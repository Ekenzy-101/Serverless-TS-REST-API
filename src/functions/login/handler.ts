import "source-map-support/register";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

import {
  setCookie,
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from "../../libs/apiGateway";
import { middyfy } from "../../libs/lambda";
import { getValidationErrors } from "../../libs/validation";
import { getUserByIndex } from "../../dataLayer/users";
import { loginSchema } from "./schema";

interface EventBody {
  email: string;
  password: string;
}

const handler: ValidatedEventAPIGatewayProxyEvent<EventBody> = async (
  event
) => {
  const errors = getValidationErrors(event.body, loginSchema);
  if (errors)
    return formatJSONResponse({
      statusCode: 400,
      body: errors,
    });

  const { email, password } = event.body;
  const IndexName = process.env.EMAIL_INDEX!;
  let user = await getUserByIndex({
    IndexName,
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
  });

  if (!user)
    return formatJSONResponse({
      statusCode: 400,
      body: { message: "Invalid Email or Password" },
    });

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid)
    return formatJSONResponse({
      statusCode: 400,
      body: { message: "Invalid Email or Password" },
    });

  const payload = { id: user.id, name: user.name, email };
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
