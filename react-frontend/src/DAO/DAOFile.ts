import AWS from 'aws-sdk';
import {S3} from './connection'
AWS.config.update({ region: 'us-east-2' });

export class DAOFile{

    constructor(private BUCKET: string, private FOLDER: string){}
    
    public async uploadFile(file: File, id: string) {
        
        const params : AWS.S3.PutObjectRequest  = {
          Bucket: this.BUCKET,
          Key: this.FOLDER + id,
          Body: file,
          ACL: 'public-read'
        };
    
        await S3.upload(params, function (err, data) {
          if (err) {
            console.log('There was an error uploading your file: ', err);
            return false;
          }
          console.log('Successfully uploaded file.', data);
          return true;
        });

        
    }

    public async downloadFile(file: File, id: string): Promise<File | undefined>{
        // const outFile : File | undefined; 
        const params : AWS.S3.GetObjectRequest  = {
            Bucket: this.BUCKET,
            Key: this.FOLDER + id,
        };
      
        await S3.getObject(params, function (err, data) {
        if (err) {
            console.log('There was an error getting your file: ', err);
            return false;
        }
       

        });
        return undefined;
    }
}
