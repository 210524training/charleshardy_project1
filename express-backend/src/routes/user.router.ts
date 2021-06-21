import { Router } from 'express';
import User from '../models/user';
import userService from '../servicers/user.servicer';
import httpCodes from 'http-status-codes';

const userRouter = Router();

userRouter.get('/', async (req, res) => {
  if(!req.session.isLoggedIn || !req.session.user) {
    throw new Error('You must be logged in to access this functionality');
  }
  const users = await userService.getAll();
  res.status(httpCodes.OK).json(users);
});

userRouter.post('/:selector', async (req, res) => {

  const {selector} = req.params;
  const value = req.body.value;
  if(selector === 'username'){
    const user: User|undefined = await userService.getByUsername(value);
    if(user){
      res.status(httpCodes.OK).json(user);
    }else{
      res.status(httpCodes.NOT_FOUND).send();
    }
  } else if(selector === 'role'){
    const users = await userService.getUsersbyRole(value);
    if(users.length>0){
      res.status(httpCodes.OK).json(users);
    }else{
      res.status(httpCodes.NOT_FOUND).send();
    }
  }else{
    res.status(httpCodes.BAD_REQUEST).send();
  }
  
});

userRouter.put('/', async (req, res) => {
  if(!req.session.isLoggedIn || !req.session.user) {
    throw new Error('You must be logged in to access this functionality');
  }
  const result = await userService.update(req.body);
  if(result){
    res.status(httpCodes.OK).json(result);
  }else{
    res.status(httpCodes.BAD_REQUEST).json(result);
  }
});

userRouter.post('/', async (req, res) => {
  const result = await userService.addUser(req.body);
  if(result){
    res.status(httpCodes.OK).json(result);
  }else{
    res.status(httpCodes.BAD_REQUEST).json(result);
  }
});


userRouter.delete('/:username', async (req, res) => {
  if(!req.session.isLoggedIn || !req.session.user) {
    throw new Error('You must be logged in to access this functionality');
  }
  // TODO: Implement the Delete user by ID endpoint
  const message={result:'user does not exist'};
  const {username} = req.params;
  const user: User|undefined = await userService.getByUsername(username);
  if (user){
    const result = await userService.remove(user);
    message.result = 'user deleted';
  }
  
  res.status(httpCodes.OK).json(message);
});

export default userRouter;