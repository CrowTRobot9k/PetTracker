import React, { useState, useEffect, useMemo } from 'react';
import useUsersStore from '../../Stores/UsersStore.tsx';
import { useAuthStore } from '../../Stores/AuthStore';
import Box from '@mui/material/Box';
import LoadingPlaceholder from '../LoadingPlaceholder.tsx';
import ErrorDisplay from '../ErrorDisplay.tsx';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { useSearch } from '../SearchProvider.tsx';
import Typography from '@mui/material/Typography';
import AddUser from './AddUser.tsx';
import ViewUser from './ViewUser.tsx';
import Chip from '@mui/material/Chip';
import { User } from '../../Types/SharedTypes';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

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

    // Filter users based on search term
    const filteredUsers = useMemo(() => {
        if (!users) return [];
        if (!searchTerm || searchTerm === '') return users;
        
        return users.filter(user => {
            const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
            const username = user.userName?.toLowerCase() || '';
            const email = user.email?.toLowerCase() || '';
            const searchLower = searchTerm.toLowerCase();
            
            return fullName.indexOf(searchLower) > -1 || 
                   username.indexOf(searchLower) > -1 || 
                   email.indexOf(searchLower) > -1;
        });
    }, [users, searchTerm]);

    // Define columns for DataGrid
    const columns: GridColDef[] = [
        {
            field: 'fullName',
            headerName: 'Full Name',
            flex: 1,
            minWidth: 150,
            filterable: false,
        },
        {
            field: 'userName',
            headerName: 'Username',
            flex: 1,
            minWidth: 130,
            filterable: false,
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1.5,
            minWidth: 180,
            filterable: false,
        },
        {
            field: 'roles',
            headerName: 'Roles',
            flex: 1.5,
            minWidth: 200,
            filterable: false,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, py: 0.5 }}>
                    {params.row.roles && params.row.roles.length > 0 ? (
                        params.row.roles.map((role) => (
                            <Chip
                                key={role.id}
                                label={role.name}
                                size="small"
                                sx={{ fontSize: '0.75rem' }}
                            />
                        ))
                    ) : (
                        <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic', fontSize: '0.875rem' }}>
                            No roles assigned
                        </Typography>
                    )}
                </Box>
            ),
        },
        {
            field: 'actions',
            headerName: '',
            sortable: false,
            filterable: false,
            width: 80,
            renderCell: (params: GridRenderCellParams) => (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                    <IconButton
                        color="primary"
                        onClick={() => handleOpenUser(params.row as User)}
                        disabled={!hasReadAccess}
                        size="small"
                    >
                        <EditIcon />
                    </IconButton>
                </Box>
            ),
        },
    ];

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
        {!(showErrors) && !loadingUsers && (
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%',
                minHeight: 0,
                gap: 2
            }}>
                {hasWriteAccess && (
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', flexShrink: 0 }}>
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
                
                <Box sx={{ 
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 0
                }}>
                    <DataGrid
                        rows={filteredUsers}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 25, page: 0 },
                            },
                            sorting: {
                                sortModel: [{ field: 'fullName', sort: 'asc' }],
                            },
                        }}
                        pageSizeOptions={[10, 25, 50, 100]}
                        disableRowSelectionOnClick
                        disableColumnMenu
                        getRowHeight={() => 'auto'}
                        slots={{
                            noRowsOverlay: () => (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        No users found
                                    </Box>
                                </Box>
                            ),
                        }}
                        sx={{
                            '& .MuiDataGrid-cell:focus': {
                                outline: 'none',
                            },
                            '& .MuiDataGrid-cell:focus-within': {
                                outline: 'none',
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                color: '#fff',
                                fontSize: '1rem',
                                fontWeight: 600,
                            },
                            '& .MuiDataGrid-columnHeader': {
                                background: 'transparent',
                                color: '#fff',
                            },
                            '& .MuiDataGrid-columnHeaderTitle': {
                                fontWeight: 600,
                                color: '#fff',
                            },
                            '& .MuiDataGrid-columnSeparator': {
                                color: 'rgba(255, 255, 255, 0.3)',
                            },
                            '& .MuiDataGrid-footerContainer': {
                                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                color: '#fff',
                            },
                            '& .MuiTablePagination-root': {
                                color: '#fff',
                            },
                            '& .MuiTablePagination-selectIcon': {
                                color: '#fff',
                            },
                            '& .MuiTablePagination-actions .MuiIconButton-root': {
                                color: '#fff',
                            },
                            '& .MuiDataGrid-sortIcon': {
                                color: '#fff',
                                opacity: 1,
                            },
                            '& .MuiDataGrid-menuIconButton': {
                                color: '#fff',
                                opacity: 1,
                            },
                            '& .MuiDataGrid-iconButtonContainer': {
                                color: '#fff',
                            },
                        }}
                    />
                </Box>

                <AddUser
                    open={open}
                    handleClose={handleClose}
                    roles={roles}
                    reloadUsers={reloadUsers}
                    setReloadUsers={setReloadUsers} />
                <ViewUser
                    open={openViewUser}
                    handleClose={handleCloseUser}
                    user={selectedUser}
                    roles={roles}
                    setReloadUsers={setReloadUsers}
                    hasWriteAccess={hasWriteAccess} />
            </Box>
        )}
    </>);
}