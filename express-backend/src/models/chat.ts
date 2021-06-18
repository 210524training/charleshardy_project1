import User from './user';
export default class chat{
    constructor(
        public members: string[],
        public messages: {to: string, from: string, message: string}[]
    ){}
}