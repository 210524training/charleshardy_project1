/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import {useAppSelector } from '../../../hooks';
import {selectUser, UserState } from '../../../slices/user.slice';
import {getRelevantRembursements} from "../../../remote/TRMS-backend/TRMS.api";
import Reimbursement from '../../../models/reimbursement';
import User from '../../../models/user';
const reimbursementsPage: React.FC = (): JSX.Element => {
    const history = useHistory();
    const user = useAppSelector<UserState>(selectUser);

    const [reimbursements,setReimbursements] = useState<JSX.Element[]>([<span key="reim:default">Loading reimbursements...</span>]);

    if(!user){ history.push('/');}

    function getRoleUpdateArrIndex(user: User):number {
        if(user.role === 'employee'){
          return 0;
        }else if(user.role === 'supervisor'){
          return 1;
        }else if(user.role === "department head"){
          return 2;
        }else{
          return 3;
        }
      }
    
    useEffect(()=>{
        const getReimbursements = async (): Promise<JSX.Element[]>=>{
            if(!user) return [];
            const reims = await getRelevantRembursements(user);
              const newReims:JSX.Element[] = [];
              reims.forEach((reim: Reimbursement) => {
                newReims.push(
                    <div className={`container d-flex border position-relative m-auto mt-3 flex-wrap secondary-color-2 border-2 bg-light ${reim.approval.urgent?('border-danger'):('secondary-color-1-border')} p-3 m-3 rounded}`} key={`reim-id:${reim.id}`}>
                        
                            <div className="p-2 bd-highlight">
                                <span className="fw-bold">Applicant:</span> {`${reim.applicant}`}
                            </div>
                            <div className="p-2 bd-highlight">
                                <span className="fw-bold">Event Date:</span> {`${reim.eventdate}`}
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
                            {!reim.updateArr[getRoleUpdateArrIndex(user)]?(<></>):(<span className="position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-danger p-2"><span className="visually-hidden">unread messages</span></span>)}
                            
                            {(user.role==='employee')?(<NavLink className="navbar-brand " to={`/evaluations/${reim.id}`}>Add Evaluation(s) here</NavLink>):(<></>)}
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
            
            <div className="container w-100 secondary-color-2 pb-3 d-flex flex-column border border-2 secondary-color-1-border  rounded">
                {(reimbursements.length)===0?('You have no reimbursements!'):(reimbursements)}
            </div>
        </>
    );
}

export default reimbursementsPage;