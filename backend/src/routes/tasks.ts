import { Router, Response } from "express";
import pool from "../db/connection";
import authMiddleware, { AuthRequest } from "../middleware/auth";

const router = Router({ mergeParams: true });

router.use(authMiddleware);

// GET /api/projects/:projectId/tasks
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  const { projectId } = req.params;

  try {
    const projectCheck = await pool.query(
      "SELECT id FROM projects WHERE id = $1 AND user_id = $2",
      [projectId, req.user!.userId],
    );

    if (projectCheck.rows.length === 0) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    const result = await pool.query(
      `SELECT * FROM tasks 
       WHERE project_id = $1 
       ORDER BY created_at ASC`,
      [projectId],
    );

    res.status(200).json({ tasks: result.rows });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/projects/:projectId/tasks
router.post("/", async (req: AuthRequest, res: Response): Promise<void> => {
  const { projectId } = req.params;
  const { title, description } = req.body;

  if (!title) {
    res.status(400).json({ error: "Task title is required" });
    return;
  }

  try {
    const projectCheck = await pool.query(
      "SELECT id FROM projects WHERE id = $1 AND user_id = $2",
      [projectId, req.user!.userId],
    );

    if (projectCheck.rows.length === 0) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    const result = await pool.query(
      `INSERT INTO tasks (project_id, title, description)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [projectId, title, description || null],
    );

    res.status(201).json({ task: result.rows[0] });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/tasks/:id
router.patch("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, status } = req.body;

  const validStatuses = ["todo", "in_progress", "done"];
  if (status && !validStatuses.includes(status)) {
    res.status(400).json({ error: "Invalid status value" });
    return;
  }

  try {
    const result = await pool.query(
      `UPDATE tasks 
       SET 
         title = COALESCE($1, title),
         status = COALESCE($2, status),
         updated_at = NOW()
       WHERE id = $3
         AND project_id IN (
           SELECT id FROM projects WHERE user_id = $4
         )
       RETURNING *`,
      [title || null, status || null, id, req.user!.userId],
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.status(200).json({ task: result.rows[0] });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/tasks/:id
router.delete(
  "/:id",
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const result = await pool.query(
        `DELETE FROM tasks 
       WHERE id = $1
         AND project_id IN (
           SELECT id FROM projects WHERE user_id = $2
         )
       RETURNING id`,
        [id, req.user!.userId],
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: "Task not found" });
        return;
      }

      res.status(200).json({ message: "Task deleted" });
    } catch (error) {
      console.error("Delete task error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

export default router;
