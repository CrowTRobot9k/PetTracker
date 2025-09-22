import React, { useState, useEffect, useMemo } from 'react';
import useUsersStore from '../../Stores/UsersStore.tsx';
import { useAuthStore } from '../../Stores/AuthStore';
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
import ViewUser from './ViewUser.tsx';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { User } from '../../Types/SharedTypes';


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
    const { user } = useAuthStore();
    
    const getUsers = useUsersStore((state) => state.getUsers);
    const getRoles = useUsersStore((state) => state.getRoles);
    const getCompanies = useUsersStore((state) => state.getCompanies);
    const { searchTerm } = useSearch();

    // Check if user has read access to users
    const hasReadAccess = user?.roles?.some(role => 
        role.name === 'Administrator' || role.name === 'Users Read' || role.name === 'Users Write'
    ) ?? false;

    // Check if user has write or admin privileges for users
    const hasWriteAccess = user?.roles?.some(role => 
        role.name === 'Administrator' || role.name === 'Users Write'
    ) ?? false;


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
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
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

    const handleOpenUser = (user: User) => {
        const copiedUser = JSON.parse(JSON.stringify(user));
        setSelectedUser(copiedUser);
        setOpenViewUser(true);
    };

    const handleCloseUser = () => {
        setOpenViewUser(false);
        setSelectedUser(null);
    };

    const getUserSlides = (images) => {
        return Array.from(images.map((f, index) => (
            <img key={`${index}_${f.fileName}`} src={getImageUrlFromBlob(f.fileDataBase64)} />
        )))
    }

    // Check if user has read access to users
    if (!hasReadAccess) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                <Typography variant="h6" color="text.secondary">
                    You do not have permission to access the users page.
                </Typography>
            </Box>
        );
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
                        {hasWriteAccess && (
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
                        )}
                        <Grid container spacing={2} sx={{ width: '100%' }}>
                        {hasWriteAccess && (
                            <AddUser
                                open={open}
                                handleClose={handleClose}
                                roles={roles}
                                reloadUsers={reloadUsers}
                                setReloadUsers={setReloadUsers} />
                        )}
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
                                    minHeight: '380px',
                                    display: 'flex'
                                }}
                            >
                                <Card
                                    variant="outlined"
                                    sx={{
                                        height: '100%',
                                        width: '100%',
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
                                                minHeight: { xs: '20px', sm: '24px' }, // Ensure consistent height
                                                width: '100%', // Ensure full width
                                            }}
                                        >
                                            {m.roles && m.roles.length > 0 ? (
                                                m.roles.map((role) => (
                                                    <Chip
                                                        key={role.id}
                                                        sx={{
                                                            m: { xs: 0.0625, sm: 0.125 },
                                                            fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                                            height: { xs: '18px', sm: '24px' },
                                                        }} 
                                                        label={role.name} 
                                                    />
                                                ))
                                            ) : (
                                                <Typography 
                                                    variant="body2" 
                                                    color="text.disabled"
                                                    sx={{
                                                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                                        fontStyle: 'italic',
                                                        textAlign: 'center',
                                                        m: { xs: 0.0625, sm: 0.125 },
                                                        width: '100%',
                                                    }}
                                                >
                                                    No roles assigned
                                                </Typography>
                                            )}
                                        </Box>
                                    </SyledCardContent>
                                    <SyledCardContent sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        my: { xs: 0.125, sm: 0.25 },
                                        p: { xs: 0.25, sm: 0.5 },
                                    }}>
                                        {hasReadAccess && (
                                            <Fab 
                                                size="small" 
                                                color="primary" 
                                                sx={{ 
                                                    width: { xs: '36px', sm: '44px' },
                                                    height: { xs: '36px', sm: '44px' },
                                                }} 
                                                onClick={() => handleOpenUser(m)} 
                                                aria-label={hasWriteAccess ? "edit user" : "view user"}
                                            >
                                                <EditIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
                                            </Fab>
                                        )}
                                    </SyledCardContent>
                                </Card>
                            </Grid>
                        )}
                        </Grid>
                    </>
                )}
                <ViewUser
                    open={openViewUser}
                    handleClose={handleCloseUser}
                    user={selectedUser}
                    roles={roles}
                    setReloadUsers={setReloadUsers}
                    hasWriteAccess={hasWriteAccess} />            </>
        )}
    </>);
}