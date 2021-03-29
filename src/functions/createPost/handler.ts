import "source-map-support/register";
import { v4 as uuidv4 } from "uuid";

import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
} from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { getValidationErrors } from "@libs/validation";
import { User } from "@utils/types/user";
import { Post } from "@utils/types/post";
import { createPost } from "@dataLayer/posts";
import { postSchema } from "./schema";
import { getUploadUrl } from "@libs/s3";

interface EventBody {
  title: string;
  content: string;
  category: string;
}

const handler: ValidatedEventAPIGatewayProxyEvent<EventBody> = async (
  event
) => {
  const errors = getValidationErrors(event.body, postSchema);
  if (errors)
    return formatJSONResponse({
      statusCode: 400,
      body: errors,
    });

  const authUser = (event.requestContext.authorizer as unknown) as User;

  const bucketName = process.env.POST_IMAGES_BUCKET!;
  const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION!);

  const id = uuidv4();

  const post: Post = {
    id,
    ...event.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: authUser.id,
    imageUrl: `https://${bucketName}.s3.amazonaws.com/${id}`,
  };

  await createPost(post);

  const signedUrl = getUploadUrl({
    Bucket: bucketName,
    Expires: urlExpiration,
    Key: id,
  });

  return formatJSONResponse({
    statusCode: 201,
    body: { ...post, signedUrl },
  });
};

export const main = middyfy(handler);
