import React, { ChangeEvent } from 'react';
import Button from '@mui/material/Button';

interface FileUploadProps {
    label: string;
    selectedFiles: File[],
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function FileUpload({ label, selectedFiles, onChange }: FileUploadProps)
{

    const handleFileChange = (e) => {
        onChange(e.target.files);
   };

    return (
        <div>
            <Button
                variant="contained"
                component="label"
                color="info"
            >
                {label}
                <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleFileChange}
                />
            </Button>
            {selectedFiles.length > 0 && (
                <div>
                    <ul>
                        {Object.values(selectedFiles).map((file) => (
                            <li key={file.name}>{file.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}