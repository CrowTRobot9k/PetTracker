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
import Owner from '../Types/SharedTypes';

interface AddOwnerProps {
    open: boolean;
    handleClose: () => void;
    ownerStates: [];
    reloadOwners: boolean,
    setReloadOwners: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddOwner({ open, handleClose, ownerStates, reloadOwners, setReloadOwners }: AddOwnerProps) {
    const [submitSuccessMessage, setSuccessMessage] = React.useState('');
    const [submitErrorMessage, setErrorMessage] = React.useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [addOwner, setAddOwner] = useState<Owner>(
        {
        });
    const [openStates, setOpenStates] = useState(false);

    const handleFileInputChange = (newValue: File[]) => {
        setSelectedFiles(newValue);
    };

    const handleChangeState = (e: SelectChangeEvent) => {
        if (ownerStates && ownerStates?.length > 0) {
            const ownerState = ownerStates.find(f => f.abbr == e.target.value);
            if (ownerState) {
                setAddOwner({ ...addOwner, state: ownerState.abbr });
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddOwner(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddOwnerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        const addOwnerData = new FormData();
        Array.from(selectedFiles).forEach((f, i) => {
            addOwnerData.append(`model.OwnerPhotos`, f);
        });

        addOwnerData.append("model.FirstName", addOwner.firstName??'');
        addOwnerData.append("model.LastName", addOwner.lastName??'');
        addOwnerData.append("model.Address", addOwner.address??'');
        addOwnerData.append("model.City", addOwner.city??'');
        addOwnerData.append("model.State", addOwner.state??'');
        addOwnerData.append("model.ZipCode", addOwner.zipCode??'');
        addOwnerData.append("model.Email", addOwner.email??'');
        addOwnerData.append("model.PrimaryPhone", addOwner.primaryPhone??'');
        addOwnerData.append("model.SecondaryPhone", addOwner.secondaryPhone??'');
        addOwnerData.append("model.ReferredBy", addOwner.referredBy??'');
        addOwnerData.append("model.Vet", addOwner.vet??'');
        addOwnerData.append("model.VetPhone", addOwner.vetPhone??'');

        fetch("/api/Owner/CreateOwner", {
            method: "POST",
            body: addOwnerData,
        }).then((data) => {
            if (data.ok) {
                setSelectedFiles([]);
                setReloadOwners(!reloadOwners);
                setAddOwner({
                });
                setSuccessMessage("Owner Created")
                handleClose();
            }
            else {
                setErrorMessage("Error Creating Owner");
            }
        }).catch((error) => {
            console.log(error);
            setErrorMessage("Error Creating Owner");
        });
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="lg"
        >
            <form name="addOwnerForm" onSubmit={handleAddOwnerSubmit}>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', width: '100%', alignItems: 'center' }}
                >
                    <DialogTitle>Add Owner</DialogTitle>
                    <ImageUpload label="Upload Photos" selectedFiles={selectedFiles} onChange={handleFileInputChange} />
                </DialogContent>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}
                >
                    <DialogContent
                        sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', flex: 1 }}
                    >
                        <DialogContentText>
                            First Name
                        </DialogContentText>
                        <OutlinedInput
                            autoFocus
                            required
                            margin="dense"
                            id="firstName"
                            name="firstName"
                            label="First Name"
                            placeholder="First Name"
                            type="text"
                            value={addOwner.firstName}
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
                            value={addOwner.address}
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
                                value={addOwner.state}
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
                            value={addOwner.email}
                            onChange={handleChange}
                        />
                        <DialogContentText>
                            Primary Phone
                        </DialogContentText>
                        <OutlinedInput
                            required
                            margin="dense"
                            id="primaryPhone"
                            name="primaryPhone"
                            label="Primary Phone"
                            placeholder="Primary Phone"
                            type="text"
                            fullWidth
                            value={addOwner.primaryPhone}
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
                            value={addOwner.vet}
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
                            required
                            margin="dense"
                            id="lastName"
                            name="lastName"
                            label="Last Name"
                            placeholder="Last Name"
                            type="text"
                            value={addOwner.lastName}
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
                            value={addOwner.city}
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
                            value={addOwner.zipCode}
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
                            value={addOwner.referredBy}
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
                            value={addOwner.secondaryPhone}
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
                            value={addOwner.vetPhone}
                            onChange={handleChange}
                        />
                        
                    </DialogContent>
                </DialogContent>
                <DialogActions sx={{ pb: 3, px: 3 }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" color="info" type="submit">Create</Button>
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