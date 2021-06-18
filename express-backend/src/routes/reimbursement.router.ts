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

reimbursementRouter.get('/:username', async (req, res) => {
  if(!req.session.isLoggedIn || !req.session.user) {
    throw new Error('You must be logged in to access this functionality');
  }
  const {role} = req.body;
  if(role){
    const elevatedRoles = ['benefits coordinator', 'supervisor', 'department head'];
    if(elevatedRoles.indexOf(role) != -1){
      const userReims = await reimbursementService.getByApprover(req.params.username,role);
      res.status(httpCodes.OK).json(userReims);
    }else if(role == 'employee'){
      const reims = await reimbursementService.getEmpReimbursements(req.params.username);
      res.status(httpCodes.OK).json(reims);
    }else{
      res.status(httpCodes.BAD_REQUEST).send();
    }
  }
  else{

    const result = await reimbursementService.getEmpReimbursements(req.params.username);
    res.status(httpCodes.OK).json(result);
  }

});

reimbursementRouter.post('/', async (req, res) => {
  if(!req.session.isLoggedIn || !req.session.user) {
    throw new Error('You must be logged in to access this functionality');
  }
  const result = await reimbursementService.makeReimbursementRequest(req.body);
  if(result){
    res.status(httpCodes.OK).json(result);
  }else{
    res.status(httpCodes.BAD_REQUEST).json(result);
  }
});

reimbursementRouter.put('/', async (req, res) => {
  if(!req.session.isLoggedIn || !req.session.user) {
    throw new Error('You must be logged in to access this functionality');
  }
  const result = await reimbursementService.updateReimbursement(req.body);
  if(result){
    res.status(httpCodes.OK).json(result);
  }else{
    res.status(httpCodes.BAD_REQUEST).json(result);
  }
});

reimbursementRouter.delete('/:id', async (req, res) => {
  // TODO: Implement the Delete reimbursement by ID endpoint
  res.status(httpCodes.NOT_IMPLEMENTED).send();
});

export default reimbursementRouter;