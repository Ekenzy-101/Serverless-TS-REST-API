export default {
  PostImagesBucket: {
    Type: "AWS::S3::Bucket",
    Properties: {
      BucketName: "${self:provider.environment.POST_IMAGES_BUCKET}",
      CorsConfiguration: {
        CorsRules: [
          {
            AllowedOrigins: ["${self:provider.environment.CLIENT_ORIGIN}"],
            AllowedHeaders: ["*"],
            AllowedMethods: ["GET", "POST", "PUT", "DELETE", "HEAD"],
            MaxAge: 3000,
          },
        ],
      },
    },
  },
  PostImagesBucketPolicy: {
    Type: "AWS::S3::BucketPolicy",
    Properties: {
      PolicyDocument: {
        Id: "PostImagesBucketPolicy",
        Version: "2012-10-17",
        Statement: {
          Sid: "PublicRead",
          Effect: "Allow",
          Principal: "*",
          Action: ["s3:GetObject"],
          Resource:
            "arn:aws:s3:::${self:provider.environment.POST_IMAGES_BUCKET}/*",
        },
      },
      Bucket: { Ref: "PostImagesBucket" },
    },
  },
};
