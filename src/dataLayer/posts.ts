import { Post } from "@utils/types/post";
import { docClient } from ".";

const TableName = process.env.POSTS_TABLE!;

export const createPost = async (Item: Post) => {
  await docClient
    .put({
      TableName,
      Item,
    })
    .promise();

  return Item;
};

export const getPostByIndex = async (
  params: Omit<AWS.DynamoDB.DocumentClient.QueryInput, "TableName">
) => {
  const result = await docClient
    .query({
      TableName,
      ...params,
    })
    .promise();

  return result.Items ? (result.Items[0] as Post) : null;
};
