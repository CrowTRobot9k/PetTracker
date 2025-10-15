import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import ImageUpload from '../ImageUpload';
import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Owner } from '../../Types/SharedTypes';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ViewPets from '../Pets/ViewPets';
import ErrorDisplay from '../ErrorDisplay';
import useOwnersStore from '../../Stores/OwnersStore.tsx';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';



interface ViewPetProps {
    open: boolean;
    viewOwner: Owner;
    handleClose: () => void;
    ownerStates: [];
    reloadOwners: boolean,
    setReloadOwners: React.Dispatch<React.SetStateAction<boolean>>;
    hasWriteAccess: boolean;
}

export default function ViewOwner({ open, viewOwner, handleClose, ownerStates, reloadOwners, setReloadOwners, hasWriteAccess }: ViewPetProps) {
    const [submitSuccessMessage, setSuccessMessage] = React.useState('');
    const [submitErrorMessage, setErrorMessage] = React.useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [openStates, setOpenStates] = useState(false);
    const [editOwner, setEditOwner] = useState<Owner>({});
    const [tabIndex, setTabIndex] = React.useState(0);
    const [isSaving, setIsSaving] = useState(false);
    
    const { getOwnerPhotos, getOwnerPhotosSync, getOwnerPhotosBatch, updateOwner } = useOwnersStore();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


    useEffect(() => {
        const copy = {
            id: viewOwner.id,
            userId: viewOwner.userId,
            firstName: viewOwner.firstName,
            lastName: viewOwner.lastName,
            address: viewOwner.address,
            city: viewOwner.city,
            state: viewOwner.state,
            zipCode: viewOwner.zipCode,
            email: viewOwner.email,
            primaryPhone: viewOwner.primaryPhone,
            secondaryPhone: viewOwner.secondaryPhone,
            referredBy: viewOwner.referredBy,
            vet: viewOwner.vet,
            vetPhone: viewOwner.vetPhone,
        };

        setEditOwner(copy);
    }, [viewOwner]);

    useEffect(() => {
        // Load owner photos when the dialog opens
        if (open && viewOwner.id) {
            loadOwnerPhotos();
        }
    }, [open, viewOwner.id]);

    const loadOwnerPhotos = async () => {
        try {
            // First check if photos are already cached
            const existingPhotos = getOwnerPhotosSync(viewOwner.id);
            
            if (existingPhotos && existingPhotos.length > 0) {
                // Use cached photos
                const mappedPhotos = existingPhotos.map(m => ({
                    id: m.id,
                    fileName: m.fileName,
                    fileDataBase64: m.fileDataBase64
                }));
                setSelectedFiles(mappedPhotos);
            } else {
                // Fetch photos from API if not cached
                const photos = await getOwnerPhotos(viewOwner.id);
                const mappedPhotos = photos?.map(m => ({
                    id: m.id,
                    fileName: m.fileName,
                    fileDataBase64: m.fileDataBase64
                })) || [];
                setSelectedFiles(mappedPhotos);
            }
        } catch (error) {
            console.error('Failed to load owner photos:', error);
            setSelectedFiles([]);
        }
    };

    const handleFileInputChange = (newValue: File[]) => {
        setSelectedFiles(newValue);
    };

    const handleChangeState = (e: SelectChangeEvent) => {
        if (ownerStates && ownerStates?.length > 0) {
            const ownerState = ownerStates.find(f => f.abbr == e.target.value);
            if (ownerState) {
                setEditOwner({ ...editOwner, state: ownerState.abbr });
            }
        }
    };

    const handleChange = (e) => {
        //const { name, value } = e.target;
        //editPet[name]= value;
        const { name, value } = e.target;
        setEditOwner(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        value: number;
    }

    function CustomTabPanel(props: TabPanelProps) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                style={{ 
                    width: '100%', 
                    height: '100%',
                    overflow: 'auto',
                    flex: 1,
                    display: value === index ? 'block' : 'none'
                }}
                {...other}
            >
                {value === index && <Box sx={{ p: 0, width: '100%', height: '100%' }}>{children}</Box>}
            </div>
        );
    }


    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const handleSaveOwnerSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");
        setIsSaving(true);

        const editOwnerData = new FormData();
        Array.from(selectedFiles).forEach((f, i) => {
            editOwnerData.append(`model.OwnerPhotos`, f);
        });

        editOwnerData.append("model.Id", editOwner.id);
        editOwnerData.append("model.UserId", editOwner.userId??'');
        editOwnerData.append("model.FirstName", editOwner.firstName??'');
        editOwnerData.append("model.LastName", editOwner.lastName??'');
        editOwnerData.append("model.Address", editOwner.address??'');
        editOwnerData.append("model.City", editOwner.city??'');
        editOwnerData.append("model.State", editOwner.state??'');
        editOwnerData.append("model.ZipCode", editOwner.zipCode??'');
        editOwnerData.append("model.Email", editOwner.email??'');
        editOwnerData.append("model.PrimaryPhone", editOwner.primaryPhone??'');
        editOwnerData.append("model.SecondaryPhone", editOwner.secondaryPhone??'');
        editOwnerData.append("model.ReferredBy", editOwner.referredBy??'');
        editOwnerData.append("model.Vet", editOwner.vet??'');
        editOwnerData.append("model.VetPhone", editOwner.vetPhone??'');

        try {
            const response = await fetch("/api/Owner/UpdateOwner", {
                method: "POST",
                body: editOwnerData,
            });

            if (!response.ok) {
                throw new Error(await response.json());
            }

            if (response.status == 200) {
                setSelectedFiles([]);
                setReloadOwners(!reloadOwners);
                
                // Update owner data in store
                updateOwner(editOwner);
                
                // Refresh owner photos if photos were uploaded
                if (selectedFiles.length > 0 && editOwner.id) {
                    await getOwnerPhotos(editOwner.id);
                }
                
                setSuccessMessage("Owner Saved")
                handleClose();
            }
        } catch (e) {
            setErrorMessage(e.message);
        } finally {
            setIsSaving(false);
        }  
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth={isMobile ? "sm" : "xl"}
            fullScreen={isMobile}
            sx={{
                '& .MuiDialog-paper': {
                    height: isMobile ? '100%' : '90vh',
                    maxHeight: isMobile ? '100%' : '90vh'
                }
            }}
        >
            <form name="saveOwnerForm" onSubmit={handleSaveOwnerSubmit} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexWrap: 'wrap',
                        width: '100%',
                        alignItems: 'center',
                        pt: { xs: 2, sm: 3 },
                        pb: 0,
                        px: { xs: 2, sm: 3 },
                        flexShrink: 0
                    }}
                >
                    <DialogTitle sx={{ p: 0, mb: 1 }} >
                        View Owner
                    </DialogTitle>
                    {submitErrorMessage?.length > 0 && (
                        <ErrorDisplay error={submitErrorMessage} />
                    )}
                    <ImageUpload label="Upload Photos" selectedFiles={selectedFiles} onChange={handleFileInputChange} readonly={!hasWriteAccess} />
                </Box>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%', flexShrink: 0 }}>
                    <Tabs value={tabIndex} onChange={handleTabChange} sx={{ width: '100%' }}>
                        <Tab label="Info" {...a11yProps(0)} />
                        <Tab label="Pets" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <CustomTabPanel value={tabIndex} index={0}>
                        <DialogContent sx={{ p: { xs: 2, sm: 3 }, width: '100%', maxWidth: '100%', height: '100%', overflow: 'auto' }}>
                            <Grid 
                                container 
                                columns={12} 
                                spacing={{ xs: 2, sm: 3 }} 
                                sx={{ 
                                    width: '100%',
                                    display: 'flex',
                                    flexWrap: 'wrap'
                                }}
                            >
                                <Grid 
                                    size={{ xs: 12, sm: 6, md: 6, lg: 6 }} 
                                    className="owner-modal-field"
                                    sx={{
                                        flex: { xs: '0 0 100%', sm: '0 0 calc(50% - 12px)' },
                                        maxWidth: { xs: '100%', sm: 'calc(50% - 12px)' }
                                    }}
                                >
                                    <DialogContentText sx={{ mb: 1, fontWeight: 500 }}>
                                        First Name
                                    </DialogContentText>
                                    <OutlinedInput
                                        autoFocus
                                        margin="dense"
                                        id="firstName"
                                        name="firstName"
                                        label="First Name"
                                        placeholder="First Name"
                                        type="text"
                                        fullWidth
                                        value={editOwner.firstName}
                                        onChange={handleChange}
                                        disabled={!hasWriteAccess}
                                    />
                                </Grid>
                                <Grid 
                                    size={{ xs: 12, sm: 6, md: 6, lg: 6 }} 
                                    className="owner-modal-field"
                                    sx={{
                                        flex: { xs: '0 0 100%', sm: '0 0 calc(50% - 12px)' },
                                        maxWidth: { xs: '100%', sm: 'calc(50% - 12px)' }
                                    }}
                                >
                                    <DialogContentText sx={{ mb: 1, fontWeight: 500 }}>
                                        Last Name
                                    </DialogContentText>
                                    <OutlinedInput
                                        margin="dense"
                                        id="lastName"
                                        name="lastName"
                                        label="Last Name"
                                        placeholder="Last Name"
                                        type="text"
                                        fullWidth
                                        value={editOwner.lastName}
                                        onChange={handleChange}
                                        disabled={!hasWriteAccess}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }} className="owner-modal-field" sx={{ flex: { xs: '0 0 100%', sm: '0 0 calc(50% - 12px)' }, maxWidth: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                    <DialogContentText sx={{ mb: 1, fontWeight: 500 }}>
                                        Email
                                    </DialogContentText>
                                    <OutlinedInput
                                        margin="dense"
                                        id="ownerEmail"
                                        name="email"
                                        label="Email"
                                        placeholder="Email"
                                        type="email"
                                        fullWidth
                                        value={editOwner.email}
                                        onChange={handleChange}
                                        disabled={!hasWriteAccess}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }} className="owner-modal-field" sx={{ flex: { xs: '0 0 100%', sm: '0 0 calc(50% - 12px)' }, maxWidth: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                    <DialogContentText sx={{ mb: 1, fontWeight: 500 }}>
                                        Address
                                    </DialogContentText>
                                    <OutlinedInput
                                        margin="dense"
                                        id="address"
                                        name="address"
                                        label="Address"
                                        placeholder="Address"
                                        type="text"
                                        fullWidth
                                        value={editOwner.address}
                                        onChange={handleChange}
                                        disabled={!hasWriteAccess}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }} className="owner-modal-field" sx={{ flex: { xs: '0 0 100%', sm: '0 0 calc(50% - 12px)' }, maxWidth: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                    <DialogContentText sx={{ mb: 1, fontWeight: 500 }}>
                                        Primary Phone
                                    </DialogContentText>
                                    <OutlinedInput
                                        margin="dense"
                                        id="primaryPhone"
                                        name="primaryPhone"
                                        label="Primary Phone"
                                        placeholder="Primary Phone"
                                        type="tel"
                                        fullWidth
                                        value={editOwner.primaryPhone}
                                        onChange={handleChange}
                                        disabled={!hasWriteAccess}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }} className="owner-modal-field" sx={{ flex: { xs: '0 0 100%', sm: '0 0 calc(50% - 12px)' }, maxWidth: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                    <DialogContentText sx={{ mb: 1, fontWeight: 500 }}>
                                        Referred By
                                    </DialogContentText>
                                    <OutlinedInput
                                        margin="dense"
                                        id="referredBy"
                                        name="referredBy"
                                        label="Referred By"
                                        placeholder="Referred By"
                                        type="text"
                                        fullWidth
                                        value={editOwner.referredBy}
                                        onChange={handleChange}
                                        disabled={!hasWriteAccess}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }} className="owner-modal-field" sx={{ flex: { xs: '0 0 100%', sm: '0 0 calc(50% - 12px)' }, maxWidth: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                    <DialogContentText sx={{ mb: 1, fontWeight: 500 }}>
                                        City
                                    </DialogContentText>
                                    <OutlinedInput
                                        margin="dense"
                                        id="city"
                                        name="city"
                                        label="City"
                                        placeholder="City"
                                        type="text"
                                        fullWidth
                                        value={editOwner.city}
                                        onChange={handleChange}
                                        disabled={!hasWriteAccess}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }} className="owner-modal-field" sx={{ flex: { xs: '0 0 100%', sm: '0 0 calc(50% - 12px)' }, maxWidth: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                    <DialogContentText sx={{ mb: 1, fontWeight: 500 }}>
                                        State
                                    </DialogContentText>
                                    <FormControl fullWidth>
                                        <Select
                                            displayEmpty
                                            id="select-owner-state"
                                            name="ownerState"
                                            value={editOwner.state}
                                            label="State"
                                            onChange={handleChangeState}
                                            disabled={!hasWriteAccess}
                                            renderValue={(selected) => {
                                                if (!selected) {
                                                    return <em>Select</em>;
                                                }
                                                return selected;
                                            }}
                                        >
                                            {ownerStates?.length > 0 && (ownerStates?.map(m =>
                                                <MenuItem key={m} value={m.abbr}>{m.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }} className="owner-modal-field" sx={{ flex: { xs: '0 0 100%', sm: '0 0 calc(50% - 12px)' }, maxWidth: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                    <DialogContentText sx={{ mb: 1, fontWeight: 500 }}>
                                        Zip Code
                                    </DialogContentText>
                                    <OutlinedInput
                                        margin="dense"
                                        id="zipCode"
                                        name="zipCode"
                                        label="Zip Code"
                                        placeholder="Zip Code"
                                        type="text"
                                        fullWidth
                                        value={editOwner.zipCode}
                                        onChange={handleChange}
                                        disabled={!hasWriteAccess}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }} className="owner-modal-field" sx={{ flex: { xs: '0 0 100%', sm: '0 0 calc(50% - 12px)' }, maxWidth: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                    <DialogContentText sx={{ mb: 1, fontWeight: 500 }}>
                                        Secondary Phone
                                    </DialogContentText>
                                    <OutlinedInput
                                        margin="dense"
                                        id="secondaryPhone"
                                        name="secondaryPhone"
                                        label="Secondary Phone"
                                        placeholder="Secondary Phone"
                                        type="tel"
                                        fullWidth
                                        value={editOwner.secondaryPhone}
                                        onChange={handleChange}
                                        disabled={!hasWriteAccess}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }} className="owner-modal-field" sx={{ flex: { xs: '0 0 100%', sm: '0 0 calc(50% - 12px)' }, maxWidth: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                    <DialogContentText sx={{ mb: 1, fontWeight: 500 }}>
                                        Veterinarian
                                    </DialogContentText>
                                    <OutlinedInput
                                        margin="dense"
                                        id="vet"
                                        name="vet"
                                        label="Veterinarian"
                                        placeholder="Veterinarian"
                                        type="text"
                                        fullWidth
                                        value={editOwner.vet}
                                        onChange={handleChange}
                                        disabled={!hasWriteAccess}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }} className="owner-modal-field" sx={{ flex: { xs: '0 0 100%', sm: '0 0 calc(50% - 12px)' }, maxWidth: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
                                    <DialogContentText sx={{ mb: 1, fontWeight: 500 }}>
                                        Veterinarian Phone
                                    </DialogContentText>
                                    <OutlinedInput
                                        margin="dense"
                                        id="vetPhone"
                                        name="vetPhone"
                                        label="Veterinarian Phone"
                                        placeholder="Veterinarian Phone"
                                        type="tel"
                                        fullWidth
                                        value={editOwner.vetPhone}
                                        onChange={handleChange}
                                        disabled={!hasWriteAccess}
                                    />
                                </Grid>
                            </Grid>
                        </DialogContent>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabIndex} index={1}>
                        <DialogContent sx={{ p: { xs: 2, sm: 3 }, width: '100%', height: '100%', overflow: 'auto' }}>
                            <ViewPets ownerId={viewOwner.id} hasWriteAccess={hasWriteAccess} />
                        </DialogContent>
                    </CustomTabPanel>
                </Box>
                <DialogActions sx={{ 
                    pb: isMobile ? 2 : 3, 
                    px: isMobile ? 2 : 3,
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? 1 : 0,
                    flexShrink: 0
                }}>
                    <Button 
                        onClick={handleClose} 
                        disabled={isSaving}
                        fullWidth={isMobile}
                        variant="contained"
                        color="secondary"
                    >
                        {hasWriteAccess ? 'Cancel' : 'Close'}
                    </Button>
                    {hasWriteAccess && (
                        <Button 
                            variant="contained" 
                            color="info" 
                            type="submit"
                            disabled={isSaving}
                            fullWidth={isMobile}
                            startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                    )}
                </DialogActions>
            </form>
        </Dialog>
    );
}
