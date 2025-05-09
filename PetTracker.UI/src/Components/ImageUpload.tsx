import React, { ChangeEvent, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Container from '@mui/material/Container';
import Carousel from '../Components/Carousel/Carousel';
import Alert from '@mui/material/Alert';

interface FileUploadProps {
    label: string;
    selectedFiles: File[],
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageUpload({ label, selectedFiles, onChange }: FileUploadProps) {
    const [slides, setSlides] = useState<React.ReactElement[]>([]);
    const [errorMessage, setErrorMessage] = React.useState('');

    const getImageUrlFromBlob = (base64String) => {
        return `data:image/png;base64,${base64String}`;
    }

    useEffect(() =>
    {
        if (selectedFiles.length > 0)
        {
            const files = [];
            Array.from(selectedFiles).map((f) => {
                if (f) {
                    try {
                        const fileUrl = getImageUrlFromBlob(f.fileDataBase64);
                        files.push({ id: f.id, fileName: f.fileName, src: fileUrl, });

                    } catch (error) {
                        setErrorMessage("Error reading file");
                    }
                }
            });

            const updateSlides = Array.from(files.map((f) => (
                <img key={`${f.id}_${f.fileName}`} src={f.src} className="img-preview" />
            )))

            setSlides(updateSlides);
        }
    }, []);

    const handleFileChange = (e) =>
    {
        setErrorMessage("");

        if (Array.from(e.target.files).some(s => s.size > 10000000)) {
            setErrorMessage("Files cannot be larger than 10MB");
        }
        else {
            onChange(e.target.files);

            const files = [];
            let idx = 1;
            Array.from(e.target.files).map((f) => {
                if (f) {
                    try {
                        const fileUrl = URL.createObjectURL(f)
                        files.push({ id: idx, fileName: f.name, src: fileUrl, })

                    } catch (error) {
                        setErrorMessage("Error reading file");
                    }
                }
                idx++;
            })

            const updateSlides = Array.from(files.map((f) => (
                <img key={`${f.id}_${f.fileName}`} src={f.src} className="img-preview" />
            )))

            setSlides(updateSlides);
        }
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
                )
            }
            {errorMessage?.length > 0 && (
                <Alert variant="filled" severity="error">
                    {errorMessage}
                </Alert>
            )}
            </Container>
        </>
    );
}