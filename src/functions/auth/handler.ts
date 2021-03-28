import "source-map-support/register";

import {
  APIGatewayRequestAuthorizerEvent,
  APIGatewayAuthorizerResult,
  APIGatewayRequestAuthorizerHandler,
} from "aws-lambda";
import { parseCookies } from "@libs/apiGateway";
import * as jwt from "jsonwebtoken";

const handler: APIGatewayRequestAuthorizerHandler = async (
  event: APIGatewayRequestAuthorizerEvent
) => {
  console.log(event.headers?.Cookie);
  console.log("event", event);
  const Resource = event.methodArn;

  if (!event.headers?.Cookie)
    return generateAuthResponse({
      principalId: "user",
      Effect: "Deny",
      Resource,
      context: null,
    });

  const cookieObject = parseCookies(event.headers.Cookie);

  const cookieName = process.env.ACCESS_TOKEN_COOKIE_NAME!;
  const secret = process.env.APP_ACCESS_SECRET!;

  try {
    const user = await jwt.verify(cookieObject[cookieName], secret);

    return generateAuthResponse({
      principalId: "user",
      Effect: "Allow",
      Resource,
      context: user,
    });
  } catch (error) {
    return generateAuthResponse({
      principalId: "user",
      Effect: "Deny",
      Resource,
      context: null,
    });
  }
};

export const main = handler;

function generateAuthResponse(params: {
  principalId: string;
  context: any;
  Effect: string;
  Resource: string;
}): APIGatewayAuthorizerResult {
  const { principalId, context, Effect, Resource } = params;
  return {
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Effect,
          Action: "execute-api:Invoke",
          Resource,
        },
      ],
    },
    principalId,
    context,
  };
}