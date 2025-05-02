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
import useSharedStore from '../Stores/SharedStore';

import '../Styles/petTracker.css';

interface AddPetProps {
    open: boolean;
    setOpen: (arg:boolean) => void;
    handleClose: () => void;
}
export default function AddPet({ open, setOpen, handleClose }: AddPetProps)
{
    const [submitSuccessMessage, setSuccessMessage] = React.useState('');
    const [submitErrorMessage, setErrorMessage] = React.useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [addPet, setAddPet] = useState<Pet>(
        {
            breeds: []
        });
    const [openBreeds, setOpenBreeds] = useState(false);

    const getPetTypes = useSharedStore((state) => state.getPetTypes);
    const petTypes = useSharedStore((state) => state.petTypes);

    const getPetBreeds = useSharedStore((state) => state.getPetBreeds);
    const petBreeds = useSharedStore((state) => state.petBreeds);

    useEffect(() => {
     getPetTypes();
    }, []);

    useEffect(() =>
    {
        if (addPet.petTypeId) {
            getPetBreeds(addPet.petTypeId);
        }
    }, [addPet.petTypeId]);

    const petGenders = [
        { value: "Male" },
        { value: "Female" },
    ]


    const handleFileInputChange = (newValue:File[]) => {
        setSelectedFiles(newValue);
    };

    const handleChangePetType = (e: SelectChangeEvent) =>
    {
        if (petTypes && petTypes?.length > 0) {
            const petType = petTypes.find(f => f.type == e.target.value);
            setAddPet({ ...addPet, petTypeId: petType.id, petType: petType.type });
        }
    };

    const handleChangePetBreed = (e: SelectChangeEvent) =>
    {
        if (petBreeds && petBreeds?.length > 0) {
            const petBreed = petBreeds.filter(f => e.target.value.indexOf(f.name) > -1);
            setAddPet({ ...addPet, breedTypeIds: petBreed.map(m=>m.id), breeds: petBreed.map(m => m.name) });
        }
        setOpenBreeds(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddPet(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleChangeDate = (e) => {
        setAddPet({ ...addPet, birthDate: e });
    };

    const handleChangePetSex = (e: SelectChangeEvent) => {
        setAddPet({ ...addPet, sex: e.target.value });
    };

    const handleAddPetSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        const addPetData = new FormData();
        Array.from(selectedFiles).forEach((f,i) => {
            addPetData.append(`model.PetPhotos`, f);
        });

        addPetData.append("model.Name", addPet.name);
        addPetData.append("model.PetTypeId", addPet.petTypeId);
        addPetData.append("model.PetType", addPet.petType);
        addPetData.append("model.BreedTypeIds", addPet.breedTypeIds);
        addPetData.append("model.Breeds", addPet.breeds);
        addPetData.append("model.Color", addPet.color);
        addPetData.append("model.BirthDate", addPet.birthDate);
        addPetData.append("model.Weight", addPet.weight);
        addPetData.append("model.Sex", addPet.sex);
        addPetData.append("model.MedicalProblems", addPet.medicalProblems);

        fetch("/api/Pet/CreatePet", {
            method: "POST",
            body: addPetData,
        }).then((data) => {
            if (data.ok) {
                setSelectedFiles([]);
                setAddPet({
                    breeds: []
                });
                setSuccessMessage("Pet Created")
                setOpen(false);
            }
            else {
                setErrorMessage("Error Creating Pet");
            }
        }).catch((error) => {
            console.log(error);
            setErrorMessage("Error Creating Pet");
        });
    }

    return (
        <Dialog
          open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="lg"
          >
          <form name="addPetForm" onSubmit={handleAddPetSubmit}>
          <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', width: '100%', alignItems: 'center' }}
          >
              <DialogTitle>Add Pet</DialogTitle>      
              <ImageUpload label="Upload Photos" selectedFiles={selectedFiles} onChange={handleFileInputChange} />
          </DialogContent>
          <DialogContent
              sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}
          >
              <DialogContent
                        sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', flex:1 }}
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
                  value={addPet.name}
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

                            <MenuItem key={ m.type } value={m.type}>{m.type}</MenuItem>
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
                      
                      disabled = { petBreeds?.length > 0? false : true }
                  >
                      {petBreeds?.length > 0 && (petBreeds.map(m =>

                          <MenuItem key={ m.name } value={m.name}>{m.name}</MenuItem>
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
                  value={addPet.color}
                  onChange={handleChange}
              />
              </DialogContent>
              <DialogContent
                        sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', flex:1 }}
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
                autoFocus
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
                  value={addPet.medicalProblems}
                  onChange={handleChange}
              />
                        </DialogContent>
          </DialogContent>
          <DialogActions sx={{ pb: 3, px: 3 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" color="info" type="submit">Create</Button>
          </DialogActions>
          {submitSuccessMessage?.length > 0 && (
              <Alert variant="filled" severity="success">
                  {submitSuccessMessage}
              </Alert>
          )}
          {submitErrorMessage?.length > 0 && (
              <Alert variant="filled" severity="error">
                  {submitErrorMessage}
              </Alert>
          )}
          </form>
        </Dialog>
    );
}