import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AppTheme from '../Theme/AppTheme';
import AppAppBar from '../Components/AppAppBar';
import AddIcon from '@mui/icons-material/Add';
import AddPet from '../Components/AddPet';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { styled } from '@mui/material/styles';
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";
import Carousel from '../Components/Carousel/Carousel';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Fab from '@mui/material/Fab';
import usePetsStore from '../Stores/PetsStore.tsx';

import '../Styles/petTracker.css';


export default function Pets(props: { disableCustomTheme?: boolean }) {
    const getPets = usePetsStore((state) => state.getPets);
    const getPetTypes = usePetsStore((state) => state.getPetTypes);
    const petTypes = usePetsStore((state) => state.petTypes);
    const { pets, loadingPets } = usePetsStore();
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        getPets();
    }, []);

    useEffect(() => {
        getPetTypes();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getImageUrlFromBlob = (base64String) =>
    {
       return `data:image/png;base64,${base64String}`;
    }

    const getPetSlides = (images) =>
    {
       return Array.from(images.map((f,index) => (
           <img key={`${index}_${f.fileName}`} src={getImageUrlFromBlob(f.fileDataBase64)}/>
        )))
    }

    const onClickPet = () =>
    {
        setOpen(true);
    }



    const SyledCard = styled(Card)(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        height: '100%',
        backgroundColor: (theme.vars || theme).palette.background.paper,
        '&:hover': {
            backgroundColor: 'transparent',
            cursor: 'pointer',
        },
        '&:focus-visible': {
            outline: '3px solid',
            outlineColor: 'hsla(210, 98%, 48%, 0.5)',
            outlineOffset: '2px',
        },
    }));

    const SyledCardContent = styled(CardContent)({
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        padding: 2,
        flexGrow: 1,
        '&:last-child': {
            paddingBottom: 2,
        },
    });

    const StyledTypography = styled(Typography)({
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 2,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    });

    function Author({ authors }: { authors: { name: string; avatar: string }[] }) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 2,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                }}
            >
                <Box
                    sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}
                >
                    <AvatarGroup max={3}>
                        {authors.map((author, index) => (
                            <Avatar
                                key={index}
                                alt={author.name}
                                src={author.avatar}
                                sx={{ width: 24, height: 24 }}
                            />
                        ))}
                    </AvatarGroup>
                    <Typography variant="caption">
                        {authors.map((author) => author.name).join(', ')}
                    </Typography>
                </Box>
                <Typography variant="caption">July 14, 2021</Typography>
            </Box>
        );
    }


    return (
       /* <AuthorizeView>*/
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <AppAppBar currentPage="pets" />
            <Container
                maxWidth="lg"
                component="main"
                sx={{ display: 'flex', flexDirection: 'row', my: 3, gap: 1 }}
            >
                <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                >
                    <div>
                        <Button onClick={handleClickOpen} variant="contained" color="info" endIcon={<AddIcon />}>
                            Add Pet
                        </Button>
                    </div>
                </Box>
                <AddPet open={open} setOpen={setOpen} handleClose={handleClose} petTypes={petTypes} />
            </Container>
            <Container
                maxWidth="lg"
                component="main"
                sx={{ display: 'flex', flexDirection: 'column', my: 3, gap: 4 }}
            >
                <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}
                >
                    <Grid container spacing={2} columns={12}>

                        {loadingPets && (
                            <CircularProgress />
                        )}  
                        {pets?.length > 0 && (pets?.map(m =>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <SyledCard
                                    variant="outlined"
                                    sx={{ height: '100%' }}
                                >
                                    <Carousel cards={getPetSlides(m.petPhotos)}/>
                                    <SyledCardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {m.name}
                                        </Typography>
                                        <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                                            {m.petType?.type}
                                        </StyledTypography>
                                    </SyledCardContent>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            bgcolor: 'background.paper',
                                            borderRadius: 1,
                                            mx: 'auto'
                                        }}
                                    >
                                        {m.breedTypes?.length > 0 && (m.breedTypes?.map(b =>
                                            <Chip sx={{
                                                m: 1,
                                            }} label={b.name} />
                                        ))}
                                    </Box>
                                    <SyledCardContent>
                                        <Fab color="primary" sx={{ alignSelf: 'center' }} onClick={onClickPet} aria-label="add">
                                            <EditIcon />
                                        </Fab>
                                    </SyledCardContent>
                                   {/* <Author authors={m.name} />*/}
                                </SyledCard>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
            </AppTheme>
       /* </AuthorizeView>*/
    );
}
