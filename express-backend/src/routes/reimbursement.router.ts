import { Router } from 'express';
import Reimbursement from '../models/reimbursement';
import reimbursementService from '../servicers/reimbursement.servicer';
import httpCodes from 'http-status-codes';
import reimbursement from '../models/reimbursement';

const reimbursementRouter = Router();

reimbursementRouter.get('/', async (req, res) => {
  if(!req.session.isLoggedIn || !req.session.user) {
    throw new Error('You must be logged in to access this functionality');
  }
  const users = await reimbursementService.getAll();
  res.status(httpCodes.OK).json(users);
});

reimbursementRouter.post('/username', async (req, res) => {
  if(!req.session.isLoggedIn || !req.session.user) {
    throw new Error('You must be logged in to access this functionality');
  }
  const {role,id,username} = req.body;
  
  console.log("role "+role +" username "+username);
  if(role){
    const elevatedRoles = ['benefits coordinator', 'supervisor', 'department head'];
    if(elevatedRoles.indexOf(role) !== -1){
      const userReims = await reimbursementService.getByApprover(username,role);
      res.status(httpCodes.OK).json(userReims);
    }else if(role === 'employee'){
      const reims = await reimbursementService.getEmpReimbursements(username);
      res.status(httpCodes.OK).json(reims);
    }else{
      res.status(httpCodes.BAD_REQUEST).send();
    }
  }else if(id){
    const idFetch = await reimbursementService.getById(id);
    const reimOut = (idFetch)?(idFetch):undefined;
    const outStatus = (reimOut)?(httpCodes.OK):httpCodes.NOT_FOUND;
    
    res.status(outStatus).send(reimOut);
  }
  else{
    const result = await reimbursementService.getEmpReimbursements(username);
    res.status(httpCodes.OK).json(result);
  }

});

reimbursementRouter.post('/', async (req, res) => {
  if(!req.session.isLoggedIn || !req.session.user) {
    throw new Error('You must be logged in to access this functionality');
  }
  const {reimbursement} = req.body;
  const result = await reimbursementService.makeReimbursementRequest(reimbursement);
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
  console.log("body "+req.body.reimbursement.approval);
  const {reimbursement} = req.body;

  const result = await reimbursementService.updateReimbursement(reimbursement);
  console.log("newREIM: "+reimbursement.approval.chat);
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