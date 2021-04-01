import { main } from "../../src/functions/login/handler";
import { deleteAllUsers, createUser } from "../../src/dataLayer/users";
import generateAPIGatewayEvent from "../utils/eventGeneration";
import * as bcrypt from "bcrypt";

describe("Login Function", () => {
  let name: string, email: string, password: string;

  const execute = () => {
    const event = generateAPIGatewayEvent({
      body: {
        email,
        password,
      },
      httpMethod: "post",
      path: "auth/login",
    });

    return main(event);
  };

  beforeEach(async () => {
    name = "Test";
    email = "test@gmail.com";
    password = "123456";

    const hashedPassword = await bcrypt.hash(password, 12);

    await createUser({
      email,
      id: "1",
      name,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    });
  });

  afterEach(async () => {
    await deleteAllUsers();
  });

  it("should return 200 if inputs are valid", async () => {
    const res = await execute();

    expect(res.statusCode).toBe(200);
    expect(Object.keys(JSON.parse(res.body))).toEqual(
      expect.arrayContaining(["name", "email", "id"])
    );
    expect(Object.keys(res.headers)).toEqual(
      expect.arrayContaining([
        "Set-Cookie",
        "Access-Control-Allow-Credentials",
        "Access-Control-Allow-Origin",
      ])
    );
  });

  it("should return 400 if inputs are invalid", async () => {
    email = new Array(247).fill("a").join("") + "@gmail.com";
    password = "123";

    const res = await execute();

    expect(res.statusCode).toBe(400);
    expect(Object.keys(JSON.parse(res.body))).toEqual(
      expect.arrayContaining(["password", "email"])
    );
    expect(Object.keys(res.headers)).toEqual(
      expect.arrayContaining([
        "Access-Control-Allow-Credentials",
        "Access-Control-Allow-Origin",
      ])
    );
  });

  it("should return 400 if a user with the email input does not exist in the database", async () => {
    email = "notfound@gmail.com";

    const res = await execute();

    expect(res.statusCode).toBe(400);
    expect(Object.keys(JSON.parse(res.body))).toEqual(
      expect.arrayContaining(["message"])
    );
    expect(Object.keys(res.headers)).toEqual(
      expect.arrayContaining([
        "Access-Control-Allow-Credentials",
        "Access-Control-Allow-Origin",
      ])
    );
  });

  it("should return 400 if a user's password and password input do not match", async () => {
    password = "654321";

    const res = await execute();

    expect(res.statusCode).toBe(400);
    expect(Object.keys(JSON.parse(res.body))).toEqual(
      expect.arrayContaining(["message"])
    );
    expect(Object.keys(res.headers)).toEqual(
      expect.arrayContaining([
        "Access-Control-Allow-Credentials",
        "Access-Control-Allow-Origin",
      ])
    );
  });
});
