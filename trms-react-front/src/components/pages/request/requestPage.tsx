import { ChangeEvent, FormEvent, useState } from "react";
import { useAppSelector } from "../../../hooks";
import { selectUser, UserState } from "../../../slices/user.slice";
import FileUploader from '../../filestuff/fileuploader';

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

    const [locState, setLocState] = useState<string|undefined>();
    const [locCity, setLocCity] = useState<string|undefined>();
    const [activity, setActivty] = useState<educationType|undefined>();
    const [cost, setCost] = useState<number|undefined>();
    const [eventDate, setEventDate] = useState<string|undefined>();
    const [remote, setRemote] = useState<boolean>(false);
    const [evaluation,setEvaluation] = useState<evaluationType| undefined>();
    const [reason, setReason] = useState<string|undefined>();
    const [files,setFiles]= useState<{fileName: string,fileID:string}[]>([]);

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        
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

    const handlefnameChange = (e: ChangeEvent<HTMLInputElement>) => {
        
    };

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
    const handleEventDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newDate = new Date(e.target.value);
        const currDate = Date.now();
        const minDate = new Date( currDate + (6.048e+8 * 1) );

        if(minDate<=newDate){
            const date = `${newDate.getDay()}/${newDate.getMonth()}/${newDate.getFullYear()}`;
            alert(date);

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
                            <label htmlFor="inputfname">First name:</label>
                            <input required type="text" id="inputfname" className="form-control" placeholder="Enter your first name" onChange={handlefnameChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputlname">Last name:</label>
                            <input required type="text" id="inputlname" className="form-control" placeholder="Enter your last name" />
                            
                            <label htmlFor="inputActivity">Select activity:</label>
                            <select required id="inputActivity" defaultValue="DEFAULT" className="form-select" aria-label="Default select example" onChange={handleActivityChange}>
                                <option value={undefined}>--select activity--</option>
                                <option value='university course'>university course</option>
                                <option value='seminar'>seminar</option>
                                <option value='certification preparation class'>certification preparation class</option>
                                <option value='certification'>certification</option>
                                <option value='technical training'>technical training</option>
                                <option value='other'>other</option>
                            </select>

                            <label htmlFor="inputCost">Enter cost:</label>
                            <input required className="form-control" placeholder="Enter cost of activity" type="number" id="inputCost" min="0" onChange={handleCostChange} ></input>

                            <label htmlFor="inputEventDate">Enter event date:</label>
                            <input required placeholder="Enter event date" id="inputEventDate"className="form-control" type="date" onChange={handleEventDateChange} ></input>

                            <div>
                                Location:&nbsp;
                                <label className="form-check-label" htmlFor="remoteToggle">Remote&nbsp;</label>
                                <input id='remoteToggle' className="form-check-input" type="checkbox"  value="true" onChange={handleRemoteToggle}/>
                            </div>
                            
                            <div id="loc">
                                <label htmlFor="inputState">Enter state:</label>
                                <select required id="inputState" defaultValue="DEFAULT" className="form-select" aria-label="Default select example" onChange={handleLocStateChange}>
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
                                <input type="text" className="form-control" id="inputCity" placeholder="Enter city" required onChange={handleCityChange}></input>
                            </div>

                            <label htmlFor="inputEvaluation">Select Evaluation:</label>
                            <select required id="inputEvaluation" defaultValue="DEFAULT" className="form-select" aria-label="Default select example" onChange={handleEvaluationChange}>
                                <option value={undefined}>--select Evaluation--</option>
                                <option value='presentation'>presentation</option>
                                <option value='grade'>grade</option>
                            </select>

                            <label htmlFor="inputReason">Enter reason/description:</label>
                            <textarea required  id="inputReason" className="form-control mb-3" placeholder="please give discription" onChange={handleReasonChange} ></textarea>

                            <label>Attach files:&nbsp;</label>
                            <FileUploader uploadedFiles={files} setUploadedFiles={setFiles} />
                            Attached file(s) :{
                            files.map(file =>{return<label key={file.fileID}> &nbsp;{`${file.fileName}`}</label>})
                            }
                        </div> 
                        <br/>
                    <button type="submit"  className="btn btn-primary text-light primary-color">Make Request</button>
                    </form>

                </div>
            </>
        )}
    </>);
}

export default RequestPage;