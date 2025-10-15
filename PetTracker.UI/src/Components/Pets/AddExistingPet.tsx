import React, { useState, useEffect, useMemo } from 'react';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import useExistingPetsStore from '../../Stores/ExistingPetStore';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import DialogContent from '@mui/material/DialogContent';
import ErrorDisplay from '../ErrorDisplay';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

interface AddExistingPetProps {
    open: boolean;
    handleClose: () => void;
    reloadPets: boolean;
    setReloadPets: React.Dispatch<React.SetStateAction<boolean>>;
    ownerId?: number;
}

export default function AddExistingPet({ open, handleClose, reloadPets, setReloadPets, ownerId }: AddExistingPetProps) {
    const [submitErrorMessage, setSubmitErrorMessage] = useState('');
    const getExistingPets = useExistingPetsStore((state) => state.getExistingPets);
    const { existingPets, loadingExistingPets } = useExistingPetsStore();
    const [searchValue, setSearchValue] = useState('');
    const [ selectedPets, setSelectedPets ] = useState<Record<number, boolean>>({});

    useEffect(() => {
        getExistingPets(ownerId);
    }, [ownerId]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleCheckboxChange = (petId: number, checked: boolean) => {
        setSelectedPets(prevState => ({
            ...prevState,
            [petId]: checked,
        }));
    };

    // Filter pets based on search
    const filteredPets = useMemo(() => {
        if (!existingPets) return [];
        
        const searchLower = searchValue.toLowerCase();
        if (!searchLower) return existingPets;
        
        return existingPets.filter((pet: any) => 
            pet.name?.toLowerCase().includes(searchLower)
        );
    }, [existingPets, searchValue]);

    // Define DataGrid columns
    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            minWidth: 150,
            filterable: false,
        },
        {
            field: 'petType',
            headerName: 'Type',
            flex: 0.8,
            minWidth: 100,
            filterable: false,
            valueGetter: (value, row) => row.petType?.type || '',
        },
        {
            field: 'breeds',
            headerName: 'Breeds',
            flex: 1.5,
            minWidth: 200,
            filterable: false,
            renderCell: (params: GridRenderCellParams) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, py: 0.5 }}>
                    {params.row.breedTypes?.map((breed: any, index: number) => (
                        <Chip 
                            key={index}
                            label={breed.name}
                            size="small"
                            sx={{ fontSize: '0.75rem' }}
                        />
                    ))}
                </Box>
            ),
        },
        {
            field: 'sex',
            headerName: 'Sex',
            flex: 0.6,
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
            field: 'select',
            headerName: '',
            flex: 0.6,
            minWidth: 80,
            sortable: false,
            filterable: false,
            renderCell: (params: GridRenderCellParams) => (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
                    <Checkbox
                        checked={selectedPets[params.row.id] || false}
                        onChange={(e) => handleCheckboxChange(params.row.id, e.target.checked)}
                    />
                </Box>
            ),
        },
    ];

    const AddExistingPetsToOwner = async () => {
        setSubmitErrorMessage("");

        const selectedPetIds = Object.keys(selectedPets)
            .filter(key => selectedPets[parseInt(key)] === true)
            .map(Number);

        const addExistingPetsModel = {
            OwnerId: ownerId,
            PetIds: selectedPetIds,
        };

        try {
            const response = await fetch("/api/Owner/AddExistingPetsToOwner", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addExistingPetsModel)
            });

            if (!response.ok) {
                throw new Error(await response.json());
            }

            if (response.status == 200) {
                setReloadPets(!reloadPets);
                setSelectedPets({});
                handleClose();
            }
        } catch (e: any) {
            setSubmitErrorMessage(e.message || 'An error occurred');
        } 
    }

    return (
        <Dialog
          open={ open }
          onClose = { handleClose }
          fullWidth
          maxWidth = "lg"
        >
            <DialogContent sx={{
                height: '100%',
                my: 0,
                p: 0
            }}>
                <Container
                    maxWidth="xl"
                    component="main"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        my: 2,
                        gap: 0,

                    }}
                >
                    <OutlinedInput
                        autoFocus
                        margin="dense"
                        placeholder="Search"
                        type="text"
                        value={searchValue}
                        onChange={handleSearchChange}
                    />
                </Container>
                {submitErrorMessage?.length > 0 && (
                    <ErrorDisplay error={submitErrorMessage} height={100} />
                )}
                {loadingExistingPets && (
                    <Container
                        maxWidth="xl"
                        component="main"
                        sx={{
                            height:'100%',
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
                {!loadingExistingPets && (
                    <Box sx={{ 
                        height: 500,
                        maxHeight: 'calc(100vh - 300px)',
                        width: '100%',
                        px: 2
                    }}>
                        <DataGrid
                            rows={filteredPets}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: { 
                                        pageSize: 25, 
                                        page: 0 
                                    },
                                },
                            }}
                            pageSizeOptions={[10, 25, 50, 100]}
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
                                '& .MuiDataGrid-columnHeaders': {
                                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                    color: '#fff',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                },
                                '& .MuiDataGrid-columnHeader': {
                                    backgroundColor: 'transparent',
                                },
                                '& .MuiDataGrid-columnHeaderTitle': {
                                    fontWeight: 'bold',
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
                                '& .MuiTablePagination-actions button': {
                                    color: '#fff',
                                },
                            }}
                        />
                    </Box>
                )}
                <DialogActions sx={{ pb: 3, px: 3 }}>
                    <Button onClick={handleClose} variant="contained" color="secondary">Cancel</Button>
                    <Button variant="contained" color="info" onClick={AddExistingPetsToOwner}>Save Pets</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
     );
}