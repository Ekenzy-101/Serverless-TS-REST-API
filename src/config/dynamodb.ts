export default {
  UsersDynamoDBTable: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "email", AttributeType: "S" },
      ],
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      BillingMode: "PAY_PER_REQUEST",
      GlobalSecondaryIndexes: [
        {
          IndexName: "${self:provider.environment.EMAIL_INDEX}",
          KeySchema: [{ AttributeName: "email", KeyType: "HASH" }],
          Projection: { ProjectionType: "ALL" },
        },
      ],
      TableName: "${self:provider.environment.USERS_TABLE}",
    },
  },
  PostsDynamoDBTable: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "userId", AttributeType: "S" },
      ],
      BillingMode: "PAY_PER_REQUEST",
      GlobalSecondaryIndexes: [
        {
          IndexName: "${self:provider.environment.USER_INDEX}",
          KeySchema: [{ AttributeName: "userId", KeyType: "HASH" }],
          Projection: { ProjectionType: "ALL" },
        },
      ],
      TableName: "${self:provider.environment.POSTS_TABLE}",
    },
  },
};
