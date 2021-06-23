import React,{ useState} from 'react';
import {uploadFile} from '../../remote/TRMS-backend/TRMS.api';
type props={
    uploadedFiles:{fileName: string,fileID:string}[];
    setUploadedFiles: React.Dispatch<React.SetStateAction<{fileName: string,fileID:string}[]>>;
};
const FileUploader = ({uploadedFiles,setUploadedFiles}:props) => {
    const [files,setFiles]=useState<FileList>();
    const [load, setLoad]=useState<JSX.Element>(<></>)
    const onChangeHandler=(event: { target: { files: FileList|null } })=>{

        if(event.target.files){
            //console.log(event.target.files[0]);
            setFiles(event.target.files)
        }
        
    }

    const onClickHandler = async () => {
        
        let failedOut:string="failed uploads:{";
        let successOut:string="successful uploads:{";
        let uploadedFilesList: {fileName:string,fileID:string}[]= []
        if(files){
            setLoad(
                <div>
                    Uploading files...
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    
                </div>);
            for(let i = 0; i < files.length; i++){
                let data = new FormData();
                data.append("file", files[i],files[i].name);
                const result = await uploadFile(data);
                //console.log(files[0])
                if(result){
                    successOut+=files[i].name+" ";
                    uploadedFilesList.push({fileName: files[i].name, fileID: result});
                }else{
                    failedOut+=files[i].name+" ";
                }
            }
            failedOut+="} ";
            successOut+="}";
            window.alert(failedOut+" "+successOut);
            setUploadedFiles(uploadedFilesList);
            setLoad(<div>Upload Complete</div>);
        }
        
        
    }
    return (
    <div className="container secondary-color-2 border border-2 secondary-color-1-border p-3 rounded">
        <input type="file" name="file" multiple onChange={onChangeHandler}/>
        <button type="button" className="btn btn-success btn-block" onClick={onClickHandler}>Upload</button>
        {load}
    </div>
    );
    
}

export default FileUploader;