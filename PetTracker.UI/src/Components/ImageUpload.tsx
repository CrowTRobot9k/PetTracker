import React, { ChangeEvent, useState } from 'react';
import Button from '@mui/material/Button';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Container from '@mui/material/Container';
import Carousel from '../Components/Carousel/Carousel';

import '../Styles/petTracker.css';

interface FileUploadProps {
    label: string;
    selectedFiles: File[],
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageUpload({ label, selectedFiles, onChange }: FileUploadProps) {
    const [slides, setSlides] = useState<React.ReactElement[]>([]);

    const handleFileChange = (e) =>
    {
        onChange(e.target.files);

        const files = [];
        let idx = 1;
        Array.from(e.target.files).map((f) => {
            if (f) {
                try {
                    const fileUrl = URL.createObjectURL(f)
                    files.push({ id: idx, fileName: f.name, src: fileUrl, })

                } catch (error) {
                    console.error("Error reading file:", error);
                }
            }
            idx++;
        })

        const updateSlides = Array.from(files.map((f) => (
            <img key={`${f.id}_${f.fileName}`} src={f.src} className="img-preview" />  
        )))

        setSlides(updateSlides);
    };

    return (
        <>
            <Container
                maxWidth="xs"
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 1, gap: 0 }}
            >
                <Button
                    variant="contained"
                    component="label"
                    color="info"
                    endIcon={<FileUploadIcon />}
                >
                    {label}
                    <input
                        type="file"
                        hidden
                        multiple
                        onChange={handleFileChange}
                    />
                </Button>
            </Container>
            <Container
                maxWidth="sm"
                sx={{ display: 'flex', flexDirection: 'column', my: 1, gap: 0 }}
            >
            {selectedFiles?.length > 0 && (

                <Carousel cards={slides} />
            )}  
            </Container>
        </>
    );
}