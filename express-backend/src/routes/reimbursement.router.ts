import { Router } from 'express';
import Reimbursement from '../models/reimbursement';
import reimbursementService from '../servicers/reimbursement.servicer';
import httpCodes from 'http-status-codes';

const reimbursementRouter = Router();

reimbursementRouter.get('/', async (req, res) => {
  if(!req.session.isLoggedIn || !req.session.user) {
    throw new Error('You must be logged in to access this functionality');
  }
  const users = await reimbursementService.getAll();
  res.status(httpCodes.OK).json(users);
});

reimbursementRouter.get('/:id', async (req, res) => {
  // TODO: Implement the GET reimbursement by ID endpoint
});

reimbursementRouter.post('/', async (req, res) => {
  const result = await reimbursementService.makeReimbursementRequest(req.body);
  if(result){
    res.status(httpCodes.OK).json(result);
  }else{
    res.status(httpCodes.BAD_REQUEST).json(result);
  }
});

reimbursementRouter.put('/', async (req, res) => {
  // TODO: Implement the Update reimbursement endpoint
});

reimbursementRouter.delete('/:id', async (req, res) => {
  // TODO: Implement the Delete reimbursement by ID endpoint
});

export default reimbursementRouter;