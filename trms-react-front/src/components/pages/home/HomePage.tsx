import { FormEvent, FormEventHandler } from "react";
import { uploadFile } from "../../../remote/TRMS-backend/TRMS.api";
import FileUploader from '../../filestuff/fileuploader';
const component: React.FC = (): JSX.Element => {
    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }
    return(
        <>
        <form onSubmit={handleFormSubmit}>
            <FileUploader/>
        </form>
        </>
    );
}

export default component;

