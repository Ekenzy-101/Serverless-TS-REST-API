import { User } from "../utils/types/user";
import { docClient } from ".";

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

export const deleteAllUsers = async () => {
  const result = await docClient
    .scan({
      TableName,
    })
    .promise();

  if (result.Items?.length) {
    const mappedItems = result.Items.map((item) => ({
      DeleteRequest: {
        Key: { id: item.id },
      },
    }));

    await docClient
      .batchWrite({ RequestItems: { [TableName]: mappedItems } })
      .promise();
  }
};
