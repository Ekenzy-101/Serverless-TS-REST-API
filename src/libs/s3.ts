import AWS from "./aws-sdk";

const s3 = new AWS.S3({
  signatureVersion: "v4",
});

export const getUploadUrl = (params: {
  Key: string;
  Bucket: string;
  Expires: number;
}) => {
  return s3.getSignedUrl("putObject", {
    ...params,
  });
};
