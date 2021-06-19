import User from "../../models/user";
import TrmsClient from "./TRMS.client";
import httpCodes from 'http-status-codes';

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