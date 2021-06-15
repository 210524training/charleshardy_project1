import User from './user';
export default class chat{
    constructor(
        public members: User[],
        public messages: {to: string, from: string, message: string}[]
    ){}
}