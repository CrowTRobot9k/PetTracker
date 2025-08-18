import React, { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import AddPet from './AddPet.tsx';
import AddExistingPet from './AddExistingPet.tsx';
import ViewPet from './ViewPet.tsx';
import Container from '@mui/material/Container';
import LoadingPlaceholder from '../LoadingPlaceholder.tsx';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import Carousel from '../Carousel/Carousel.tsx';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Chip from '@mui/material/Chip';
import Fab from '@mui/material/Fab';
import { getImageUrlFromBlob } from '../../Util/CommonFunctions.tsx'
import usePetsStore from '../../Stores/PetsStore.tsx';
import ConfirmDialog from '../ConfirmDialog.tsx';
import ErrorDisplay from '../ErrorDisplay.tsx';
import { useSearch } from '../SearchProvider.tsx';

import { Pet } from '../../Types/SharedTypes.tsx';

export default function ViewPets(props: { ownerId?: number }) {
    const getPets = usePetsStore((state) => state.getPets);
    const getPetTypes = usePetsStore((state) => state.getPetTypes);
    const petTypes = usePetsStore((state) => state.petTypes);
    const {
        pets,
        loadingPets,
        errorMessage,
        showErrors
    } = usePetsStore();
    const [open, setOpen] = React.useState(false);
    const [openAddExistingPet, setOpenAddExistingPet] = React.useState(false);
    const [openViewPet, setOpenViewPet] = React.useState(false);
    const [selectedPet, setSelectedPet] = useState<Pet>(
        {
        });
    const [removePetId, setRemovePetId] = useState<number>(0);
    const [deletePetId, setDeletePetId] = useState<number>(0);

    const [reloadPets, setReloadPets] = React.useState(false);
    const [openConfirmRemove, setOpenConfirmRemove] = React.useState(false);
    const [openConfirmDelete, setOpenConfirmDelete] = React.useState(false);

    const [submitErrorMessage, setSubmitErrorMessage] = React.useState('');
    const { searchTerm } = useSearch();



    useEffect(() => {
        getPets(props.ownerId);
    }, [reloadPets, props.ownerId]);

    useMemo(() => {
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

    const getPetSlides = (images, petType:string) =>
    {
        const placeholderDict =
        {
            Cat: "../src/assets/Cat Placeholder.png",
            Dog: "../src/assets/Dog Placeholder.png",
        }
        if (!images || images.length === 0) {
            return [<img src={placeholderDict[petType]} />]
        }

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

    const handleConfirmOpenRemove = (pet) => {
        setRemovePetId(pet.id);
        setOpenConfirmRemove(true);
    };

    const handleConfirmOpenDelete = (pet) => {
        setDeletePetId(pet.id);
        setOpenConfirmDelete(true);
    };

    const handleConfirmCloseRemove = () => {
        setOpenConfirmRemove(false);
    };
    const handleConfirmCloseDelete = () => {
        setOpenConfirmDelete(false);
    };

    const handleConfirmRemovePet = async () => {

        setSubmitErrorMessage("");

        const removeExistingPetsModel = {
            OwnerId: props.ownerId,
            PetIds: [removePetId],
        };

        try {
            const response = await fetch("/api/Owner/RemoveExistingPetFromOwner", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(removeExistingPetsModel)
            });

            setOpenConfirmRemove(false);

            if (!response.ok) {
                throw new Error(await response.json());
            }

            if (response.status == 200) {
                setReloadPets(true);
            }
        } catch (e) {
            setSubmitErrorMessage(e.message);
        } 
    };

    const handleConfirmDeletePet = async () => {

        setSubmitErrorMessage("");

        try {
            const response = await fetch(`/api/Pet/DeletePet`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(deletePetId)
            });

            setOpenConfirmDelete(false);

            if (!response.ok) {
                throw new Error(await response.json());
            }

            if (response.status == 200) {
                setReloadPets(true);
            }
        } catch (e) {
            setSubmitErrorMessage(e.message);
        }
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
            {showErrors && (
                <ErrorDisplay error={errorMessage} height={700} />
            )}
            {submitErrorMessage?.length > 0 && (
                <ErrorDisplay error={submitErrorMessage} />
            )}
            {loadingPets && (
                <LoadingPlaceholder />
            )}
            {!(showErrors) && (
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
                            height: '100%',
                            //width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            //alignItems: 'center',
                            //justifyContent: 'center',
                        }}>
                            <Grid
                                size={pets.length < 3 ? "grow" : 4
                                }
                                sx={{ height: '360px' }}
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
                                        Add/Move Existing Pets
                                    </Button>)}
                                </Card>
                            </Grid>
                            <AddPet open={open} handleClose={handleClose} petTypes={petTypes} reloadPets={reloadPets} setReloadPets={setReloadPets} ownerId={props.ownerId} />
                            <AddExistingPet open={openAddExistingPet} handleClose={handleCloseAddExisting} reloadPets={reloadPets} setReloadPets={setReloadPets} ownerId={props.ownerId} />
                            {pets?.filter(f => (
                                (searchTerm ?? '') == '' ||
                                ((f.name).toLowerCase().indexOf(searchTerm?.toLowerCase()) > -1) ||
                                (f.breedTypes.some(s => s.name.toLowerCase().indexOf(searchTerm?.toLowerCase()) > -1))
                            )).map(m =>
                                <Grid size={pets.length < 3 ? "grow" : 4}
                                    sx={{ height: '360px' }}
                                >
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            height: '100%',
                                            //alignItems: 'center',
                                            //justifyContent: 'center',
                                        }}
                                    >
                                        <Carousel cards={getPetSlides(m.petPhotos, m.petType?.type)} />
                                        <SyledCardContent sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
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
                                                <Fab size="small" color="warning" sx={{ alignSelf: 'center', m: 1, }} onClick={() => handleConfirmOpenRemove(m)} aria-label="remove">
                                                    <RemoveCircleIcon />
                                                </Fab>
                                            )}
                                            {props.ownerId == null && (
                                                <Fab size="small" color="error" sx={{ alignSelf: 'center', m: 1, }} onClick={() => handleConfirmOpenDelete(m)} aria-label="delete">
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
                    <ConfirmDialog open={openConfirmRemove} handleClose={handleConfirmCloseRemove} handleConfirm={handleConfirmRemovePet} confirmTitle={"Remove Pet"} confirmDescription={"Remove pet from this owner?"} confirmbuttonText="Yes" />
                    <ConfirmDialog open={openConfirmDelete} handleClose={handleConfirmCloseDelete} handleConfirm={handleConfirmDeletePet} confirmTitle={"Delete Pet"} confirmDescription={"Are you sure you want to delete this pet?"} confirmbuttonText="Yes" />
                </Container>
            )}
        </>
    );
}
