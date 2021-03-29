import "source-map-support/register";

import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { getValidationErrors } from "@libs/validation";
import { User } from "@utils/types/user";
import { deletePost, getPost } from "@dataLayer/posts";
import { idSchema } from "./schema";

const handler: ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
  let errors = getValidationErrors(event.pathParameters, idSchema);
  if (errors)
    return formatJSONResponse({
      statusCode: 400,
      body: errors,
    });

  const authUser = (event.requestContext.authorizer as unknown) as User;

  const post = await getPost(event.pathParameters?.id!);

  if (!post)
    return formatJSONResponse({
      statusCode: 404,
      body: { message: "Post not found" },
    });

  if (post.userId !== authUser.id)
    return formatJSONResponse({
      statusCode: 403,
      body: { message: "User not authorized to edit post" },
    });

  await deletePost(post.id);

  return formatJSONResponse({
    statusCode: 200,
    body: { message: "Sucessfully deleted" },
  });
};

export const main = middyfy(handler);
