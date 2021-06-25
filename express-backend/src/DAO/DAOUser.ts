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
    
    public async get(username: string, password?: string): Promise<User|undefined> {
        let params: AWS.DynamoDB.DocumentClient.QueryInput

        if(password){ 
            params = {
                TableName: 'TRMS_user',
                IndexName: 'username-index',
                KeyConditionExpression: 'username = :username',
                FilterExpression: 'password = :password',
                ExpressionAttributeValues: {
                ':password': password,
                ':username': username,
                },
            };
        } else {
            params = {
                TableName: 'TRMS_user',
                IndexName: 'username-index',
                KeyConditionExpression: 'username = :username',
                ExpressionAttributeValues: { ':username': username },
            };
        }

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
    
    public async getUsersbyRole(role: string): Promise<User[]>{
       const params: AWS.DynamoDB.DocumentClient.QueryInput={
            TableName: 'TRMS_user',
            KeyConditionExpression: '#r = :role',
            ExpressionAttributeNames: {
                '#r': 'role',
            },
            ExpressionAttributeValues: {
            ':role': role,
            },
        };

        try {
            const result = await docClient.query(params).promise();
            if(result.Items && result.Items.length > 0) {
                return result.Items as User[];
            }
            return [];
        } catch(error) {
            // TODO: log error
            return [];
        }

    }

    public async exists(username: string): Promise<User|null> {
        const params: AWS.DynamoDB.DocumentClient.QueryInput = {
            TableName: 'TRMS_user',
            IndexName: 'username-index',
            KeyConditionExpression: 'username = :username',
            ExpressionAttributeValues: { ':username': username },
        };

        try {
            const result = await docClient.query(params).promise();
            if(result.Items) {
                return result.Items[0] as User;
            }
            return null;
        } catch(error) {
            // TODO: log error
            return null;
        }
    }
    
    public async getAll(): Promise<User[]>{
        const params: AWS.DynamoDB.DocumentClient.ScanInput = {
            TableName: 'TRMS_user',
        };

        try {
            const result = await docClient.scan(params).promise();
      
            if(result.Items) {
              return result.Items as User[];
            }
        } catch {
            return [];
        }
        return [];
    }

    public async remove(user: User): Promise<boolean> {
        const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
            TableName: 'TRMS_user',
            Key: {
              user: user.username,
              role: user.role,
            },
            ReturnValues: 'ALL_OLD',
            };
      
        try {
            const result = await docClient.delete(params).promise();
            if(result) {
            if(result.Attributes) return true;
            }
            return false;
        } catch(err) {
            // TODO: log error
            return false;
        }
    }

    public async update(user: User): Promise<boolean> {
        console.log('lllllllllllll '+user.username+" "+ user.role +" "+ user.reimbursementFunds);
        const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
            TableName: 'TRMS_user',
            Item: {
              ...user,
            },
            ConditionExpression: '#r = :role and username = :username',
            ExpressionAttributeNames: {
                '#r': 'role',
            },
            ExpressionAttributeValues: {
              ':role': user.role,
              ':username': user.username,
            },
        };
      
        try {
            await docClient.put(params).promise();
    
        return true;
        } catch(error) {
            // TODO: log error
            console.log(error);
        return false;
        }
    }
}

const dao : DAOUser = new DAOUser();
export default dao;