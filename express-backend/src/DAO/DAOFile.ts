import AWS from 'aws-sdk';
import {S3} from './connection';
import { v4 } from 'uuid';
AWS.config.update({ region: 'us-east-2' });
class DAOFile{

    constructor(private BUCKET: string, private FOLDER: string){}
    
    public async uploadFile(file:Express.Multer.File):Promise<string|undefined> {
        const newID : string = v4()+file.originalname; 
        const params : AWS.S3.PutObjectRequest  = {
          
          Key: newID,
          Body: file.buffer,
          ContentType: file.mimetype,
          Bucket: this.BUCKET,
          ACL: 'authenticated-read'
        };

        const result = await S3.upload(params, function(err, data) {
          console.log(err, data);
          if (err){
            return undefined;
          }
          return newID;
          }).promise();
        return newID;
    }

    public async getSignedUrl(id: string):Promise<string|boolean> {
      const params = {Bucket: this.BUCKET, Key: id};
      try{
        const result = await S3.getSignedUrl('getObject', params);
        return result;
      }catch(err){
        console.log(err);
        return false;
      }
      
    }
    public async downloadFile(id: string): Promise<AWS.S3.Body | undefined>{
        // const outFile : File | undefined; 
        const params : AWS.S3.GetObjectRequest  = {
            Bucket: this.BUCKET,
            Key: this.FOLDER + id,
        };

        try {
        const fileOut = await S3.getObject(params).promise();
          return (fileOut.Body);

        } catch (err) {
          console.log(err);
          return undefined;
        }
        //return undefined;
    }
}
const dao = new DAOFile("trms-bucket-charles-hardy","")
export default dao;