import React, {useState, useEffect, useRef} from 'react';
import { useDropzone } from 'react-dropzone';
import { IconButton } from '@chakra-ui/react';
import { MdClose } from 'react-icons/md';

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 4
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

function DropZoneWithImage({ callback, rest }) {
    const [files, setFiles] = useState([]);
    const [isFileGt10Mb, setIsFileGt10Mb] = useState(false);
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': []
        },
        onDrop: (acceptedFiles) => {
            // console.log("--- acceptedFiles", acceptedFiles)
            let isGt10Mb = false;

            acceptedFiles.map(file => {
                isGt10Mb = (file.size / 1024 / 1024) > 10;
                if(isGt10Mb) {
                    setIsFileGt10Mb(isGt10Mb);
                    return;
                }
            })
           
            if(!isGt10Mb) {
                setIsFileGt10Mb(isGt10Mb);
                setFiles(acceptedFiles.map(file => Object.assign(file, {
                    preview: URL.createObjectURL(file)
                })));
                callback(acceptedFiles[0]);
            }
        },
    });

    const thumbs = files.map(file => (
        <div style={{...thumb, ...rest}} key={file.name}>
            <div style={thumbInner}>
                <img 
                    src={file.preview}
                    style={img}
                    onLoad={() => {
                        URL.revokeObjectURL(file.preview)
                    }}
                />
            </div>
        </div>
    ));

    useEffect(() => {
        return () => files.forEach(file => URL.revokeObjectURL(file.preview));
    }, []);

    return (
        <section className="dropzone-container">
            <aside style={thumbsContainer}>
                {thumbs}
                {
                    thumbs && thumbs.length > 0 &&
                    <IconButton
                        size="xs"
                        // variant="outline"
                        title='Xoá'
                        colorScheme="red"
                        icon={<MdClose />}
                        onClick={() => {
                            setFiles([]);
                            setIsFileGt10Mb(false);
                            callback(null);
                        }}
                    />
                }
                {
                    (!thumbs || (thumbs && thumbs.length === 0)) &&
                    <div {...getRootProps({ className: 'dropzone' })} style={{ marginLeft: "5px"}}>
                        <input {...getInputProps()} />
                        <p> Kéo và thả ảnh vào đây hoặc click để chọn (file upload nhỏ hơn 10Mb)</p>
                    </div>
                }
            </aside>
            {
                isFileGt10Mb && 
                <div style={{ color: "red" }}>File upload lớn hơn 10Mb! Vui lòng upload file có dung lượng nhỏ hơn 10Mb</div>
            }
        </section>
    )
}

export default DropZoneWithImage