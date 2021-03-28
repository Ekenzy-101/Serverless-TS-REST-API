import AWS from "@libs/aws-sdk";
import { User } from "@utils/types/user";

const docClient = new AWS.DynamoDB.DocumentClient({
  apiVersion: "2012-08-10",
});

const TableName = process.env.USERS_TABLE!;

export const createUser = async (Item: User) => {
  await docClient
    .put({
      TableName,
      Item,
    })
    .promise();

  return Item;
};

export const getUserByIndex = async (
  params: Omit<AWS.DynamoDB.DocumentClient.QueryInput, "TableName">
) => {
  const result = await docClient
    .query({
      TableName,
      ...params,
    })
    .promise();

  return result.Items ? (result.Items[0] as User) : null;
};
