import middy from "@middy/core";
import middyJsonBodyParser from "@middy/http-json-body-parser";
import cors from "@middy/http-cors";
import { APIGatewayProxyEvent } from "aws-lambda";

export const middyfy = (handler: any) => {
  const origin = process.env.CLIENT_ORIGIN;
  return (middy(handler)
    .use(middyJsonBodyParser())
    .use(cors({ credentials: true, origin })) as unknown) as (
    event: APIGatewayProxyEvent
  ) => Promise<{
    statusCode: number;
    headers: Record<string, any>;
    body: string;
  }>;
};
