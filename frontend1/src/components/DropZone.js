import React, { useEffect, useState } from "react";
import { useDropzone } from 'react-dropzone';
import { MdDelete, MdClose } from 'react-icons/md';
import { IconButton } from '@chakra-ui/react';

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
};
  
const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
};
  
const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
};

const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
};
  
// accept: {
//     'image/png': ['.png'],
//     'text/html': ['.html', '.htm'],
// }

function Previews(props) {
    const [files, setFiles] = useState([]);
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': []
        },
        onDrop: (acceptedFiles) => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));

            acceptedFiles.forEach(file => {
                props.apiUploadFile({file, subPath: props.subPath});
            });
        },
        disabled: props.isDisabled
    });

    // const thumbs = files.map(file => (
    //     <div style={thumb} key={file.name}>
    //         <div style={thumbInner}>
    //             <img 
    //                 src={file.preview}
    //                 style={img}
    //                 onLoad={() => {
    //                     URL.revokeObjectURL(file.preview)
    //                 }}
    //             />
    //         </div>
    //     </div>
    // ));

    useEffect(() => {
        // if(props.files) {
        //     setFiles(props.files.map(file => Object.assign(file, {
        //         preview: URL.createObjectURL(file)
        //     })));
        // }
        return () => files.forEach(file => URL.revokeObjectURL(file.preview));
    }, []);

    //console.log('--- props', props)

    return (
        <section className="dropzone-container">
            <div {...getRootProps({ className: props.isDisabled ? 'dropzone disabled' : 'dropzone' })}>
                <input {...getInputProps()} />
                <p> Kéo và thả ảnh vào đây hoặc click để chọn (*.png)</p>
            </div>

            {/* <aside style={thumbsContainer}>
                {thumbs}
                {
                    thumbs && thumbs.length > 0 &&
                    <IconButton
                        size="xs"
                        variant="outline"
                        title='Xoá'
                        colorScheme="red"
                        icon={<MdClose />}
                        onClick={() => {
                            setFiles([]);
                            props.handleDeleteImage();
                        }}
                    />
                }
            </aside> */}
        </section>
    )
}

export default Previews;