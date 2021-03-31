import { APIGatewayProxyEvent } from "aws-lambda";

interface EventOptions {
  authorizer?: Record<string, any>;
  body: any;
  headers?: Record<string, string | undefined>;
  httpMethod: string;
  path: string;
  pathParameters?: Record<string, string | undefined>;
  queryStringParameters?: Record<string, string | undefined>;
  stageVariables?: Record<string, string | undefined>;
}

const generateAPIGatewayEvent = (options: EventOptions) => {
  const {
    authorizer = {},
    path = "",
    body,
    headers = {},
    httpMethod,
    pathParameters = null,
    queryStringParameters = null,
    stageVariables = null,
  } = options;
  return {
    body: body ? body : null,
    headers,
    multiValueHeaders: {},
    httpMethod,
    isBase64Encoded: false,
    path,
    pathParameters: pathParameters,
    queryStringParameters: queryStringParameters,
    multiValueQueryStringParameters: null,
    stageVariables,
    requestContext: {
      accountId: "",
      apiId: "",
      httpMethod,
      identity: {
        accessKey: "",
        accountId: "",
        apiKey: "",
        apiKeyId: "",
        caller: "",
        cognitoAuthenticationProvider: "",
        cognitoAuthenticationType: "",
        cognitoIdentityId: "",
        cognitoIdentityPoolId: "",
        principalOrgId: "",
        sourceIp: "",
        user: "",
        userAgent: "",
        userArn: "",
      },
      path,
      stage: "",
      requestId: "",
      requestTimeEpoch: 3,
      resourceId: "",
      resourcePath: "",
      authorizer,
    },
    resource: "",
  } as APIGatewayProxyEvent;
};

export default generateAPIGatewayEvent;
