import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import Alert from '@mui/material/Alert';
import ImageUpload from './ImageUpload';
import React, { useState, useEffect } from 'react';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { Owner } from '../Types/SharedTypes';
import usePetStore from '../Stores/PetStore';
import dayjs, { Dayjs } from 'dayjs';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ViewPets from '../Components/ViewPets';


interface viewPetProps {
    open: boolean;
    viewOwner: Owner;
    handleClose: () => void;
    ownerStates: [];
    reloadOwners: boolean,
    setReloadOwners: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ViewOwner({ open, viewOwner, handleClose, ownerStates, reloadOwners, setReloadOwners }: viewPetProps) {
    const [submitSuccessMessage, setSuccessMessage] = React.useState('');
    const [submitErrorMessage, setErrorMessage] = React.useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [openStates, setOpenStates] = useState(false);
    const [editOwner, setEditOwner] = useState<Owner>({});
    const [tabIndex, setTabIndex] = React.useState(0);


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
        const ownerPhotos = viewOwner.ownerPhotos?.map(m =>
        (
            {
                id: m.id,
                fileName: m.fileName,
                fileDataBase64: m.fileDataBase64
            }
        ));

        setSelectedFiles(ownerPhotos);
    }, [viewOwner]);

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
                {...other}
            >
                {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
            </div>
        );
    }


    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const handleSaveOwnerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

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

        fetch("/api/Owner/UpdateOwner", {
            method: "POST",
            body: editOwnerData,
        }).then((data) => {
            if (data.ok) {
                setSelectedFiles([]);
                setReloadOwners(!reloadOwners);
                setSuccessMessage("Owner Saved")
                handleClose();
            }
            else {
                setErrorMessage("Error Saving Owner");
            }
        }).catch((error) => {
            console.log(error);
            setErrorMessage("Error Saving Owner");
        });
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="lg"
        >
            <form name="saveOwnerForm" onSubmit={handleSaveOwnerSubmit}>
                <DialogContent sx={{ height:800}}>
                    <DialogContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            flexWrap: 'wrap',
                            width: '100%',
                            alignItems: 'center',
                            p:0
                        }}
                    >
                        <DialogTitle sx={{p:0}} >View Owner</DialogTitle>
                        <ImageUpload label="Upload Photos" selectedFiles={selectedFiles} onChange={handleFileInputChange} />
                    </DialogContent>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabIndex} onChange={handleTabChange}>
                            <Tab label="Info" {...a11yProps(0)} />
                            <Tab label="Pets" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={tabIndex} index={0}>
                        <DialogContent
                            sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%'  }}
                        >
                            <DialogContent
                                sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', flex: 1 }}
                            >
                                <DialogContentText>
                                    First Name
                                </DialogContentText>
                                <OutlinedInput
                                    autoFocus
                                    // required
                                    margin="dense"
                                    id="firstName"
                                    name="firstName"
                                    label="First Name"
                                    placeholder="First Name"
                                    type="text"
                                    value={editOwner.firstName}
                                    onChange={handleChange}
                                />
                                <DialogContentText>
                                    Address
                                </DialogContentText>
                                <OutlinedInput
                                    autoFocus
                                    //required
                                    margin="dense"
                                    id="address"
                                    name="address"
                                    label="Address"
                                    placeholder="Address"
                                    type="text"
                                    value={editOwner.address}
                                    onChange={handleChange}
                                />
                                <DialogContentText>
                                    State
                                </DialogContentText>
                                <FormControl fullWidth>
                                    <Select
                                        displayEmpty
                                        id="select-owner-state"
                                        name="ownerState"
                                        value={editOwner.state}
                                        label="Pet Type"
                                        onChange={handleChangeState}
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
                                <DialogContentText>
                                    Email
                                </DialogContentText>
                                <OutlinedInput
                                    margin="dense"
                                    id="ownerEmail"
                                    name="email"
                                    label="Owner Email"
                                    placeholder="Email"
                                    type="text"
                                    fullWidth
                                    value={editOwner.email}
                                    onChange={handleChange}
                                />
                                <DialogContentText>
                                    Primary Phone
                                </DialogContentText>
                                <OutlinedInput
                                    margin="dense"
                                    id="primaryPhone"
                                    name="primaryPhone"
                                    label="Primary Phone"
                                    placeholder="Primary Phone"
                                    type="text"
                                    fullWidth
                                    value={editOwner.primaryPhone}
                                    onChange={handleChange}
                                />
                                <DialogContentText>
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
                                />
                            </DialogContent>
                            <DialogContent
                                sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', flex: 1 }}
                            >
                                <DialogContentText>
                                    Last Name
                                </DialogContentText>
                                <OutlinedInput
                                    autoFocus
                                    //required
                                    margin="dense"
                                    id="lastName"
                                    name="lastName"
                                    label="Last Name"
                                    placeholder="Last Name"
                                    type="text"
                                    value={editOwner.lastName}
                                    onChange={handleChange}
                                />
                                <DialogContentText>
                                    City
                                </DialogContentText>
                                <OutlinedInput
                                    autoFocus
                                    //required
                                    margin="dense"
                                    id="city"
                                    name="city"
                                    label="city"
                                    placeholder="City"
                                    type="text"
                                    value={editOwner.city}
                                    onChange={handleChange}
                                />
                                <DialogContentText>
                                    Zip Code
                                </DialogContentText>
                                <OutlinedInput
                                    margin="dense"
                                    id="zipCode"
                                    name="zipCode"
                                    label="Owner Zip"
                                    placeholder="Zip Code"
                                    type="text"
                                    fullWidth
                                    value={editOwner.zipCode}
                                    onChange={handleChange}
                                />
                                <DialogContentText>
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
                                />
                                <DialogContentText>
                                    Secondary Phone
                                </DialogContentText>
                                <OutlinedInput
                                    margin="dense"
                                    id="secondaryPhone"
                                    name="secondaryPhone"
                                    label="Secondary Phone"
                                    placeholder="Secondary Phone"
                                    type="text"
                                    fullWidth
                                    value={editOwner.secondaryPhone}
                                    onChange={handleChange}
                                />
                                <DialogContentText>
                                    Veterinarian Phone
                                </DialogContentText>
                                <OutlinedInput
                                    margin="dense"
                                    id="vetPhone"
                                    name="vetPhone"
                                    label="Veterinarian Phone"
                                    placeholder="Veterinarian Phone"
                                    type="text"
                                    fullWidth
                                    value={editOwner.vetPhone}
                                    onChange={handleChange}
                                />

                            </DialogContent>
                        </DialogContent>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabIndex} index={1}>
                        <DialogContent>
                            <ViewPets ownerId={viewOwner.id} />
                        </DialogContent>
                    </CustomTabPanel>
                </DialogContent>
                <DialogActions sx={{ pb: 3, px: 3 }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" color="info" type="submit">Save</Button>
                </DialogActions>
                {/*{submitSuccessMessage?.length > 0 && (*/}
                {/*    <Alert variant="filled" severity="success">*/}
                {/*        {submitSuccessMessage}*/}
                {/*    </Alert>*/}
                {/*)}*/}
                {submitErrorMessage?.length > 0 && (
                    <Alert variant="filled" severity="error">
                        {submitErrorMessage}
                    </Alert>
                )}
            </form>
        </Dialog>
    );
}