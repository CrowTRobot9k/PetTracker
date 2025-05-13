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
import ViewPet from '../Components/ViewPet.tsx';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";
import Carousel from '../Components/Carousel/Carousel';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Fab from '@mui/material/Fab';
import usePetsStore from '../Stores/PetsStore.tsx';

import { Pet } from '../Types/SharedTypes.ts';

export default function Pets(props: { disableCustomTheme?: boolean }) {
    const getPets = usePetsStore((state) => state.getPets);
    const getPetTypes = usePetsStore((state) => state.getPetTypes);
    const petTypes = usePetsStore((state) => state.petTypes);
    const { pets, loadingPets } = usePetsStore();
    const [open, setOpen] = React.useState(false);
    const [openViewPet, setOpenViewPet] = React.useState(false);
    const [selectedPet, setSelectedPet] = useState<Pet>(
        {
        });
    const [reloadPets, setReloadPets] = React.useState(false);


    useEffect(() => {
        getPets();
    }, [reloadPets]);

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

    const handleOpenPet = (pet) => {
        const copiedPet = JSON.parse(JSON.stringify(pet));
        setSelectedPet(copiedPet);
        setOpenViewPet(true);
    }

    const handleClosePet = () => {
        setOpenViewPet(false);
    };

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

    return (
       /* <AuthorizeView>*/
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <AppAppBar currentPage="pets" />
            <Container
                maxWidth="xl"
                component="main"
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    my: 1,
                    gap: 1
                }}
            >
                <SyledCard
                    variant="outlined"
                    sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Box sx={{
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        mx: 'auto'
                    }}
                    >
                        <div>
                            <Button onClick={handleClickOpen} variant="contained" color="info" endIcon={<AddIcon />}>
                                Add Pet
                            </Button>
                        </div>
                    </Box>
                    <AddPet open={open} handleClose={handleClose} petTypes={petTypes} />
                </SyledCard>
            </Container>
            <Container
                maxWidth="xl"
                component="main"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    my: 1,
                    gap: 1
                }}
            >

                    {loadingPets && (
                        <CircularProgress />
                    )}
                    {(!loadingPets || loadingPets)&& (
                    <Grid container spacing={2} size={ 12} sx={{
                            //height: '100%',
                            display: 'flex',
                            //alignItems: 'center',
                            //justifyContent: 'center',
                        }}>
                            {pets?.map(m =>
                                <Grid size={ 4}>
                                    <SyledCard
                                        variant="outlined"
                                        sx={{ height: '100%' }}
                                    >
                                        <Carousel cards={getPetSlides(m.petPhotos)} />
                                        <SyledCardContent>
                                            <Typography gutterBottom variant="h6" component="div">
                                                {m.name}
                                            </Typography>
                                            {/*<StyledTypography variant="body2" color="text.secondary" gutterBottom>*/}
                                            {/*    {m.petType?.type}*/}
                                            {/*</StyledTypography>*/}
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
                                        <SyledCardContent sx={{ my: 1 }}>
                                            <Fab color="primary" sx={{ alignSelf: 'center' }} onClick={() => handleOpenPet(m)} aria-label="add">
                                                <EditIcon />
                                            </Fab>
                                        </SyledCardContent>
                                    </SyledCard>
                                </Grid>
                            )}
                        </Grid>
                    )}
                <ViewPet open={openViewPet} viewPet={selectedPet} handleClose={handleClosePet} petTypes={petTypes} reloadPets={reloadPets} setReloadPets={setReloadPets} />
            </Container>
            </AppTheme>
       /* </AuthorizeView>*/
    );
}
