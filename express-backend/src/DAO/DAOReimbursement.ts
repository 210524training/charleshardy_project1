import AWS from 'aws-sdk';
import {docClient} from './connection';
import Reimbursement from '../models/reimbursement'
import { v4 } from 'uuid';
import reimbursement from '../models/reimbursement';
import { error } from 'console';

class DAOReimbursement{
    public async add(reimbursement:Reimbursement): Promise<boolean>{
        const newID : string = v4();
        reimbursement.id = newID;
        const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
            TableName: 'reimbursement',
            Item: {
                ...reimbursement,
            },
        };

        try {
            await docClient.put(params).promise();
            return true;
        } catch(error) {
            // TODO: err
        return false;
        }
    }

    public async remove(reimbursement: Reimbursement): Promise<boolean> {
        const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
            TableName: 'reimbursement',
            Key: {
              id: reimbursement.id,
              applicant: reimbursement.applicant,
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

    public async update(reimbursement: Reimbursement): Promise<boolean> {
        const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
            TableName: 'reimbursement',
            Item: {
              ...reimbursement,
            },
            ConditionExpression: 'id = :id AND applicant = :applicant',
            ExpressionAttributeValues: {
              ':id': reimbursement.id,
              ':applicant': reimbursement.applicant,
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

    public async get(applicant: string, id: string): Promise<Reimbursement | null> {
        const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
            TableName: 'reimbursement',
            Key: {
              applicant: applicant,
              id: id,
            },
        };
    
        try {
            const result = await docClient.get(params).promise();
        
            if(!result.Item) {
                // No Restaraunt found with this id
                return null;
            }
            return result.Item as Reimbursement;
        } catch(error) {
            // TODO: log error
            return null;
        }

    }

   

    

    public async getByApplicant(applicant: string): Promise<Reimbursement[]>{
        const params: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: 'reimbursement',
        KeyConditionExpression: '#applicant = :applicant',
        ExpressionAttributeNames: {
            '#applicant': 'applicant',
        },
        ExpressionAttributeValues: { ':applicant': applicant },
        };
        try {
        const result = await docClient.query(params).promise();

        if(result.Items) {
            return result.Items as Reimbursement[];
        }
        } catch(error){
            console.log(error+"\n"+applicant);
        return [];
        }
        return [];
    }

    public async getAll(): Promise<Reimbursement[]>{
        const params: AWS.DynamoDB.DocumentClient.ScanInput = {
            TableName: 'reimbursement',
        };

        try {
            const result = await docClient.scan(params).promise();
      
            if(result.Items) {
              return result.Items as Reimbursement[];
            }
        } catch {
            return [];
        }
        return [];
    }

    public async getByCondition(condtionName: string, conditionValue: string): Promise<Reimbursement[]>{
        const params: AWS.DynamoDB.DocumentClient.ScanInput = {
        TableName: 'reimbursement',
        FilterExpression: "#condition = :condVal",
        ExpressionAttributeNames: {
            '#condition': condtionName,
        },
        ExpressionAttributeValues: { ':condVal': conditionValue },
        };
        try {
            const result = await docClient.scan(params).promise();
        
            if(result.Items) {
                return result.Items as Reimbursement[];
            }
        } catch(error) {
            console.log(error);
        }
        return [];
    }
}

const dao : DAOReimbursement = new DAOReimbursement();
export default dao;