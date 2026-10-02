/* ==========================================================================
   SHIKSHA SETU - LIBRARY CONTROLLER
   ========================================================================== */

const db = require('../services/db');

async function getAll(req, res, next) {
  try {
    const { class_number, subject_key } = req.query;
    let queryText = `SELECT id, resource_key, title, description, resource_type, resource_url, class_number, subject_key, created_at FROM library_resources WHERE published = TRUE`;
    const params = [];

    if (class_number) {
      params.push(parseInt(class_number));
      queryText += ` AND class_number = $${params.length}`;
    }
    if (subject_key) {
      params.push(subject_key);
      queryText += ` AND subject_key = $${params.length}`;
    }
    queryText += ' ORDER BY created_at DESC';

    const result = await db.query(queryText, params);
    res.json({ resources: result.rows });
  } catch (err) {
    next(err);
  }
}

async function add(req, res, next) {
  try {
    const teacherId = req.user.sub;
    const { resource_key, title, description, resource_type, resource_url, class_number, subject_key } = req.body;

    const result = await db.query(
      `INSERT INTO library_resources (resource_key, title, description, resource_type, resource_url, class_number, subject_key, uploaded_by, published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
       RETURNING *`,
      [resource_key || null, title, description || null, resource_type || null, resource_url || null, class_number || null, subject_key || null, teacherId]
    );
    res.status(201).json({ resource: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description, resource_url, published } = req.body;

    const result = await db.query(
      `UPDATE library_resources
       SET title        = COALESCE($1, title),
           description  = COALESCE($2, description),
           resource_url = COALESCE($3, resource_url),
           published    = COALESCE($4, published)
       WHERE id = $5
       RETURNING *`,
      [title, description, resource_url, published, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Resource not found.' });
    res.json({ resource: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const result = await db.query(
      `DELETE FROM library_resources WHERE id = $1 RETURNING id`, [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Resource not found.' });
    res.json({ message: 'Resource deleted.', id });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, add, update, remove };
