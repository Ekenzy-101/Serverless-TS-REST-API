import type { AWS } from "@serverless/typescript";

import register from "@functions/register";

import dynamodbTables from "./src/config/dynamodb";

const serverlessConfiguration: AWS = {
  service: "serverless-blog",
  frameworkVersion: "2",
  custom: {
    documentation: {
      api: {
        info: {
          version: "1.0.0",
          title: "Serverless Blog API",
          description: "Serverless application for creating posts",
        },
      },
    },
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  package: {
    individually: true,
  },
  plugins: [
    "serverless-webpack",
    "serverless-iam-roles-per-function",
    "serverless-v2-aws-documentation",
  ],
  provider: {
    name: "aws",
    profile: "serverless",
    region: "us-east-1",
    runtime: "nodejs14.x",
    stage: "${opt:stage, 'dev'}",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      APP_ACCESS_SECRET: "kfgreiufg3u1y332",
      ACCESS_TOKEN_COOKIE_NAME: "access_token",
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      USERS_TABLE: "${self:service}-Users-${self:provider.stage}",
      EMAIL_INDEX: "EmailIndex",
      CLIENT_ORIGIN: "http://localhost:3000",
    },
    lambdaHashingVersion: "20201221",
  },
  resources: {
    Resources: {
      ...dynamodbTables,
    },
  },
  functions: {
    register,
  },
};

module.exports = serverlessConfiguration;
