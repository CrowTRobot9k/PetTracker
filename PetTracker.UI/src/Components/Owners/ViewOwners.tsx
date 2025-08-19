import React, { useState, useEffect, useMemo } from 'react';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
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
    const states = useOwnersStore((state) => state.states);
    const { searchTerm } = useSearch();

    const {
        owners,
        loadingOwners,
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

    const getOwnerSlides = (images) =>
    {
        if (!images || images.length === 0) {
            return [<img key="no-image" src="/Owner Placeholder.png"/>];
        }

        return Array.from(images.map((f, index) => (
            <img key={`${index}_${f.fileName}`} src={getImageUrlFromBlob(f.fileDataBase64)} />
        )))
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
                        <Container
                            maxWidth="xl"
                            component="main"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column', my: 2, gap: 2,

                            }}
                        >
                            {(!loadingOwners) && (
                                <Grid container spacing={2} columns={12} sx={{
                                    //height: '400px',
                                    //width: '100%',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    //alignItems: 'center',
                                    //justifyContent: 'center',
                                }}>
                                    <Grid
                                        size={owners.length < 3 ? "grow" : 4}
                                        sx={{ height: '350px' }}
                                    >
                                        <Card
                                            //variant="outlined"
                                            sx={{
                                                height: '100%',
                                                //width: '100%',
                                                display: 'flex',
                                                //flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Button onClick={handleClickOpen} variant="contained" color="info" endIcon={<AddIcon />}>
                                                Add Owner
                                            </Button>
                                        </Card>
                                    </Grid>
                                    <AddOwner open={open} handleClose={handleClose} ownerStates={states} reloadOwners={reloadOwners} setReloadOwners={setReloadOwners} />
                            {owners?.filter(f => (
                                (searchTerm ?? '') == '' ||
                                ((f.firstName + " " + f.lastName).toLowerCase().indexOf(searchTerm?.toLowerCase()) > -1)
                            )).map(m =>
                                        <Grid
                                            size={owners.length < 3 ? "grow" : 4}
                                            sx={{ height: '350px' }}
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
                                                <Carousel cards={getOwnerSlides(m.ownerPhotos)} />
                                                <SyledCardContent>
                                                    <Typography gutterBottom variant="h6" component="div">
                                                        {m.firstName} {m.lastName}
                                                    </Typography>
                                                    <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                                                        {m.Address}
                                                    </StyledTypography>
                                                    <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                                                        {m.city} {m.state} {m.zipCode}
                                                    </StyledTypography>
                                                </SyledCardContent>
                                                <SyledCardContent sx={{ my: 0 }}>
                                                    <Fab size="small" color="primary" sx={{ alignSelf: 'center' }} onClick={() => handleOpenOwner(m)} aria-label="add">
                                                        <EditIcon />
                                                    </Fab>
                                                </SyledCardContent>
                                            </Card>
                                        </Grid>
                                    )}
                                </Grid>
                            )}
                            <ViewOwner open={openViewOwner} viewOwner={selectedOwner} handleClose={handleCloseOwner} ownerStates={states} reloadOwners={reloadOwners} setReloadOwners={setReloadOwners} />
                        </Container>
                    )}
        </>
    );
}
