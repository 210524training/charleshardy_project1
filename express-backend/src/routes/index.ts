import express, { Router } from 'express';
import userRouter from './user.router';
import reimbursementRouter from './reimbursement.router';
import User from '../models/user';
import userService from '../servicers/user.servicer';
import httpCodes from 'http-status-codes';
import fileRouter from './file.router';
const baseRouter = Router();



baseRouter.post('/login', async (req: express.Request<unknown, unknown, { username: string, password: string }, unknown, {}>, res) => {
  const { username, password } = req.body;
  const user: User|undefined = await userService.signIn(username, password);

  if(user){
    req.session.isLoggedIn = true;
    req.session.user = user;
    user.password = "BLOCKED PASS"
    res.status(httpCodes.OK).json(req.session.user);
  } else {
    res.status(httpCodes.FORBIDDEN).send();
  }
});

export async function logout(req: express.Request, res: express.Response): Promise<void> {
  if(req.session.user) {
    const { username } = req.session.user;
    req.session.destroy(() => {
      console.log(`${username} logged out`);
    });
  }

  res.status(httpCodes.OK).send();
}

baseRouter.post('/logout', logout);

baseRouter.use('/api/v1/users', userRouter);
baseRouter.use('/api/v1/files', fileRouter);
baseRouter.use('/api/v1/reimbursements', reimbursementRouter);

export default baseRouter;