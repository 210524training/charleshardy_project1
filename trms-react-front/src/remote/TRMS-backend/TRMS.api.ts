import User from "../../models/user";
import TrmsClient from "./TRMS.client";
import httpCodes from 'http-status-codes';
import Reimbursement from "../../models/reimbursement";



export const uploadFile= async(formData:FormData):Promise<string|undefined>=>{
  try{
    console.log("HERE "+formData.entries);
    const result = await TrmsClient.post<{id:string}>('api/v1/files/',  formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if(result){
      return result.data.id;
    }
    return undefined
    
  } catch (err) {
    console.error(err);
    return undefined;
  }
}
export const downloadFileLink = async (id: string, filename: string)=>{
  try{
    const result = await TrmsClient.get<{url:string}>('api/v1/files/'+id, {
    
    //params: {id: id}
    });
    console.log(result.data);
    console.log(result.data);
    return result.data.url;
  } catch (err) {
    console.log(err);
    return false;
  }
}
export const getReimbursementAPI:((id:string, username: string) =>Promise<{code:number, reimbursement:Reimbursement|undefined}>)= 
  async(id:string, username: string)=>{
    try{
      const response = await TrmsClient.post<Reimbursement|undefined>('api/v1/reimbursements/username',{
        id: id,
        username: username
      });
      const status = response.status
      return {code:status, reimbursement:response.data}
    } catch (err) {
      return {code:404, reimbursement:undefined}
    }
}

export const getRelevantRembursements=  async(user:User)=>{
  try{
    const response = await TrmsClient.post<Reimbursement[]>('api/v1/reimbursements/username',{
      role: user.role,
      username: user.username
    });
    return response.data as Reimbursement[];
  } catch (err) {
    return[];
  }
}

export const registerUser = async(user:User)=>{
  const response = await TrmsClient.post<boolean>('api/v1/users',{
    ...user,
  });

  return response.data as boolean;
}
export const getBenCos = async (): Promise<User[]>=>{
  const response = await TrmsClient.post<User[]>('api/v1/users/role',{
    value:"benefits coordinator"
  });

  return response.data as User[];
}
export const getsupervisors = async (department: string): Promise<User[]>=>{
  const response = await TrmsClient.post<User[]>('api/v1/users/role',{
    value:"supervisor"
  });

  const response2 = await TrmsClient.post<User[]>('api/v1/users/role',{
    value:"department head"
  });

  const newSupervisors: User[]=[];

  response.data.forEach((user:User)=>{
    if(user.department === department) newSupervisors.push(user);
  });

  response2.data.forEach((user:User)=>{
    if(user.department === department) newSupervisors.push(user);
  });
  return newSupervisors;
}
export const getDhs = async (department: string): Promise<User[]>=>{
  const response = await TrmsClient.post<User[]>('api/v1/users/role',{
    value:"department head"
  });

  const newDHS: User[]=[];

  response.data.forEach((user:User)=>{
    if(user.department === department) newDHS.push(user);
  });
  return newDHS;
}
export const sendLogin = async (username: string, password: string): Promise<User> => {
  const response = await TrmsClient.post<User>('/login', {
    username,
    password,
  });

  if(response.status !== httpCodes.OK) {
    throw new Error("invalid login!");
  }
  return response.data;
}

export const sendLogout = async(): Promise<boolean> => {
  const response = await TrmsClient.post<any>('/logout');
  if(response.status !== httpCodes.OK) {
    throw new Error("logout failed");
  }
  return true;
}