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
import Pet from '../Types/SharedTypes';
import usePetStore from '../Stores/PetStore';
import dayjs, { Dayjs } from 'dayjs';

interface viewPetProps {
    open: boolean;
    viewPet: Pet;
    handleClose: () => void;
    petTypes: [];
    reloadPets: boolean,
    setReloadPets: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ViewPet({ open, viewPet, handleClose, petTypes, reloadPets, setReloadPets }: viewPetProps) {
    const [submitSuccessMessage, setSuccessMessage] = React.useState('');
    const [submitErrorMessage, setErrorMessage] = React.useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [openBreeds, setOpenBreeds] = useState(false);
    const [editPet, setEditPet] = useState<Pet>({});

    useEffect(() => {
        const copy = {
            id: viewPet.id,
            name: viewPet.name,
            petTypeId: viewPet.petType?.id,
            petType: viewPet.petType?.type,
            breedTypeIds: viewPet.breedTypes?.map(m => m.id),
            breeds: viewPet.breedTypes?.map(m => m.name),
            color: viewPet.color,
            birthDate: dayjs(viewPet.birthDate),
            weight:viewPet.weight,
            sex: viewPet.sex,
            medicalProblems: viewPet.medicalProblems
        };

        setEditPet(copy);
    }, [viewPet]);

    useEffect(() => {
        const petPhotos = viewPet.petPhotos?.map(m =>
        (
            {
                id: m.id,
                fileName: m.fileName,
                fileDataBase64: m.fileDataBase64
            }
        ));

        setSelectedFiles(petPhotos);
    }, [viewPet]);

    const getPetBreeds = usePetStore((state) => state.getPetBreeds);
    const petBreeds = usePetStore((state) => state.petBreeds);

    useEffect(() => {
        if (editPet.petTypeId) {
            getPetBreeds(editPet.petTypeId);
        }
    }, [editPet.petTypeId]);

    const petGenders = [
        { value: "Male" },
        { value: "Female" },
    ]

    const handleFileInputChange = (newValue: File[]) => {
        setSelectedFiles(newValue);
    };

    const handleChangePetType = (e: SelectChangeEvent) => {
        if (petTypes && petTypes?.length > 0 && e.target.value) {
            const petType = petTypes.find(f => f.type == e.target.value);
            setEditPet({ ...editPet, petTypeId: petType.id, petType: petType.type });
        }
    };


    const handleChangePetBreed = (e: SelectChangeEvent) => {
        if (petBreeds && petBreeds?.length > 0 && e.target.value) {
            const petBreed = petBreeds.filter(f => e.target.value.indexOf(f.name) > -1);
            setEditPet({ ...editPet, breedTypeIds: petBreed.map(m=>m.id), breeds: petBreed.map(m => m.name) });
        }
        setOpenBreeds(false);
    };

    const handleChange = (e) => {
        //const { name, value } = e.target;
        //editPet[name]= value;
        const { name, value } = e.target;
        setEditPet(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleChangeDate = (e) => {
        setEditPet({ ...editPet, birthDate: e });
    };

    const handleChangePetSex = (e: SelectChangeEvent) => {
        setEditPet({ ...editPet, sex: e.target.value });
    };

    const handleSavePetSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        const editPetData = new FormData();
        Array.from(selectedFiles).forEach((f, i) => {
            editPetData.append(`model.PetPhotos`, f);
        });

        editPetData.append("model.Id", editPet.id);
        editPetData.append("model.Name", editPet.name??'');
        editPetData.append("model.PetTypeId", editPet.petTypeId??'');
        editPetData.append("model.PetType", editPet.petType??'');
        editPet.breedTypeIds.forEach(f => {
            editPetData.append("model.BreedTypeIds", f);
        });
        editPetData.append("model.Breeds", editPet.breeds??'');
        editPetData.append("model.Color", editPet.color??'');
        editPetData.append("model.BirthDate", editPet.birthDate??'');
        editPetData.append("model.Weight", editPet.weight??'');
        editPetData.append("model.Sex", editPet.sex??'');
        editPetData.append("model.MedicalProblems", editPet.medicalProblems??'');

        fetch("/api/Pet/UpdatePet", {
            method: "POST",
            body: editPetData,
        }).then((data) => {
            if (data.ok) {
                setSelectedFiles([]);
                setReloadPets(!reloadPets);
                setSuccessMessage("Pet Saved")
                handleClose();
            }
            else {
                setErrorMessage("Error Saving Pet");
            }
        }).catch((error) => {
            console.log(error);
            setErrorMessage("Error Saving Pet");
        });
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="lg"
        >
            <form name="savePetForm" onSubmit={handleSavePetSubmit}>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', width: '100%', alignItems: 'center' }}
                >
                    <DialogTitle>View Pet</DialogTitle>
                    <ImageUpload label="Upload Photos" selectedFiles={selectedFiles} onChange={handleFileInputChange} />
                </DialogContent>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}
                >
                    <DialogContent
                        sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', flex: 1 }}
                    >
                        <DialogContentText>
                            Name
                        </DialogContentText>
                        <OutlinedInput
                            autoFocus
                            required
                            margin="dense"
                            id="petName"
                            name="name"
                            label="Pet Name"
                            placeholder="Pet Name"
                            type="text"
                            value={editPet.name}
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
                                value={editPet.petType}
                                label="Pet Type"
                                onChange={handleChangePetType}
                                renderValue={(selected) => {
                                    if (!selected) {
                                        return <em>Select</em>;
                                    }

                                    return selected;
                                }}
                            >
                                {petTypes?.length > 0 && (petTypes?.map((m,index) => (

                                    <MenuItem key={index} value={m.type}>{m.type}</MenuItem>
                                )))}
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
                                value={editPet.breeds}
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
                                            {selected?.map((value) => (
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
                            autoFocus
                            //required
                            margin="dense"
                            id="petColor"
                            name="color"
                            label="Pet Color"
                            placeholder="Pet Color"
                            type="text"
                            fullWidth
                            value={editPet.color}
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
                                value={editPet.birthDate}
                                onChange={handleChangeDate}
                                slotProps={{ textField: { size: 'small' } }}
                            />
                        </LocalizationProvider>
                        <DialogContentText>
                            Weight
                        </DialogContentText>
                        <OutlinedInput
                            autoFocus
                            margin="dense"
                            id="petWeight"
                            name="weight"
                            label="Pet Weight"
                            placeholder="Pet Weight"
                            type="text"
                            fullWidth
                            value={editPet.weight}
                            onChange={handleChange}
                        />
                        <DialogContentText>
                            Sex
                        </DialogContentText>
                        <Select
                            displayEmpty
                            id="select-pet-sex"
                            name="sex"
                            value={editPet.sex}
                            label="Pet Sex"
                            onChange={handleChangePetSex}
                            renderValue={(selected) => {
                                if (!selected) {
                                    return <em>Select Sex</em>;
                                }

                                return selected;
                            }}
                        >
                            {petGenders?.length > 0 && (petGenders.map((m,index) =>(

                                <MenuItem key={ index} value={m.value}>{m.value}</MenuItem>
                            )))}
                        </Select>
                        <DialogContentText>
                            Medical Problems
                        </DialogContentText>
                        <OutlinedInput
                            autoFocus
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
                            value={editPet.medicalProblems}
                            onChange={handleChange}
                        />
                    </DialogContent>
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