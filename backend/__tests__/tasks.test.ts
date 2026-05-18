import request from "supertest";
import app from "../src/index";
import pool from "../src/db/testPool";

let token: string;
let userId: string;
let projectId: string;
let taskId: string;

const testUser = {
  email: "tasks_test@taskflow.com",
  password: "testpassword123",
  name: "Tasks Test User",
};

beforeAll(async () => {
  const registerRes = await request(app)
    .post("/api/auth/register")
    .send(testUser);

  token = registerRes.body.token;
  userId = registerRes.body.user.id;

  const projectRes = await request(app)
    .post("/api/projects")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Tasks Test Project",
      description: "Project for task testing",
    });

  projectId = projectRes.body.project.id;
});

afterAll(async () => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
  } catch (error){
    console.error(error);console.error("Migration failed:", error); 

  }
});

describe("POST /api/projects/:projectId/tasks", () => {
  it("should create a task and return 201", async () => {
    const res = await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "Task description",
      });

    expect(res.status).toBe(201);
    expect(res.body.task.title).toBe("Test Task");
    expect(res.body.task.project_id).toBe(projectId);

    taskId = res.body.task.id;
  });

  it("should return 400 if title is missing", async () => {
    const res = await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "No title",
      });

    expect(res.status).toBe(400);
  });

  it("should return 404 for invalid project", async () => {
    const res = await request(app)
      .post("/api/projects/00000000-0000-0000-0000-000000000000/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Invalid project task",
      });

    expect(res.status).toBe(404);
  });
});

describe("GET /api/projects/:projectId/tasks", () => {
  it("should return tasks for the project", async () => {
    const res = await request(app)
      .get(`/api/projects/${projectId}/tasks`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.tasks)).toBe(true);
    expect(res.body.tasks.length).toBeGreaterThan(0);
  });

  it("should return 404 for invalid project", async () => {
    const res = await request(app)
      .get("/api/projects/00000000-0000-0000-0000-000000000000/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});

describe("PATCH /api/tasks/:id", () => {
  it("should update task title and status", async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Task",
        status: "done",
      });

    expect(res.status).toBe(200);
    expect(res.body.task.title).toBe("Updated Task");
    expect(res.body.task.status).toBe("done");
  });

  it("should return 400 for invalid status", async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "invalid_status",
      });

    expect(res.status).toBe(400);
  });

  it("should return 404 for non-existent task", async () => {
    const res = await request(app)
      .patch("/api/tasks/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Does not exist",
      });

    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/tasks/:id", () => {
  it("should delete the task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Task deleted");
  });

  it("should return 404 for already deleted task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
