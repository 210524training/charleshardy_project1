import { ChangeEvent, FormEvent, useState } from "react";
import { useAppSelector } from "../../../hooks";
import { selectUser, UserState } from "../../../slices/user.slice";
import FileUploader from '../../filestuff/fileuploader';
import Chat from '../../../models/chat';
import Reimbursement from '../../../models/reimbursement';
import Approval from '../../../models/approval';
import {postReimbursement} from "../../../remote/TRMS-backend/TRMS.api";
import { useHistory } from "react-router-dom";

type educationType =
    'university course'|
    'seminar'|
    'certification preparation class'|
    'certification'|
    'technical training'|
    'other';
type evaluationType= 'presentation'| 'grade';
const RequestPage: React.FC = (): JSX.Element =>{
    const user = useAppSelector<UserState>(selectUser);
    const history = useHistory();

    const [locState, setLocState] = useState<string|undefined>();
    const [locCity, setLocCity] = useState<string|undefined>();
    const [activity, setActivty] = useState<educationType|undefined>();
    const [cost, setCost] = useState<number|undefined>();
    const [eventDate, setEventDate] = useState<string|undefined>();
    const [remote, setRemote] = useState<boolean>(false);
    const [evaluation,setEvaluation] = useState<evaluationType| undefined>();
    const [reason, setReason] = useState<string|undefined>();
    const [files,setFiles]= useState<{fileName: string,fileID:string}[]>([]);

    const preVerify=()=>{
        
        if(!activity) return false;
        if(!Number(cost)) return false;
        if(!eventDate) return false;
        if(!remote){ 
            if(!locState || locState === "DEFAULT") return false;
            if(!locCity) return false;
        }
        if(!evaluation) return false;
        if(!reason) return false;
        return true;
    }

    const buildRiembursement=()=>{
        if(!preVerify()) return undefined;
        if(!user) return undefined;
        
        const members= new Set<string>();
        if(user.benCo) members.add(user.benCo);
        if(user.departmentHead) members.add(user.departmentHead);
        if(user.supervisor) members.add(user.supervisor);
        members.add(user.username);
        const membersArr:string[] = [];
        members.forEach(member=>{membersArr.push(member);});

        if(!user.supervisor || !user.departmentHead || !user.benCo) return undefined;
        const chat = new Chat(membersArr,[]);

        const approval = new Approval(0,undefined, false, undefined, {d0:'',d1:'',d2:'',d3:''}, chat);

        const subDate = new Date();
        const location=(remote ? "remote" :({state:locState as string, city:locCity as string}))

        const reimbursement = new Reimbursement(
            '',
            user.username, 
            user.supervisor,
            user.departmentHead,
            user.benCo,
            activity as educationType,
            cost as number,
            `${subDate.getMonth()+1}/${subDate.getDate()}/${subDate.getFullYear()}`,
            eventDate as string,
            location,
            evaluation as evaluationType,
            reason as string,
            files,[],
            0,
            approval,
            false
        );
        return reimbursement;
    }

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("buildRiembursement...");
        const reimbursement = buildRiembursement();
        if(reimbursement){
            console.log("send...reimbursement");
            const result = await postReimbursement(reimbursement);
            if(result && user){
                alert("request made!");
                history.push('/');
            }else{
                alert("request Failed!");
            }
            
            
        }else{
            console.log("invalid input try again");
        }
        
        
    };

    const handleActivityChange = async (e: ChangeEvent<HTMLSelectElement>)=>{
        const newActivity = e.target.value;
        const educationTypes = ['university course',
        'seminar',
        'certification preparation class',
        'certification',
        'technical training',
        'other'];

        const activityIndex = educationTypes.indexOf(newActivity);

        if(activityIndex !== -1){
            setActivty(educationTypes[activityIndex] as educationType);
        }else{
            setActivty(undefined);
        }
        
    }

    const handleEvaluationChange = async (e: ChangeEvent<HTMLSelectElement>)=>{
        const newActivity = e.target.value;
        const evaluationTypes = ['presentation','grade'];

        const evaluationIndex = evaluationTypes.indexOf(newActivity);

        if(evaluationIndex !== -1){
            setEvaluation(evaluationTypes[evaluationIndex] as evaluationType);
        }else{
            setEvaluation(undefined);
        }
        
    }

    

    const handleReasonChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setReason(e.target.value);
    };
    const handleRemoteToggle = (e: ChangeEvent<HTMLInputElement>) => {
        const remoteOn = e.target.checked;
        const display = (remoteOn)?("none"):("block");
        const locBlock = document.getElementById("loc");

        if(locBlock){
            locBlock.style.display = display;
        }
        setRemote(remoteOn);
    };
    const handleCostChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCost(Number(e.target.value));
    };

    const handleCityChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLocCity(e.target.value);
    };

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

    const handleEventDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newDate = new Date(e.target.value);
        const currDate = Date.now();
        const minDate = new Date( currDate + (6.048e+8 * 1) );

        if(minDate<=newDate){
            const date = `${newDate.getMonth()+1}/${newDate.getDate()}/${newDate.getFullYear()}`;
            setEventDate(date);
        } else{
            alert('please select a date at least 7+ days from now.');
            e.target.value ="";
            setEventDate(undefined);
        }
        
    };

    const handleLocStateChange = async (e: ChangeEvent<HTMLSelectElement>)=>{
        
        setLocState(e.target.value);
    };
    return(
    <>  
        <div className="spacer"></div>
        {(!user)?(<>you must be logged in!</>):(
            <>
                
                <div className="container secondary-color-2 border border-2 secondary-color-1-border p-3 rounded">
                <form onSubmit={handleFormSubmit}>
                        <div className="form-group">
                            
                        </div>
                        <div className="form-group">
                            
                            <label htmlFor="inputActivity">Select activity:</label>
                            <select name="inputActivity" required id="inputActivity" defaultValue="DEFAULT" className="form-select" aria-label="Default select example" onChange={handleActivityChange}>
                                <option value={undefined}>--select activity--</option>
                                <option value='university course'>university course</option>
                                <option value='seminar'>seminar</option>
                                <option value='certification preparation class'>certification preparation class</option>
                                <option value='certification'>certification</option>
                                <option value='technical training'>technical training</option>
                                <option value='other'>other</option>
                            </select>

                            <label htmlFor="inputCost">Enter cost:</label>
                            <input required className="form-control" placeholder="Enter cost of activity" type="number" id="inputCost" name="inputCost" min="0" onChange={handleCostChange} ></input>

                            <label htmlFor="inputEventDate">Enter event date:</label>
                            <input required placeholder="Enter event date" id="inputEventDate" name="inputEventDate" className="form-control" type="date" onChange={handleEventDateChange} ></input>

                            <div>
                                Location:&nbsp;
                                <label className="form-check-label" htmlFor="remoteToggle">Remote&nbsp;</label>
                                <input id='remoteToggle' name='remoteToggle' className="form-check-input" type="checkbox"  value="true" onChange={handleRemoteToggle}/>
                            </div>
                            
                            <div id="loc">
                                <label htmlFor="inputState">Enter state:</label>
                                <select  id="inputState" name="inputState" defaultValue="DEFAULT" className="form-select" aria-label="Default select example" onChange={handleLocStateChange}>
                                    <option value={undefined}>--select state--</option>
                                    <option value="AL">Alabama</option>
                                    <option value="AK">Alaska</option>
                                    <option value="AZ">Arizona</option>
                                    <option value="AR">Arkansas</option>
                                    <option value="CA">California</option>
                                    <option value="CO">Colorado</option>
                                    <option value="CT">Connecticut</option>
                                    <option value="DE">Delaware</option>
                                    <option value="DC">District Of Columbia</option>
                                    <option value="FL">Florida</option>
                                    <option value="GA">Georgia</option>
                                    <option value="HI">Hawaii</option>
                                    <option value="ID">Idaho</option>
                                    <option value="IL">Illinois</option>
                                    <option value="IN">Indiana</option>
                                    <option value="IA">Iowa</option>
                                    <option value="KS">Kansas</option>
                                    <option value="KY">Kentucky</option>
                                    <option value="LA">Louisiana</option>
                                    <option value="ME">Maine</option>
                                    <option value="MD">Maryland</option>
                                    <option value="MA">Massachusetts</option>
                                    <option value="MI">Michigan</option>
                                    <option value="MN">Minnesota</option>
                                    <option value="MS">Mississippi</option>
                                    <option value="MO">Missouri</option>
                                    <option value="MT">Montana</option>
                                    <option value="NE">Nebraska</option>
                                    <option value="NV">Nevada</option>
                                    <option value="NH">New Hampshire</option>
                                    <option value="NJ">New Jersey</option>
                                    <option value="NM">New Mexico</option>
                                    <option value="NY">New York</option>
                                    <option value="NC">North Carolina</option>
                                    <option value="ND">North Dakota</option>
                                    <option value="OH">Ohio</option>
                                    <option value="OK">Oklahoma</option>
                                    <option value="OR">Oregon</option>
                                    <option value="PA">Pennsylvania</option>
                                    <option value="RI">Rhode Island</option>
                                    <option value="SC">South Carolina</option>
                                    <option value="SD">South Dakota</option>
                                    <option value="TN">Tennessee</option>
                                    <option value="TX">Texas</option>
                                    <option value="UT">Utah</option>
                                    <option value="VT">Vermont</option>
                                    <option value="VA">Virginia</option>
                                    <option value="WA">Washington</option>
                                    <option value="WV">West Virginia</option>
                                    <option value="WI">Wisconsin</option>
                                    <option value="WY">Wyoming</option>
                                </select>
                                
                                <label htmlFor="inputCity">Enter city:</label>
                                <input type="text" className="form-control" name="inputCity" id="inputCity" placeholder="Enter city"  onChange={handleCityChange}></input>
                            </div>

                            <label htmlFor="inputEvaluation">Select Evaluation:</label>
                            <select required name="inputEvaluation" id="inputEvaluation" defaultValue="DEFAULT" className="form-select" aria-label="Default select example" onChange={handleEvaluationChange}>
                                <option value={undefined}>--select Evaluation--</option>
                                <option value='presentation'>presentation</option>
                                <option value='grade'>grade</option>
                            </select>

                            <label htmlFor="inputReason">Enter reason/description:</label>
                            <textarea required  id="inputReason" name="inputReason" className="form-control mb-3" placeholder="please give discription" onChange={handleReasonChange} ></textarea>

                            <label>Attach files:&nbsp;</label>
                            <FileUploader uploadedFiles={files} setUploadedFiles={setFiles} />
                            <br/>
                            Attached file(s) :{
                            files.map(file =>{
                                return(
                                <label className="text-light m-3 p-1 border border-2 secondary-color-1-border rounded primary-color position-relative" id={file.fileID} key={file.fileID}> 
                                    {`${file.fileName}`}&nbsp;
                                    <button key={"x"+file.fileID} onClick={(e)=>{removeFile(file.fileID)}} className="btn-sm position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-danger ">X</button>
                                </label>);
                            })
                            }
                        </div> 
                        <br/>
                    <button type="submit" name="sub" id="sub"  className="btn btn-primary text-light primary-color">Make Request</button>
                    </form>

                </div>
            </>
        )}
    </>);
}

export default RequestPage;