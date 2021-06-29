import { useAppSelector } from "../../../hooks";
import { selectUser, UserState } from "../../../slices/user.slice";

const Component: React.FC = (): JSX.Element => {
    const user = useAppSelector<UserState>(selectUser);
    return(
        <>
        <div className="spacer"/>
        {(!user)?(<>Welcome to TRMS, please sign in.</>):(
        <>
            <div className="container w-100 secondary-color-2 pb-3 d-flex border border-2 secondary-color-1-border  rounded">
                <div className="p-2 bd-highlight">
                    <h4 className="fw-bold">PROFILE:</h4>
                    <p><span className="fw-bold">First Name:</span> {`${user.firstName}`}</p>
                    <p><span className="fw-bold">Last Name:</span> {`${user.lastName}`}</p>
                    <p><span className="fw-bold">Username:</span> {`${user.username}`}</p>
                    <p><span className="fw-bold">Role:</span> {`${user.role}`}</p>
                    {(user.role==='benefits coordinator')?(<></>):(<p><span className="fw-bold">Department:</span> {`${user.department}`}</p>)}
                    {(user.role!=='employee')?(<></>):(<p><span className="fw-bold">Avaliable Reimbursement Funds:</span> {`${user.reimbursementFunds}`}</p>)}
                </div>
            </div>
        </>
        )}

        <div className="container w-100 mt-3 secondary-color-2 pb-3 d-flex flex-column border border-2 secondary-color-1-border  rounded">
            <h4 className="fw-bold">FAQ:</h4>
            <p><span className="fw-bold">How do I request for a reimbursement?</span></p>
            <p>If you are a department head, supervisor, or benefits coordinator then you can't. Otherwise, select the request reimbursement tab in the navigator and fill out the form.</p>
            <p><span className="fw-bold">How do I submit my evaluation?</span></p>
            <p>If you are a department head, supervisor, or benefits coordinator then you can't. Otherwise select the reimbursements tab and click 'Add Evaluation(s) here' for the desired reimbursement request and then upload your file(s).</p>
            <p><span className="fw-bold">What is the 'Approval level'?</span></p>
            <p>This number(0-3) indicates the stage of a request. 0:'waiting for supervisor approval', 1:'waiting for department head approval', 2:'waiting for benefits coordinator approval', 3:'request accepted/rejected'.</p>
            <p><span className="fw-bold">How do i talk with my approvers/requestor?</span></p>
            <p>Navigate to the desired request via ReimbursementPage, then select the user you wish to chat with.</p>
            <p><span className="fw-bold">How do i handle a request?</span></p>
            <p>If you are not a department head, supervisor, or benefits coordinator then you can't. Otherwise select the reimbursements tab and click 'view here' for the desired reimbursement request and then depending on the request status and your role in the request, you can handle it.</p>
        </div>
        </>
    );
}

export default Component;

