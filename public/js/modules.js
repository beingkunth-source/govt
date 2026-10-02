/* ==========================================================================
   SHIKSHA SETU - EXTENDED MODULES
   1. Leaderboard
   2. AI Doubt Solver (Simulated)
   3. Interactive Science Lab Simulations
   4. Study Planner
   5. Vocabulary Builder
   ========================================================================== */

/* ─── Helper: render views using AppRouter.renderXxx ─── */

/* ════════════════════════════════════════════════════════
   MODULE 1: LEADERBOARD
   ════════════════════════════════════════════════════════ */
AppRouter.renderLeaderboard = function (main) {
  const myXp   = ProgressTracker.profile.xp || 0;
  const myName = ProgressTracker.profile.name || 'You';

  /* Simulated classmates list (seeded deterministically) */
  const peers = [
    { rank: 1,  name: 'Aarav Sharma',   xp: 2340, badge: '🏆', class: 8 },
    { rank: 2,  name: 'Priya Patel',    xp: 2110, badge: '🥈', class: 8 },
    { rank: 3,  name: 'Ravi Kumar',     xp: 1980, badge: '🥉', class: 8 },
    { rank: 4,  name: 'Sneha Jadhav',   xp: 1750, badge: '⭐', class: 8 },
    { rank: 5,  name: 'Mohan Das',      xp: 1620, badge: '⭐', class: 8 },
    { rank: 6,  name: 'Kavita Singh',   xp: 1510, badge: '⭐', class: 8 },
    { rank: 7,  name: 'Amol Desai',     xp: 1390, badge: '⭐', class: 8 },
    { rank: 8,  name: myName,           xp: myXp,  badge: '📍', class: 8, isMe: true },
    { rank: 9,  name: 'Pooja Nair',     xp: 980,   badge: '',   class: 8 },
    { rank: 10, name: 'Kiran Rao',      xp: 840,   badge: '',   class: 8 },
  ].sort((a, b) => b.xp - a.xp).map((p, i) => ({ ...p, rank: i + 1 }));

  const trophyColors = ['#f59e0b', '#9ca3af', '#d97706'];

  main.innerHTML = `
    <div class="section-header">
      <div>
        <h2 class="section-title">🏅 Class Leaderboard</h2>
        <div class="section-subtitle">See how you rank against your classmates this week</div>
      </div>
      <div class="chip chip-primary">Class ${AppRouter.auth.selectedClass || 8} · Week ${Math.ceil(new Date().getDate() / 7)}</div>
    </div>

    <!-- Top 3 Podium -->
    <div style="display:flex; justify-content:center; align-items:flex-end; gap:16px; margin-bottom:var(--space-xl); padding:var(--space-xl) 0; background:linear-gradient(135deg,#ecfdf5,#d1fae5); border-radius:var(--border-radius-xl); border:1px solid var(--border-color);">
      ${[peers[1], peers[0], peers[2]].map((p, podiumIdx) => {
        const heights = ['100px','130px','85px'];
        const podiumPos = [2, 1, 3];
        return `
        <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
          <div style="font-size:1.8rem;">${p.badge || '🎖️'}</div>
          <div style="font-weight:800;font-size:0.95rem;color:var(--text-primary);text-align:center;max-width:80px;">${p.name.split(' ')[0]}</div>
          <div style="font-size:0.85rem;font-weight:700;color:var(--color-primary);">${p.xp} XP</div>
          <div style="width:72px;height:${heights[podiumIdx]};background:${podiumIdx===1?'linear-gradient(135deg,#059669,#047857)':podiumIdx===0?'linear-gradient(135deg,#9ca3af,#6b7280)':'linear-gradient(135deg,#d97706,#b45309)'};border-radius:8px 8px 0 0;display:flex;align-items:flex-start;justify-content:center;padding-top:8px;color:#fff;font-size:1.3rem;font-weight:900;">${podiumPos[podiumIdx]}</div>
        </div>`;
      }).join('')}
    </div>

    <!-- Full Table -->
    <div class="card" style="overflow:hidden;padding:0;">
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:var(--bg-subtle);text-align:left;">
            <th style="padding:12px 16px;font-size:0.85rem;color:var(--text-muted);font-weight:700;">Rank</th>
            <th style="padding:12px 16px;font-size:0.85rem;color:var(--text-muted);font-weight:700;">Student</th>
            <th style="padding:12px 16px;font-size:0.85rem;color:var(--text-muted);font-weight:700;">XP Points</th>
            <th style="padding:12px 16px;font-size:0.85rem;color:var(--text-muted);font-weight:700;">Progress</th>
          </tr>
        </thead>
        <tbody>
          ${peers.map(p => `
            <tr style="border-top:1px solid var(--border-subtle);${p.isMe ? 'background:var(--color-primary-light);' : ''}transition:background 0.2s;">
              <td style="padding:12px 16px;font-weight:800;font-size:1.05rem;color:${p.rank<=3?'var(--color-primary)':'var(--text-muted)'};">${p.rank <= 3 ? ['🥇','🥈','🥉'][p.rank-1] : p.rank}</td>
              <td style="padding:12px 16px;">
                <div style="font-weight:700;${p.isMe?'color:var(--color-primary-dark);':''}">${p.name} ${p.isMe ? '<span class="chip chip-primary" style="font-size:0.7rem;padding:2px 8px;">You</span>' : ''}</div>
              </td>
              <td style="padding:12px 16px;font-weight:700;color:var(--color-primary);">${p.xp.toLocaleString()} XP</td>
              <td style="padding:12px 16px;min-width:140px;">
                <div class="progress-container" style="height:8px;">
                  <div class="progress-bar" style="width:${Math.min(100, Math.round(p.xp/2400*100))}%;"></div>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Weekly Challenge Banner -->
    <div style="margin-top:var(--space-xl);background:linear-gradient(135deg,#065f46,#047857);color:#fff;border-radius:var(--border-radius-xl);padding:var(--space-xl);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:var(--space-md);">
      <div>
        <div style="font-size:1.3rem;font-weight:800;margin-bottom:4px;">⚡ Weekly Challenge Active!</div>
        <div style="opacity:0.85;font-size:0.95rem;">Complete 3 quizzes this week to earn a <strong>50 Bonus XP</strong> and climb the leaderboard!</div>
      </div>
      <button class="btn btn-primary" style="background:#fff;color:var(--color-primary-dark);font-weight:800;" onclick="AppRouter.navigate('quizzes')">Take Quizzes →</button>
    </div>
  `;
};


/* ════════════════════════════════════════════════════════
   MODULE 2: AI DOUBT SOLVER (Simulated)
   ════════════════════════════════════════════════════════ */
AppRouter._doubtHistory = [];

AppRouter._doubtAnswers = {
  // Math
  'what is photosynthesis': '🌿 **Photosynthesis** is the process by which green plants convert sunlight, water (H₂O), and carbon dioxide (CO₂) into glucose (food) and oxygen (O₂). It happens in the **chloroplast** of plant cells using a green pigment called **chlorophyll**.\n\n**Equation:** 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂',
  'what is newton law': '🍎 **Newton\'s Three Laws of Motion:**\n\n1. **First Law (Inertia):** An object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force.\n\n2. **Second Law (F = ma):** Force equals mass times acceleration. Heavier objects need more force to accelerate.\n\n3. **Third Law (Action-Reaction):** For every action, there is an equal and opposite reaction.',
  'what is hcf': '🔢 **HCF (Highest Common Factor)** is the largest number that divides two or more numbers without leaving a remainder.\n\n**Example:** HCF of 12 and 18:\n- Factors of 12: 1, 2, 3, **6**, 12\n- Factors of 18: 1, 2, 3, **6**, 9, 18\n- **HCF = 6**\n\n**Tip:** You can also use prime factorization method!',
  'what is democracy': '🏛️ **Democracy** is a system of government where the people hold power and exercise it directly or through freely elected representatives.\n\n**Key Features:**\n- Free and fair elections\n- Freedom of speech and press\n- Rule of law applies to everyone equally\n- Protection of fundamental rights\n\n*India is the world\'s largest democracy!*',
  'what is mitosis': '🔬 **Mitosis** is a type of cell division where one parent cell divides into **two identical daughter cells**, each with the same number of chromosomes.\n\n**Stages:** Prophase → Metaphase → Anaphase → Telophase\n\n**Purpose:** Growth, repair, and asexual reproduction in living organisms.',
  'default': '🤖 Great question! I\'m analyzing your doubt...\n\n**Here\'s a structured answer:**\n\nThis topic is part of your Class curriculum. I recommend:\n1. **Re-read** the relevant chapter section\n2. **Solve** 3 practice problems on this concept\n3. **Ask your teacher** for clarification in the next class\n\nWould you like me to find a specific lesson on this topic? Click on **Classes** in the sidebar to explore chapters!',
};

AppRouter._getDoubtAnswer = function(q) {
  const lower = q.toLowerCase();
  for (const key of Object.keys(this._doubtAnswers)) {
    if (key !== 'default' && lower.includes(key)) {
      return this._doubtAnswers[key];
    }
  }
  return this._doubtAnswers['default'];
};

AppRouter.renderDoubtSolver = function(main) {
  const hist = AppRouter._doubtHistory;
  main.innerHTML = `
    <div class="section-header">
      <div>
        <h2 class="section-title">🤖 AI Doubt Solver</h2>
        <div class="section-subtitle">Ask any academic doubt — get instant, structured answers powered by AI</div>
      </div>
      <div class="chip chip-secondary">Powered by Shiksha AI</div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 320px;gap:var(--space-lg);align-items:start;">

      <!-- Chat Panel -->
      <div class="card" style="padding:0;overflow:hidden;display:flex;flex-direction:column;min-height:520px;">

        <!-- Chat Header -->
        <div style="background:linear-gradient(135deg,#059669,#0d9488);color:#fff;padding:var(--space-md) var(--space-lg);display:flex;align-items:center;gap:var(--space-sm);">
          <div style="width:40px;height:40px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.4rem;">🤖</div>
          <div>
            <div style="font-weight:800;font-size:1rem;">Shiksha AI Tutor</div>
            <div style="opacity:0.85;font-size:0.8rem;">● Online · Ready to help</div>
          </div>
        </div>

        <!-- Messages Area -->
        <div id="doubt-messages" style="flex:1;overflow-y:auto;padding:var(--space-md);display:flex;flex-direction:column;gap:var(--space-md);background:var(--bg-primary);min-height:350px;">
          <!-- Welcome message -->
          <div style="display:flex;gap:var(--space-sm);align-items:flex-start;">
            <div style="width:36px;height:36px;background:var(--color-primary-light);border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.2rem;">🤖</div>
            <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:0 12px 12px 12px;padding:var(--space-md);max-width:80%;box-shadow:var(--box-shadow);">
              <div style="font-weight:700;font-size:0.85rem;color:var(--color-primary);margin-bottom:4px;">Shiksha AI Tutor</div>
              <div style="font-size:0.95rem;line-height:1.6;">Namaste! 🙏 I'm your AI study assistant. Ask me anything about your Class ${AppRouter.auth.selectedClass || 8} subjects — Maths, Science, English, Hindi, Social Studies & more!</div>
            </div>
          </div>
          ${hist.map(h => `
            <div style="display:flex;gap:var(--space-sm);justify-content:flex-end;">
              <div style="background:var(--color-primary);color:#fff;border-radius:12px 0 12px 12px;padding:var(--space-sm) var(--space-md);max-width:70%;font-size:0.95rem;">${h.q}</div>
            </div>
            <div style="display:flex;gap:var(--space-sm);align-items:flex-start;">
              <div style="width:36px;height:36px;background:var(--color-primary-light);border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:1.2rem;">🤖</div>
              <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:0 12px 12px 12px;padding:var(--space-md);max-width:80%;white-space:pre-line;font-size:0.92rem;line-height:1.7;box-shadow:var(--box-shadow);">${h.a}</div>
            </div>
          `).join('')}
        </div>

        <!-- Input Area -->
        <div style="border-top:1px solid var(--border-color);padding:var(--space-md);background:var(--bg-surface);display:flex;gap:var(--space-sm);">
          <input
            type="text"
            id="doubt-input"
            class="form-control"
            placeholder="e.g. What is photosynthesis? or What is HCF?"
            style="flex:1;"
            onkeydown="if(event.key==='Enter') AppRouter.submitDoubt()"
          >
          <button class="btn btn-primary" onclick="AppRouter.submitDoubt()" style="padding:10px 18px;">
            ➤ Ask
          </button>
        </div>
      </div>

      <!-- Sidebar: Quick Topics -->
      <div style="display:flex;flex-direction:column;gap:var(--space-md);">
        <div class="card">
          <div class="card-title" style="margin-bottom:var(--space-md);">⚡ Quick Questions</div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${[
              'What is photosynthesis?',
              'What is Newton\'s Law?',
              'What is HCF?',
              'What is Democracy?',
              'What is Mitosis?'
            ].map(q => `
              <button class="btn btn-outline btn-sm" style="text-align:left;justify-content:flex-start;" onclick="document.getElementById('doubt-input').value='${q}'; AppRouter.submitDoubt();">
                ${q}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="card" style="background:var(--bg-highlight);border-color:var(--border-color);">
          <div style="font-weight:800;margin-bottom:var(--space-sm);color:var(--color-primary-dark);">📊 Your Doubts Today</div>
          <div style="font-size:2rem;font-weight:800;color:var(--color-primary);">${hist.length}</div>
          <div style="font-size:0.85rem;color:var(--text-muted);">questions asked this session</div>
        </div>

        <div class="card">
          <div class="card-title" style="margin-bottom:var(--space-sm);">🔥 Subjects Supported</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;">
            ${['📐 Maths','🔬 Science','📚 English','🇮🇳 Hindi','🌍 SST','💻 Computers'].map(s => `<span class="chip chip-secondary" style="font-size:0.78rem;">${s}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
};

AppRouter.submitDoubt = function() {
  const input = document.getElementById('doubt-input');
  if (!input || !input.value.trim()) return;

  const q = input.value.trim();
  const a = this._getDoubtAnswer(q);
  AppRouter._doubtHistory.push({ q, a });
  input.value = '';

  /* Re-render to show new message */
  this.renderDoubtSolver(document.getElementById('view-container'));
  /* Scroll to bottom */
  setTimeout(() => {
    const msgs = document.getElementById('doubt-messages');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }, 50);
};


/* ════════════════════════════════════════════════════════
   MODULE 3: INTERACTIVE SCIENCE LAB SIMULATIONS
   ════════════════════════════════════════════════════════ */
AppRouter._currentLab = null;

AppRouter.renderScienceLab = function(main) {
  const labs = [
    { id: 'pendulum', icon: '🔩', title: 'Simple Pendulum', desc: 'Explore how length & gravity affect the period of oscillation', subject: 'Physics', class: 9 },
    { id: 'acid-base', icon: '🧪', title: 'Acid-Base Indicator', desc: 'Test liquids with pH indicator and observe color changes', subject: 'Chemistry', class: 8 },
    { id: 'food-chain', icon: '🌱', title: 'Food Chain Builder', desc: 'Build and balance an ecosystem food chain interactively', subject: 'Biology', class: 6 },
    { id: 'circuit', icon: '⚡', title: 'Electric Circuit Sim', desc: 'Build series and parallel circuits and measure current/voltage', subject: 'Physics', class: 10 },
    { id: 'plant-cell', icon: '🟩', title: 'Plant vs Animal Cell', desc: 'Explore and label organelles in plant and animal cells', subject: 'Biology', class: 8 },
    { id: 'states-matter', icon: '💧', title: 'States of Matter', desc: 'Observe particles in solid, liquid, and gas states with heating', subject: 'Chemistry', class: 7 },
  ];

  if (AppRouter._currentLab) {
    return AppRouter._renderLabSim(main, AppRouter._currentLab);
  }

  main.innerHTML = `
    <div class="section-header">
      <div>
        <h2 class="section-title">🔬 Virtual Science Lab</h2>
        <div class="section-subtitle">Hands-on interactive simulations for Science concepts — no equipment needed!</div>
      </div>
    </div>

    <div style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:1px solid var(--border-color);border-radius:var(--border-radius-xl);padding:var(--space-xl);margin-bottom:var(--space-xl);display:flex;align-items:center;gap:var(--space-lg);flex-wrap:wrap;">
      <div style="font-size:3.5rem;">🔬</div>
      <div>
        <div style="font-size:1.25rem;font-weight:800;color:var(--text-primary);margin-bottom:4px;">Welcome to the Virtual Lab!</div>
        <div style="color:var(--text-muted);max-width:550px;">Choose any simulation below to start experimenting. Each lab includes interactive controls, real-time observations, and science explanations.</div>
      </div>
    </div>

    <div class="grid-3">
      ${labs.map(lab => `
        <div class="card" style="cursor:pointer;text-align:center;padding:var(--space-xl);" onclick="AppRouter._currentLab='${lab.id}'; AppRouter.renderScienceLab(document.getElementById('view-container'));" onmouseenter="this.style.transform='translateY(-4px)'" onmouseleave="this.style.transform=''">
          <div style="font-size:3rem;margin-bottom:var(--space-md);">${lab.icon}</div>
          <div style="font-weight:800;font-size:1.05rem;margin-bottom:4px;">${lab.title}</div>
          <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:var(--space-md);">${lab.desc}</div>
          <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
            <span class="chip chip-secondary">${lab.subject}</span>
            <span class="chip chip-primary">Class ${lab.class}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
};

AppRouter._renderLabSim = function(main, labId) {
  const labContent = {
    'pendulum': AppRouter._labPendulum(),
    'acid-base': AppRouter._labAcidBase(),
    'food-chain': AppRouter._labFoodChain(),
    'circuit': AppRouter._labCircuit(),
    'plant-cell': AppRouter._labPlantCell(),
    'states-matter': AppRouter._labStatesMatter(),
  };

  main.innerHTML = `
    <div class="section-header">
      <div>
        <h2 class="section-title">🔬 Virtual Lab Simulation</h2>
      </div>
      <button class="btn btn-outline" onclick="AppRouter._currentLab=null; AppRouter.renderScienceLab(document.getElementById('view-container'));">← Back to Labs</button>
    </div>
    ${labContent[labId] || '<div class="card"><p>Lab not found</p></div>'}
  `;
};

AppRouter._labPendulum = function() {
  return `
    <div class="card" style="max-width:650px;margin:0 auto;text-align:center;">
      <h3 style="font-weight:800;font-size:1.3rem;margin-bottom:var(--space-md);color:var(--color-primary-dark);">🔩 Simple Pendulum Simulation</h3>
      <p style="color:var(--text-muted);margin-bottom:var(--space-lg);">Adjust the pendulum length and observe how the time period changes. <strong>Longer pendulum = slower swing!</strong></p>

      <div style="background:var(--bg-subtle);border-radius:var(--border-radius-lg);padding:var(--space-xl);margin-bottom:var(--space-lg);position:relative;height:220px;overflow:hidden;">
        <div id="pendulum-pivot" style="width:12px;height:12px;background:var(--color-primary-dark);border-radius:50%;position:absolute;top:20px;left:50%;transform:translateX(-50%);"></div>
        <div id="pendulum-string" style="width:2px;background:var(--text-muted);position:absolute;top:26px;left:50%;transform-origin:top center;transition:height 0.4s;height:120px;"></div>
        <div id="pendulum-bob" style="width:28px;height:28px;background:var(--color-primary);border-radius:50%;position:absolute;bottom:40px;left:calc(50% - 14px);box-shadow:0 4px 12px rgba(5,150,105,0.4);transition:all 0.4s;"></div>
        <div style="position:absolute;bottom:20px;left:0;right:0;height:3px;background:var(--border-color);"></div>
      </div>

      <div style="margin-bottom:var(--space-lg);">
        <label class="form-label" style="display:block;margin-bottom:8px;">Pendulum Length: <strong id="pend-len-val">80</strong> cm</label>
        <input type="range" id="pend-length" min="20" max="160" value="80" style="width:100%;accent-color:var(--color-primary);" oninput="
          const l=this.value;
          document.getElementById('pend-len-val').textContent=l;
          document.getElementById('pendulum-string').style.height=l*0.9+'px';
          const T=(2*3.14159*Math.sqrt(l/100/9.8)).toFixed(2);
          document.getElementById('pend-period').textContent=T;
          const anim = (T*1000);
          document.getElementById('pendulum-string').style.animation='pendulumSwing '+anim+'ms ease-in-out infinite alternate';
        ">
      </div>

      <style>
        @keyframes pendulumSwing { from{transform:rotate(-30deg)} to{transform:rotate(30deg)} }
        #pendulum-string { animation: pendulumSwing 1.8s ease-in-out infinite alternate; transform-origin: top center; }
      </style>

      <div style="background:var(--color-primary-light);border-radius:var(--border-radius-lg);padding:var(--space-md);display:flex;gap:var(--space-xl);justify-content:center;">
        <div>
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:600;">TIME PERIOD</div>
          <div style="font-size:1.8rem;font-weight:800;color:var(--color-primary-dark);"><span id="pend-period">1.79</span>s</div>
        </div>
        <div>
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:600;">FORMULA</div>
          <div style="font-size:1rem;font-weight:800;color:var(--color-primary-dark);">T = 2π√(L/g)</div>
        </div>
        <div>
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:600;">GRAVITY</div>
          <div style="font-size:1.8rem;font-weight:800;color:var(--color-primary-dark);">9.8 m/s²</div>
        </div>
      </div>

      <div style="margin-top:var(--space-lg);padding:var(--space-md);background:var(--bg-highlight);border-radius:var(--border-radius-lg);text-align:left;">
        <strong>📖 Key Insight:</strong> The time period of a simple pendulum depends only on its <strong>length</strong> and the <strong>acceleration due to gravity</strong> — NOT on the mass of the bob!
      </div>
    </div>
  `;
};

AppRouter._labAcidBase = function() {
  const liquids = [
    { name: 'Lemon Juice', ph: 2, color: '#fdba74', emoji: '🍋' },
    { name: 'Vinegar', ph: 3, color: '#fca5a5', emoji: '🍶' },
    { name: 'Milk', ph: 6.5, color: '#fef3c7', emoji: '🥛' },
    { name: 'Pure Water', ph: 7, color: '#a7f3d0', emoji: '💧' },
    { name: 'Blood', ph: 7.4, color: '#bbf7d0', emoji: '🩸' },
    { name: 'Baking Soda', ph: 8.5, color: '#93c5fd', emoji: '🧂' },
    { name: 'Soap', ph: 10, color: '#8b5cf6', emoji: '🧼' },
  ];

  return `
    <div class="card" style="max-width:680px;margin:0 auto;">
      <h3 style="font-weight:800;font-size:1.3rem;margin-bottom:var(--space-md);color:var(--color-primary-dark);">🧪 Acid-Base Indicator Lab</h3>
      <p style="color:var(--text-muted);margin-bottom:var(--space-xl);">Select a liquid to dip the indicator. Watch the color change and observe the pH scale!</p>

      <!-- Beaker Display -->
      <div style="display:flex;justify-content:center;margin-bottom:var(--space-xl);">
        <div style="position:relative;width:120px;height:160px;">
          <div id="beaker-liquid" style="position:absolute;bottom:10px;left:8px;right:8px;height:100px;background:#a7f3d0;border-radius:0 0 8px 8px;transition:background 0.5s;display:flex;align-items:center;justify-content:center;font-size:2rem;">💧</div>
          <div style="position:absolute;inset:0;border:4px solid var(--border-color);border-radius:8px;pointer-events:none;background:transparent;"></div>
          <div id="beaker-label" style="text-align:center;margin-top:4px;font-size:0.8rem;font-weight:700;color:var(--text-muted);position:absolute;bottom:-24px;left:0;right:0;">Pure Water</div>
          <div id="ph-value" style="position:absolute;top:-40px;left:0;right:0;text-align:center;font-size:1.5rem;font-weight:900;color:var(--color-primary);">pH 7.0</div>
        </div>
      </div>

      <div style="margin-bottom:var(--space-xl);">
        <div style="font-weight:700;margin-bottom:var(--space-md);">Select a liquid to test:</div>
        <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;">
          ${liquids.map(l => `
            <button class="btn btn-outline btn-sm" onclick="
              document.getElementById('beaker-liquid').style.background='${l.color}';
              document.getElementById('beaker-liquid').innerHTML='<span style=\\'font-size:1.8rem;\\'>${l.emoji}</span>';
              document.getElementById('beaker-label').textContent='${l.name}';
              document.getElementById('ph-value').textContent='pH ${l.ph}';
              document.getElementById('ph-scale-marker').style.left='calc(${((l.ph/14)*100).toFixed(1)}% - 8px)';
              document.getElementById('ph-nature').textContent=${l.ph<7?'\"🔴 Acidic\"':l.ph===7?'\"🟢 Neutral\"':'\"🔵 Basic (Alkaline)\""'};
            ">${l.emoji} ${l.name}</button>
          `).join('')}
        </div>
      </div>

      <!-- pH Scale -->
      <div style="padding:var(--space-md);background:var(--bg-subtle);border-radius:var(--border-radius-lg);">
        <div style="font-weight:700;margin-bottom:var(--space-sm);">pH Scale (0-14)</div>
        <div style="position:relative;height:28px;border-radius:14px;background:linear-gradient(to right,#ef4444,#f97316,#fbbf24,#a3e635,#4ade80,#2dd4bf,#60a5fa,#818cf8,#a855f7);margin-bottom:24px;">
          <div id="ph-scale-marker" style="position:absolute;top:-6px;width:16px;height:40px;background:var(--text-primary);border-radius:4px;transition:left 0.5s;left:calc(50% - 8px);"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:0.78rem;font-weight:700;color:var(--text-muted);">
          <span>0 (Strong Acid)</span><span>7 (Neutral)</span><span>14 (Strong Base)</span>
        </div>
        <div id="ph-nature" style="text-align:center;font-size:1.1rem;font-weight:800;margin-top:var(--space-md);color:var(--color-primary-dark);">🟢 Neutral</div>
      </div>
    </div>
  `;
};

AppRouter._labFoodChain = function() {
  const organisms = [
    { id: 'sun', name: 'Sun', icon: '☀️', level: 'Energy Source' },
    { id: 'grass', name: 'Grass', icon: '🌿', level: 'Producer' },
    { id: 'grasshopper', name: 'Grasshopper', icon: '🦗', level: 'Primary Consumer' },
    { id: 'frog', name: 'Frog', icon: '🐸', level: 'Secondary Consumer' },
    { id: 'snake', name: 'Snake', icon: '🐍', level: 'Tertiary Consumer' },
    { id: 'eagle', name: 'Eagle', icon: '🦅', level: 'Apex Predator' },
  ];
  return `
    <div class="card" style="max-width:680px;margin:0 auto;text-align:center;">
      <h3 style="font-weight:800;font-size:1.3rem;margin-bottom:var(--space-sm);color:var(--color-primary-dark);">🌱 Food Chain Builder</h3>
      <p style="color:var(--text-muted);margin-bottom:var(--space-xl);">Energy flows from the Sun through producers and consumers in a food chain. Each arrow (→) means "is eaten by".</p>

      <!-- Food Chain Display -->
      <div style="display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:4px;margin-bottom:var(--space-xl);padding:var(--space-lg);background:var(--bg-subtle);border-radius:var(--border-radius-xl);">
        ${organisms.map((o, i) => `
          <div style="display:flex;align-items:center;gap:4px;animation:fadeInUp 0.4s ease ${i*0.1}s both;">
            <div style="text-align:center;padding:var(--space-sm);">
              <div style="font-size:2.5rem;margin-bottom:4px;">${o.icon}</div>
              <div style="font-weight:700;font-size:0.85rem;">${o.name}</div>
              <span class="chip chip-secondary" style="font-size:0.7rem;padding:2px 8px;">${o.level}</span>
            </div>
            ${i < organisms.length-1 ? '<div style="font-size:1.5rem;color:var(--color-primary);font-weight:900;margin:0 2px;">→</div>' : ''}
          </div>
        `).join('')}
      </div>

      <style>@keyframes fadeInUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}</style>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:var(--space-md);text-align:left;">
        <div style="background:var(--color-success-light);border:1px solid #a7f3d0;border-radius:var(--border-radius-lg);padding:var(--space-md);">
          <div style="font-weight:800;margin-bottom:4px;color:var(--color-primary-dark);">🌿 Producers</div>
          <div style="font-size:0.9rem;color:var(--text-muted);">Plants make their own food using sunlight (photosynthesis)</div>
        </div>
        <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:var(--border-radius-lg);padding:var(--space-md);">
          <div style="font-weight:800;margin-bottom:4px;color:#92400e;">🦗 Consumers</div>
          <div style="font-size:0.9rem;color:var(--text-muted);">Animals eat plants or other animals to get energy</div>
        </div>
        <div style="background:#fce7f3;border:1px solid #fbcfe8;border-radius:var(--border-radius-lg);padding:var(--space-md);">
          <div style="font-weight:800;margin-bottom:4px;color:#9d174d;">♻️ Decomposers</div>
          <div style="font-size:0.9rem;color:var(--text-muted);">Bacteria & fungi break down dead matter and recycle nutrients</div>
        </div>
      </div>
    </div>
  `;
};

AppRouter._labCircuit = function() {
  return `
    <div class="card" style="max-width:650px;margin:0 auto;">
      <h3 style="font-weight:800;font-size:1.3rem;margin-bottom:var(--space-md);color:var(--color-primary-dark);">⚡ Electric Circuit Simulator</h3>
      <p style="color:var(--text-muted);margin-bottom:var(--space-lg);">Toggle the switch and adjust voltage to observe current flow using Ohm's Law: <strong>V = I × R</strong></p>

      <!-- Circuit Diagram -->
      <div style="background:var(--bg-subtle);border-radius:var(--border-radius-xl);padding:var(--space-xl);text-align:center;margin-bottom:var(--space-lg);">
        <svg viewBox="0 0 400 200" style="width:100%;max-height:200px;">
          <!-- Wire paths -->
          <path d="M60,100 L120,100 L120,50 L280,50 L280,100 L340,100 L340,150 L60,150 Z" fill="none" stroke="#a7f3d0" stroke-width="3"/>
          <!-- Battery -->
          <rect x="35" y="88" width="30" height="24" rx="4" fill="var(--color-primary)" />
          <text x="50" y="104" text-anchor="middle" fill="white" font-size="10" font-weight="700">BAT</text>
          <!-- Bulb -->
          <circle cx="200" cy="50" r="18" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
          <text x="200" y="55" text-anchor="middle" font-size="16" id="bulb-icon">💡</text>
          <!-- Switch -->
          <rect x="155" y="140" width="50" height="20" rx="8" fill="var(--border-color)" id="switch-bg"/>
          <circle cx="170" cy="150" r="9" fill="#6b7280" id="switch-knob" style="transition:cx 0.3s;"/>
          <text x="180" y="175" text-anchor="middle" fill="var(--text-muted)" font-size="11">SWITCH</text>
          <!-- Resistor -->
          <rect x="295" y="90" width="50" height="20" rx="4" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
          <text x="320" y="104" text-anchor="middle" fill="#0284c7" font-size="10" font-weight="700">RES</text>
          <!-- + - labels -->
          <text x="50" y="84" text-anchor="middle" fill="var(--color-primary-dark)" font-size="12" font-weight="900">+</text>
          <text x="50" y="122" text-anchor="middle" fill="#e11d48" font-size="12" font-weight="900">−</text>
        </svg>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);margin-bottom:var(--space-lg);">
        <div>
          <label class="form-label">Voltage (V): <strong id="volt-val">6</strong> V</label>
          <input type="range" id="volt-slider" min="1" max="12" value="6" style="width:100%;accent-color:var(--color-primary);" oninput="
            document.getElementById('volt-val').textContent=this.value;
            const R=parseFloat(document.getElementById('res-slider').value);
            document.getElementById('curr-val').textContent=(this.value/R).toFixed(2);
            document.getElementById('power-val').textContent=(this.value*this.value/R).toFixed(2);
          ">
        </div>
        <div>
          <label class="form-label">Resistance (Ω): <strong id="res-val">3</strong> Ω</label>
          <input type="range" id="res-slider" min="1" max="12" value="3" style="width:100%;accent-color:var(--color-primary);" oninput="
            document.getElementById('res-val').textContent=this.value;
            const V=parseFloat(document.getElementById('volt-slider').value);
            document.getElementById('curr-val').textContent=(V/this.value).toFixed(2);
            document.getElementById('power-val').textContent=(V*V/this.value).toFixed(2);
          ">
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-md);text-align:center;">
        <div style="background:var(--color-primary-light);border-radius:var(--border-radius-lg);padding:var(--space-md);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:600;">CURRENT (I)</div>
          <div style="font-size:1.8rem;font-weight:900;color:var(--color-primary-dark);"><span id="curr-val">2.00</span> A</div>
        </div>
        <div style="background:#fef3c7;border-radius:var(--border-radius-lg);padding:var(--space-md);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:600;">VOLTAGE (V)</div>
          <div style="font-size:1.8rem;font-weight:900;color:#92400e;"><span id="volt-val2">6</span> V</div>
        </div>
        <div style="background:#e0f2fe;border-radius:var(--border-radius-lg);padding:var(--space-md);">
          <div style="font-size:0.8rem;color:var(--text-muted);font-weight:600;">POWER (P=V²/R)</div>
          <div style="font-size:1.8rem;font-weight:900;color:#0369a1;"><span id="power-val">12.00</span> W</div>
        </div>
      </div>
    </div>
  `;
};

AppRouter._labPlantCell = function() {
  const organelles = [
    { name: 'Cell Wall', desc: 'Rigid outer layer made of cellulose — unique to plant cells. Provides structure & protection.', color: '#a7f3d0', plant: true, animal: false },
    { name: 'Cell Membrane', desc: 'Selectively permeable membrane that controls what enters and exits the cell.', color: '#bbf7d0', plant: true, animal: true },
    { name: 'Nucleus', desc: 'Control center of the cell. Contains DNA and controls all cellular activities.', color: '#93c5fd', plant: true, animal: true },
    { name: 'Chloroplast', desc: 'Site of photosynthesis. Contains chlorophyll (green pigment) — only in plant cells!', color: '#86efac', plant: true, animal: false },
    { name: 'Mitochondria', desc: 'Powerhouse of the cell. Produces ATP energy through cellular respiration.', color: '#fca5a5', plant: true, animal: true },
    { name: 'Vacuole', desc: 'Large central vacuole in plants stores water & maintains turgor pressure.', color: '#c4b5fd', plant: true, animal: true },
    { name: 'Ribosome', desc: 'Tiny organelles that synthesize proteins from amino acids using mRNA instructions.', color: '#fde68a', plant: true, animal: true },
  ];

  return `
    <div class="card" style="max-width:700px;margin:0 auto;">
      <h3 style="font-weight:800;font-size:1.3rem;margin-bottom:var(--space-md);color:var(--color-primary-dark);">🟩 Plant vs Animal Cell Explorer</h3>
      <p style="color:var(--text-muted);margin-bottom:var(--space-lg);">Click each organelle to learn what it does. Green checkmarks = present, ✗ = absent.</p>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);margin-bottom:var(--space-xl);">
        ${organelles.map(o => `
          <div onclick="document.getElementById('org-desc').textContent='${o.desc}'; document.getElementById('org-name').textContent='${o.name}';"
               style="display:flex;align-items:center;gap:var(--space-sm);background:${o.color}33;border:1px solid ${o.color};border-radius:var(--border-radius-lg);padding:var(--space-sm) var(--space-md);cursor:pointer;transition:all 0.2s;"
               onmouseenter="this.style.transform='translateX(4px)'" onmouseleave="this.style.transform=''">
            <div style="width:14px;height:14px;border-radius:50%;background:${o.color};flex-shrink:0;border:1px solid rgba(0,0,0,0.1);"></div>
            <div style="flex:1;font-weight:700;font-size:0.9rem;">${o.name}</div>
            <div style="font-size:0.8rem;font-weight:700;">${o.plant ? '🌿✓' : '✗'} ${o.animal ? '🐾✓' : '✗'}</div>
          </div>
        `).join('')}
      </div>

      <div id="org-info" style="background:var(--bg-highlight);border:1px solid var(--border-color);border-radius:var(--border-radius-lg);padding:var(--space-lg);">
        <div style="font-weight:800;color:var(--color-primary-dark);margin-bottom:4px;" id="org-name">Click an organelle above</div>
        <div style="color:var(--text-muted);" id="org-desc">to see its description and whether it appears in plant cells, animal cells, or both.</div>
      </div>

      <div style="display:flex;gap:var(--space-md);margin-top:var(--space-md);">
        <span class="chip chip-primary">🌿 Plant Only: Cell Wall, Chloroplast, Large Vacuole</span>
        <span class="chip chip-secondary">🐾 Animal Only: Centrioles, Lysosomes</span>
      </div>
    </div>
  `;
};

AppRouter._labStatesMatter = function() {
  return `
    <div class="card" style="max-width:620px;margin:0 auto;text-align:center;">
      <h3 style="font-weight:800;font-size:1.3rem;margin-bottom:var(--space-md);color:var(--color-primary-dark);">💧 States of Matter Simulation</h3>
      <p style="color:var(--text-muted);margin-bottom:var(--space-lg);">Drag the temperature slider to see how particles behave in different states of matter.</p>

      <div id="matter-display" style="background:var(--bg-subtle);border-radius:var(--border-radius-xl);padding:var(--space-xl);margin-bottom:var(--space-lg);position:relative;height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;transition:background 0.5s;">
        <div id="particle-container" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;align-items:center;width:100%;height:100%;"></div>
      </div>

      <div style="margin-bottom:var(--space-lg);">
        <label class="form-label">Temperature: <strong id="temp-val">0</strong>°C</label>
        <input type="range" id="temp-slider" min="-50" max="150" value="0" style="width:100%;accent-color:var(--color-primary);" oninput="
          const T=parseInt(this.value);
          document.getElementById('temp-val').textContent=T;
          const container=document.getElementById('particle-container');
          const display=document.getElementById('matter-display');
          let state,color,count,speed,bg;
          if(T<0){state='❄️ Solid';color='#93c5fd';count=20;bg='#eff6ff';}
          else if(T<100){state='💧 Liquid';color='#6ee7b7';count=16;bg='#ecfdf5';}
          else{state='💨 Gas';color='#fbbf24';count=10;bg='#fefce8';}
          display.style.background=bg;
          document.getElementById('matter-state').textContent=state;
          container.innerHTML='';
          for(let i=0;i<count;i++){
            const p=document.createElement('div');
            const size=T<0?18:T<100?16:22;
            const anim=T<0?'none':T<100?'wobble 1s ease-in-out infinite alternate':'float 0.5s ease-in-out infinite alternate';
            p.style.cssText='width:'+size+'px;height:'+size+'px;border-radius:50%;background:'+color+';box-shadow:0 0 6px '+color+';animation:'+anim+';';
            p.style.animationDelay=(i*0.08)+'s';
            container.appendChild(p);
          }
        ">
      </div>

      <style>
        @keyframes wobble{from{transform:translateX(-3px)}to{transform:translateX(3px)}}
        @keyframes float{from{transform:translate(-5px,-5px)}to{transform:translate(5px,5px)}}
      </style>

      <div style="background:var(--color-primary-light);border-radius:var(--border-radius-lg);padding:var(--space-md);">
        <div style="font-size:1.5rem;font-weight:900;color:var(--color-primary-dark);" id="matter-state">❄️ Solid</div>
        <div style="margin-top:8px;color:var(--text-muted);font-size:0.9rem;">Solid: Tightly packed | Liquid: Loosely packed | Gas: Freely moving</div>
      </div>
    </div>
  `;
};


/* ════════════════════════════════════════════════════════
   MODULE 4: STUDY PLANNER
   ════════════════════════════════════════════════════════ */
AppRouter._studyTasks = JSON.parse(localStorage.getItem('shiksha_study_tasks') || '[]');

AppRouter.renderStudyPlanner = function(main) {
  const tasks = AppRouter._studyTasks;
  const today = new Date();

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
      date: d.toISOString().split('T')[0],
      tasks: tasks.filter(t => t.date === d.toISOString().split('T')[0]),
    };
  });

  main.innerHTML = `
    <div class="section-header">
      <div>
        <h2 class="section-title">📅 Study Planner</h2>
        <div class="section-subtitle">Plan your weekly study schedule, set goals, and track completion</div>
      </div>
      <button class="btn btn-primary" onclick="AppRouter.showAddTaskModal()">+ Add Study Task</button>
    </div>

    <!-- Stats Row -->
    <div class="grid-4" style="margin-bottom:var(--space-xl);">
      <div class="card" style="text-align:center;padding:var(--space-lg);">
        <div style="font-size:2rem;margin-bottom:4px;">📋</div>
        <div style="font-size:1.6rem;font-weight:900;color:var(--color-primary);">${tasks.length}</div>
        <div style="font-size:0.85rem;color:var(--text-muted);">Total Tasks</div>
      </div>
      <div class="card" style="text-align:center;padding:var(--space-lg);">
        <div style="font-size:2rem;margin-bottom:4px;">✅</div>
        <div style="font-size:1.6rem;font-weight:900;color:var(--color-success);">${tasks.filter(t=>t.done).length}</div>
        <div style="font-size:0.85rem;color:var(--text-muted);">Completed</div>
      </div>
      <div class="card" style="text-align:center;padding:var(--space-lg);">
        <div style="font-size:2rem;margin-bottom:4px;">⏳</div>
        <div style="font-size:1.6rem;font-weight:900;color:var(--color-accent-gold);">${tasks.filter(t=>!t.done).length}</div>
        <div style="font-size:0.85rem;color:var(--text-muted);">Pending</div>
      </div>
      <div class="card" style="text-align:center;padding:var(--space-lg);">
        <div style="font-size:2rem;margin-bottom:4px;">🔥</div>
        <div style="font-size:1.6rem;font-weight:900;color:var(--color-danger);">${days[0].tasks.length}</div>
        <div style="font-size:0.85rem;color:var(--text-muted);">Tasks Today</div>
      </div>
    </div>

    <!-- Weekly Calendar Grid -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:var(--space-md);margin-bottom:var(--space-xl);">
      ${days.map((day, di) => `
        <div class="card" style="${di===0?'border:2px solid var(--color-primary);':''}padding:var(--space-md);">
          <div style="font-weight:800;color:${di===0?'var(--color-primary)':'var(--text-primary)'};margin-bottom:var(--space-sm);display:flex;justify-content:space-between;align-items:center;">
            ${day.label}
            <span class="chip chip-primary" style="font-size:0.72rem;">${day.tasks.length}</span>
          </div>
          ${day.tasks.length ? day.tasks.map(task => `
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;padding:6px 8px;background:${task.done?'var(--color-success-light)':'var(--bg-subtle)'};border-radius:var(--border-radius);cursor:pointer;" onclick="AppRouter.toggleTask('${task.id}')">
              <span style="font-size:1.1rem;">${task.done ? '✅' : '⬜'}</span>
              <div style="flex:1;">
                <div style="font-size:0.85rem;font-weight:700;${task.done?'text-decoration:line-through;color:var(--text-muted);':''}">${task.title}</div>
                <div style="font-size:0.75rem;color:var(--text-muted);">${task.subject} · ${task.duration}min</div>
              </div>
              <button style="background:none;border:none;cursor:pointer;color:#e11d48;font-size:0.9rem;" onclick="event.stopPropagation();AppRouter.deleteTask('${task.id}')">🗑️</button>
            </div>
          `).join('') : `<div style="text-align:center;padding:var(--space-md);color:var(--text-muted);font-size:0.85rem;">No tasks</div>`}
        </div>
      `).join('')}
    </div>

    <!-- Add Task Modal Placeholder -->
    <div id="add-task-modal"></div>
  `;
};

