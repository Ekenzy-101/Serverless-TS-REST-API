import "source-map-support/register";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import * as jwt from "jsonwebtoken";

import {
  setCookie,
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from "../../libs/apiGateway";
import { middyfy } from "../../libs/lambda";
import { getValidationErrors } from "../../libs/validation";
import { createUser, getUserByIndex } from "../../dataLayer/users";
import { registerSchema } from "./schema";

interface EventBody {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const handler: ValidatedEventAPIGatewayProxyEvent<EventBody> = async (
  event
) => {
  const errors = getValidationErrors(event.body, registerSchema);
  if (errors)
    return formatJSONResponse({
      statusCode: 400,
      body: errors,
    });

  const { password, email, name } = event.body;

  const IndexName = process.env.EMAIL_INDEX!;

  let user = await getUserByIndex({
    IndexName,
    KeyConditionExpression: "email = :email",
    ProjectionExpression: "email",
    ExpressionAttributeValues: {
      ":email": email,
    },
  });

  if (user)
    return formatJSONResponse({
      statusCode: 400,
      body: { email: "Email already exists" },
    });

  const hashedPassword = await bcrypt.hash(password, 15);
  user = {
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };

  await createUser(user);

  const payload = { id: user.id, name, email };
  const secret = process.env.APP_ACCESS_SECRET!;
  const cookieName = process.env.ACCESS_TOKEN_COOKIE_NAME!;
  const oneDay = 60 * 60 * 24;

  const token = jwt.sign(payload, secret, { expiresIn: oneDay });

  return formatJSONResponse({
    statusCode: 200,
    body: payload,
    headers: {
      ...setCookie({
        name: cookieName,
        value: token,
        httpOnly: true,
        maxAge: oneDay,
      }),
    },
  });
};

export const main = middyfy(handler);
