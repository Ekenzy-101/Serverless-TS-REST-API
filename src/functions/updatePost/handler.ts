import "source-map-support/register";

import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { getValidationErrors } from "@libs/validation";
import { User } from "@utils/types/user";
import { getPost, updatePost } from "@dataLayer/posts";
import { idSchema, postSchema } from "./schema";

interface EventBody {
  title: string;
  content: string;
  category: string;
}

const handler: ValidatedEventAPIGatewayProxyEvent<EventBody> = async (
  event
) => {
  let errors = getValidationErrors(event.pathParameters, idSchema);
  if (errors)
    return formatJSONResponse({
      statusCode: 400,
      body: errors,
    });

  errors = getValidationErrors(event.body, postSchema);
  if (errors)
    return formatJSONResponse({
      statusCode: 400,
      body: errors,
    });

  const authUser = (event.requestContext.authorizer as unknown) as User;

  let post = await getPost(event.pathParameters?.id!);

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

  post = await updatePost({
    id: post.id,
    ...event.body,
    updatedAt: new Date().toISOString(),
  });

  return formatJSONResponse({
    statusCode: 200,
    body: post,
  });
};

export const main = middyfy(handler);
