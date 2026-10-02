/* ==========================================================================
   SHIKSHA SETU - SYNC MANAGER (OFFLINE-FIRST QUEUE)
   Uses IndexedDB to persist operations while offline.
   Automatically flushes to backend when internet connectivity returns.
   Preserves all existing LocalStorage keys — never deletes shiksha_student_state.
   ========================================================================== */

const SyncManager = {

  // IndexedDB configuration
  DB_NAME:    'shiksha_sync_db',
  DB_VERSION: 1,
  STORE_NAME: 'pending_ops',

  // LocalStorage keys managed by SyncManager
  MIGRATED_KEY:  'shiksha_migrated',
  LAST_SYNC_KEY: 'shiksha_last_sync',

  // Internal DB reference
  _db: null,

  /* ------------------------------------------------------------------
     INITIALIZATION
     Opens IndexedDB and registers the online event listener.
     Called once from DOMContentLoaded in index.html.
     ------------------------------------------------------------------ */

  async init() {
    try {
      await this._openDB();
      console.log('[SyncManager] IndexedDB ready.');

      // Flush any pending ops immediately if we're online at load time
      if (navigator.onLine && typeof ApiClient !== 'undefined' && ApiClient.isAuthenticated()) {
        this.flush();
      }

      // Flush when connectivity returns
      window.addEventListener('online', () => {
        console.log('[SyncManager] Connection restored. Flushing offline queue...');
        if (typeof ApiClient !== 'undefined' && ApiClient.isAuthenticated()) {
          this.flush();
        }
        // Update online status badge (existing AppRouter method)
        if (typeof AppRouter !== 'undefined') {
          AppRouter.updateOnlineStatus();
        }
      });

      window.addEventListener('offline', () => {
        console.log('[SyncManager] Went offline. Operations will queue to IndexedDB.');
        if (typeof AppRouter !== 'undefined') {
          AppRouter.updateOnlineStatus();
        }
      });

    } catch (err) {
      // IndexedDB unavailable (private mode, quota exceeded, etc.)
      // Silently degrade — app still works via LocalStorage
      console.warn('[SyncManager] IndexedDB unavailable. Offline sync disabled:', err.message);
    }
  },

  /* ------------------------------------------------------------------
     OPEN INDEXEDDB
     ------------------------------------------------------------------ */

  _openDB() {
    return new Promise((resolve, reject) => {
      if (this._db) {
        resolve(this._db);
        return;
      }

      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this._db = event.target.result;
        resolve(this._db);
      };

      request.onerror = (event) => {
        reject(new Error('Failed to open IndexedDB: ' + event.target.error));
      };
    });
  },

  /* ------------------------------------------------------------------
     ENQUEUE AN OPERATION
     Stores a sync operation to IndexedDB for later flushing.
     Called by ProgressTracker methods after each local save.

     operation = { type, payload }
     type: 'LESSON_COMPLETE' | 'QUIZ_ATTEMPT' | 'XP_ADD' | 'BADGE_UNLOCK' | 'PROFILE_SYNC'
     ------------------------------------------------------------------ */

  async enqueue(operation) {
    try {
      if (!this._db) await this._openDB();

      const op = {
        id: `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: operation.type,
        payload: operation.payload,
        timestamp: new Date().toISOString(),
        retries: 0
      };

      await this._putRecord(op);
      console.log(`[SyncManager] Queued: ${op.type} (${op.id})`);

      // If online and authenticated, try to flush immediately
      if (navigator.onLine && typeof ApiClient !== 'undefined' && ApiClient.isAuthenticated()) {
        this.flush();
      }

    } catch (err) {
      // Non-fatal — local data is already saved to LocalStorage
      console.warn('[SyncManager] Could not enqueue operation:', err.message);
    }
  },

  /* ------------------------------------------------------------------
     FLUSH PENDING OPERATIONS TO BACKEND
     Reads all pending ops from IndexedDB and sends them to /sync/push.
     Clears successfully processed ops. Keeps failed ops for retry.
     ------------------------------------------------------------------ */

  async flush() {
    try {
      if (!this._db) await this._openDB();

      const pending = await this._getAllRecords();

      if (pending.length === 0) {
        return;
      }

      console.log(`[SyncManager] Flushing ${pending.length} pending operation(s)...`);

      const result = await ApiClient.sync.push(pending);

      if (!result) {
        // Network failure — keep ops in queue for next time
        console.warn('[SyncManager] Flush failed (network). Ops kept in queue.');
        return;
      }

      if (result._error) {
        console.warn('[SyncManager] Server rejected sync:', result.message);
        return;
      }

      // Delete successfully processed ops
      const processedIds = new Set(result.processed || []);
      for (const op of pending) {
        if (processedIds.has(op.id)) {
          await this._deleteRecord(op.id);
        }
      }

      // Mark failed ops with incremented retry count
      const failedIds = new Set((result.failed || []).map(f => f.id));
      for (const op of pending) {
        if (failedIds.has(op.id)) {
          op.retries = (op.retries || 0) + 1;
          if (op.retries >= 5) {
            // Give up after 5 retries to avoid stuck queue
            console.warn(`[SyncManager] Giving up on op ${op.id} after 5 retries.`);
            await this._deleteRecord(op.id);
          } else {
            await this._putRecord(op);
          }
        }
      }

      // Update last sync timestamp
      localStorage.setItem(this.LAST_SYNC_KEY, new Date().toISOString());
      console.log(`[SyncManager] Sync complete. Processed: ${result.processed?.length || 0}, Failed: ${result.failed?.length || 0}`);

    } catch (err) {
      console.warn('[SyncManager] Flush error:', err.message);
    }
  },

  /* ------------------------------------------------------------------
     GET PENDING COUNT (for UI display)
     ------------------------------------------------------------------ */

  async getPendingCount() {
    try {
      if (!this._db) await this._openDB();
      const records = await this._getAllRecords();
      return records.length;
    } catch (err) {
      return 0;
    }
  },

  /* ------------------------------------------------------------------
     LOCAL STORAGE MIGRATION
     Reads existing shiksha_student_state and syncs it to the backend.
     Only runs once per account (guarded by 'shiksha_migrated' key).
     NEVER deletes LocalStorage data.
     ------------------------------------------------------------------ */

  async migrateLocalStorageToBackend(studentId) {
    // Guard: only migrate once
    if (localStorage.getItem(this.MIGRATED_KEY) === 'true') {
      return;
    }

    if (!studentId || !navigator.onLine) {
      return;
    }

    try {
      console.log('[SyncManager] Starting LocalStorage migration for student:', studentId);

      const savedState = localStorage.getItem('shiksha_student_state');
      if (!savedState) {
        localStorage.setItem(this.MIGRATED_KEY, 'true');
        return;
      }

      let state;
      try {
        state = JSON.parse(savedState);
      } catch (e) {
        console.warn('[SyncManager] Could not parse shiksha_student_state. Skipping migration.');
        return;
      }

      const operations = [];

      // Migrate completed lessons
      if (Array.isArray(state.completedLessons)) {
        state.completedLessons.forEach(lessonKey => {
          if (lessonKey) {
            operations.push({
              id: `migrate_lesson_${lessonKey}`,
              type: 'LESSON_COMPLETE',
              payload: { lesson_key: lessonKey, xp_earned: 0 }, // XP already counted in PROFILE_SYNC
              timestamp: new Date().toISOString()
            });
          }
        });
      }

      // Migrate quiz scores
      if (Array.isArray(state.quizScores)) {
        state.quizScores.forEach((qs, idx) => {
          if (qs && qs.quizId) {
            operations.push({
              id: `migrate_quiz_${qs.quizId}_${idx}`,
              type: 'QUIZ_ATTEMPT',
              payload: {
                quiz_key: qs.quizId,
                score: qs.score || 0,
                total: qs.total || 1,
                percentage: qs.percentage || 0,
                time_taken_seconds: null,
                date: qs.date
              },
              timestamp: new Date().toISOString()
            });
          }
        });
      }

      // Migrate unlocked badges
      if (Array.isArray(state.unlockedBadges)) {
        state.unlockedBadges.forEach(badgeKey => {
          if (badgeKey) {
            operations.push({
              id: `migrate_badge_${badgeKey}`,
              type: 'BADGE_UNLOCK',
              payload: { badge_key: badgeKey },
              timestamp: new Date().toISOString()
            });
          }
        });
      }

      // Sync overall profile (XP, streak)
      if (state.xp !== undefined || state.streak !== undefined) {
        operations.push({
          id: 'migrate_profile',
          type: 'PROFILE_SYNC',
          payload: {
            xp: state.xp || 0,
            streak: state.streak || 1,
            last_active_date: state.lastActiveDate || new Date().toISOString().split('T')[0],
            preferred_language: localStorage.getItem('shiksha_lang') || 'en'
          },
          timestamp: new Date().toISOString()
        });
      }

      if (operations.length === 0) {
        localStorage.setItem(this.MIGRATED_KEY, 'true');
        return;
      }

      const result = await ApiClient.sync.push(operations, true /* is_migration */);

      if (result && !result._error) {
        // Mark migration as complete
        localStorage.setItem(this.MIGRATED_KEY, 'true');
        localStorage.setItem(this.LAST_SYNC_KEY, new Date().toISOString());
        console.log(`[SyncManager] Migration complete. ${result.processed?.length || 0} ops synced.`);

        // Show a subtle toast notification (non-blocking)
        this._showMigrationToast();
      } else {
        console.warn('[SyncManager] Migration failed. Will retry on next login.');
        // Don't mark as migrated — will retry next login
      }

    } catch (err) {
      console.warn('[SyncManager] Migration error:', err.message);
      // NEVER delete local data on failure
    }
  },

  /* ------------------------------------------------------------------
     SHOW MIGRATION SUCCESS TOAST
     Non-intrusive notification that sync succeeded.
     ------------------------------------------------------------------ */

  _showMigrationToast() {
    try {
      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #059669;
        color: white;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 0.9rem;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: opacity 0.5s ease;
      `;
      toast.textContent = '☁️ Your progress has been synced to the cloud!';
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
      }, 3000);
    } catch (e) {
      // Non-critical UI element
    }
  },

  /* ------------------------------------------------------------------
     INDEXEDDB HELPERS
     ------------------------------------------------------------------ */

  _putRecord(record) {
    return new Promise((resolve, reject) => {
      const tx = this._db.transaction([this.STORE_NAME], 'readwrite');
      const store = tx.objectStore(this.STORE_NAME);
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  _deleteRecord(id) {
    return new Promise((resolve, reject) => {
      const tx = this._db.transaction([this.STORE_NAME], 'readwrite');
      const store = tx.objectStore(this.STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  _getAllRecords() {
    return new Promise((resolve, reject) => {
      const tx = this._db.transaction([this.STORE_NAME], 'readonly');
      const store = tx.objectStore(this.STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },

  /* ------------------------------------------------------------------
     UTILITY
     ------------------------------------------------------------------ */

  isOnline() {
    return navigator.onLine;
  },

  getLastSyncTime() {
    return localStorage.getItem(this.LAST_SYNC_KEY);
  },

  isMigrated() {
    return localStorage.getItem(this.MIGRATED_KEY) === 'true';
  }

};
