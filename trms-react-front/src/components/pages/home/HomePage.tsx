import { FormEvent,useState } from "react";
import FileUploader from '../../filestuff/fileuploader';
const Component: React.FC = (): JSX.Element => {
    const [files,setFiles]= useState<{fileName: string,fileID:string}[]>([]);
    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }
    return(
        <>
        <form onSubmit={handleFormSubmit}>
            <FileUploader uploadedFiles={files} setUploadedFiles={setFiles} />
        </form>
        uploaded these {
            files.map(file =>{return<>{`name:${file.fileName} //// ID:${file.fileID}`}</>})
        }
        </>
    );
}

export default Component;

