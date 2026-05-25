import { Router, Response } from "express";
import pool from "../db/connection";
import authMiddleware, { AuthRequest } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

// GET /api/projects — list all projects for logged in user
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT * FROM projects 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [req.user!.userId]
    )

    res.status(200).json({ projects: result.rows })

  } catch (error) {
    console.error('Get projects error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/projects — create a new project
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, description } = req.body

  if (!name) {
    res.status(400).json({ error: 'Project name is required' })
    return
  }

  try {
    const result = await pool.query(
      `INSERT INTO projects (user_id, name, description)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.user!.userId, name, description || null]
    )

    res.status(201).json({ project: result.rows[0] })

  } catch (error) {
    console.error('Create project error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /api/projects/:id — delete a project
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params

  try {
    const result = await pool.query(
      `DELETE FROM projects 
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, req.user!.userId]
    )

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Project not found' })
      return
    }

    res.status(200).json({ message: 'Project deleted' })

  } catch (error) {
    console.error('Delete project error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router