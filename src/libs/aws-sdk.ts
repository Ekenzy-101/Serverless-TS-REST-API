import * as aws from "aws-sdk";
import * as xray from "aws-xray-sdk";

const AWS = process.env.IS_OFFLINE ? aws : xray.captureAWS(aws);

export default AWS;
