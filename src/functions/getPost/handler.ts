import "source-map-support/register";

import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { getPost } from "@dataLayer/posts";
import { getValidationErrors } from "@libs/validation";
import { idSchema } from "./schema";

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  const errors = getValidationErrors(event.pathParameters, idSchema);

  if (errors)
    return formatJSONResponse({
      statusCode: 400,
      body: errors,
    });

  const post = await getPost(event.pathParameters?.id!);

  if (!post)
    return formatJSONResponse({
      statusCode: 404,
      body: { message: "Post not found" },
    });

  return formatJSONResponse({
    statusCode: 200,
    body: post,
  });
};

export const main = middyfy(handler);
