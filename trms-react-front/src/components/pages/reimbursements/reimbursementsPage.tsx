/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {useAppSelector } from '../../../hooks';
import {selectUser, UserState } from '../../../slices/user.slice';
import {getRelevantRembursements} from "../../../remote/TRMS-backend/TRMS.api";
import Reimbursement from '../../../models/reimbursement';
const reimbursementsPage: React.FC = (): JSX.Element => {
    const history = useHistory();
    const user = useAppSelector<UserState>(selectUser);

    const [reimbursements,setReimbursements] = useState<JSX.Element[]>([]);

    if(!user){ history.push('/');}

    const getReimbursements = async (): Promise<JSX.Element[]>=>{
        if(!user) return [];
        const reims = await getRelevantRembursements(user);
          const newReims:JSX.Element[] = [];
          reims.forEach(reim => {
            newReims.push(<span key={`reim-id:${reim.id}`}>{`activity:${reim.activity} reason:${reim.reason} submission-date:${reim.submissiondate}`}</span>)
          });
          setReimbursements( newReims);
        return newReims;
    };

    getReimbursements();
    

    return(
        <>
            <br/>
            <div className="container">
                Hello {`${user?.firstName} ${user?.lastName}, please select a reimbursement to view:`}
                <div className="spacer"/>
            </div>
            
            <div className="container w-75 secondary-color-2 border border-2 secondary-color-1-border p-3 rounded">
                {(reimbursements.length)===0?('You have no reimbursements!'):(reimbursements)}
            </div>
        </>
    );
}

export default reimbursementsPage;