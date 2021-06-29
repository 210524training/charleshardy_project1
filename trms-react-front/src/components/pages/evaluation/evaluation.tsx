import React, { useEffect, useState} from "react";
import { useHistory, useParams } from "react-router-dom";
import { useAppSelector } from "../../../hooks";
import Reimbursement from "../../../models/reimbursement";
import { getReimbursementAPI,updateReimbursement } from "../../../remote/TRMS-backend/TRMS.api";
import { selectUser, UserState } from "../../../slices/user.slice";
import FileUploader from "../../filestuff/fileuploader";


const EvaluationPage: React.FC = (): JSX.Element => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const params = useParams<{id:string}>();
    const history = useHistory();
    const [reimbursement,setReimbursement] = useState<Reimbursement|undefined>(undefined);
    const user = useAppSelector<UserState>(selectUser);
    const [files,setFiles]= useState<{fileName: string,fileID:string}[]>([]);

    
    if(!user){ history.push('/');}

    const serverUpdateReimbursement = async(reim: Reimbursement)=>{
        if(reim){
           return updateReimbursement(reim);
        }
        return false;
    };

    const handleEvaluationAttach = async ()=>{
        if(!reimbursement) return;
        const newReimbursement = reimbursement;
        files.forEach((file)=>{newReimbursement.evaluations.push(file)});
        setReimbursement(newReimbursement);

        const result = await serverUpdateReimbursement(newReimbursement);
        if(result){
            alert('Evaluations added to the request');
            history.push('/');
        }else{
            alert('Evaluations could not be added to the request');
        }
    }

    useEffect(()=>{
        
        const getReimbursement = (async():Promise<{code:number, reimbursement:Reimbursement|undefined}>=>{
            if(user){
                const fetchResult = await getReimbursementAPI(params.id,user.username);
                return fetchResult;
            }
            
            return{code:404,reimbursement:undefined};
        });

        
        const loadReimbursement = (async()=>{
            let isMounted = true;               // note mutable flag
            if (isMounted){
                console.log("ELLO");
                const newReimbursementResult = await getReimbursement();
                
                if(newReimbursementResult.code === 202){
                    window.alert("return code "+newReimbursementResult.code+"!");
                    console.log("return code "+newReimbursementResult.code+"!");
                }
                setReimbursement( newReimbursementResult.reimbursement);
                if(newReimbursementResult.reimbursement)setFiles([]);
                
            }     
            return () => { isMounted = false }; // use cleanup to toggle value, if unmounted
        });
        
        loadReimbursement();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const removeFile = (id: string)=>{
        const newfileList: {
            fileName: string;
            fileID: string;
        }[] = []
        files.forEach(file=>{
            if(file.fileID !== id){
                newfileList.push(file);
            }
        });

        setFiles(newfileList);
    }
    return (
    <>
    <div className="spacer"></div>
    <div className="container">
    Upload Evaluation Files for reimbursement request: {` {${params.id}}`}
    <FileUploader uploadedFiles={files} setUploadedFiles={setFiles} />
    Attached file(s) :{
        files.map(file =>{
            return(
            <label className="text-light m-3 p-1 border border-2 secondary-color-1-border rounded primary-color position-relative" id={file.fileID} key={file.fileID}> 
                {`${file.fileName}`}&nbsp;
                <button key={"x"+file.fileID} onClick={(e)=>{removeFile(file.fileID)}} className="btn-sm position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-danger ">X</button>
            </label>);
        })
    }
    <div className="spacer"></div>
    <button  name="sub" id="sub" onClick={handleEvaluationAttach} className="btn btn-primary text-light primary-color">Add Evaluations</button>
    </div>
    </>

    );

}



export default EvaluationPage;