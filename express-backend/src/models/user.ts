export default class user{
    constructor(
        public username:string,
        public password:string,
        public role:'benefits coordinator'|'supervisor'| 'department head'| 'employee',
        public firstName:string,
        public lastName:string,
        public reimbursementFunds: number,
        public department?:string,
        public supervisor?: string,
        public departmentHead?: string,
        public benCo?: string,
    ){}
}