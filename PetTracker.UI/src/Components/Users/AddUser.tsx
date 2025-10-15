import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import ImageUpload from '../ImageUpload';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { User, UserRole } from '../../Types/SharedTypes';
import ErrorDisplay from '../ErrorDisplay';
import { useAuthStore } from '../../Stores/AuthStore';
import CircularProgress from '@mui/material/CircularProgress';

interface AddUserProps {
    open: boolean;
    handleClose: () => void;
    roles: UserRole[];
    reloadUsers: boolean,
    setReloadUsers: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddUser(props: AddUserProps) {

    const [submitSuccessMessage, setSuccessMessage] = React.useState('');
    const [submitErrorMessage, setErrorMessage] = React.useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [addUser, setAddUser] = useState<User>(
        {
            roleNames:[]
        });
    const [openRoles, setOpenRoles] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // Get current user from auth store
    const { user: currentUser } = useAuthStore();
    
    // Filter roles based on current user's permissions
    const availableRoles = React.useMemo(() => {
        if (!currentUser || !currentUser.roles || !props.roles) {
            return [];
        }
        
        const currentUserRoleNames = currentUser.roles.map(role => role.name);
        
        // If user is Administrator, they can assign any role
        if (currentUserRoleNames.includes('Administrator')) {
            return props.roles;
        }
        
        // Otherwise, filter based on write access permissions
        const assignableRoles: UserRole[] = [];
        
        for (const role of props.roles) {
            const roleName = role.name;
            
            // Check if user has write access to this resource
            if (roleName.endsWith(' Write')) {
                const resourceName = roleName.replace(' Write', '');
                const readRoleName = `${resourceName} Read`;
                
                // User can assign the read version of the same resource
                const readRole = props.roles.find(r => r.name === readRoleName);
                if (readRole) {
                    assignableRoles.push(readRole);
                }
            }
        }
        
        return assignableRoles;
    }, [currentUser, props.roles]);



    const handleFileInputChange = (newValue: File[]) => {
        setSelectedFiles(newValue);
    };

    const handleChangeUserRoles = (e: SelectChangeEvent) => {
        if (availableRoles && availableRoles?.length > 0) {
            const roles = availableRoles.filter(f => e.target.value.indexOf(f.name) > -1);
            setAddUser({ ...addUser, roleNames: roles.map(m=>m.name),roles: roles});
        }
        setOpenRoles(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddUser(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddUserSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");
        setIsSaving(true);

        const addUserData = new FormData();
        Array.from(selectedFiles).forEach((f, i) => {
            addUserData.append(`model.UserPhotos`, f);
        });

        addUserData.append("model.FirstName", addUser.firstName ?? '');
        addUserData.append("model.LastName", addUser.lastName ?? '');
        addUserData.append("model.UserName", addUser.userName ?? '');
        addUserData.append("model.Email", addUser.email ?? '');
        addUserData.append("model.Company", JSON.stringify(addUser.company));
        Array.from(addUser.roles).forEach((r, i) => {
            addUserData.append(`model.Roles[${i}].id`, r.id);
            addUserData.append(`model.Roles[${i}].name`, r.name);
        });


        try {
            const response = await fetch("/api/User/CreateUser", {
                method: "POST",
                body: addUserData,
            });

            if (!response.ok) {
                throw new Error(await response.json());
            }

            if (response.status == 200) {
                setSelectedFiles([]);
                props.setReloadUsers(!props.reloadUsers);
                setAddUser({
                    roleNames: []
                });
                setSuccessMessage("User Created")
                props.handleClose();
            }
        } catch (e) {
            setErrorMessage(e.message);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            fullWidth
            maxWidth="lg"
        >
            <form name="addUserForm" onSubmit={handleAddUserSubmit}>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', width: '100%', alignItems: 'center' }}
                >
                    <DialogTitle>Add User</DialogTitle>
                    {submitErrorMessage?.length > 0 && (
                        <ErrorDisplay error={submitErrorMessage} />
                    )}
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
                            value={addUser.firstName}
                            onChange={handleChange}
                        />
                        <DialogContentText>
                            Last Name
                        </DialogContentText>
                        <OutlinedInput
                            autoFocus
                            //required
                            margin="dense"
                            id="lastName"
                            name="lastName"
                            label="lastName"
                            placeholder="Last Name"
                            type="text"
                            value={addUser.lastName}
                            onChange={handleChange}
                        />  
                        <DialogContentText>
                            Username
                        </DialogContentText>
                        <OutlinedInput
                            margin="dense"
                            id="userName"
                            name="userName"
                            label="userName"
                            placeholder="Username"
                            type="text"
                            fullWidth
                            value={addUser.userName}
                            onChange={handleChange}
                        />
                        <DialogContentText>
                            Email
                        </DialogContentText>
                        <OutlinedInput
                            margin="dense"
                            id="email"
                            name="email"
                            label="Email"
                            placeholder="Email"
                            type="text"
                            fullWidth
                            value={addUser.email}
                            onChange={handleChange}
                        />
                        <DialogContentText>
                            Roles
                        </DialogContentText>
                        <FormControl fullWidth>
                            <Select
                                multiple
                                displayEmpty
                                id="select-user-roles"
                                name="roles"
                                value={addUser.roleNames}
                                label="User Roles"
                                open={openRoles}
                                onOpen={() => setOpenRoles(true)}
                                onClose={() => setOpenRoles(false)}
                                onChange={handleChangeUserRoles}
                                renderValue={(selected) => {
                                    if (availableRoles?.length < 1) {
                                        return <em>No Roles Available</em>;
                                    }
                                    if (availableRoles?.length > 0 && selected?.length < 1) {
                                        return <em>Select Roles</em>;
                                    }
                                    return (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected?.map((value) => (
                                                <Chip key={value} label={value} />
                                            ))}
                                        </Box>)
                                }}

                                disabled={availableRoles?.length > 0 ? false : true}
                            >
                                {availableRoles?.length > 0 && (availableRoles.map(m =>

                                    <MenuItem key={m.name} value={m.name}>{m.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                </DialogContent>
                <DialogActions sx={{ pb: 3, px: 3 }}>
                    <Button onClick={props.handleClose} disabled={isSaving} variant="contained" color="secondary">Cancel</Button>
                    <Button 
                        variant="contained" 
                        color="info" 
                        type="submit"
                        disabled={isSaving}
                        startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {isSaving ? 'Creating...' : 'Create'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
