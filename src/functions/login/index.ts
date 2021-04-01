import { handlerPath } from "../../libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "auth/login",
        cors: true,
        documentation: {
          summary: "Login user",
          description: "Login user",
        },
      },
    },
  ],
  iamRoleStatements: [
    {
      Effect: "Allow",
      Action: ["dynamodb:Query"],
      Resource:
        "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.USERS_TABLE}/index/${self:provider.environment.EMAIL_INDEX}",
    },
  ],
};
