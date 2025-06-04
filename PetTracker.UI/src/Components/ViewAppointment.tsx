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
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import useAppointmentStore from '../Stores/AppointmentStore';
import dayjs, { Dayjs } from 'dayjs';

interface viewAppointmentProps {
    open: boolean;
    handleClose: () => void;
    viewAppointment: Appointment;
    reloadAppointments: boolean;
    setReloadAppointments: React.Dispatch<React.SetStateAction<boolean>>;
    owners: [];
}

export default function ViewAppointment({ open, handleClose, viewAppointment, reloadAppointments, setReloadAppointments, owners }: ViewAppointmentProps) {
    const [submitSuccessMessage, setSuccessMessage] = React.useState('');
    const [submitErrorMessage, setErrorMessage] = React.useState('');
    const [start, setStart] = React.useState<Dayjs>(dayjs());
    const [end, setEnd] = React.useState<Dayjs>(dayjs());
    const [editAppointment, setEditAppointment] = useState<Appointment>(
        {
        });

    const [openPets, setOpenPets] = useState(false);
    const getPetList = useAppointmentStore((state) => state.getPetList);
    const {
        pets,
        loadingPets,
        errorMessage,
        showErrors
    } = useAppointmentStore();

    useEffect(() => {
        const copy = {
            id: viewAppointment.id,
            companyId: viewAppointment.companyId,
            userId: viewAppointment.userId,
            ownerId: viewAppointment.ownerId,
            owner: viewAppointment.owner,
            petId: viewAppointment.petId,
            petName: viewAppointment.petName,
            start: dayjs(viewAppointment.start),
            end: dayjs(viewAppointment.end),
            title: viewAppointment.title,
            description: viewAppointment.description
        };

        setEditAppointment(copy);
    }, [viewAppointment]);

    useEffect(() => {
        if (viewAppointment.ownerId) {
            getPetList(viewAppointment.ownerId);
        }
    }, [viewAppointment.ownerId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditAppointment(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleChangeStartDate = (e) => {
        setEditAppointment({ ...editAppointment, start: e });
    };

    const handleChangeEndDate = (e) => {
        setEditAppointment({ ...editAppointment, end: e });
    };

    const handleChangeOwner = (e: SelectChangeEvent) => {
        if (owners && owners?.length > 0) {
            const owner = owners.find(f => (f.fullName == e.target.value));
            if (owner) {
                setEditAppointment({ ...editAppointment, ownerId: owner.id, petType: owner.fullName });
            }
        }
    };

    const handleChangePet = (e: SelectChangeEvent) => {
        if (pets && pets?.length > 0) {
            const pet = pets.find(f => e.target.value == f.name);
            if (pet) {
                setEditAppointment({ ...editAppointment, petId: pet.id, petName: pet.name });
            }
        }
        setOpenPets(false);
    };

    const handleSaveAppointmentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        const editAppointmentModel = {
            id: editAppointment.id,
            companyId: editAppointment.companyId??null,
            userId: editAppointment.userId??null,
            ownerId: editAppointment.ownerId ?? null,
            petId: editAppointment.petId ?? null,
            title: editAppointment.title ?? '',
            description: editAppointment.description ?? '',
            start: editAppointment.start ?? '',
            end: editAppointment.end ?? '',
        };

        try {
            const response = await fetch("/api/Appointment/UpdateAppointment", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editAppointmentModel)
            });

            if (!response.ok) {
                throw new Error(await response.json());
            }

            if (response.status == 200) {
                setReloadAppointments(!reloadAppointments);
                setEditAppointment({
                });
                setSuccessMessage("Appointment Updated")
                handleClose();
            }
        } catch (e) {
            setErrorMessage(e.message);
        }
    }

    const handleDelete = async () =>
    {
        event.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const delModel = {
                id:editAppointment.id
            };

            const response = await fetch("/api/Appointment/DeleteAppointment", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: editAppointment.id
            });

            if (!response.ok) {
                throw new Error(await response.json());
            }

            if (response.status == 200) {
                setReloadAppointments(!reloadAppointments);
                setEditAppointment({
                });
                setSuccessMessage("Appointment Updated")
                handleClose();
            }
        } catch (e) {
            setErrorMessage(e.message);
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="lg"
        >
            <form name="editAppointmentForm" onSubmit={handleSaveAppointmentSubmit}>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', width: '100%', alignItems: 'center' }}
                >
                    <DialogTitle>View Appointment</DialogTitle>
                    {showErrors && (
                        <ErrorDisplay error={errorMessage} />
                    )}
                    {submitErrorMessage?.length > 0 && (
                        <ErrorDisplay error={submitErrorMessage} />
                    )}
                </DialogContent>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', flex: 1, pb: 1 }}
                >
                    <DialogContentText>
                        Title
                    </DialogContentText>
                    <OutlinedInput
                        required
                        margin="dense"
                        id="appointmentTitle"
                        name="title"
                        label="Title"
                        placeholder="Title"
                        type="text"
                        fullWidth
                        value={editAppointment.title}
                        onChange={handleChange}
                    />
                    <DialogContentText>
                        Description
                    </DialogContentText>
                    <OutlinedInput
                        required
                        margin="dense"
                        id="appointmentDescription"
                        name="description"
                        label="Appointment Description"
                        placeholder="Description"
                        type="textArea"
                        multiline
                        minRows="3"
                        fullWidth
                        value={editAppointment.description}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%', px: 0 }}
                >
                    <DialogContent
                        sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', flex: 1 }}
                    >
                        <DialogContentText>
                            Owner
                        </DialogContentText>
                        <FormControl fullWidth>
                            <Select
                                displayEmpty
                                id="select-appointment-owner"
                                name="owner"
                                value={editAppointment.owner}
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
                                value={editAppointment.petName}
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
                            <DateTimePicker
                                name="start"
                                value={editAppointment.start}
                                onChange={handleChangeStartDate}
                                slotProps={{ textField: { size: 'small' } }}
                            />
                        </LocalizationProvider>
                        <DialogContentText>
                            End Date
                        </DialogContentText>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                name="end"
                                value={editAppointment.end}
                                onChange={handleChangeEndDate}
                                slotProps={{ textField: { size: 'small' } }}
                            />
                        </LocalizationProvider>
                    </DialogContent>
                </DialogContent>
                <DialogActions sx={{ pb: 3, px: 3 }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" color="info" type="submit">Save Appointment</Button>
                    <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>

                </DialogActions>
            </form>
        </Dialog>
    );
}
