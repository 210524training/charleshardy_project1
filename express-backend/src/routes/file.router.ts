import { Router } from 'express';
import httpCodes from 'http-status-codes';
import { Blob } from 'node:buffer';
import fileServicer from '../servicers/file.servicer';
import FileServicer from '../servicers/file.servicer';
import multer from 'multer';
var AWS = require("aws-sdk");

// Multer ships with storage engines DiskStorage and MemoryStorage
// And Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form, the file or files object contains the files uploaded via the form.
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
const fileRouter = Router();


fileRouter.post('/',upload.single("file"),async (req,res)=>{
    const file= req.file;
    if(file){
        const result = await fileServicer.uploadFile(file);
        if(result){
            res.status(httpCodes.OK).json({id:result});
        } 
        
    }
    res.status(httpCodes.BAD_REQUEST).send();
})
fileRouter.get('/:id',async (req,res)=>{
    const {id} = req.params;

    const result = await FileServicer.getSignedUrl(id);
    console.log(result);
    if(result){
        res.status(httpCodes.OK).json({url:result});
    }else{
        res.status(httpCodes.NOT_FOUND).send("srry");
    }

})
export default fileRouter;