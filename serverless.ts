import type { AWS } from "@serverless/typescript";

import auth from "@functions/auth";
import createPost from "@functions/createPost";
import deletePost from "@functions/deletePost";
import getPost from "@functions/getPost";
import getPosts from "@functions/getPosts";
import login from "@functions/login";
import register from "@functions/register";
import updatePost from "@functions/updatePost";

import dynamodbTables from "./src/config/dynamodb";
import s3Buckets from "./src/config/s3";

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
    dynamodb: {
      stages: ["dev"],
      start: {
        port: 8000,
        inMemory: true,
        heapInitial: "200m",
        heapMax: "1g",
        migrate: true,
        seed: true,
        convertEmptyValues: true,
      },
    },
    "serverless-offline": {
      httpPort: 3000,
      babelOptions: {
        presets: ["env"],
      },
    },
  },
  package: {
    individually: true,
  },
  plugins: [
    "serverless-webpack",
    "serverless-iam-roles-per-function",
    "serverless-v2-aws-documentation",
    "serverless-dynamodb-local",
    "serverless-offline",
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
      SIGNED_URL_EXPIRATION: "300",
      CLIENT_ORIGIN: "http://localhost:3000",
      EMAIL_INDEX: "EmailIndex",
      USER_INDEX: "UserTitleIndex",
      POST_IMAGES_BUCKET: "${self:service}-post-images-${self:provider.stage}",
      POSTS_TABLE: "${self:service}-Posts-${self:provider.stage}",
      USERS_TABLE: "${self:service}-Users-${self:provider.stage}",
    },
    lambdaHashingVersion: "20201221",
  },
  resources: {
    Resources: {
      ...dynamodbTables,
      ...s3Buckets,
    },
  },
  functions: {
    auth,
    createPost,
    deletePost,
    getPost,
    getPosts,
    login,
    register,
    updatePost,
  },
  useDotenv: true,
};

module.exports = serverlessConfiguration;
