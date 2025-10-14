import React, { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import useOwnersStore from '../../Stores/OwnersStore.tsx';
import AddOwner from './AddOwner.tsx';
import ViewOwner from './ViewOwner.tsx';
import LoadingPlaceholder from '../LoadingPlaceholder.tsx';
import ErrorDisplay from '../ErrorDisplay.tsx';
import { useSearch } from '../SearchProvider.tsx';
import { useAuthStore } from '../../Stores/AuthStore';
import { Owner } from '../../Types/SharedTypes';

export default function ViewOwners() {
    const getOwners = useOwnersStore((state) => state.getOwners);
    const getStates = useOwnersStore((state) => state.getStates);
    const states = useOwnersStore((state) => state.states);
    const { searchTerm } = useSearch();
    const { user } = useAuthStore();

    // Check if user has read access to owners
    const hasReadAccess = user?.roles?.some(role => 
        role.name === 'Administrator' || role.name === 'Owners Read' || role.name === 'Owners Write'
    ) ?? false;

    // Check if user has write or admin privileges for owners
    const hasWriteAccess = user?.roles?.some(role => 
        role.name === 'Administrator' || role.name === 'Owners Write'
    ) ?? false;

    const {
        owners,
        loadingOwners,
        errorMessage,
        showErrors
    } = useOwnersStore();
    
    const [open, setOpen] = React.useState(false);
    const [openViewOwner, setOpenViewOwner] = React.useState(false);
    const [selectedOwner, setSelectedOwner] = useState<Owner>({
        id: 0,
        userId: 0,
        firstName: '',
        lastName: '',
        fullName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        email: '',
        primaryPhone: '',
        secondaryPhone: '',
        referredBy: '',
        vet: '',
        vetPhone: ''
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

    const handleOpenOwner = (owner: Owner) => {
        const copiedOwner = JSON.parse(JSON.stringify(owner));
        setSelectedOwner(copiedOwner);
        setOpenViewOwner(true);
    }

    const handleCloseOwner = () => {
        setOpenViewOwner(false);
    };

    // Filter owners based on search term
    const filteredOwners = useMemo(() => {
        if (!owners) return [];
        if (!searchTerm || searchTerm === '') return owners;
        
        return owners.filter(owner => {
            const fullName = `${owner.firstName} ${owner.lastName}`.toLowerCase();
            return fullName.indexOf(searchTerm.toLowerCase()) > -1;
        });
    }, [owners, searchTerm]);

    // Define columns for DataGrid
    const columns: GridColDef[] = [
        {
            field: 'fullName',
            headerName: 'Name',
            flex: 1,
            minWidth: 150,
            filterable: false,
            valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
        },
        {
            field: 'address',
            headerName: 'Address',
            flex: 1.5,
            minWidth: 200,
            filterable: false,
            valueGetter: (value, row) => {
                const parts = [row.address, row.city, row.state, row.zipCode].filter(Boolean);
                return parts.join(', ');
            },
        },
        {
            field: 'primaryPhone',
            headerName: 'Phone',
            flex: 0.8,
            minWidth: 130,
            filterable: false,
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
            minWidth: 150,
            filterable: false,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            filterable: false,
            width: 80,
            renderCell: (params: GridRenderCellParams) => (
                <IconButton
                    color="primary"
                    onClick={() => handleOpenOwner(params.row as Owner)}
                    disabled={!hasReadAccess}
                    size="small"
                >
                    <EditIcon />
                </IconButton>
            ),
        },
    ];

    return (       
        <>
            {showErrors && (
                <ErrorDisplay error={errorMessage} height={700} />
            )}
            {loadingOwners && (
                <LoadingPlaceholder />
            )}
            {!(showErrors) && !loadingOwners && (
                <>
                    {hasWriteAccess && (
                        <Box sx={{ display: 'flex', gap: 2, mb: 2, mt: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
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
                    )}
                    
                    <Box sx={{ height: 600, width: '100%', maxHeight: 'calc(100vh - 220px)' }}>
                        <DataGrid
                            rows={filteredOwners}
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

                    <AddOwner 
                        open={open} 
                        handleClose={handleClose} 
                        ownerStates={states} 
                        reloadOwners={reloadOwners} 
                        setReloadOwners={setReloadOwners} 
                    />
                    <ViewOwner 
                        open={openViewOwner} 
                        viewOwner={selectedOwner} 
                        handleClose={handleCloseOwner} 
                        ownerStates={states} 
                        reloadOwners={reloadOwners} 
                        setReloadOwners={setReloadOwners} 
                        hasWriteAccess={hasWriteAccess} 
                    />
                </>
            )}
        </>
    );
}
