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

export const getPost = async (id: string) => {
  const result = await docClient
    .get({
      TableName,
      Key: {
        id,
      },
    })
    .promise();

  return result.Item as Post | undefined;
};

export const getPaginatedPosts = async (
  ExclusiveStartKey: any,
  Limit: number
) => {
  return docClient
    .scan({
      TableName,
      Limit,
      ExclusiveStartKey,
    })
    .promise();
};

export const updatePost = async (
  post: Omit<Post, "createdAt" | "userId" | "imageUrl">
) => {
  const { id, content, category, title, updatedAt } = post;

  const result = await docClient
    .update({
      TableName,
      Key: {
        id,
      },
      UpdateExpression:
        "SET content = :content, category = :category, title = :title, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":content": content,
        ":category": category,
        ":title": title,
        ":updatedAt": updatedAt,
      },
      ReturnValues: "ALL_NEW",
    })
    .promise();

  return result.Attributes as Post | undefined;
};

export const deletePost = async (id: string) => {
  await docClient
    .delete({
      TableName,
      Key: {
        id,
      },
    })
    .promise();
};
