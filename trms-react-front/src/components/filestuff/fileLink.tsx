
type props = {fileName: string,url: string}
const FileUploader = ({fileName,url}:props) => {

    return (
    <>
        <a href={url} target="_blank" rel="noreferrer">{fileName}</a>
    </>
    );
    
}

export default FileUploader;