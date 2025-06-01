import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Appointment from '../Types/SharedTypes';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import ErrorDisplay from '../Components/ErrorDisplay';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import useOwnerStore from '../Stores/OwnerStore';


interface AddAppointmentProps {
    open: boolean;
    handleClose: () => void;
    reloadAppointments: boolean;
    setReloadAppointments: React.Dispatch<React.SetStateAction<boolean>>;
    startDate: Date;
    endDate: Date;
    owners: [];
}

export default function AddAppointment({ open, handleClose, reloadAppointments, setReloadAppointments, startDate, endDate, owners }: AddAppointmentProps) {
    const [submitSuccessMessage, setSuccessMessage] = React.useState('');
    const [submitErrorMessage, setErrorMessage] = React.useState('');
    const [addAppointment, setAddAppointment] = useState<Appointment>(
        {
            start: startDate,
            end: endDate,
        });
    const [openPets, setOpenPets] = useState(false);

    const getPetList = useOwnerStore((state) => state.getPetList);
    const {
        pets,
        loadingPets,
        errorMessage,
        showErrors
    } = useOwnerStore();

    useEffect(() => {
        if (addAppointment.ownerId) {
            getPetList(addAppointment.ownerId);
        }
    }, [addAppointment.ownerId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddAppointment(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleChangeOwner= (e: SelectChangeEvent) => {
        if (owners && owners?.length > 0) {
            const owner = owners.find(f => (f.fullName == e.target.value));
            if (owner) {
                setAddAppointment({ ...addAppointment, ownerId: owner.id, petType: owner.fullName });
            }
        }
    };

    const handleChangePet = (e: SelectChangeEvent) => {
        if (pets && pets?.length > 0) {
            const pet = pets.filter(f => e.target.value.indexOf(f.name) > -1);
            setAddAppointment({ ...addAppointment, petId: pet.id, petName: pet.name });
        }
        setOpenPets(false);
    };

    const handleChangeDate = (e) => {
        setAddAppointment({ ...addAppointment, birthDate: e });
    };

    const handleAddAppointmentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        setReloadAppointments(!reloadAppointments);
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="lg"
        >
            <form name="addAppointmentForm" onSubmit={handleAddAppointmentSubmit}>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', width: '100%', alignItems: 'center' }}
                >
                    <DialogTitle>Add Appointment</DialogTitle>
                    {showErrors && (
                        <ErrorDisplay error={errorMessage} />
                    )}
                    {submitErrorMessage?.length > 0 && (
                        <ErrorDisplay error={submitErrorMessage} />
                    )}
                </DialogContent>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}
                >
                    <DialogContent
                        sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', flex: 1 }}
                    >
                        <DialogContentText>
                            Title
                        </DialogContentText>
                        <OutlinedInput
                            //required
                            margin="dense"
                            id="appointmentTitle"
                            name="color"
                            label="Title"
                            placeholder="Title"
                            type="text"
                            fullWidth
                            value={addAppointment.title}
                            onChange={handleChange}
                        />
                        <DialogContentText>
                            Description
                        </DialogContentText>
                        <OutlinedInput
                            //required
                            margin="dense"
                            id="appointmentDescription"
                            name="appointmentDescription"
                            label="Appointment Description"
                            placeholder="Description"
                            type="textArea"
                            multiline
                            minRows="3"
                            fullWidth
                            value={addAppointment.description}
                            onChange={handleChange}
                        />
                        <DialogContentText>
                            Owner
                        </DialogContentText>
                        <FormControl fullWidth>
                            <Select
                                displayEmpty
                                id="select-appointment-owner"
                                name="owner"
                                value={addAppointment.owner}
                                label="Owner"
                                onChange={handleChangeOwner}
                                renderValue={(selected) => {
                                    if (!selected) {
                                        return <em>Select</em>;
                                    }

                                    return selected;
                                }}
                            >
                                {owners?.length > 0 && (owners?.map(m =>

                                    <MenuItem key={m.fullName} value={m.fullName}>{m.fullName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <DialogContentText>
                            Pet
                        </DialogContentText>
                        <FormControl fullWidth>
                            <Select
                                displayEmpty
                                id="select-pet"
                                name="pets"
                                value={addAppointment.petName}
                                label="Pet"
                                open={openPets}
                                onOpen={() => setOpenPets(true)}
                                onClose={() => setOpenPets(false)}
                                onChange={handleChangePet}
                                renderValue={(selected) => {
                                    if (pets?.length < 1) {
                                        return <em>Select Owner To View Pets</em>;
                                    }
                                    if (pets?.length > 0 && !selected) {
                                        return <em>Select</em>;
                                    }
                                    return selected;
                                }}

                                disabled={pets?.length > 0 ? false : true}
                            >
                                {pets?.length > 0 && (pets.map(m =>

                                    <MenuItem key={m.name} value={m.name}>{m.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogContent
                        sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', flex: 1 }}
                    >
                        <DialogContentText>
                            Start Date
                        </DialogContentText>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                name="birthDate"
                                value={addAppointment.start}
                                onChange={handleChangeDate}
                                slotProps={{ textField: { size: 'small' } }}
                            />
                        </LocalizationProvider>
                        <DialogContentText>
                            End Date
                        </DialogContentText>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                name="birthDate"
                                value={addAppointment.end}
                                onChange={handleChangeDate}
                                slotProps={{ textField: { size: 'small' } }}
                            />
                        </LocalizationProvider>
                    </DialogContent>
                </DialogContent>
                <DialogActions sx={{ pb: 3, px: 3 }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" color="info" type="submit">Add Appointment</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}