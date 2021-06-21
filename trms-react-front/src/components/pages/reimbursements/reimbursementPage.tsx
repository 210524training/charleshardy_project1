import { string } from "prop-types";
import { useParams } from "react-router-dom";


const component: React.FC = (): JSX.Element => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const params = useParams<{id:string}>();;
    return(
        <>
        {`veiwing reimbursement: ${params.id}`}
        </>
    );
}

export default component;