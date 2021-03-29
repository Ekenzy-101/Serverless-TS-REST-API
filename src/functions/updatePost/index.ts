import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "put",
        path: "posts/{id}",
        cors: true,
        authorizer: {
          name: "auth",
          resultTtlInSeconds: 0,
          identitySource: "method.request.header.Cookie",
          type: "request",
        },
        documentation: {
          summary: "Update Post",
          description: "Update Post",
        },
      },
    },
  ],
  iamRoleStatements: [
    {
      Effect: "Allow",
      Action: ["dynamodb:UpdateItem", "dynamodb:GetItem"],
      Resource:
        "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.POSTS_TABLE}",
    },
  ],
};
