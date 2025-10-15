import React, { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import IconButton from '@mui/material/IconButton';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import AddPet from './AddPet.tsx';
import AddExistingPet from './AddExistingPet.tsx';
import ViewPet from './ViewPet.tsx';
import LoadingPlaceholder from '../LoadingPlaceholder.tsx';
import usePetsStore from '../../Stores/PetsStore.tsx';
import ConfirmDialog from '../ConfirmDialog.tsx';
import ErrorDisplay from '../ErrorDisplay.tsx';
import { useSearch } from '../SearchProvider.tsx';
import { useAuthStore } from '../../Stores/AuthStore';
import { Pet } from '../../Types/SharedTypes.tsx';

interface PetGridRow {
    id: number;
    name: string;
    petType: string;
    breeds: string;
    sex: string;
    color: string;
    _originalPet: any; // Reference to full pet object
}

export default function ViewPets(props: { ownerId?: number; hasWriteAccess?: boolean }) {
    const { user } = useAuthStore();
    
    // Determine access level based on user roles when not explicitly provided
    const hasReadAccess = user?.roles?.some(role => 
        role.name === 'Administrator' || role.name === 'Pets Read' || role.name === 'Pets Write'
    ) ?? false;
    
    const hasWriteAccessByRole = user?.roles?.some(role => 
        role.name === 'Administrator' || role.name === 'Pets Write'
    ) ?? false;
    
    // Use explicit hasWriteAccess prop if provided, otherwise use role-based access
    const hasWriteAccess = props.hasWriteAccess !== undefined ? props.hasWriteAccess : hasWriteAccessByRole;
    
    const getPets = usePetsStore((state) => state.getPets);
    const getPetTypes = usePetsStore((state) => state.getPetTypes);
    const petTypes = usePetsStore((state) => state.petTypes);
    
    const {
        pets,
        loadingPets,
        errorMessage,
        showErrors
    } = usePetsStore();
    
    const [open, setOpen] = React.useState(false);
    const [openAddExistingPet, setOpenAddExistingPet] = React.useState(false);
    const [openViewPet, setOpenViewPet] = React.useState(false);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [removePetId, setRemovePetId] = useState<number>(0);
    const [deletePetId, setDeletePetId] = useState<number>(0);

    const [reloadPets, setReloadPets] = React.useState(false);
    const [openConfirmRemove, setOpenConfirmRemove] = React.useState(false);
    const [openConfirmDelete, setOpenConfirmDelete] = React.useState(false);

    const [submitErrorMessage, setSubmitErrorMessage] = React.useState('');
    const { searchTerm } = useSearch();

    useEffect(() => {
        getPets(props.ownerId);
    }, [reloadPets, props.ownerId]);

    useMemo(() => {
        getPetTypes();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickOpenAddExisting = () => {
        setOpenAddExistingPet(true);
    };

    const handleCloseAddExisting = () => {
        setOpenAddExistingPet(false);
    };

    const handleOpenPet = (pet: any) => {
        const copiedPet = JSON.parse(JSON.stringify(pet));
        setSelectedPet(copiedPet);
        setOpenViewPet(true);
    }

    const handleClosePet = () => {
        setOpenViewPet(false);
    };

    const handleConfirmOpenRemove = (petId: number) => {
        setRemovePetId(petId);
        setOpenConfirmRemove(true);
    };

    const handleConfirmOpenDelete = (petId: number) => {
        setDeletePetId(petId);
        setOpenConfirmDelete(true);
    };

    const handleConfirmCloseRemove = () => {
        setOpenConfirmRemove(false);
    };
    
    const handleConfirmCloseDelete = () => {
        setOpenConfirmDelete(false);
    };

    const handleConfirmRemovePet = async () => {
        setSubmitErrorMessage("");

        const removeExistingPetsModel = {
            OwnerId: props.ownerId,
            PetIds: [removePetId],
        };

        try {
            const response = await fetch("/api/Owner/RemoveExistingPetFromOwner", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(removeExistingPetsModel)
            });

            setOpenConfirmRemove(false);

            if (!response.ok) {
                throw new Error(await response.json());
            }

            if (response.status == 200) {
                setReloadPets(!reloadPets);
            }
        } catch (e: any) {
            setSubmitErrorMessage(e.message);
        } 
    };

    const handleConfirmDeletePet = async () => {
        setSubmitErrorMessage("");

        try {
            const response = await fetch(`/api/Pet/DeletePet`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(deletePetId)
            });

            setOpenConfirmDelete(false);

            if (!response.ok) {
                throw new Error(await response.json());
            }

            if (response.status == 200) {
                setReloadPets(!reloadPets);
            }
        } catch (e: any) {
            setSubmitErrorMessage(e.message);
        }
    };

    // Filter pets based on search term
    const filteredPets = useMemo(() => {
        if (!pets) return [];
        if (!searchTerm || searchTerm === '') return pets;
        
        return pets.filter((pet: any) => {
            const name = pet.name?.toLowerCase() || '';
            const hasBreedMatch = pet.breedTypes?.some((b: any) => 
                b.name?.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
            ) || false;
            
            return name.indexOf(searchTerm.toLowerCase()) > -1 || hasBreedMatch;
        });
    }, [pets, searchTerm]);

    // Transform pets data for DataGrid
    const gridRows: PetGridRow[] = useMemo(() => {
        return filteredPets.map((pet: any): PetGridRow => ({
            id: pet.id,
            name: pet.name || '',
            petType: pet.petType?.type || '',
            breeds: pet.breedTypes?.map((b: any) => b.name).join(', ') || '',
            sex: pet.sex || '',
            color: pet.color || '',
            _originalPet: pet // Keep reference to original pet object
        }));
    }, [filteredPets]);

    // Define columns for DataGrid
    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            minWidth: 120,
            filterable: false,
        },
        {
            field: 'petType',
            headerName: 'Type',
            flex: 0.7,
            minWidth: 100,
            filterable: false,
        },
        {
            field: 'breeds',
            headerName: 'Breed(s)',
            flex: 1.5,
            minWidth: 150,
            filterable: false,
        },
        {
            field: 'sex',
            headerName: 'Sex',
            flex: 0.5,
            minWidth: 80,
            filterable: false,
        },
        {
            field: 'color',
            headerName: 'Color',
            flex: 0.8,
            minWidth: 100,
            filterable: false,
        },
        {
            field: 'actions',
            headerName: '',
            sortable: false,
            filterable: false,
            width: props.ownerId != null ? 120 : 80,
            renderCell: (params: GridRenderCellParams) => (
                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                    <IconButton
                        color="primary"
                        onClick={() => handleOpenPet(params.row._originalPet)}
                        size="small"
                        aria-label={hasWriteAccess ? "edit" : "view"}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    {hasWriteAccess && props.ownerId != null && (
                        <IconButton
                            color="warning"
                            onClick={() => handleConfirmOpenRemove(params.row.id)}
                            size="small"
                            aria-label="remove"
                        >
                            <RemoveCircleIcon fontSize="small" />
                        </IconButton>
                    )}
                    {hasWriteAccess && props.ownerId == null && (
                        <IconButton
                            color="error"
                            onClick={() => handleConfirmOpenDelete(params.row.id)}
                            size="small"
                            aria-label="delete"
                        >
                            <RemoveCircleIcon fontSize="small" />
                        </IconButton>
                    )}
                </Box>
            ),
        },
    ];

    // Check if user has read access to pets (only applies when not used within owner context)
    if (props.ownerId === undefined && !hasReadAccess) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                <Typography variant="h6" color="text.secondary">
                    You do not have permission to access the pets page.
                </Typography>
            </Box>
        );
    }

    return (
        <>
            {showErrors && (
                <ErrorDisplay error={errorMessage} height={700} />
            )}
            {submitErrorMessage?.length > 0 && (
                <ErrorDisplay error={submitErrorMessage} height={100} />
            )}
            {loadingPets && (
                <LoadingPlaceholder />
            )}
            {!(showErrors) && !loadingPets && (
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    height: props.ownerId != null ? 'auto' : '100%',
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
                                Add New Pet
                            </Button>
                            {props.ownerId != null && (
                                <Button 
                                    onClick={handleClickOpenAddExisting} 
                                    variant="outlined" 
                                    color="info" 
                                    endIcon={<AddIcon />}
                                    size="medium"
                                    sx={{ 
                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                    }}
                                >
                                    Add/Move Existing Pets
                                </Button>
                            )}
                        </Box>
                    )}
                    
                    <Box sx={{ 
                        height: props.ownerId != null ? 450 : '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 0,
                        flexGrow: props.ownerId != null ? 0 : 1
                    }}>
                        <DataGrid
                            rows={gridRows}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: { 
                                        pageSize: props.ownerId != null ? 10 : 25, 
                                        page: 0 
                                    },
                                },
                                sorting: {
                                    sortModel: [{ field: 'name', sort: 'asc' }],
                                },
                            }}
                            pageSizeOptions={props.ownerId != null ? [5, 10, 25] : [10, 25, 50, 100]}
                            disableRowSelectionOnClick
                            disableColumnMenu
                            slots={{
                                noRowsOverlay: () => (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            No pets found
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

                    <AddPet 
                        open={open} 
                        handleClose={handleClose} 
                        petTypes={petTypes} 
                        reloadPets={reloadPets} 
                        setReloadPets={setReloadPets} 
                        ownerId={props.ownerId} 
                    />
                    <AddExistingPet 
                        open={openAddExistingPet} 
                        handleClose={handleCloseAddExisting} 
                        reloadPets={reloadPets} 
                        setReloadPets={setReloadPets} 
                        ownerId={props.ownerId} 
                    />
                    {selectedPet && (
                        <ViewPet 
                            open={openViewPet} 
                            viewPet={selectedPet}
                            handleClose={handleClosePet} 
                            petTypes={petTypes} 
                            reloadPets={reloadPets} 
                            setReloadPets={setReloadPets} 
                            hasWriteAccess={hasWriteAccess} 
                        />
                    )}
                    <ConfirmDialog 
                        open={openConfirmRemove} 
                        handleClose={handleConfirmCloseRemove} 
                        handleConfirm={handleConfirmRemovePet} 
                        confirmTitle={"Remove Pet"} 
                        confirmDescription={"Remove pet from this owner?"} 
                        confirmbuttonText="Yes" 
                    />
                    <ConfirmDialog 
                        open={openConfirmDelete} 
                        handleClose={handleConfirmCloseDelete} 
                        handleConfirm={handleConfirmDeletePet} 
                        confirmTitle={"Delete Pet"} 
                        confirmDescription={"Are you sure you want to delete this pet?"} 
                        confirmbuttonText="Yes" 
                    />
                </Box>
            )}
        </>
    );
}
