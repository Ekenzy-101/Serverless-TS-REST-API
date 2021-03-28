import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "auth/register",
        cors: true,
        documentation: {
          summary: "Create a new user",
          description: "Create a new user",
        },
      },
    },
  ],
  iamRoleStatements: [
    {
      Effect: "Allow",
      Action: ["dynamodb:PutItem", "dynamodb:Query"],
      Resource:
        "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.USERS_TABLE}",
    },
    {
      Effect: "Allow",
      Action: ["dynamodb:Query"],
      Resource:
        "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.USERS_TABLE}/index/${self:provider.environment.EMAIL_INDEX}",
    },
  ],
};
