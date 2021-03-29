import AWS from "@libs/aws-sdk";

const localOptions = {
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.ACCESS_KEY_SECRET!,
  },
  region: "localhost",
  endpoint: "http://localhost:8000",
};

export const docClient = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
  ...(process.env.IS_OFFLINE ? localOptions : {}),
});
