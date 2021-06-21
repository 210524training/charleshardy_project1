/* eslint-disable react-hooks/rules-of-hooks */
import React, { ChangeEvent} from 'react';

type Props = {
    handleDepChange: (e: ChangeEvent<HTMLSelectElement>) => Promise<void>
};
const departmentHeadReg: React.FC<Props> = ({handleDepChange}: Props): JSX.Element => {

     //setRole('employee');
    const departments = [
        <option key="IT" value="IT">information technology</option>,
        <option key="HR" value="HR">human resources</option>,
        <option key="Sales" value="sales">sales</option>,
        <option key="Finance" value="finance">finance</option>
    ];
    return(
    <>
        <div className="form-group">
            <label htmlFor="inputDep">Select Deparment:</label>
            <select id="inputDep" defaultValue="DEFAULT" className="form-select" aria-label="Default select example" onChange={handleDepChange}>
            <option value="DEFAULT">--select department--</option>
                {departments}
            </select>
        </div>
    </>
    );

}

export default departmentHeadReg;