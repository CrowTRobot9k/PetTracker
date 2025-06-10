import React, { useState, useEffect, useMemo } from 'react';
import useUsersStore from '../../Stores/UsersStore.tsx';
import LoadingPlaceholder from '../LoadingPlaceholder.tsx';
import ErrorDisplay from '../ErrorDisplay.tsx';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useSearch } from '../SearchProvider.tsx';
import { getImageUrlFromBlob } from '../../Util/CommonFunctions.tsx'
import Carousel from '../Carousel/Carousel.tsx';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import { styled } from '@mui/material/styles';
import AddUser from './AddUser.tsx';


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

export default function Users() {
    const getUsers = useUsersStore((state) => state.getUsers);
    const getRoles = useUsersStore((state) => state.getRoles);
    const getCompanies = useUsersStore((state) => state.getCompanies);
    const { searchTerm } = useSearch();


    const {
        loadingUsers,
        users,
        loadingRoles,
        roles,
        loadingCompanies,
        companies,
        errorMessage,
        showErrors
    } = useUsersStore();

    const [open, setOpen] = React.useState(false);
    const [reloadUsers, setReloadUsers] = React.useState(false);

    useEffect(() => {
        getUsers();
    }, [reloadUsers]);

    useMemo(() => {
        getRoles();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getUserSlides = (images) => {
        return Array.from(images.map((f, index) => (
            <img key={`${index}_${f.fileName}`} src={getImageUrlFromBlob(f.fileDataBase64)} />
        )))
    }

    return (<>
        {showErrors && (
            <ErrorDisplay error={errorMessage} height={700} />
        )}
        {loadingUsers && (
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
                {(!loadingUsers) && (
                    <Grid container spacing={2} columns={12} sx={{
                        //height: '400px',
                        //width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        //alignItems: 'center',
                        //justifyContent: 'center',
                    }}>
                        <Grid
                            size={users.length < 3 ? "grow" : 4}
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
                                    Add User
                                </Button>
                            </Card>
                        </Grid>
                        <AddUser
                            open={open}
                            handleClose={handleClose}
                            roles={roles}
                            reloadUsers={reloadUsers}
                            setReloadUsers={setReloadUsers} />
                        {users?.filter(f => (
                            (searchTerm ?? '') == '' ||
                            ((f.firstName + " " + f.lastName).toLowerCase().indexOf(searchTerm?.toLowerCase()) > -1)
                        )).map(m =>
                            <Grid
                                size={users.length < 3 ? "grow" : 4}
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
                                    {/*<Carousel cards={getOwnerSlides(m.ownerPhotos)} />*/}
                                    <SyledCardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {m.fullName}
                                        </Typography>
                                        <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                                            {m.email}
                                        </StyledTypography>
                                        {/*<StyledTypography variant="body2" color="text.secondary" gutterBottom>*/}
                                        {/*    {m.city} {m.state} {m.zipCode}*/}
                                        {/*</StyledTypography>*/}
                                    </SyledCardContent>
                                    <SyledCardContent sx={{ my: 0 }}>
                                        {/*<Fab size="small" color="primary" sx={{ alignSelf: 'center' }} onClick={() => handleOpenOwner(m)} aria-label="add">*/}
                                        {/*    <EditIcon />*/}
                                        {/*</Fab>*/}
                                    </SyledCardContent>
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                )}
            {/*    <ViewOwner open={openViewOwner} viewOwner={selectedOwner} handleClose={handleCloseOwner} ownerStates={states} reloadOwners={reloadOwners} setReloadOwners={setReloadOwners} />*/}
            </Container>
        )}
    </>);
}