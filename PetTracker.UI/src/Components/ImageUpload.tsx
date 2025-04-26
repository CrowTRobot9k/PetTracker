import React, { ChangeEvent, useState } from 'react';
import Button from '@mui/material/Button';
import Carousel from '../Components/Carousel/Carousel'
import { EmblaOptionsType } from 'embla-carousel'
import '../Styles/embla.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Container from '@mui/material/Container';
import CardMedia from '@mui/material/CardMedia';


interface FileUploadProps {
    label: string;
    selectedFiles: File[],
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface previewFile
{
    fileName: string,
    src:string

}

export default function ImageUpload({ label, selectedFiles, onChange }: FileUploadProps) {
    const [slides, setSlides] = useState([]);
    const OPTIONS: EmblaOptionsType = {}



    const handleFileChange = (e) =>
    {
        onChange(e.target.files);

        const files = [];
        Array.from(e.target.files).map((f) => {
            if (f) {
                try {
                    const fileUrl = URL.createObjectURL(f)
                    files.push({ fileName: f.name, src: fileUrl, })

                } catch (error) {
                    console.error("Error reading file:", error);
                }
            }
        })

        setSlides(Array.from(files.map((f) => (
                    <img src={ f.src} width="100" height="100" />
        ))))
    };

    return (
        <div>
            <Container
                maxWidth="lg"
                component="main"
                sx={{ display: 'flex', flexDirection: 'column', my: 1, gap: 1 }}
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
            {selectedFiles?.length > 0 && (
                <Container
                    maxWidth="lg"
                    component="main"
                    sx={{ display: 'flex', flexDirection: 'column', my: 1, gap: 1 }}
                >
                    <Card variant="outlined">
                        <Carousel slides={slides} options={OPTIONS} />
                    </Card>
                </Container>
            )}  
        </div>
    );
}