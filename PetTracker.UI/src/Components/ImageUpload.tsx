import React, { ChangeEvent, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Container from '@mui/material/Container';
import Carousel from '../Components/Carousel/Carousel';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { getImageUrlFromBlob } from '../Util/CommonFunctions'

interface PhotoFile {
    id?: number;
    fileName?: string;
    name?: string;
    fileDataBase64?: string;
    size?: number;
}

interface FileUploadProps {
    label: string;
    selectedFiles: PhotoFile[] | File[];
    onChange: (e: any) => void;
    readonly?: boolean;
}

export default function ImageUpload({ label, selectedFiles, onChange, readonly = false }: FileUploadProps) {
    const [slides, setSlides] = useState<React.ReactElement[]>([]);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() =>
    {
        if (selectedFiles && selectedFiles.length > 0)
        {
            setIsLoading(true);
            const files: any[] = [];
            Array.from(selectedFiles).forEach((f: any, index: number) => {
                // Handle existing photos from server (with fileDataBase64)
                if (f && f.fileDataBase64) {
                    try {
                        const fileUrl = getImageUrlFromBlob(f.fileDataBase64);
                        files.push({ id: f.id, fileName: f.fileName, src: fileUrl, });
                    } catch (error) {
                        setErrorMessage("Error reading file");
                    }
                }
                // Handle newly selected File objects
                else if (f instanceof File) {
                    try {
                        const fileUrl = URL.createObjectURL(f);
                        files.push({ id: index + 1, fileName: f.name, src: fileUrl, });
                    } catch (error) {
                        setErrorMessage("Error reading file");
                    }
                }
            });

            const updateSlides = Array.from(files.map((f) => (
                <img key={`${f.id}_${f.fileName}`} src={f.src} className="img-preview" />
            )))

            setSlides(updateSlides);
            setIsLoading(false);
        } else {
            setSlides([]);
            setIsLoading(false);
        }
    }, [selectedFiles]);

    const handleFileChange = (e: any) =>
    {
        setErrorMessage("");

        if (Array.from(e.target.files).some((s: any) => s.size > 10000000)) {
            setErrorMessage("Files cannot be larger than 10MB");
            setIsLoading(false);
        }
        else {
            // Just pass the files to the parent - the useEffect will handle display
            onChange(e.target.files);
        }
    };

    return (
        <>
            {!readonly && (
                <Container
                    maxWidth="xs"
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 0.5, gap: 0 }}
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
            )}
            <Container
                maxWidth="sm"
                sx={{ display: 'flex', flexDirection: 'column', my: 0.5, gap: 0 }}
            >
            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 1 }}>
                    <CircularProgress />
                </Box>
            )}
            {!isLoading && selectedFiles?.length > 0 && (

                <Carousel cards={slides} onVisible={() => {}} />
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