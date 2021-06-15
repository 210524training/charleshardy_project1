import Chat from './chat';
export default class approval{
    constructor(
       public level: number,
       public modReim: {cost: number, reason: string},
       public urgent: boolean,
       public denyReim: {denier: string, reason: string},
       public dates:{d0:string, d1:string, d2:string, d3:string},
       public chat: Chat,
    ){}
}