AppRouter.showAddTaskModal = function() {
  const modal = document.getElementById('add-task-modal');
  if (!modal) return;
  modal.innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this) this.parentNode.innerHTML=''">
      <div class="modal-content">
        <h3 style="font-weight:800;margin-bottom:var(--space-md);">+ Add Study Task</h3>
        <div class="form-group">
          <label class="form-label">Task Title</label>
          <input type="text" id="task-title" class="form-control" placeholder="e.g. Revise Chapter 3 – Atoms & Molecules">
        </div>
        <div class="form-group">
          <label class="form-label">Subject</label>
          <select id="task-subject" class="form-select">
            <option>📐 Mathematics</option><option>🔬 Science</option><option>📚 English</option><option>🇮🇳 Hindi</option><option>🌍 Social Studies</option><option>💻 Computers</option>
          </select>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-md);">
          <div class="form-group">
            <label class="form-label">Date</label>
            <input type="date" id="task-date" class="form-control" value="${new Date().toISOString().split('T')[0]}">
          </div>
          <div class="form-group">
            <label class="form-label">Duration (min)</label>
            <input type="number" id="task-duration" class="form-control" value="30" min="5" max="180">
          </div>
        </div>
        <div style="display:flex;gap:var(--space-sm);justify-content:flex-end;margin-top:var(--space-md);">
          <button class="btn btn-outline" onclick="document.getElementById('add-task-modal').innerHTML=''">Cancel</button>
          <button class="btn btn-primary" onclick="AppRouter.saveTask()">Save Task</button>
        </div>
      </div>
    </div>
  `;
};

AppRouter.saveTask = function() {
  const title = document.getElementById('task-title')?.value?.trim();
  const subject = document.getElementById('task-subject')?.value;
  const date = document.getElementById('task-date')?.value;
  const duration = parseInt(document.getElementById('task-duration')?.value || 30);

  if (!title || !date) { alert('Please fill in the task title and date.'); return; }

  AppRouter._studyTasks.push({ id: `task_${Date.now()}`, title, subject, date, duration, done: false });
  localStorage.setItem('shiksha_study_tasks', JSON.stringify(AppRouter._studyTasks));
  this.renderStudyPlanner(document.getElementById('view-container'));
};

AppRouter.toggleTask = function(id) {
  const task = AppRouter._studyTasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    localStorage.setItem('shiksha_study_tasks', JSON.stringify(AppRouter._studyTasks));
    this.renderStudyPlanner(document.getElementById('view-container'));
  }
};

AppRouter.deleteTask = function(id) {
  AppRouter._studyTasks = AppRouter._studyTasks.filter(t => t.id !== id);
  localStorage.setItem('shiksha_study_tasks', JSON.stringify(AppRouter._studyTasks));
  this.renderStudyPlanner(document.getElementById('view-container'));
};


/* ════════════════════════════════════════════════════════
   MODULE 5: VOCABULARY BUILDER
   ════════════════════════════════════════════════════════ */
AppRouter._vocabWords = [
  { word: 'Photosynthesis', meaning: 'The process by which green plants use sunlight, water, and CO₂ to produce food (glucose) and oxygen.', example: 'Plants perform photosynthesis to make their own food.', subject: 'Science', difficulty: 'Medium' },
  { word: 'Democracy', meaning: 'A system of government in which power is vested in the people, who rule either directly or through freely elected representatives.', example: 'India is the world\'s largest democracy.', subject: 'Civics', difficulty: 'Easy' },
  { word: 'Ecosystem', meaning: 'A biological community of interacting organisms and their physical environment.', example: 'A forest ecosystem includes trees, animals, and soil organisms.', subject: 'Science', difficulty: 'Medium' },
  { word: 'Algebra', meaning: 'The branch of mathematics dealing with symbols and rules for manipulating those symbols to solve equations.', example: 'We use algebra to find the unknown value of x in equations.', subject: 'Maths', difficulty: 'Medium' },
  { word: 'Parliament', meaning: 'The supreme legislative body of a country, responsible for making laws and controlling government.', example: 'The Indian Parliament consists of the Lok Sabha and Rajya Sabha.', subject: 'Civics', difficulty: 'Easy' },
  { word: 'Osmosis', meaning: 'The movement of water molecules from an area of low solute concentration to high solute concentration through a semi-permeable membrane.', example: 'Osmosis is how plant roots absorb water from the soil.', subject: 'Science', difficulty: 'Hard' },
  { word: 'Protagonist', meaning: 'The leading character or hero in a literary work, story, or film.', example: 'Frodo is the protagonist in "The Lord of the Rings".', subject: 'English', difficulty: 'Medium' },
  { word: 'Latitude', meaning: 'The angular distance of a place north or south of the Earth\'s equator, measured in degrees.', example: 'India lies between 8°N and 37°N latitude.', subject: 'Geography', difficulty: 'Easy' },
  { word: 'Mitochondria', meaning: 'An organelle found in the cells of most organisms, where energy (ATP) is produced through cellular respiration.', example: 'The mitochondria is called the "powerhouse of the cell".', subject: 'Science', difficulty: 'Hard' },
  { word: 'Fraction', meaning: 'A number that represents a part of a whole, written with a numerator over a denominator.', example: '3/4 means 3 parts out of 4 equal parts.', subject: 'Maths', difficulty: 'Easy' },
  { word: 'Metaphor', meaning: 'A figure of speech that describes an object by referring to it as something else, implying a comparison.', example: '"The world is a stage" is a famous metaphor by Shakespeare.', subject: 'English', difficulty: 'Medium' },
  { word: 'Sedimentary', meaning: 'Relating to rock formed from sediment (tiny particles) deposited by water, wind, or ice over millions of years.', example: 'Sandstone is a common sedimentary rock.', subject: 'Geography', difficulty: 'Hard' },
];

AppRouter._vocabIndex = 0;
AppRouter._vocabMastered = JSON.parse(localStorage.getItem('shiksha_vocab_mastered') || '[]');
AppRouter._vocabFlipped = false;

AppRouter.renderVocabularyBuilder = function(main) {
  const words = this._vocabWords;
  const idx = this._vocabIndex;
  const word = words[idx];
  const mastered = this._vocabMastered;
  const flipped = this._vocabFlipped;

  const subjects = [...new Set(words.map(w => w.subject))];

  main.innerHTML = `
    <div class="section-header">
      <div>
        <h2 class="section-title">📖 Vocabulary Builder</h2>
        <div class="section-subtitle">Master key academic terms with flashcards, definitions, and examples</div>
      </div>
      <div class="chip chip-primary">${mastered.length}/${words.length} Mastered</div>
    </div>

    <!-- Progress -->
    <div class="card" style="margin-bottom:var(--space-xl);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-sm);">
        <div style="font-weight:700;">Overall Mastery Progress</div>
        <div style="font-weight:800;color:var(--color-primary);">${Math.round(mastered.length/words.length*100)}%</div>
      </div>
      <div class="progress-container">
        <div class="progress-bar" style="width:${Math.round(mastered.length/words.length*100)}%"></div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:var(--space-md);">
        ${subjects.map(s => `<span class="chip">${s}: ${words.filter(w=>w.subject===s&&mastered.includes(w.word)).length}/${words.filter(w=>w.subject===s).length}</span>`).join('')}
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 300px;gap:var(--space-xl);align-items:start;">

      <!-- Flashcard -->
      <div>
        <div class="flashcard ${flipped ? 'flipped' : ''}" onclick="AppRouter._vocabFlipped=!AppRouter._vocabFlipped; AppRouter.renderVocabularyBuilder(document.getElementById('view-container'));" style="cursor:pointer;">
          <div class="flashcard-inner">
            <div class="flashcard-front" style="flex-direction:column;text-align:center;gap:var(--space-md);">
              <div>
                <span class="chip chip-${word.difficulty==='Easy'?'primary':word.difficulty==='Medium'?'secondary':'accent'}" style="margin-bottom:var(--space-sm);">${word.difficulty} · ${word.subject}</span>
              </div>
              <div style="font-size:2rem;font-weight:900;color:var(--text-primary);letter-spacing:-0.02em;">${word.word}</div>
              <div style="color:var(--text-muted);font-size:0.9rem;">👆 Tap to reveal meaning</div>
            </div>
            <div class="flashcard-back" style="flex-direction:column;text-align:left;gap:var(--space-md);padding:var(--space-xl);">
              <div style="font-size:1.5rem;font-weight:900;color:var(--color-primary-dark);margin-bottom:var(--space-sm);">${word.word}</div>
              <div style="font-size:0.95rem;line-height:1.7;"><strong>📖 Meaning:</strong><br>${word.meaning}</div>
              <div style="font-size:0.9rem;line-height:1.6;color:var(--text-muted);"><strong>💬 Example:</strong><br><em>${word.example}</em></div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:var(--space-lg);">
          <button class="btn btn-outline" onclick="AppRouter._vocabIndex=Math.max(0,AppRouter._vocabIndex-1);AppRouter._vocabFlipped=false;AppRouter.renderVocabularyBuilder(document.getElementById('view-container'));" ${idx===0?'disabled':''}>← Previous</button>

          <div style="text-align:center;">
            <div style="font-weight:700;color:var(--text-muted);">${idx+1} / ${words.length}</div>
            <button class="btn btn-sm ${mastered.includes(word.word)?'btn-secondary':'btn-primary'}" onclick="AppRouter.markVocabMastered('${word.word}')">
              ${mastered.includes(word.word)?'✅ Mastered!':'🎯 Mark as Mastered'}
            </button>
          </div>

          <button class="btn btn-outline" onclick="AppRouter._vocabIndex=Math.min(AppRouter._vocabWords.length-1,AppRouter._vocabIndex+1);AppRouter._vocabFlipped=false;AppRouter.renderVocabularyBuilder(document.getElementById('view-container'));" ${idx===words.length-1?'disabled':''}>Next →</button>
        </div>
      </div>

      <!-- Word List Sidebar -->
      <div class="card" style="padding:0;overflow:hidden;">
        <div style="padding:var(--space-md);font-weight:800;border-bottom:1px solid var(--border-subtle);background:var(--bg-subtle);">📚 All Words</div>
        <div style="max-height:420px;overflow-y:auto;">
          ${words.map((w, i) => `
            <div onclick="AppRouter._vocabIndex=${i};AppRouter._vocabFlipped=false;AppRouter.renderVocabularyBuilder(document.getElementById('view-container'));"
                 style="padding:10px var(--space-md);border-bottom:1px solid var(--border-subtle);cursor:pointer;display:flex;align-items:center;gap:8px;background:${i===idx?'var(--color-primary-light)':'transparent'};transition:background 0.15s;"
                 onmouseenter="this.style.background='var(--bg-subtle)'" onmouseleave="this.style.background='${i===idx?'var(--color-primary-light)':'transparent'}'">
              <span style="font-size:0.9rem;">${mastered.includes(w.word)?'✅':'⬜'}</span>
              <div style="flex:1;">
                <div style="font-weight:700;font-size:0.9rem;">${w.word}</div>
                <div style="font-size:0.75rem;color:var(--text-muted);">${w.subject}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
};

AppRouter.markVocabMastered = function(word) {
  if (!this._vocabMastered.includes(word)) {
    this._vocabMastered.push(word);
  } else {
    this._vocabMastered = this._vocabMastered.filter(w => w !== word);
  }
  localStorage.setItem('shiksha_vocab_mastered', JSON.stringify(this._vocabMastered));
  this.renderVocabularyBuilder(document.getElementById('view-container'));
};
