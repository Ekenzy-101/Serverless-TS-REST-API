import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from "aws-lambda";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, "body"> & {
  body: S;
};

export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

export type CookieOptions = {
  name: string;
  value: string;
  maxAge?: number;
  secure?: boolean;
  httpOnly?: boolean;
  path?: string;
  domain?: string;
};

export type ResponseOptions = {
  body: any;
  statusCode: number;
  headers?: Record<string, any>;
};

export const formatJSONResponse = (options: ResponseOptions) => {
  return {
    ...options,
    body: JSON.stringify(options.body),
  };
};

export const setCookie = (options: CookieOptions) => {
  const { name, value, secure, httpOnly, maxAge, path, domain } = options;

  let cookieString = `${name}=${value}`;

  cookieString = secure ? `${cookieString}; Secure` : cookieString;
  cookieString = httpOnly ? `${cookieString}; HttpOnly` : cookieString;
  cookieString =
    maxAge !== undefined ? `${cookieString}; Max-Age=${maxAge}` : cookieString;
  cookieString = path
    ? `${cookieString}; Path=${path}`
    : `${cookieString}; Path=/`;
  cookieString = domain ? `${cookieString}; Domain=${domain}` : cookieString;

  return {
    "Set-Cookie": cookieString,
  };
};

export const parseCookies = (value: string) => {
  return Object.fromEntries(
    value?.split(/; */).map((cookieString) => {
      const [key, ...v] = cookieString.split("=");
      return [key, decodeURIComponent(v.join("="))];
    })
  );
};
