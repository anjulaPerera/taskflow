import request from "supertest";
import app from "../src/index";
import pool from "../src/db/connection";

const testUser = {
  email: "test@taskflow.com",
  password: "testpassword123",
  name: "Test User",
};

afterAll(async () => {
  await pool.query("DELETE FROM users WHERE email = $1", [testUser.email]);
  await pool.end();
});

describe("POST /api/auth/register", () => {
  it("should register a new user and return 201 with token", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.user).not.toHaveProperty("password_hash");
  });

  it("should return 409 if email already exists", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("Email already registered");
  });

  it("should return 400 if required fields are missing", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "incomplete@test.com" });

    expect(res.status).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  it("should login successfully and return token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).not.toHaveProperty("password_hash");
  });

  it("should return 401 with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: "wrongpassword" });

    expect(res.status).toBe(401);
  });

  it("should return 401 with non-existent email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@test.com", password: "anything" });

    expect(res.status).toBe(401);
  });
});
