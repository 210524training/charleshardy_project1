import AWS from 'aws-sdk';
import dotenv from 'dotenv';
// import { env } from 'process';

AWS.config.update({ region: 'us-east-2' });
dotenv.config({});

export const dynamo = new AWS.DynamoDB({ apiVersion: 'latest',
accessKeyId: process.env.aws_access_key_id2,
secretAccessKey: process.env.aws_secret_access_key2,
});

export const docClient = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-2',
  endpoint: 'https://dynamodb.us-east-2.amazonaws.com',
  apiVersion: 'latest',
  
});

export const S3 = new AWS.S3({
  accessKeyId: process.env.aws_access_key_id2,
secretAccessKey: process.env.aws_secret_access_key2,
  
});
console.log(process.env.aws_access_key_id2+" here  "+process.env.aws_secret_access_key2); 