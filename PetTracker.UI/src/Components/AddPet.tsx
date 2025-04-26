import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import Alert from '@mui/material/Alert';
import ImageUpload from './ImageUpload';
import React, { useState } from 'react';

interface AddPetProps {
    open: boolean;
    handleClose: () => void;
}
export default function AddPet({ open, handleClose }: AddPetProps)
{
    const [submitSuccessMessage, setSuccessMessage] = React.useState('');
    const [submitErrorMessage, setErrorMessage] = React.useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleFileInputChange = (newValue:File[]) => {
        setSelectedFiles(newValue);
    };

    const handleAddPetSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");



        const data = new FormData(event.currentTarget);

        
        const petName = data.get('petName');

        const createPet = {
            PetPhotos: Array.from(selectedFiles).map((f) => ({ FileName:f.name, FormFile: f})),
            Name: petName,
        };
        fetch("/api/Pet/CreatePet", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
               model: createPet
            }),
        }).then((data) => {
            if (data.ok) {
                setSuccessMessage("Pet Created")
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
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', flex:1 }}
              >
              <DialogContentText>
               Name
              </DialogContentText>
              <OutlinedInput
                  autoFocus
                  required
                  margin="dense"
                  id="petName"
                  name="petName"
                  label="Pet Name"
                  placeholder="Pet Name"
                  type="text"
              
              />
              <DialogContentText>
                  Pet Type
              </DialogContentText>
              <OutlinedInput
                  autoFocus
                  //required
                  margin="dense"
                  id="petType"
                  name="petType"
                  label="Pet Type"
                  placeholder="Pet Type"
                  type="text"
                  fullWidth
              />
              <DialogContentText>
                  Breed
              </DialogContentText>
              <OutlinedInput
                  autoFocus
                  //required
                  margin="dense"
                  id="petBreed"
                  name="petBreed"
                  label="Pet Breed"
                  placeholder="Pet Breed"
                  type="text"
                  fullWidth
              />
              <DialogContentText>
                  Color
              </DialogContentText>
              <OutlinedInput
                  autoFocus
                  //required
                  margin="dense"
                  id="petColor"
                  name="petColor"
                  label="Pet Color"
                  placeholder="Pet Color"
                  type="text"
                  fullWidth
              />
              </DialogContent>
              <DialogContent
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', flex:1 }}
              >
              <DialogContentText>
                  Birth Date
              </DialogContentText>
              <OutlinedInput
                  autoFocus
                  //required
                  margin="dense"
                  id="petBirthDate"
                  name="petBirthDate"
                  label="Pet Birth Date"
                  placeholder="Pet Birth Date"
                  type="text"
                  fullWidth
              />
              <DialogContentText>
                  Weight
              </DialogContentText>
              <OutlinedInput
                  autoFocus
                  //required
                  margin="dense"
                  id="petWeight"
                  name="petWeight"
                  label="Pet Weight"
                  placeholder="Pet Weight"
                  type="text"
                  fullWidth
              />
              <DialogContentText>
                  Sex
              </DialogContentText>
              <OutlinedInput
                  autoFocus
                  //required
                  margin="dense"
                  id="petSex"
                  name="petSex"
                  label="Pet Sex"
                  placeholder="Pet Sex"
                  type="text"
                  fullWidth
              />
              <DialogContentText>
                  Medical Problems
              </DialogContentText>
              <OutlinedInput
                  autoFocus
                  //required
                  margin="dense"
                  id="petMedicalProblems"
                  name="petMedicalProblems"
                  label="Pet Medical Problems"
                  placeholder="Pet Medical Problems"
                  type="textArea"
                  fullWidth
              />
                        </DialogContent>
          </DialogContent>
          <DialogActions sx={{ pb: 3, px: 3 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" color="info" type="submit">Continue</Button>
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