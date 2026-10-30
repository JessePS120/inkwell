// server/src/routes/__tests__/auth.integration.test.js

import request from "supertest";
import { app } from "../../app.js";
import { prisma } from "../../db/client.js";
import { resetDatabase } from "../../test-utils/fixtures.js";

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

//Testing the registration and login togethe.
test("a newly registered user can log in with the same credentials", async () => {
  const registerRes = await request(app).post("/api/auth/register").send({
    email: "bob@example.com",
    displayName: "Bob",
    password: "correcthorse",
  });

  expect(registerRes.status).toBe(201);

  const loginRes = await request(app).post("/api/auth/login").send({
    email: "bob@example.com",
    password: "correcthorse",
  });

  expect(loginRes.status).toBe(200);
  expect(loginRes.body.user.id).toBe(registerRes.body.user.id);
  expect(loginRes.body.user.email).toBe("bob@example.com");
  expect(loginRes.body.user).not.toHaveProperty("passwordHash");
  expect(loginRes.body.accessToken).toEqual(expect.any(String));

  const wrongPasswordRes = await request(app).post("/api/auth/login").send({
    email: "bob@example.com",
    password: "wrongpassword",
  });

  expect(wrongPasswordRes.status).toBe(401);
  expect(wrongPasswordRes.body.error.code).toBe("INVALID_CREDENTIALS");
});
