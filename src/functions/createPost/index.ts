import { handlerPath } from "../../libs/handlerResolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "posts",
        cors: true,
        authorizer: {
          name: "auth",
          resultTtlInSeconds: 0,
          identitySource: "method.request.header.Cookie",
          type: "request",
        },
        documentation: {
          summary: "Create Post",
          description: "Create Post",
        },
      },
    },
  ],
  iamRoleStatements: [
    {
      Effect: "Allow",
      Action: ["dynamodb:PutItem"],
      Resource:
        "arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.POSTS_TABLE}",
    },
    {
      Effect: "Allow",
      Action: ["s3:PutObject", "s3:GetObject"],
      Resource:
        "arn:aws:s3:::${self:provider.environment.POST_IMAGES_BUCKET}/*",
    },
  ],
};
