import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import AppTheme from '../Theme/AppTheme';
import AppAppBar from '../Components/AppAppBar';
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import useOwnersStore from '../Stores/OwnersStore';
import Carousel from '../Components/Carousel/Carousel';
import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import AddOwner from '../Components/AddOwner';
import ViewOwner from '../Components/ViewOwner';
import { getImageUrlFromBlob } from '../Util/CommonFunctions'

const SyledCardContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    //gap: 4,
    //padding: 4,
    // flexGrow: 1,
    //'&:last-child': {
    //    paddingBottom: 4,
    //},
});

const StyledTypography = styled(Typography)({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
});

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

    return (
        <AuthorizeView>
            <AppTheme {...props}>
                <CssBaseline enableColorScheme />
                <AppAppBar currentPage="owners" />
                {loadingOwners && (
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
                        flexDirection: 'column', my: 2, gap: 4,

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
                                sx={{ height: '365px' }}
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
                            {owners?.map(m =>
                                <Grid
                                    size={owners.length < 3 ? "grow" : 4}
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
            </AppTheme>
        </AuthorizeView>

    );
}
