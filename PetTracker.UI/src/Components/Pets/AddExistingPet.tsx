import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import Carousel from '../Carousel/Carousel';
import useExistingPetsStore from '../../Stores/ExistingPetStore';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { getImageUrlFromBlob } from '../../Util/CommonFunctions'
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import DialogContent from '@mui/material/DialogContent';
import ErrorDisplay from '../ErrorDisplay';

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
    const [submitSuccessMessage, setSuccessMessage] = useState('');
    const [submitErrorMessage, setSubmitErrorMessage] = useState('');
    const getExistingPets = useExistingPetsStore((state) => state.getExistingPets);
    const { existingPets, loadingExistingPets } = useExistingPetsStore();
    const [searchValue, setSearchValue] = useState('');
    const [ selectedPets, setSelectedPets ] = useState({});

     useEffect(() => {
         getExistingPets(ownerId);
     }, [ownerId]);

    const getPetSlides = (images, petType: string) =>
    {
        const placeholderDict =
        {
            Cat: "/Cat Placeholder.png",
            Dog: "/Dog Placeholder.png",
        }
        if (!images || images.length === 0) {
            return [<img src={placeholderDict[petType]} />]
        }

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

    const AddExistingPetsToOwner = async () => {
        setSuccessMessage("");
        setSubmitErrorMessage("");

        const selectedPetIds = Object.keys(selectedPets).filter(key => selectedPets[key] === true).map(Number);

        const addExistingPetsModel = {
            OwnerId: ownerId,
            PetIds: selectedPetIds,
        };

        try {
            const response = await fetch("/api/Owner/AddExistingPetsToOwner", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addExistingPetsModel)
            });

            if (!response.ok) {
                throw new Error(await response.json());
            }

            if (response.status == 200) {
                setReloadPets(!reloadPets);
                setSelectedPets({
                });
                setSuccessMessage("Pets Added")
                handleClose();
            }
        } catch (e) {
            setSubmitErrorMessage(e.message);
        } 
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
                {submitErrorMessage?.length > 0 && (
                    <ErrorDisplay error={submitErrorMessage} />
                )}
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
                        <Grid container spacing={2} sx={{
                            display: 'flex',
                            flexDirection: 'row',
                        }}>
                            {existingPets?.filter(f => ((searchValue ?? '') == '' || (f.name.toLowerCase().indexOf(searchValue?.toLowerCase())>-1))).map(m =>
                                <Grid 
                                    key={m.id}
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={3}
                                    xl={2}
                                    sx={{ 
                                        height: { xs: '320px', sm: '360px', md: '400px' },
                                        minHeight: '320px'
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
                                            p: { xs: 0.5, sm: 1 },
                                            flexGrow: 1,
                                        }}>
                                            <Typography 
                                                gutterBottom 
                                                variant="h6" 
                                                component="div"
                                                sx={{
                                                    fontSize: { xs: '0.9rem', sm: '1.1rem' },
                                                    textAlign: 'center',
                                                    wordBreak: 'break-word',
                                                    mb: { xs: 0.5, sm: 1 },
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
                                                p: { xs: 0.25, sm: 0.5 },
                                                justifyContent: 'center',
                                                mb: { xs: 0.5, sm: 1 },
                                            }}
                                        >
                                            {m.breedTypes?.length > 0 && (m.breedTypes?.map((b, index) =>
                                                <Chip 
                                                    key={index}
                                                    sx={{
                                                        m: { xs: 0.125, sm: 0.25 },
                                                        fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                                        height: { xs: '20px', sm: '28px' },
                                                    }} 
                                                    label={b.name} 
                                                />
                                            ))}
                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                bgcolor: 'background.paper',
                                                borderRadius: 1,
                                                mx: 'auto',
                                                p: { xs: 0.25, sm: 0.5 },
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <FormControlLabel 
                                                control={
                                                    <Checkbox
                                                        sx={{ 
                                                            '& .MuiSvgIcon-root': { 
                                                                fontSize: { xs: 24, sm: 28 } 
                                                            } 
                                                        }}
                                                        checked={selectedPets[m.id]||false}
                                                        onChange={handlePetCheckboxChange}
                                                        name={m.id}
                                                    />
                                                }
                                                label={
                                                    <Typography sx={{
                                                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                                    }}>
                                                        Add Pet
                                                    </Typography>
                                                }
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