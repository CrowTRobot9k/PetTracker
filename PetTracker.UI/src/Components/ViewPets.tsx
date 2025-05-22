import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import AddPet from '../Components/AddPet';
import AddExistingPet from '../Components/AddExistingPet';
import ViewPet from '../Components/ViewPet.tsx';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import Carousel from '../Components/Carousel/Carousel';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Chip from '@mui/material/Chip';
import Fab from '@mui/material/Fab';
import { getImageUrlFromBlob } from '../Util/CommonFunctions'
import usePetsStore from '../Stores/PetsStore.tsx';
import ConfirmDialog from './ConfirmDialog.tsx';

import { Pet } from '../Types/SharedTypes.tsx';

export default function ViewPets(props: { ownerId?: number }) {
    const getPets = usePetsStore((state) => state.getPets);
    const getPetTypes = usePetsStore((state) => state.getPetTypes);
    const petTypes = usePetsStore((state) => state.petTypes);
    const { pets, loadingPets } = usePetsStore();
    const [open, setOpen] = React.useState(false);
    const [openAddExistingPet, setOpenAddExistingPet] = React.useState(false);
    const [openViewPet, setOpenViewPet] = React.useState(false);
    const [selectedPet, setSelectedPet] = useState<Pet>(
        {
        });
    const [removePetId, setRemovePetId] = useState<number>(0);
    const [reloadPets, setReloadPets] = React.useState(false);
    const [openConfirm, setOpenConfirm] = React.useState(false);



    useEffect(() => {
        getPets(props.ownerId);
    }, [reloadPets, props.ownerId]);

    useEffect(() => {
        getPetTypes();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpenAddExisting = () => {
        setOpenAddExistingPet(true);
    };

    const handleCloseAddExisting = () => {
        setOpenAddExistingPet(false);
    };

    const getPetSlides = (images) => {
        return Array.from(images.map((f, index) => (
            <img key={`${index}_${f.fileName}`} src={getImageUrlFromBlob(f.fileDataBase64)} />
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

    const handleConfirmOpen = (pet) => {
        setRemovePetId(pet.id);
        setOpenConfirm(true);
    };

    const handleConfirmClose = () => {
        setOpenConfirm(false);
    };

    const handleConfirmRemovePet = () => {

        const removeExistingPetsModel = {
            OwnerId: props.ownerId,
            PetIds: [removePetId],
        };

        fetch("/api/Owner/RemoveExistingPetFromOwner", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(removeExistingPetsModel)
        }).then((data) => {
            if (data.ok) {
                setOpenConfirm(false);
                setReloadPets(true);
            }
            else {
                //setErrorMessage("Error Adding Pets");
            }
        }).catch((error) => {
            console.log(error);
            //setErrorMessage("Error Adding Pets");
        });
    };

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

    return (
        <>
            {loadingPets && (
                <Container
                    maxWidth="xl"
                    component="main"
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        my: 2,
                        gap: 4
                    }}
                >
                    <CircularProgress />
                </Container>
            )}
            <Container
                maxWidth="xl"
                component="main"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    my: 2,
                    gap: 4,

                }}
            >
                {(!loadingPets) && (
                    <Grid container spacing={2} columns={12} sx={{
                        //height: '400px',
                        //width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        //alignItems: 'center',
                        //justifyContent: 'center',
                    }}>
                        <Grid
                            size={ pets.length < 3 ? "grow" : 4
                            }
                            sx={{ height: '365px' }}
                        >
                            <Card
                                //variant="outlined"
                                sx={{
                                    height: '100%',
                                    //width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Button onClick={handleClickOpen} variant="contained" color="info" endIcon={<AddIcon />}>
                                    Add New Pet
                                </Button>
                                {props.ownerId != null && (<Button onClick={handleClickOpenAddExisting} variant="contained" color="info" endIcon={<AddIcon />}>
                                    Add Existing Pets
                                </Button>) }
                            </Card>
                        </Grid>
                        <AddPet open={open} handleClose={handleClose} petTypes={petTypes} reloadPets={reloadPets} setReloadPets={setReloadPets} ownerId={props.ownerId} />
                        <AddExistingPet open={openAddExistingPet} handleClose={handleCloseAddExisting} reloadPets={reloadPets} setReloadPets={setReloadPets} ownerId={props.ownerId} />
                        {pets?.map(m =>
                            <Grid size={pets.length < 3 ? "grow" : 4}
                                sx={{ height: '365px' }}
                            >
                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: '100%',
                                        ////width: '100%',
                                        //display: 'flex',
                                        ////flexDirection: 'row',
                                        //alignItems: 'center',
                                        //justifyContent: 'center',
                                    }}
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
                                    <SyledCardContent sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        my: 1
                                    }}>
                                        <Fab size="small" color="primary" sx={{ alignSelf: 'center', m: 1, }} onClick={() => handleOpenPet(m)} aria-label="add">
                                            <EditIcon />
                                        </Fab>
                                        {props.ownerId != null && (
                                            <Fab size="small" color="warning" sx={{ alignSelf: 'center', m: 1, }} onClick={() => handleConfirmOpen(m)} aria-label="add">
                                                <RemoveCircleIcon />
                                            </Fab>
                                        )}
                                    </SyledCardContent>
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                )}
                <ViewPet open={openViewPet} viewPet={selectedPet} handleClose={handleClosePet} petTypes={petTypes} reloadPets={reloadPets} setReloadPets={setReloadPets} />
                <ConfirmDialog open={openConfirm} handleClose={handleConfirmClose} handleConfirm={handleConfirmRemovePet}  confirmTitle={"Remove Pet"} confirmDescription={"Remove pet from this owner?"} confirmbuttonText="Yes" />
            </Container>
        </>
    );
}
