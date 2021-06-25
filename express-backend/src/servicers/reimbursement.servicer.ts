import DAOReimbursement from '../DAO/DAOReimbursement';
import DAOUser from '../DAO/DAOUser';
import Reimbursement from '../models/reimbursement';
import User from '../models/user';
import constants from '../constants';
import reimbursement from '../models/reimbursement';
class ReimbursementService{
    private isUrgent(date:string):boolean{
        const currDate = Date.now();
        const minDate = new Date( currDate + (6.048e+8 * 1) );
    
        const vars = date.split('/');
        const day = Number(vars[1]);
        const month = Number(vars[0]);
        const year = Number(vars[2]);
        const d =  new Date(year, month-1, day);
        if(minDate>d){
            return true;
        }
    
        return false;
    }
    private  calculateProjectedReimbursement(user:User, price:number, plan:string): number {
        
        if(!user){
            return 0;
        }
        const priceCoverage:number = price* constants.priceCoverage(plan);
        const totalFunds = user.reimbursementFunds
        const projectedReimbursement = ((priceCoverage<=totalFunds)?(priceCoverage):(totalFunds));

        if(projectedReimbursement>=0) return projectedReimbursement
        return 0;
    }

    public async makeReimbursementRequest(reimbursement: Reimbursement): Promise<boolean>{
        const user: User|null= await DAOUser.exists(reimbursement.applicant);
        if(!user) return false;

        
        
        const projection = this.calculateProjectedReimbursement(
            user,
            reimbursement.cost,
            reimbursement.activity
        );
        user.reimbursementFunds = (((user.reimbursementFunds - reimbursement.cost) <= 0)? (0): (user.reimbursementFunds - reimbursement.cost));
        const res = await DAOUser.update(user);
        if(!res) return false;
        reimbursement.projectedReimbursement = projection;
        return await DAOReimbursement.add(reimbursement);
    }

    public async updateReimbursement(reimbursement: Reimbursement): Promise<boolean>{
        return await DAOReimbursement.update(reimbursement);
    }

    public async getAll(): Promise<Reimbursement[]>{
        const reims = (await DAOReimbursement.getAll());

        reims.forEach((reimbursement)=>{
            if(this.isUrgent(reimbursement.eventdate)){
                if(!reimbursement.resolved){
                    reimbursement.approval.urgent=true;
                }
            }
        });
        return reims;
    }

    public async getEmpReimbursements(username: string): Promise<Reimbursement[]>{
        const reims = await DAOReimbursement.getByApplicant(username);

        reims.forEach((reimbursement)=>{
            if(this.isUrgent(reimbursement.eventdate)){
                if(!reimbursement.resolved){
                    reimbursement.approval.urgent=true;
                }
            }
        });
        return reims;
    }

    public async getEmpReimbursement(username: string, id: string): Promise<Reimbursement|null>{
        const reimbursement = await DAOReimbursement.get(username, id);
        if(!reimbursement) return null;
        if(this.isUrgent(reimbursement.eventdate)){
            if(!reimbursement.resolved){
                reimbursement.approval.urgent=true;
            }
        }
        return reimbursement;
    }

    public async getById(id: string): Promise<Reimbursement|null>{
        const result = await DAOReimbursement.getByCondition("id",id);
        if(result.length<=0) return null;
        const reimbursement =result[0];
        if(this.isUrgent(reimbursement.eventdate)){
            if(!reimbursement.resolved){
                reimbursement.approval.urgent=true;
            }
        }
        
        return reimbursement;
    }

    public async getByApprover(
        username: string,
        role:'benefits coordinator'|'supervisor'| 'department head')
        :Promise<Reimbursement[]>
    {
        let condName = 'supervisor';
        if(role === 'benefits coordinator') condName='benCo';
        if(role === 'department head') condName='departmentHead';

        const reims =  await DAOReimbursement.getByCondition(condName, username);
        reims.forEach((reimbursement)=>{
            if(this.isUrgent(reimbursement.eventdate)){
                if(!reimbursement.resolved){
                    reimbursement.approval.urgent=true;
                }
            }
        });
        return reims;
        

    }
}

const servicer = new ReimbursementService();
export default servicer;