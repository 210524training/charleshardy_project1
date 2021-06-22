import DAOReimbursement from '../DAO/DAOReimbursement';
import Reimbursement from '../models/reimbursement';
import DAOUser from '../DAO/DAOUser';
import User from '../models/user';
import constants from '../constants';
class ReimbursementService{
    private async calculateProjectedReimbursement(username:string, price:number, plan:string): Promise<number> {
        const user: User|null= await DAOUser.exists(username);

        if(!user){
            return 0;
        }
        const priceCoverage:number = price* constants.priceCoverage(plan);
        const totalFunds = user.reimbursementFunds
        const projectedReimbursement = ((priceCoverage>totalFunds)?(priceCoverage):(totalFunds));

        if(projectedReimbursement>=0) return projectedReimbursement
        return 0;
    }

    public async makeReimbursementRequest(reimbursement: Reimbursement): Promise<boolean>{
        const projection = await this.calculateProjectedReimbursement(
            reimbursement.applicant,
            reimbursement.cost,
            reimbursement.activity
        );
        reimbursement.projectedReimbursement = projection;
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

    public async getById(id: string): Promise<Reimbursement|null>{
        const result = await DAOReimbursement.getByCondition("id",id);
        return (result.length > 0 )? (result[0]): (null);
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