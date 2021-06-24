import { v4 } from "uuid";

type props = {fileName: string,url: string}
const FileUploader = ({fileName,url}:props) => {

    return (
        <>
        <a href={url} key={v4().toString() + url} target="_blank" rel="noreferrer">{fileName}</a> &nbsp;
        </>
    );
    
}

export default FileUploader;