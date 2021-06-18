import DAOReimbursement from '../DAO/DAOReimbursement';
import Reimbursement from '../models/reimbursement';

class ReimbursementService{
    public async makeReimbursementRequest(reimbursement: Reimbursement): Promise<boolean>{
        return await DAOReimbursement.add(reimbursement);
    }

    public async updateReimbursement(reimbursement: Reimbursement): Promise<boolean>{
        return await DAOReimbursement.update(reimbursement);
    }

    public async getAll(): Promise<Reimbursement[]>{
        return await DAOReimbursement.getAll();
    }

    public async getEmpReimbursements(username: string): Promise<Reimbursement[]>{
        return await DAOReimbursement.getByApplicant(username);
    }

    public async getEmpReimbursement(username: string, id: string): Promise<Reimbursement|null>{
        return await DAOReimbursement.get(username, id);
    }

    public async getByApprover(
        username: string,
        role:'benefits coordinator'|'supervisor'| 'department head')
        :Promise<Reimbursement[]>
    {
        let condName = 'supervisor';
        if(role === 'benefits coordinator') condName='benCo';
        if(role === 'department head') condName='departmentHead';

        return await DAOReimbursement.getByCondition(condName, username);
        

    }
}

const servicer = new ReimbursementService();
export default servicer;