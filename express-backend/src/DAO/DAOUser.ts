import AWS from 'aws-sdk';
import {docClient} from './connection';
import User from '../models/user';

class DAOUser{
    public async add(user: User) {
        const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
          TableName: 'TRMS_user',
          Item: {
            ...user,
          },
        };
    
        const unameExists = await this.exists(user.username);
        if(unameExists) { return false; }
        try {
          await docClient.put(params).promise();
          return true;
        } catch(error) {
          // TODO: log error
          return false;
        }
    }
    
    public async get(username: string, password: string): Promise<User|undefined> {
        const params: AWS.DynamoDB.DocumentClient.QueryInput = {
            TableName: 'TRMS_user',
            IndexName: 'username-index',
            KeyConditionExpression: 'username = :username',
            FilterExpression: 'password = :password',
            ExpressionAttributeValues: {
            ':password': password,
            ':username': username,
            },
        };
        try {
            const result = await docClient.query(params).promise();
            if(result.Items && result.Items.length > 0) {
                return result.Items[0] as User
            }
            return undefined;
        } catch(error) {
            // TODO: log error
            return undefined;
        }
    }
    
    public async exists(username: string): Promise<boolean> {
        const params: AWS.DynamoDB.DocumentClient.QueryInput = {
            TableName: 'TRMS_user',
            IndexName: 'username-index',
            KeyConditionExpression: 'username = :username',
            ExpressionAttributeValues: { ':username': username },
        };

        try {
            const result = await docClient.query(params).promise();
            if(result.Items) {
            return result.Items.length > 0;
            }
            return true;
        } catch(error) {
            // TODO: log error
            return true;
        }
    }
}

const dao : DAOUser = new DAOUser();
export default dao;