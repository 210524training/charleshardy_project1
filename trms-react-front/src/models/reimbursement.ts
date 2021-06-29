import Approval  from './approval';

export default class reimbursement{
    constructor(
        public id: string,
        public applicant: string,
        public supervisor: string,
        public departmentHead: string,
        public benCo: string,
        public activity: 
            'university course'|
            'seminar'|
            'certification preparation class'|
            'certification'|
            'technical training'|
            'other',
        public cost: number,
        public submissiondate: string,
        public eventdate: string,
        public location: {state:string, city:string} | 'remote',
        public evaluation: 'presentation'| 'grade',
        public reason: string,
        public attachments: {fileID:string,fileName:string}[],
        public evaluations: {fileID:string,fileName:string}[],
        public projectedReimbursement: number,
        public approval: Approval,
        public resolved: boolean,
        public updateArr: boolean[]
    ){}
}