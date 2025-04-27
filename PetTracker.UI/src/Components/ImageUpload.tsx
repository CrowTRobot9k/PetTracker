import React, { ChangeEvent, useState } from 'react';
import Button from '@mui/material/Button';
//import Carousel from '../Components/Carousel/Carousel'
import { EmblaOptionsType } from 'embla-carousel'
import '../Styles/embla.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Container from '@mui/material/Container';
import CardMedia from '@mui/material/CardMedia';
import Carousel from 'react-material-ui-carousel'

import '../Styles/petTracker.css';

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
        let idx = 0;
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

        const slides = Array.from(files.map((f) => (
            {
                id: `${f.id}-${f.fileName}`,
                slide: <img src={f.src} className="img-preview" />
                //slide: <CardMedia
                //    component="img"
                //    alt={f.fileName}
                //    image={f.src}
                //    sx={{
                //        aspectRatio: '16 / 9',
                //        borderBottom: '1px solid',
                //        borderColor: 'divider',
                //    }}
                ///>
            }
        )))

        setSlides(slides);
    };

    return (
        <div>
            <Container
                maxWidth="xs"
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

                        <Carousel>
                        {
                            slides.map((s) => (
                                s.slide
                            ))
                        }
                        </Carousel>

            )}  
        </div>
    );
}