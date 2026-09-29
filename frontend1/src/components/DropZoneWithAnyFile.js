import React, { useEffect, useState, useRef } from "react";
import { useDropzone } from 'react-dropzone';

function DropZoneWithAnyFile(props) {
    const [fileNameGt10Mb, setFileNameGt10Mb] = useState("");
    const [isFileGt10Mb, setIsFileGt10Mb] = useState(false);
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            //'image/*': []
        },
        onDrop: (acceptedFiles) => {
            let isGt10Mb = false;

            acceptedFiles.map(file => {
                isGt10Mb = (file.size / 1024 / 1024) > 10;
                if(isGt10Mb) {
                    setIsFileGt10Mb(isGt10Mb);
                    setFileNameGt10Mb(file.name);
                    return;
                }
            })
           
            if(!isGt10Mb) {
                setIsFileGt10Mb(isGt10Mb);
                props.setFileResults([ ...props.fileResults, ...acceptedFiles ]);
            }
        },
    });

    return (
        <section className="dropzone-container">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p> Kéo và thả file vào đây hoặc click để chọn {props.note}</p>
            </div>
            {
                isFileGt10Mb && 
                <div style={{ color: "red" }}>File "{fileNameGt10Mb}" upload lớn hơn 10Mb! Vui lòng upload file có dung lượng nhỏ hơn 10Mb</div>
            }
        </section>
    )
}

export default DropZoneWithAnyFile;