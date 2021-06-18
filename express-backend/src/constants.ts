class Constants{
//approval level
approvalL0 = 0;
approvalL1 = 1;
approvalL2 = 2;
approvalL3 = 3;

//reimbursement percentages
universityCoursePercentage:number = .8;
seminarPercentage:number = .6;
certificationPrepClassPercentage:number = .75;
certificationPercentage:number = 1.0;
technicalTrainingPercentage:number = .9;
otherPercentage:number = .3;
public priceCoverage=(plan: string):number=>{
    switch(plan){
        case 'university course':
            return this.universityCoursePercentage;
        case 'seminar':
            return this.seminarPercentage;
        case 'certification preparation class':
            return this.certificationPrepClassPercentage;
        case 'certification':
            return this.certificationPercentage;
        case 'technical training':
            return this.technicalTrainingPercentage;
        default:
            return this.otherPercentage;
    }
}
}

const constants = new Constants(); 

export default constants;