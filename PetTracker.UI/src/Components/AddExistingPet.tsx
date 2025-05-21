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
    '&:last-child': {
        paddingBottom: 2,
    },
});

export default function AddExistingPet({ open, handleClose, reloadPets, setReloadPets, ownerId }: AddExistingPetProps) {
    const [submitSuccessMessage, setSuccessMessage] = React.useState('');
    const [submitErrorMessage, setErrorMessage] = React.useState('');
    const getExistingPets = useExistingPetsStore((state) => state.getExistingPets);
    const { existingPets, loadingExistingPets } = useExistingPetsStore();

     useEffect(() => {
         getExistingPets(ownerId);
     }, [ownerId]);

    const getImageUrlFromBlob = (base64String) => {
        return `data:image/png;base64,${base64String}`;
    }

    const getPetSlides = (images) => {
        return Array.from(images.map((f, index) => (
            <img key={`${index}_${f.fileName}`} src={getImageUrlFromBlob(f.fileDataBase64)} />
        )))
    }

    return (
        <Dialog
          open={ open }
          onClose = { handleClose }
          fullWidth
          maxWidth = "lg"
        >
            {loadingExistingPets && (
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
                {(!loadingExistingPets) && (
                    <Grid container spacing={2} columns={12} sx={{
                        //height: '400px',
                        //width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        //alignItems: 'center',
                        //justifyContent: 'center',
                    }}>
                        {existingPets?.map(m =>
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
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Container>
            <DialogActions sx={{ pb: 3, px: 3 }}>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" color="info" type="submit">Save Pets</Button>
            </DialogActions>
        </Dialog>
     );
}