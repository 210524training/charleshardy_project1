import { ChangeEvent, createContext, FormEvent, useContext, useEffect, useState} from "react";
import { useHistory, useParams } from "react-router-dom";
import { useAppSelector } from "../../../hooks";
import Reimbursement from "../../../models/reimbursement";
import Approval from "../../../models/approval";
import Chat from "../../../models/chat";
import User from "../../../models/user";
import FileLink from "../../filestuff/fileLink";
import {downloadFileLink,updateUser} from "../../../remote/TRMS-backend/TRMS.api"
import { getReimbursementAPI,updateReimbursement } from "../../../remote/TRMS-backend/TRMS.api";
import { selectUser, UserState } from "../../../slices/user.slice";
import { v4 } from 'uuid';
import reply from '../../../icons/reply.svg';


const OutContext = createContext<string|undefined>(undefined);
const ReimbursementPage: React.FC = (): JSX.Element => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const params = useParams<{id:string}>();
    const [reimbursement,setReimbursement] = useState<Reimbursement|undefined>(undefined);
    const [approval,setApproval] = useState<Approval|undefined>(undefined);
    const [chat,setChat] = useState<Chat|undefined>(undefined);
    const [msgOut,setMsgOut] = useState<string|undefined>(undefined);
    const history = useHistory();
    const user = useAppSelector<UserState>(selectUser);
    const [load, setLoad] = useState<JSX.Element[]>([<>Loading Reimbursement...</>]);
    const [action, setAction] = useState<'accepted'|'rejected'|'mod-accepted'>('accepted');
    const [reason, setReason] = useState<string>();
    const [newCost,setNewCost] = useState<number>();

    const [reimResponse,setReimResponse] = useState<boolean>(false);
    const [final,setFinal] = useState<boolean>(false);
    const [showMod, setShowMod] = useState<boolean>(false);

    const [fileLinks,setFileLinks]=useState<JSX.Element[]>([]);
    const [evalLinks,setEvalLinks]=useState<JSX.Element[]>([]);
    
    if(!user){ history.push('/');}

    const handleMsgOutChange = (out: string)=>{
        setMsgOut(out);
        
    }

     const serverUpdateReimbursement = async()=>{
         if(reimbursement){
            return updateReimbursement(reimbursement);
         }
         return false;
     };

    

    const handleCostChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewCost(Number(e.target.value));
    };

    const getReimResponse= (reimbursement:Reimbursement,user: User)=>{
        const approvalLevel = reimbursement.approval.level+1;
        let approver = "";

        console.log("approval lvl "+approvalLevel+" user level "+ getRoleLevel(user.role));

        switch(approvalLevel){
            case getRoleLevel('supervisor'):
                approver = reimbursement.supervisor;
                break;
            case getRoleLevel('department head'):
                approver = reimbursement.departmentHead;
                break;
            case getRoleLevel('benefits coordinator'):
                approver = reimbursement.benCo;
                break;
            default:
                return false;
        }
        if(user.username === reimbursement.benCo) return true;
        if(user.username!==approver) return false;

        return true;
        
    }
    const handleReasonChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setReason(e.target.value);
    };

    const handleToggle = (e: ChangeEvent<HTMLInputElement>) => {
        const acceptedOn = e.target.value;
        const display = (acceptedOn !== 'accepted')?("block"):("none");
        const locBlock = document.getElementById("inputReason");
        const locBlockLabel = document.getElementById("inputReasonLabel");
        const newAction = (acceptedOn === 'accepted')?('accepted'):((acceptedOn ==='rejected')?('rejected'):('mod-accepted'));
        if(newAction === 'mod-accepted'){
            setShowMod(true);
        }else{
            setShowMod(false);
        }
        if(locBlock && locBlockLabel){
            locBlock.style.display = display;
            locBlockLabel.style.display = display;
        }
        setAction(newAction);
    };

    
    useEffect(()=>{
        
        const getReimbursement = (async():Promise<{code:number, reimbursement:Reimbursement|undefined}>=>{
            if(user){
                const fetchResult = await getReimbursementAPI(params.id,user.username);
                return fetchResult;
            }
            
            return{code:404,reimbursement:undefined};
        });

        const getLinks =async (attachments:{fileID:string,fileName:string}[]):Promise<JSX.Element[]>=>{
        
            const links:JSX.Element[] = [];
            for(let i = 0; i<attachments.length; i++){
                let attachment = attachments[i];
                const url = await downloadFileLink(attachment.fileID,attachment.fileName);
                console.log("LINK:"+url);
                if(url){
                    links.push(<FileLink key={v4().toString() + url} fileName={attachment.fileName} url={url}/>);
                }
            }
            
            console.log("NUM-LINKs "+links.length);
            return (links);

            
            
        }
        const loadReimbursement = (async()=>{
            let isMounted = true;               // note mutable flag
            if (isMounted){
                console.log("ELLO");
                const newReimbursementResult = await getReimbursement();
                if(!newReimbursementResult){
                    setLoad([<>requested reimbursment does not exist...</>]);
                } 
                if(newReimbursementResult.code === 202){
                    window.alert("return code "+newReimbursementResult.code+"!");
                    console.log("return code "+newReimbursementResult.code+"!");
                }
                setReimbursement( newReimbursementResult.reimbursement);
                if(newReimbursementResult.reimbursement){
                    
                    
                    if(newReimbursementResult.reimbursement.approval && user){
                        const newApp = new Approval(
                            newReimbursementResult.reimbursement.approval.level,
                            newReimbursementResult.reimbursement.approval.modReim,
                            newReimbursementResult.reimbursement.approval.urgent,
                            newReimbursementResult.reimbursement.approval.denyReim,
                            newReimbursementResult.reimbursement.approval.dates,
                            newReimbursementResult.reimbursement.approval.chat
                            );
                        setApproval(newApp);
                        setChat(newReimbursementResult.reimbursement.approval.chat);
                        setReimResponse(getReimResponse(newReimbursementResult.reimbursement, user));
                        if(newReimbursementResult.reimbursement.resolved)setFinal(true);
                        
                    }
                    const links  = await getLinks(newReimbursementResult.reimbursement.attachments); 
                    const evals  = await getLinks(newReimbursementResult.reimbursement.evaluations); 
                    setFileLinks(links);
                    setEvalLinks(evals);
                    console.log("MATE"+ links);
                    
                }
            }     // add conditional check
            return () => { isMounted = false }; // use cleanup to toggle value, if unmounted
        });
        
        loadReimbursement();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!approval || !user) return;
        if(!reimbursement) return;
        if(action !== 'accepted' && !reason){
            alert('Please provide a reason');
            return;
        }

        const newApproval = approval;

        
        if(action === 'mod-accepted'){
            if(newCost || newCost === 0 ){newApproval.modReim ={reason:reason as string, cost:newCost};
                const newUser = new User(reimbursement.applicant,'root','employee','c','h',0,'','','','');

                newUser.reimbursementFunds += (reimbursement.projectedReimbursement- newCost);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const x =await updateUser(newUser);
                
            }else{
                alert('Please enter new adjusted reimbursement');
                return;
            }
            
        }

        if(action === 'rejected'){
            newApproval.denyReim = {reason:reason as string, denier:user.username};
            reimbursement.resolved = true;
            newApproval.urgent = false;
            const newUser = new User(reimbursement.applicant,'root','employee','c','h',0,'','','','');

            newUser.reimbursementFunds += reimbursement.projectedReimbursement;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const x =await updateUser(newUser);

            
            setFinal(true);
            
        }else{
            newApproval.level = getRoleLevel(user.role);
        }
        

        const newReimbursement = reimbursement;
        newReimbursement.approval = newApproval;
        if(user.role ==='benefits coordinator'){
            reimbursement.resolved = true;
            newApproval.urgent = false;
            setFinal(true);
        }
        setReimbursement(newReimbursement);
        setApproval(newApproval);
        const result = await serverUpdateReimbursement();

        if(result){
            setReimResponse(false);
            alert("Request handled!");
        }else{
            alert("failed to handle request");
        }

    }
    return(
        <>
            <div className="spacer"></div>
            {(!reimbursement)?(load):(
            <>
                {
                    (final)?
                    (<div className="container secondary-color-2 border border-2 mb-3 secondary-color-1-border p-3 rounded">
                        {`Reimbursemnt request resolved with a status of ${(reimbursement.approval.denyReim)?(`'rejected',
                        deined by '${(reimbursement.approval.denyReim.denier)} because '${(reimbursement.approval.denyReim.denier)}'
                        `):(`${(reimbursement.approval.modReim)?(`'accepted' by '${reimbursement.benCo}', with a modified reimbursement (from
                        ${reimbursement.projectedReimbursement} to ${reimbursement.approval.modReim.cost}) because
                        '${reimbursement.approval.modReim.reason}'`):('accepted')}`)}`}
                    </div>):(<></>)
                }
                {
                    <div className="container secondary-color-2 border border-2 mb-3 secondary-color-1-border p-3 rounded">
                        <p><span className="fw-bold">Applicant Evalution Type: </span>{` ${reimbursement.evaluation}`}</p>
                        <p><span className="fw-bold">Applicant Evalution(s):</span> {
                            (reimbursement.evaluations.length>0)?(
                                evalLinks
                            ):('none.')
                        }</p>
                    </div>
                }
                {   
                    <>
                    <div className="container secondary-color-2 border border-2 secondary-color-1-border p-3 rounded">
                        <div className="row align-items-start">
                            <div className="col">
                                <p><span className="fw-bold">ID:</span> {`${reimbursement.id}`}</p>
                                <p><span className="fw-bold">Applicant:</span> {`${reimbursement.applicant}`}</p>
                                <p><span className="fw-bold">Supervisor:</span> {`${reimbursement.supervisor}`}</p>
                                <p><span className="fw-bold">Department Head:</span> {`${reimbursement.departmentHead}`}</p>
                                <p><span className="fw-bold">Benefits Coordinator:</span> {`${reimbursement.benCo}`}</p>
                                <p><span className="fw-bold">Submission Date:</span> {`${reimbursement.submissiondate}`}</p>
                                <p><span className="fw-bold">Event Date:</span> {`${reimbursement.eventdate}`}</p>
                                <p><span className="fw-bold">Approval Level: </span>{reimbursement.approval.level}  </p>
                                <p><span className="fw-bold">Attachment(s):</span> {
                                    (reimbursement.attachments.length>0)?(
                                        fileLinks
                                    ):('none.')
                                    }</p>
                            </div>
                            <div className="col">
                                <p><span className="fw-bold">Activity:</span> {`${reimbursement.activity}`}</p>
                                <p><span className="fw-bold">Cost:</span> {`${reimbursement.cost}`}</p>
                                <p><span className="fw-bold">Reason:</span> {`${reimbursement.reason}`}</p>
                                <p><span className="fw-bold">Evaluation:</span> {`${reimbursement.evaluation}`}</p>
                                <p><span className="fw-bold">Location:</span> {`${(reimbursement.location==="remote")?("remote"):reimbursement.location.city+", "+reimbursement.location.state}`}</p>
                                <p><span className="fw-bold">Projected Reimbursement:</span> {`${reimbursement.projectedReimbursement}`}</p>
                                <p><span className="fw-bold">Status:</span> { `${(reimbursement.resolved)?(approval?.denyReim===undefined):("Pending")}` }</p>
                                {
                                    (approval?.denyReim!==undefined)?
                                    (<>
                                        <p><span className="fw-bold">Denier:</span> { `${(approval?.denyReim.denier)}` }</p>
                                        <p><span className="fw-bold">Reason for Denial:</span> { `${(approval?.denyReim.reason)}` }</p>
                                    </>):
                                    (<></>)
                                }
                            </div>
                            
                        </div>
                    </div>
                    {!reimResponse?(<></>):(
                        <div className="container secondary-color-2 mt-3 border border-2 secondary-color-1-border p-3 rounded">
                            <fieldset>
                                <legend>Handle the Request</legend>
                                <form onSubmit={handleFormSubmit}>
                                    <div onChange={handleToggle}>
                                        <input  className="form-check-input" type="radio" id="accepted" name="response" value="accepted" defaultChecked />
                                        <label className="form-check-label me-2" htmlFor="accepted">Accept</label>
                                        <input className="form-check-input" type="radio" id="rejected" name="response"  value="rejected"/>
                                        <label className="form-check-label me-2" htmlFor="rejected">Reject</label>
                                        {(!user)?(<></>):((user.role!=='benefits coordinator')?(<></>):(
                                            <>
                                            <input className="form-check-input" type="radio" id="mod-accepted" name="response"  value="mod-accepted"/>
                                            <label className="form-check-label me-2" htmlFor="mod-accepted">Accept and Modify reimbursement</label>
                                            {!showMod?(<></>):(<><br/><label htmlFor="inputCost">Enter Adjusted Reimbursement:</label>
                                            <input className="form-control" placeholder="Enter cost of activity" type="number" id="inputCost" name="inputCost" min="0" onChange={handleCostChange} ></input></>)}
                                            </>
                                        ))}
                                    </div>
                                    
                                    <label id="inputReasonLabel" htmlFor="inputReason">Enter reason:</label>
                                    <textarea style={{display:'none'}} id="inputReason" name="inputReason" className="form-control mb-3" placeholder="please give reason" onChange={handleReasonChange} ></textarea>
                                    <button type="submit" name="sub" id="sub"  className="btn btn-primary text-light primary-color">Confirm</button>
                                </form>
                            </fieldset>
                        </div>
                    )}
                    <div className="spacer"></div>
                    {
                        (chat)?(
                            <div className="container">
                                <div className="dropdown">
                                    <button className="btn btn-secondary dropdown-toggle primary-color" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                        message aproval members
                                    </button>
                                    <ul className="dropdown-menu primary-color" aria-labelledby="dropdownMenuButton1">
                                        {chat.members.map(member =>{
                                            if(member===user?.username) return<></>;
                                            return<>{<div><button value={member} onClick={(e)=>{handleMsgOutChange(member)}} className="btn w-100 text-light primary-color" key={"MSGGER:"+member}>{member}</button></div>}</>
                                            })}
                                    </ul>
                                </div>
                                {(msgOut && user)?(<>
                                    <div className="container pb-0  secondary-color-2 border border-2 secondary-color-1-border p-3 rounded">
                                        {
                                        <OutContext.Provider value={msgOut}>
                                           <MessageBox setChat={setChat} serverUpdate={serverUpdateReimbursement } chat={chat}/>
                                        </OutContext.Provider>
                                        }
                                    </div>
                                </>):(<></>)}
                                
                            </div>
                        ):(<></>)}
                    
                    </>
                }
            </>
            )}
        </>
    );
}
type props={
    chat:Chat
    setChat: React.Dispatch<React.SetStateAction<Chat | undefined>>
    serverUpdate:  () => Promise<boolean>
}
const MessageBox: React.FC<props> = ({serverUpdate, chat, setChat}:props)=>{
    const user = useAppSelector<UserState>(selectUser);
    const out = useContext(OutContext);
    const [newMessage, setNewMessage] = useState<string|undefined>();
    const [messageBox, setMessageBox] = useState<JSX.Element[]>([]);

    const getMessageBoxes = (pageGuy: string, RemoteGuy: string, chatLog: Chat): JSX.Element[] => {
        console.log("pageguy:"+pageGuy+" remoteGuy:"+RemoteGuy);
        if(!chatLog) return[];
        const messageBoxes: JSX.Element[] = [];
        const currentMembers = [RemoteGuy,pageGuy]
        let msgkey = 0;
        chatLog.messages.forEach(message=>{
            if(currentMembers.includes(message.from) && currentMembers.includes(message.to)){
                if(message.from === pageGuy){
                    messageBoxes.push(<div key={"mess"+msgkey} className="container w-75 mb-3 me-0 rounded-pill secondary-color-1" >{"you: "+message.message}</div>);
                }else{
                    messageBoxes.push(<div key={"mess"+msgkey} className="container w-75 mb-3 ms-0 rounded-pill text-light primary-color" >{message.from+": "+message.message}</div>);
                }
                
                msgkey++;
            }
        });
        console.log("numMess:"+messageBoxes.length)
        return messageBoxes;
    }

    const handleMsgSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("message sent");
        if(user && out && newMessage){
            const msg ={to:out,from:user.username,message:newMessage};
            const newChat = chat;
            newChat.messages.push(msg);
            setChat(newChat);
            setMessageBox(getMessageBoxes( user.username,out, newChat));
            window.scrollTo(0,document.body.scrollHeight);
            await serverUpdate();
            const input:HTMLInputElement|null = document.getElementById("messageInput") as HTMLInputElement;
            if(input){
                if(input.value) input.value="";
            }
        }
        
    }

    

    const handleMsgChange = (e: ChangeEvent<HTMLInputElement>)=>{
        setNewMessage(e.target.value);
    };
    useEffect(()=>{
        if(user && out){
            setMessageBox( getMessageBoxes(user.username, out, chat));
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[chat,out]);

    if(user && out){
        return(
        <>
            {messageBox}
            <form onSubmit={handleMsgSubmit}>
            <hr className="my"/>
            <div className="input-group input-group-end d-flex flex-row-reverse">
                <div className="d-flex p-1 w-75 bg-light flex-row-reverse rounded-pill">
                    <button type="submit" className="btn p-1 btn-sm btn-primary rounded-pill">
                        <img alt="reply" className="m-auto" src={reply}/>
                    </button>
                    <input  type="text" id="messageInput" onChange={handleMsgChange} className="w-100 border-0 no-focus rounded-pill" placeholder="   Enter message . . ."/>
                </div>
                
            </div>
            </form>
        </>);
    }
    return (<></>);
}



function getRoleLevel(role: string): number{
    const elevatedRoles=['supervisor', 'department head','benefits coordinator'];
    const index =  elevatedRoles.indexOf(role);
    return index+1;
}


export default ReimbursementPage;