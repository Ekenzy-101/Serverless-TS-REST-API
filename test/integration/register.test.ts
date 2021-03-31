import { main } from "../../src/functions/register/handler";
import { deleteAllUsers, createUser } from "../../src/dataLayer/users";
import generateAPIGatewayEvent from "../utils/eventGeneration";

describe("Register Function", () => {
  let name: string, email: string, password: string, confirmPassword: string;

  const execute = () => {
    const event = generateAPIGatewayEvent({
      body: {
        name,
        email,
        password,
        confirmPassword,
      },
      httpMethod: "post",
      path: "auth/register",
    });

    return main(event);
  };

  beforeEach(() => {
    name = "Test";
    email = "test@gmail.com";
    password = "123456";
    confirmPassword = "123456";
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
    name = new Array(52).fill("a").join("");
    password = "";
    email = new Array(247).fill("a").join("") + "@gmail.com";
    confirmPassword = "122";
    const res = await execute();

    expect(res.statusCode).toBe(400);
    expect(Object.keys(JSON.parse(res.body))).toEqual(
      expect.arrayContaining(["name", "email", "password", "confirmPassword"])
    );
    expect(Object.keys(res.headers)).toEqual(
      expect.arrayContaining([
        "Access-Control-Allow-Credentials",
        "Access-Control-Allow-Origin",
      ])
    );
  });

  it("should return 400 if a user already exists in the database", async () => {
    await createUser({
      id: "1",
      email,
      name,
      password,
      createdAt: new Date().toISOString(),
    });

    const res = await execute();

    expect(res.statusCode).toBe(400);
    expect(Object.keys(JSON.parse(res.body))).toEqual(
      expect.arrayContaining(["email"])
    );
    expect(Object.keys(res.headers)).toEqual(
      expect.arrayContaining([
        "Access-Control-Allow-Credentials",
        "Access-Control-Allow-Origin",
      ])
    );
  });
});
