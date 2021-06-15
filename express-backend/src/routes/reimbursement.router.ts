import { Router } from 'express';

const reimbursementRouter = Router();

reimbursementRouter.get('/', async (req, res) => {
  // TODO: Implement the GET all reimbursements endpoint
});

reimbursementRouter.get('/:id', async (req, res) => {
  // TODO: Implement the GET reimbursement by ID endpoint
});

reimbursementRouter.post('/', async (req, res) => {
  // TODO: Implement the Create reimbursement endpoint
});

reimbursementRouter.put('/', async (req, res) => {
  // TODO: Implement the Update reimbursement endpoint
});

reimbursementRouter.delete('/:id', async (req, res) => {
  // TODO: Implement the Delete reimbursement by ID endpoint
});

export default reimbursementRouter;