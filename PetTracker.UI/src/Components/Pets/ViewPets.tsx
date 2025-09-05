import React, { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import AddPet from './AddPet.tsx';
import AddExistingPet from './AddExistingPet.tsx';
import ViewPet from './ViewPet.tsx';
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
                <>
                    {(!loadingPets) && (
                        <>
                            <Box sx={{ display: 'flex', gap: 2, mb: 1, mt: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Button 
                                    onClick={handleClickOpen} 
                                    variant="contained" 
                                    color="info" 
                                    endIcon={<AddIcon />}
                                    size="medium"
                                    sx={{ 
                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                    }}
                                >
                                    Add New Pet
                                </Button>
                                {props.ownerId != null && (
                                    <Button 
                                        onClick={handleClickOpenAddExisting} 
                                        variant="outlined" 
                                        color="info" 
                                        endIcon={<AddIcon />}
                                        size="medium"
                                        sx={{ 
                                            fontSize: { xs: '0.875rem', sm: '1rem' }
                                        }}
                                    >
                                        Add/Move Existing Pets
                                    </Button>
                                )}
                            </Box>
                            <Grid container spacing={2} sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'row',
                            }}>
                            <AddPet open={open} handleClose={handleClose} petTypes={petTypes} reloadPets={reloadPets} setReloadPets={setReloadPets} ownerId={props.ownerId} />
                            <AddExistingPet open={openAddExistingPet} handleClose={handleCloseAddExisting} reloadPets={reloadPets} setReloadPets={setReloadPets} ownerId={props.ownerId} />
                            {pets?.filter(f => (
                                (searchTerm ?? '') == '' ||
                                ((f.name).toLowerCase().indexOf(searchTerm?.toLowerCase()) > -1) ||
                                (f.breedTypes.some(s => s.name.toLowerCase().indexOf(searchTerm?.toLowerCase()) > -1))
                            )).map(m =>
                                                                <Grid 
                                    key={m.id}
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={3}
                                    xl={2}
                                    sx={{ 
                                        height: { xs: '380px', sm: '360px', md: '400px' },
                                        minHeight: '380px'
                                    }}
                                >
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <Carousel cards={getPetSlides(m.petPhotos, m.petType?.type)} />
                                        <SyledCardContent sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            p: { xs: 0.25, sm: 0.5 },
                                            flexGrow: 0,
                                        }}>
                                            <Typography 
                                                gutterBottom 
                                                variant="h6" 
                                                component="div"
                                                sx={{
                                                    fontSize: { xs: '0.9rem', sm: '1.1rem' },
                                                    textAlign: 'center',
                                                    wordBreak: 'break-word',
                                                    mb: { xs: 0.125, sm: 0.25 },
                                                }}
                                            >
                                                {m.name}
                                            </Typography>
                                        </SyledCardContent>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                flexWrap: 'wrap',
                                                bgcolor: 'background.paper',
                                                borderRadius: 1,
                                                mx: 'auto',
                                                p: { xs: 0.125, sm: 0.25 },
                                                justifyContent: 'center',
                                                mb: { xs: 0.125, sm: 0.25 },
                                            }}
                                        >
                                            {m.breedTypes?.length > 0 && (m.breedTypes?.map((b, index) =>
                                                <Chip 
                                                    key={index}
                                                    sx={{
                                                        m: { xs: 0.0625, sm: 0.125 },
                                                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                                        height: { xs: '18px', sm: '24px' },
                                                    }} 
                                                    label={b.name} 
                                                />
                                            ))}
                                        </Box>
                                        <SyledCardContent sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            my: { xs: 0.125, sm: 0.25 },
                                            p: { xs: 0.25, sm: 0.5 },
                                        }}>
                                            <Fab 
                                                size="small" 
                                                color="primary" 
                                                sx={{ 
                                                    alignSelf: 'center', 
                                                    m: { xs: 0.25, sm: 0.5 },
                                                    width: { xs: '36px', sm: '44px' },
                                                    height: { xs: '36px', sm: '44px' },
                                                }} 
                                                onClick={() => handleOpenPet(m)} 
                                                aria-label="edit"
                                            >
                                                <EditIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                                            </Fab>
                                            {props.ownerId != null && (
                                                <Fab 
                                                    size="small" 
                                                    color="warning" 
                                                    sx={{ 
                                                        alignSelf: 'center', 
                                                        m: { xs: 0.25, sm: 0.5 },
                                                        width: { xs: '36px', sm: '44px' },
                                                        height: { xs: '36px', sm: '44px' },
                                                    }} 
                                                    onClick={() => handleConfirmOpenRemove(m)} 
                                                    aria-label="remove"
                                                >
                                                    <RemoveCircleIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                                                </Fab>
                                            )}
                                            {props.ownerId == null && (
                                                <Fab 
                                                    size="small" 
                                                    color="error" 
                                                    sx={{ 
                                                        alignSelf: 'center', 
                                                        m: { xs: 0.25, sm: 0.5 },
                                                        width: { xs: '36px', sm: '44px' },
                                                        height: { xs: '36px', sm: '44px' },
                                                    }} 
                                                    onClick={() => handleConfirmOpenDelete(m)} 
                                                    aria-label="delete"
                                                >
                                                    <RemoveCircleIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                                                </Fab>
                                            )}
                                        </SyledCardContent>
                                    </Card>
                                </Grid>
                            )}
                            </Grid>
                        </>
                    )}
                    <ViewPet open={openViewPet} viewPet={selectedPet} handleClose={handleClosePet} petTypes={petTypes} reloadPets={reloadPets} setReloadPets={setReloadPets} />
                    <ConfirmDialog open={openConfirmRemove} handleClose={handleConfirmCloseRemove} handleConfirm={handleConfirmRemovePet} confirmTitle={"Remove Pet"} confirmDescription={"Remove pet from this owner?"} confirmbuttonText="Yes" />
                    <ConfirmDialog open={openConfirmDelete} handleClose={handleConfirmCloseDelete} handleConfirm={handleConfirmDeletePet} confirmTitle={"Delete Pet"} confirmDescription={"Are you sure you want to delete this pet?"} confirmbuttonText="Yes" />
                </>
            )}
        </>
    );
}
