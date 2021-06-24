import { ChangeEvent, createContext, FormEvent, useContext, useEffect,  useState} from "react";
import { useHistory, useParams } from "react-router-dom";
import { useAppSelector } from "../../../hooks";
import Reimbursement from "../../../models/reimbursement";
import Approval from "../../../models/approval";
import Chat from "../../../models/chat";
import FileLink from "../../filestuff/fileLink";
import {downloadFileLink} from "../../../remote/TRMS-backend/TRMS.api"
import { getReimbursementAPI,updateReimbursement } from "../../../remote/TRMS-backend/TRMS.api";
import { selectUser, UserState } from "../../../slices/user.slice";
import { v4 } from 'uuid';
import reply from '../../../icons/reply.svg';
// import reimbursement from "../../../models/reimbursement";


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
    const [load, setLoad] = useState<JSX.Element[]>([<>Loading Reimbursement...</>])

    const [fileLinks,setFileLinks]=useState<JSX.Element[]>([]);
    
    if(!user){ history.push('/');}

    const handleMsgOutChange = (out: string)=>{
        setMsgOut(out);
        
    }

     const serverUpdateReimbursement = async()=>{
         if(reimbursement){
            updateReimbursement(reimbursement);
         }
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
                    
                    setApproval(newReimbursementResult.reimbursement.approval);
                    if(newReimbursementResult.reimbursement.approval){
                        setChat(newReimbursementResult.reimbursement.approval.chat);
                    }
                    const links  = await getLinks(newReimbursementResult.reimbursement.attachments); 
                    setFileLinks(links);
                    console.log("MATE"+ links);
                    
                }
            }     // add conditional check
            return () => { isMounted = false }; // use cleanup to toggle value, if unmounted
        });
        
        loadReimbursement();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    return(
        <>
            <div className="spacer"></div>
            {(!reimbursement)?(load):(
            <>
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
    serverUpdate:  () => Promise<void>
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



/*function getRoleLevel(role: string): number{
    const elevatedRoles=['supervisor', 'department head','benefits coordinator'];
    const index =  elevatedRoles.indexOf(role);
    return index+1;
}*/


export default ReimbursementPage;