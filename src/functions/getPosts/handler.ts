import "source-map-support/register";

import {
  ValidatedEventAPIGatewayProxyEvent,
  formatJSONResponse,
  ValidatedAPIGatewayProxyEvent,
} from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import { getPaginatedPosts } from "@dataLayer/posts";

interface EventBody {
  title: string;
  content: string;
  category: string;
}

const handler: ValidatedEventAPIGatewayProxyEvent<EventBody> = async (
  event
) => {
  try {
    const nextKey = parseNextKeyParameter(event);
    const limit = parseLimitParameter(event);

    const result = await getPaginatedPosts(nextKey, limit);

    return formatJSONResponse({
      statusCode: 200,
      body: { posts: result.Items, nextKey: result.LastEvaluatedKey },
    });
  } catch (error) {
    return formatJSONResponse({
      statusCode: 400,
      body: { message: "Invalid Query string parameters" },
    });
  }
};

function parseNextKeyParameter(
  event: ValidatedAPIGatewayProxyEvent<EventBody>
) {
  const nextKeyStr = event.queryStringParameters?.nextKey;
  if (!nextKeyStr) return undefined;

  return { id: nextKeyStr };
}

function parseLimitParameter(event: ValidatedAPIGatewayProxyEvent<EventBody>) {
  const limitStr = event.queryStringParameters?.limit;
  if (!limitStr) return 2;

  const limit = parseInt(limitStr, 10);

  if (limit <= 0) throw new Error("Limit should be positive");

  return limit;
}

export const main = middyfy(handler);
