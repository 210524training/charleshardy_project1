/* eslint-disable react-hooks/rules-of-hooks */
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {getBenCos,getDhs,getsupervisors, registerUser} from "../../../remote/TRMS-backend/TRMS.api"
import DeparmentSelect from "./depReg";
import User from "../../../models/user";
import { useAppDispatch } from '../../../hooks';
import { loginAsync } from '../../../slices/user.slice';

const register: React.FC = (): JSX.Element => {
  
  const dispatch = useAppDispatch();
  const history = useHistory();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role=undefined, setRole] = useState<undefined|'benefits coordinator'|'supervisor'| 'department head'| 'employee'>();
  const [department, setDepartment] = useState<string|undefined>(undefined);
  const [departmentHead, setDepartmentHead] = useState<string|undefined>(undefined);
  const [supervisor, setSupervisor] = useState<string|undefined>(undefined);
  const [benco, setBenCo] = useState<string|undefined>(undefined);

  const [benCos, setBenCos] = useState<JSX.Element[]>([]);
  const [departmentHeads, setDepartmentHeads] = useState<JSX.Element[]>([]);
  const [supervisors, setSupervisors] = useState<JSX.Element[]>([]);
  const [displayDH, setDisplayDH] = useState<React.CSSProperties>({display: 'none' });
  const [displaySUP, setDisplaySUP] = useState<React.CSSProperties>({display: 'none' });

  
  const roles = [
    <option key="emp" value="employee">employee</option>,
    <option key="sup" value="supervisor">supervisor</option>,
    <option key="dh" value="department head">department head</option>
  ];

  const preVerify=():boolean => {
    if(firstName.length===0) return false;
    if(lastName.length===0) return false;
    if(username.length===0) return false;
    if(password.length===0) return false;
    if(!role) return false;
    if(!department) return false;

    if(role==="employee"){
      if(!departmentHead) return false;
      if(!supervisor) return false;
      if(!benco) return false;
    }

    if(role==="supervisor"){
      if(!departmentHead) return false;
      if(!benco) return false;
    }

    if(role==="department head"){
      if(!benco) return false;
    }

    return true;
  };

  const getDHs = async (department: string)=>{
    const bencos = await getDhs(department);
      const newDHs:JSX.Element[] = [];
      bencos.forEach(user => {
        newDHs.push(<option key={`DH:${user.username}`} value={user.username}>{`${user.firstName} ${user.lastName} (${user.username})`}</option>)
      });
    return newDHs;
  };

  const getSupervisors = async (department: string)=>{
    const supervisors = await getsupervisors(department);
      const newSupervisors:JSX.Element[] = [];
      supervisors.forEach(user => {
        newSupervisors.push(<option key={`sup:${user.username}`} value={user.username}>{`${user.firstName} ${user.lastName} (${user.username})`}</option>)
      });
    return newSupervisors;
  };

  const handleDepHeadChange = async (e: ChangeEvent<HTMLSelectElement>)=>{
    setDepartmentHead(e.target.value);
}

  const getBencos = async ()=>{
    const bencos = await getBenCos();
      const newBencos:JSX.Element[] = [];
      bencos.forEach(user => {
        newBencos.push(<option key={`benco:${user.username}`} value={user.username}>{`${user.firstName} ${user.lastName} (${user.username})`}</option>)
      });
    setBenCos(newBencos);
  };

  const handleBencoChange = (e: ChangeEvent<HTMLSelectElement>)=>{
    setBenCo(e.target.value);
  };
  const handleDepChange = async (e: ChangeEvent<HTMLSelectElement>)=>{
    setDepartment(e.target.value);
    const DHs= await getDHs(e.target.value);
    const sups = await getSupervisors(e.target.value);
    setDepartmentHeads(DHs);
    setSupervisors(sups);
    
  };

  const handleSupervisorChange = async (e: ChangeEvent<HTMLSelectElement>)=>{
    setSupervisor(e.target.value);
}

  const handleRoleChange = async (e: ChangeEvent<HTMLSelectElement>)=>{
    const newRole: 'benefits coordinator'|'supervisor'| 'department head'| 'employee' = e.target.value as 'benefits coordinator'|'supervisor'| 'department head'| 'employee';
    setRole(newRole);

    if(newRole === 'employee'){
      setDisplayDH({});
      setDisplaySUP({});
    }else if(newRole === 'supervisor'){
      setDisplayDH({});
      setDisplaySUP({display: 'none' });
    }else if(newRole === 'department head'){
      setDisplayDH({display: 'none' });
      setDisplaySUP({display: 'none' });
    }else{
      setDisplayDH({});
      setDisplaySUP({});
    }
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlefnameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handlelnameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(role && preVerify()){
      const newUser = new User(username, password,role,firstName,lastName,1000,department,supervisor, departmentHead,benco);
      const result = await registerUser(newUser);
      if(!result){
        window.alert("username taken.");
      }else{
        window.alert("account created!");
        const result = await dispatch(loginAsync({username, password}));
        if(result.meta.requestStatus === 'fulfilled'){
          history.push('/');
        }else{
          window.alert("login failed!");
        }

      }
    }else{
      window.alert("invalid input! try again.");
    }
    
  };

  return(
    <>
    <div className="spacer"/>
        <div className="container w-75 secondary-color-2 p-3 rounded">
            <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                    <label htmlFor="inputfname">First name:</label>
                    <input required type="text" id="inputfname" className="form-control" placeholder="Enter your first name" onChange={handlefnameChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="inputlname">Last name:</label>
                    <input required type="text" id="inputlname" className="form-control" placeholder="Enter your last name" onChange={handlelnameChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="inputUsername">User name:</label>
                    <input required type="text" id="inputUsername" className="form-control" placeholder="Enter username" onChange={handleUsernameChange}/>
                </div>

                <div className="form-group">
                    <label htmlFor="InputPassword">Password:</label>
                    <input required type="password" className="form-control" id="InputPassword" placeholder="Password" onChange={handlePasswordChange}/>
                </div>
                <div className="form-group">
                    <label htmlFor="inputRole">Select role:</label>
                    <select id="inputRole" defaultValue="DEFAULT" className="form-select" aria-label="Default select example" onChange={handleRoleChange}>
                    <option value={undefined}>--select role--</option>
                        {roles}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="inputBenCo">Benefits cordinator:</label>
                    <select id="inputBenCo" defaultValue="DEFAULT" onChange={handleBencoChange} onClick={getBencos} className="form-select" aria-label="Default select example" >
                      <option value="DEFAULT" >--select benefits cordinator--</option>
                        {benCos}
                    </select>
                </div>
                {/******************************************************/}
                <DeparmentSelect handleDepChange={handleDepChange}/>
                <div  id="DHinput" className="form-group" style={displayDH}>
                  <label htmlFor="inputDepHead">Select Deparment Head:</label>
                  <select id="inputDepHead" defaultValue="DEFAULT" className="form-select" aria-label="Default select example" onChange={handleDepHeadChange}>
                  <option value={undefined}>--select department head--</option>
                      {departmentHeads}
                  </select>
                </div>
                <div id="SUPinput" className="form-group" style={displaySUP}>
                  <label htmlFor="inputSupervisor">Select Supervisor:</label>
                  <select id="inputsupervisor" defaultValue="DEFAULT" className="form-select" aria-label="Default select example" onChange={handleSupervisorChange}>
                  <option value={undefined}>--select supervisor--</option>
                      {supervisors}
                  </select>
              </div>
                {/******************************************************/}
                <br/>
            <button type="submit" className="btn btn-primary text-light primary-color">Register</button>
            </form>
        </div>
    </>
  );
}

export default register;