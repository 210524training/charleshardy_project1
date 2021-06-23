import { service } from 'aws-sdk/clients/health';
import DAOFile from '../DAO/DAOFile';

class fileServicer{
    public async uploadFile(file:Express.Multer.File){
        return await DAOFile.uploadFile(file);
    }

    public async downloadFile(id: string){
        return await DAOFile.downloadFile(id);
    }

    public async getSignedUrl(id: string):Promise<string|boolean>{
        return await DAOFile.getSignedUrl(id);
    }

}
const servicer = new fileServicer();
export default servicer;