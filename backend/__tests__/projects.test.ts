import request from "supertest";
import app from "../src/index";
import pool from "../src/db/testPool";

let token: string;
let userId: string;
let projectId: string;

const testUser = {
  email: "projects_test@taskflow.com",
  password: "testpassword123",
  name: "Projects Test User",
};

beforeAll(async () => {
  const res = await request(app).post("/api/auth/register").send(testUser);

  token = res.body.token;
  userId = res.body.user.id;
});

afterAll(async () => {
  await pool.query("DELETE FROM users WHERE id = $1", [userId]);

});

describe("POST /api/projects", () => {
  it("should create a project and return 201", async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Project", description: "A test project" });

    expect(res.status).toBe(201);
    expect(res.body.project.name).toBe("Test Project");
    expect(res.body.project.user_id).toBe(userId);

    projectId = res.body.project.id;
  });

  it("should return 400 if name is missing", async () => {
    const res = await request(app)
      .post("/api/projects")
      .set("Authorization", `Bearer ${token}`)
      .send({ description: "No name provided" });

    expect(res.status).toBe(400);
  });

  it("should return 401 if no token provided", async () => {
    const res = await request(app)
      .post("/api/projects")
      .send({ name: "Should fail" });

    expect(res.status).toBe(401);
  });
});

describe("GET /api/projects", () => {
  it("should return list of projects for the user", async () => {
    const res = await request(app)
      .get("/api/projects")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.projects)).toBe(true);
    expect(res.body.projects.length).toBeGreaterThan(0);
  });
});

describe("DELETE /api/projects/:id", () => {
  it("should delete the project and return 200", async () => {
    const res = await request(app)
      .delete(`/api/projects/${projectId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it("should return 404 for non-existent project", async () => {
    const res = await request(app)
      .delete("/api/projects/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
