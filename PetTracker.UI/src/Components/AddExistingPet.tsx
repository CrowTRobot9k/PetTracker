import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import Carousel from '../Components/Carousel/Carousel';
import useExistingPetsStore from '../Stores/ExistingPetStore';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { getImageUrlFromBlob } from '../Util/CommonFunctions'
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import DialogContent from '@mui/material/DialogContent';

interface AddExistingPetProps {
    open: boolean;
    handleClose: () => void;
    reloadPets: boolean;
    setReloadPets: React.Dispatch<React.SetStateAction<boolean>>;
    ownerId?: number;
}

const SyledCardContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    padding: 2,
    flexGrow: 1,

});

export default function AddExistingPet({ open, handleClose, reloadPets, setReloadPets, ownerId }: AddExistingPetProps) {
    const [submitSuccessMessage, setSuccessMessage] = React.useState('');
    const [submitErrorMessage, setErrorMessage] = React.useState('');
    const getExistingPets = useExistingPetsStore((state) => state.getExistingPets);
    const { existingPets, loadingExistingPets } = useExistingPetsStore();
    const [searchValue, setSearchValue] = React.useState('');
    const [ selectedPets, setSelectedPets ] = React.useState({});

     useEffect(() => {
         getExistingPets(ownerId);
     }, [ownerId]);

    const getPetSlides = (images) => {
        return Array.from(images.map((f, index) => (
            <img key={`${index}_${f.fileName}`} src={getImageUrlFromBlob(f.fileDataBase64)} />
        )))
    }

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handlePetCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setSelectedPets(prevState => ({
            ...prevState,
            [name]: checked,
        }));
    };

    const AddExistingPetsToOwner = () => {
        setSuccessMessage("");
        setErrorMessage("");

        const selectedPetIds = Object.keys(selectedPets).filter(key => selectedPets[key] === true).map(Number);

        const addExistingPetsModel = {
            OwnerId: ownerId,
            PetIds: selectedPetIds,
        };

        fetch("/api/Owner/AddExistingPetsToOwner", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(addExistingPetsModel)
        }).then((data) => {
            if (data.ok) {
                setReloadPets(!reloadPets);
                setSelectedPets({
                });
                setSuccessMessage("Pets Added")
                handleClose();
            }
            else {
                setErrorMessage("Error Adding Pets");
            }
        }).catch((error) => {
            console.log(error);
            setErrorMessage("Error Adding Pets");
        });
    }

    return (
        <Dialog
          open={ open }
          onClose = { handleClose }
          fullWidth
          maxWidth = "lg"
        >
            <DialogContent sx={{
                height: '100%',
                my: 0,
                p: 0
            }}>
                <Container
                    maxWidth="xl"
                    component="main"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        my: 2,
                        gap: 0,

                    }}
                >
                    <OutlinedInput
                        autoFocus
                        margin="dense"
                        placeholder="Search"
                        type="text"
                        value={searchValue}
                        onChange={handleSearchChange}
                    />
                </Container>
                {loadingExistingPets && (
                    <Container
                        maxWidth="xl"
                        component="main"
                        sx={{
                            height:'100%',
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
                        my: 0,
                        gap: 2,

                    }}
                >
                    {(!loadingExistingPets) && (
                        <Grid container spacing={2} columns={12} sx={{
                            //height: '400px',
                            //width: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                            //alignItems: 'center',
                            //justifyContent: 'center',
                        }}>
                            {existingPets?.filter(f => ((searchValue ?? '') == '' || (f.name.toLowerCase().indexOf(searchValue?.toLowerCase())>-1))).map(m =>
                                <Grid size={existingPets.length < 3 ? "grow" : 4}
                                    sx={{ height: '365px' }}
                                >
                                    <Card
                                        variant="outlined"
                                        sx={{
                                            height: '100%',
                                            ////width: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Carousel cards={getPetSlides(m.petPhotos)} />
                                        <SyledCardContent>
                                            <Typography gutterBottom variant="h6" component="div">
                                                {m.name}
                                            </Typography>
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
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                bgcolor: 'background.paper',
                                                borderRadius: 1,
                                                mx: 'auto'
                                            }}
                                        >
                                            <FormControlLabel control={<Checkbox
                                                sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                                checked={selectedPets[m.id]||false}
                                                onChange={handlePetCheckboxChange}
                                                name={m.id}
                                            />}
                                                label="Add Pet"
                                            />

                                        </Box>
                                    </Card>
                                </Grid>
                            )}
                        </Grid>
                    )}
                </Container>
                <DialogActions sx={{ pb: 3, px: 3 }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" color="info" onClick={AddExistingPetsToOwner }>Save Pets</Button>
                    </DialogActions>
            </DialogContent>
        </Dialog>
     );
}