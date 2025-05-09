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
    setReloadOwnerss: React.Dispatch<React.SetStateAction<boolean>>;
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
            const ownerState = ownerStates.find(f => f == e.target.value);
            setAddOwner({ ...addOwner, state: ownerState });
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

        addOwnerData.append("model.FirstName", addOwner.firstName);
        addOwnerData.append("model.LastName", addOwner.lastName);
        addOwnerData.append("model.Address", addOwner.address);
        addOwnerData.append("model.City", addOwner.city);
        addOwnerData.append("model.State", addOwner.state);
        addOwnerData.append("model.ZipCode", addOwner.zipCode);
        addOwnerData.append("model.Email", addOwner.email);
        addOwnerData.append("model.Phone", addOwner.phone);
        addOwnerData.append("model.ReferredBy", addOwner.referredBy);
        addOwnerData.append("model.Vet", addOwner.vet);
        addOwnerData.append("model.VetPhone", addOwner.vetPhone);

        fetch("/api/Owner/CreateOwner", {
            method: "POST",
            body: addOwnerData,
        }).then((data) => {
            if (data.ok) {
                setSelectedFiles([]);
                setReloadOwners(!reloadOwners);
                addOwner({
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
                            name="firstNamw"
                            label="First Name"
                            placeholder="First Name"
                            type="text"
                            value={addOwner.firstName}
                            onChange={handleChange}
                        />
                        <DialogContentText>
                            Pet Type
                        </DialogContentText>
                        <FormControl fullWidth>
                            <Select
                                displayEmpty
                                id="select-pet-type"
                                name="petType"
                                value={addPet.petType}
                                label="Pet Type"
                                onChange={handleChangePetType}
                                renderValue={(selected) => {
                                    if (!selected) {
                                        return <em>Select</em>;
                                    }

                                    return selected;
                                }}
                            >
                                {petTypes?.length > 0 && (petTypes?.map(m =>

                                    <MenuItem key={m.type} value={m.type}>{m.type}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <DialogContentText>
                            Breed
                        </DialogContentText>
                        <FormControl fullWidth>
                            <Select
                                multiple
                                displayEmpty
                                id="select-pet-type"
                                name="breeds"
                                value={addPet.breeds}
                                label="Pet Breed"
                                open={openBreeds}
                                onOpen={() => setOpenBreeds(true)}
                                onClose={() => setOpenBreeds(false)}
                                onChange={handleChangePetBreed}
                                renderValue={(selected) => {
                                    if (petBreeds?.length < 1) {
                                        return <em>Select Pet Type To View Breeds</em>;
                                    }
                                    if (petBreeds?.length > 0 && selected?.length < 1) {
                                        return <em>Select</em>;
                                    }
                                    return (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} />
                                            ))}
                                        </Box>)
                                }}

                                disabled={petBreeds?.length > 0 ? false : true}
                            >
                                {petBreeds?.length > 0 && (petBreeds.map(m =>

                                    <MenuItem key={m.name} value={m.name}>{m.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <DialogContentText>
                            Color
                        </DialogContentText>
                        <OutlinedInput
                            //required
                            margin="dense"
                            id="petColor"
                            name="color"
                            label="Pet Color"
                            placeholder="Pet Color"
                            type="text"
                            fullWidth
                            value={addPet.color}
                            onChange={handleChange}
                        />
                    </DialogContent>
                    <DialogContent
                        sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', flex: 1 }}
                    >
                        <DialogContentText>
                            Birth Date
                        </DialogContentText>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                name="birthDate"
                                value={addPet.birthDate}
                                onChange={handleChangeDate}
                                slotProps={{ textField: { size: 'small' } }}
                            />
                        </LocalizationProvider>
                        <DialogContentText>
                            Weight
                        </DialogContentText>
                        <OutlinedInput
                            margin="dense"
                            id="petWeight"
                            name="weight"
                            label="Pet Weight"
                            placeholder="Pet Weight"
                            type="text"
                            fullWidth
                            value={addPet.weight}
                            onChange={handleChange}
                        />
                        <DialogContentText>
                            Sex
                        </DialogContentText>
                        <Select
                            displayEmpty
                            id="select-pet-sex"
                            name="sex"
                            value={addPet.sex}
                            label="Pet Sex"
                            onChange={handleChangePetSex}
                            renderValue={(selected) => {
                                if (!selected) {
                                    return <em>Select Sex</em>;
                                }

                                return selected;
                            }}
                        >
                            {petGenders?.length > 0 && (petGenders.map(m =>

                                <MenuItem value={m.value}>{m.value}</MenuItem>
                            ))}
                        </Select>
                        <DialogContentText>
                            Medical Problems
                        </DialogContentText>
                        <OutlinedInput
                            //required
                            margin="dense"
                            id="petMedicalProblems"
                            name="medicalProblems"
                            label="Pet Medical Problems"
                            placeholder="Pet Medical Problems"
                            type="textArea"
                            multiline
                            minRows="3"
                            fullWidth
                            value={addPet.medicalProblems}
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