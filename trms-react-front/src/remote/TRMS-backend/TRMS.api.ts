import User from "../../models/user";
import TrmsClient from "./TRMS.client";
import httpCodes from 'http-status-codes';
import trmsClient from "./TRMS.client";
import user from "../../models/user";

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