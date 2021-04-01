import * as jwt from "jsonwebtoken";

import { main } from "../../src/functions/auth/handler";
import { generateAPIGatewayRequestAuthorizerEvent } from "../utils/eventGeneration";

describe("Request Authorizer", () => {
  let cookieName: string, headers: Record<string, any>;

  const execute = () => {
    const event = generateAPIGatewayRequestAuthorizerEvent({
      headers,
    });
    return main(event);
  };

  beforeEach(() => {
    const secret = process.env.APP_ACCESS_SECRET!;
    cookieName = process.env.ACCESS_TOKEN_COOKIE_NAME!;

    const token = jwt.sign(
      { name: "test", email: "test@gmail.com", id: "1" },
      secret
    );
    headers = {
      Cookie: `${cookieName}=${token}`,
    };
  });

  it("should allow user if cookie is valid", async () => {
    const res = await execute();

    expect(res.context).not.toBeNull();
    expect(Object.keys(res.context!)).toEqual(
      expect.arrayContaining(["name", "email", "id", "iat"])
    );
  });

  it("should deny user if there is no cookie", async () => {
    headers = {};
    const res = await execute();

    expect(res.context).toBeNull();
  });

  it("should deny user if cookie is invalid", async () => {
    headers = {
      Cookie: `${cookieName}=invalid`,
    };
    const res = await execute();

    expect(res.context).toBeNull();
  });
});
