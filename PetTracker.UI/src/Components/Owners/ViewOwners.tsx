import React, { useState, useEffect, useMemo } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import useOwnersStore from '../../Stores/OwnersStore.tsx';
import Carousel from '../Carousel/Carousel.tsx';
import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import AddOwner from './AddOwner.tsx';
import ViewOwner from './ViewOwner.tsx';
import { getImageUrlFromBlob } from '../../Util/CommonFunctions.tsx'
import LoadingPlaceholder from '../LoadingPlaceholder.tsx';
import ErrorDisplay from '../ErrorDisplay.tsx';
import { useSearch } from '../SearchProvider.tsx';

const SyledCardContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
});

const StyledTypography = styled(Typography)({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
});

export default function ViewOwners() {
    const getOwners = useOwnersStore((state) => state.getOwners);
    const getStates = useOwnersStore((state) => state.getStates);
    const getOwnerPhotos = useOwnersStore((state) => state.getOwnerPhotos);
    const getOwnerPhotosSync = useOwnersStore((state) => state.getOwnerPhotosSync);
    const states = useOwnersStore((state) => state.states);
    const { searchTerm } = useSearch();

    const {
        owners,
        loadingOwners,
        loadingOwnerPhotos,
        ownerPhotos,
        errorMessage,
        showErrors
    } = useOwnersStore();
    const [open, setOpen] = React.useState(false);
    const [openViewOwner, setOpenViewOwner] = React.useState(false);
    const [selectedOwner, setSelectedOwner] = useState<Owner>(
        {
        });
    const [reloadOwners, setReloadOwners] = React.useState(false);
    useEffect(() => {
        getOwners();
    }, [reloadOwners]);

    useMemo(() => {
        getStates();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getOwnerSlides = (ownerId) =>
    {
        const photos = getOwnerPhotosSync(ownerId);
        
        if (!photos || photos.length === 0) {
            return [<img key="no-image" src="/Owner Placeholder.png"/>];
        }

        return Array.from(photos.map((f, index) => (
            <img key={`${index}_${f.fileName}`} src={getImageUrlFromBlob(f.fileDataBase64)} />
        )))
    }

    const loadOwnerPhotos = async (ownerId) => {
        const existingPhotos = getOwnerPhotosSync(ownerId);
        if (!existingPhotos || existingPhotos.length === 0) {
            await getOwnerPhotos(ownerId);
        }
    }

    const handleOpenOwner = (owner) => {
        const copiedOwner = JSON.parse(JSON.stringify(owner));
        setSelectedOwner(copiedOwner);
        setOpenViewOwner(true);
    }

    const handleCloseOwner = () => {
        setOpenViewOwner(false);
    };

    return (       
        <>
            {showErrors && (
                        <ErrorDisplay error={errorMessage} height={700} />
                    )}
            {loadingOwners && (
                        <LoadingPlaceholder />
                    )}
            {!(showErrors) && (
                        <>
                            {(!loadingOwners) && (
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
                                            Add Owner
                                        </Button>
                                    </Box>
                                    <Grid container spacing={2} sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                    }}>
                                    <AddOwner open={open} handleClose={handleClose} ownerStates={states} reloadOwners={reloadOwners} setReloadOwners={setReloadOwners} />
                            {owners?.filter(f => (
                                (searchTerm ?? '') == '' ||
                                ((f.firstName + " " + f.lastName).toLowerCase().indexOf(searchTerm?.toLowerCase()) > -1)
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
                                                <Carousel 
                                                    cards={getOwnerSlides(m.id)} 
                                                    onVisible={() => loadOwnerPhotos(m.id)}
                                                />
                                                <SyledCardContent sx={{
                                                    p: { xs: 0.25, sm: 0.5 },
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
                                                            mb: { xs: 0.125, sm: 0.25 },
                                                        }}
                                                    >
                                                        {m.firstName} {m.lastName}
                                                    </Typography>
                                                    <StyledTypography 
                                                        variant="body2" 
                                                        color="text.secondary" 
                                                        gutterBottom
                                                        sx={{
                                                            fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                                            textAlign: 'center',
                                                            mb: { xs: 0.125, sm: 0.25 },
                                                        }}
                                                    >
                                                        {m.Address}
                                                    </StyledTypography>
                                                    <StyledTypography 
                                                        variant="body2" 
                                                        color="text.secondary" 
                                                        gutterBottom
                                                        sx={{
                                                            fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                                            textAlign: 'center',
                                                            mb: { xs: 0.125, sm: 0.25 },
                                                        }}
                                                    >
                                                        {m.city} {m.state} {m.zipCode}
                                                    </StyledTypography>
                                                </SyledCardContent>
                                                <SyledCardContent sx={{ 
                                                    my: { xs: 0.125, sm: 0 },
                                                    p: { xs: 0.25, sm: 0.5 },
                                                }}>
                                                    <Fab 
                                                        size="small" 
                                                        color="primary" 
                                                        sx={{ 
                                                            alignSelf: 'center',
                                                            width: { xs: '36px', sm: '44px' },
                                                            height: { xs: '36px', sm: '44px' },
                                                        }} 
                                                        onClick={() => handleOpenOwner(m)} 
                                                        aria-label="edit"
                                                    >
                                                        <EditIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                                                    </Fab>
                                                </SyledCardContent>
                                            </Card>
                                        </Grid>
                                    )}
                                    </Grid>
                                </>
                            )}
                            <ViewOwner open={openViewOwner} viewOwner={selectedOwner} handleClose={handleCloseOwner} ownerStates={states} reloadOwners={reloadOwners} setReloadOwners={setReloadOwners} />
                        </>
                    )}
        </>
    );
}
