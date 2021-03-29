import { handlerPath } from "@libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "delete",
        path: "posts/{id}",
        cors: true,
        authorizer: {
          name: "auth",
          resultTtlInSeconds: 0,
          identitySource: "method.request.header.Cookie",
          type: "request",
        },
        documentation: {
          summary: "Delete Post",
          description: "Delete Post",
        },
      },
    },
  ],
  iamRoleStatements: [
    {
      Effect: "Allow",
      Action: ["dynamodb:DeleteItem", "dynamodb:GetItem"],
      Resource:
        "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.POSTS_TABLE}",
    },
  ],
};
