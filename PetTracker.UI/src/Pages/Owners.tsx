import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AppTheme from '../Theme/AppTheme';
import AppAppBar from '../Components/AppAppBar';
import AddIcon from '@mui/icons-material/Add';
import AddOwner from '../Components/AddOwner';
import ViewOwner from '../Components/ViewOwner';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";
import Carousel from '../Components/Carousel/Carousel';
import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import useOwnersStore from '../Stores/OwnersStore';
import { Owner } from '../Types/SharedTypes.ts';


export default function Owners(props: { disableCustomTheme?: boolean }) {
    const getOwners = useOwnersStore((state) => state.getOwners);
    const getStates = useOwnersStore((state) => state.getStates);
    const states = useOwnersStore((state) => state.states);
    const { owners, loadingOwners } = useOwnersStore();
    const [open, setOpen] = React.useState(false);
    const [openViewOwner, setOpenViewOwner] = React.useState(false);
    const [selectedOwner, setSelectedOwner] = useState<Owner>(
        {
        });
    const [reloadOwners, setReloadOwners] = React.useState(false);


    useEffect(() => {
        getOwners();
    }, [reloadOwners]);

    useEffect(() => {
        getStates();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getImageUrlFromBlob = (base64String) => {
        return `data:image/png;base64,${base64String}`;
    }

    const getOwnerSlides = (images) => {
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
            <AppAppBar currentPage="owners" />
            <Container
                maxWidth="xl"
                component="main"
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    my: 3,
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
                                Add Owner
                            </Button>
                        </div>
                    </Box>
                    <AddOwner open={open} handleClose={handleClose} ownerStates={states} reloadOwners={reloadOwners} setReloadOwners={setReloadOwners} />
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
                    {loadingOwners && (
                        <CircularProgress />
                )}
                {(!loadingOwners || loadingOwners) && (
                    <Grid container spacing={2} size="auto" sx={{
                        //height: '100%',
                        //width:'100%',
                        //display: 'flex',
                        //alignItems: 'center',
                        //justifyContent: 'center',

                    }}>
                            {owners?.map(m =>
                                <Grid size={ 4} >
                                        <SyledCard
                                        variant="outlined"
                                        sx={{ height: '100%' }}
                                        //className="full-width"
                                        >
                                            <Carousel cards={getOwnerSlides(m.ownerPhotos)} />
                                            <SyledCardContent>
                                                <Typography gutterBottom variant="h6" component="div">
                                                    {m.firstName} { m.lastName}
                                                </Typography>
                                                <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                                                    {m.Address}
                                                </StyledTypography>
                                                <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                                                    {m.city} {m.state} {m.zipCode}
                                                </StyledTypography>
                                            </SyledCardContent>
                                            <SyledCardContent sx={{ my: 1 }}>
                                                <Fab color="primary" sx={{ alignSelf: 'center' }} onClick={() => handleOpenOwner(m)} aria-label="add">
                                                    <EditIcon />
                                                </Fab>
                                            </SyledCardContent>
                                        </SyledCard>
                                </Grid>
                            )}
                        </Grid>
                )}
                <ViewOwner open={openViewOwner} viewOwner={selectedOwner} handleClose={handleCloseOwner} ownerStates={states} reloadOwners={reloadOwners} setReloadOwners={setReloadOwners} />
            </Container>
        </AppTheme>
        /* </AuthorizeView>*/
    );
}
