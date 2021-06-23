import React,{ useState} from 'react';
import {uploadFile} from '../../remote/TRMS-backend/TRMS.api';

const FileUploader = () => {
    const [files,setFiles]=useState<FileList>();
    const onChangeHandler=(event: { target: { files: FileList|null } })=>{

        if(event.target.files){
            //console.log(event.target.files[0]);
            setFiles(event.target.files)
        }
        
    }

    const onClickHandler = async () => {
        const data = new FormData()
        if(files){
           data.append("file", files[0],files[0].name);
           const result = await uploadFile(data);
           //console.log(files[0])
           if(result){
            window.alert("uploaded!");
           }else{
            window.alert("upload failed");
           }
           
        }
        
    }
    return (
    <>
        <input type="file" name="file" onChange={onChangeHandler}/>
        <button type="button" className="btn btn-success btn-block" onClick={onClickHandler}>Upload</button>
    </>
    );
    
}

export default FileUploader;