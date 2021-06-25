/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import {useAppSelector } from '../../../hooks';
import {selectUser, UserState } from '../../../slices/user.slice';
import {getRelevantRembursements} from "../../../remote/TRMS-backend/TRMS.api";
import Reimbursement from '../../../models/reimbursement';
const reimbursementsPage: React.FC = (): JSX.Element => {
    const history = useHistory();
    const user = useAppSelector<UserState>(selectUser);

    const [reimbursements,setReimbursements] = useState<JSX.Element[]>([<span key="reim:default">Loading reimbursements...</span>]);

    if(!user){ history.push('/');}

    
    useEffect(()=>{
        const getReimbursements = async (): Promise<JSX.Element[]>=>{
            if(!user) return [];
            const reims = await getRelevantRembursements(user);
              const newReims:JSX.Element[] = [];
              reims.forEach((reim: Reimbursement) => {
                newReims.push(
                    <div className={`container d-flex border flex-wrap secondary-color-2 border-2 bg-light ${reim.approval.urgent?('border-danger'):('secondary-color-1-border')} p-3 m-3 rounded}`} key={`reim-id:${reim.id}`}>
                        
                            <div className="p-2 bd-highlight">
                                <span className="fw-bold">Applicant:</span> {`${reim.applicant}`}
                            </div>
                            <div className="p-2 bd-highlight">
                                <span className="fw-bold">Event Date:</span> {`${reim.eventdate}`}
                            </div>
                            <div className="p-2 bd-highlight">
                                <span className="fw-bold">Applicant:</span> {`${reim.applicant}`}
                            </div>
                            <div className="p-2 bd-highlight">
                                <span className="fw-bold">Status: </span> 
                                {reim.resolved? (`${ reim.approval.denyReim?('deneid'):('accepted') }`):('pending')}
                            </div>
                            <div className="p-2 bd-highlight">
                                <span className="fw-bold">Urgent: </span> 
                                {reim.approval.urgent?('yes'):('no')} 
                            </div>
                            <div className="p-2 bd-highlight">
                                <span className="fw-bold">Approval Level: </span> 
                                {reim.approval.level} 
                            </div>
                            
                            <NavLink className="navbar-brand " to={`/reimbursments/${reim.id}`}>view here</NavLink>
                        </div>
                    
                );
              });
            return newReims;
        };
    
        const fetchData = async () => {

            let isMounted = true;               // note mutable flag
            const newReims = await getReimbursements()
            if (isMounted) setReimbursements( newReims);    // add conditional check
            return () => { isMounted = false }; // use cleanup to toggle value, if unmounted
        }
        fetchData();

    },[]);

    

    return(
        <>
            <br/>
            <div className="container">
                Hello {`${user?.firstName} ${user?.lastName}, please select a reimbursement to view:`}
                <div className="spacer"/>
            </div>
            
            <div className="container w-100 secondary-color-2 d-flex border border-2 secondary-color-1-border p-3 rounded">
                {(reimbursements.length)===0?('You have no reimbursements!'):(reimbursements)}
            </div>
        </>
    );
}

export default reimbursementsPage;