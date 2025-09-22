import React, { useState, useEffect, useMemo } from 'react';
import useUsersStore from '../../Stores/UsersStore.tsx';
import Box from '@mui/material/Box';
import LoadingPlaceholder from '../LoadingPlaceholder.tsx';
import ErrorDisplay from '../ErrorDisplay.tsx';
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
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';


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
    const [openViewUser, setOpenViewUser] = React.useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
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

    const handleOpenUser = (user) => {
        const copiedUser = JSON.parse(JSON.stringify(user));
        setSelectedUser(copiedUser);
        setOpenViewUser(true);
    };

    const handleCloseUser = () => {
        setOpenViewUser(false);
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
            <>
                {(!loadingUsers) && (
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
                                Add User
                            </Button>
                        </Box>
                        <Grid container spacing={2} sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'row',
                        }}>
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
                                    {/* Avatar placeholder to match carousel space in pet/owner cards */}
                                    <Box sx={{ 
                                        height: { xs: '200px', sm: '180px', md: '220px' },
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'grey.50',
                                        borderBottom: '1px solid',
                                        borderColor: 'divider'
                                    }}>
                                        <Avatar 
                                            sx={{ 
                                                width: { xs: 80, sm: 90, md: 100 },
                                                height: { xs: 80, sm: 90, md: 100 },
                                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                                bgcolor: 'primary.main'
                                            }}
                                        >
                                            {m.firstName?.charAt(0)?.toUpperCase()}{m.lastName?.charAt(0)?.toUpperCase()}
                                        </Avatar>
                                    </Box>
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
                                            {m.fullName}
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
                                            {m.email}
                                        </StyledTypography>
                                        {m.company && (
                                            <StyledTypography 
                                                variant="body2" 
                                                color="text.secondary" 
                                                gutterBottom
                                                sx={{
                                                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                                    textAlign: 'center',
                                                    mb: { xs: 0.125, sm: 0.25 },
                                                    fontStyle: 'italic'
                                                }}
                                            >
                                                {m.company.name}
                                            </StyledTypography>
                                        )}
                                        {m.roles && m.roles.length > 0 && (
                                            <Stack 
                                                direction="row" 
                                                spacing={0.5} 
                                                sx={{ 
                                                    justifyContent: 'center', 
                                                    flexWrap: 'wrap',
                                                    gap: 0.5,
                                                    mb: { xs: 0.25, sm: 0.5 },
                                                }}
                                            >
                                                {m.roles.map((role) => (
                                                    <Chip
                                                        key={role.id}
                                                        label={role.name}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                        sx={{
                                                            fontSize: { xs: '0.6rem', sm: '0.7rem' },
                                                            height: { xs: '20px', sm: '24px' },
                                                            '& .MuiChip-label': {
                                                                px: { xs: 0.5, sm: 0.75 },
                                                            }
                                                        }}
                                                    />
                                                ))}
                                            </Stack>
                                        )}
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
                                            onClick={() => handleOpenUser(m)} 
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
            {/*    <ViewOwner open={openViewOwner} viewOwner={selectedOwner} handleClose={handleCloseOwner} ownerStates={states} reloadOwners={reloadOwners} setReloadOwners={setReloadOwners} />*/}
            </>
        )}
    </>);
}