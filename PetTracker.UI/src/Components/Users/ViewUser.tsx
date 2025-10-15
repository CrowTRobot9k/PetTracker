import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import ImageUpload from '../ImageUpload';
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { User, UserRole } from '../../Types/SharedTypes';
import ErrorDisplay from '../ErrorDisplay';
import { useAuthStore } from '../../Stores/AuthStore';
import CircularProgress from '@mui/material/CircularProgress';

interface ViewUserProps {
    open: boolean;
    handleClose: () => void;
    user: User | null;
    roles: UserRole[];
    setReloadUsers: React.Dispatch<React.SetStateAction<boolean>>;
    hasWriteAccess?: boolean;
}

export default function ViewUser(props: ViewUserProps) {
    const [submitSuccessMessage, setSuccessMessage] = React.useState('');
    const [submitErrorMessage, setErrorMessage] = React.useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [openRoles, setOpenRoles] = useState(false);
    
    const { hasWriteAccess = true } = props;
    
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

    // Initialize editUser when user prop changes
    useEffect(() => {
        if (props.user) {
            setEditUser({ ...props.user });
        }
    }, [props.user]);

    const handleFileInputChange = (newValue: File[]) => {
        setSelectedFiles(newValue);
    };

    const handleChangeUserRoles = (e: SelectChangeEvent) => {
        if (availableRoles && availableRoles?.length > 0) {
            const roles = availableRoles.filter(f => e.target.value.indexOf(f.name) > -1);
            setEditUser(prev => prev ? { ...prev, roleNames: roles.map(m=>m.name), roles: roles} : null);
        }
        setOpenRoles(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditUser(prev => prev ? {
            ...prev,
            [name]: value,
        } : null);
    };

    const handleUpdateUserSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");
        setIsSaving(true);

        if (!editUser) return;

        const updateUserData = new FormData();
        Array.from(selectedFiles).forEach((f, i) => {
            updateUserData.append(`model.UserPhotos`, f);
        });

        updateUserData.append("model.Id", editUser.id);
        updateUserData.append("model.FirstName", editUser.firstName ?? '');
        updateUserData.append("model.LastName", editUser.lastName ?? '');
        updateUserData.append("model.UserName", editUser.userName ?? '');
        updateUserData.append("model.Email", editUser.email ?? '');
        updateUserData.append("model.Company", JSON.stringify(editUser.company));
        Array.from(editUser.roles || []).forEach((r, i) => {
            updateUserData.append(`model.Roles[${i}].id`, r.id);
            updateUserData.append(`model.Roles[${i}].name`, r.name);
        });

        try {
            const response = await fetch("/api/User/UpdateUser", {
                method: "POST",
                body: updateUserData,
            });

            if (!response.ok) {
                throw new Error(await response.json());
            }

            if (response.status == 200) {
                setSelectedFiles([]);
                props.setReloadUsers(prev => !prev);
                setSuccessMessage("User Updated Successfully");
                setTimeout(() => {
                    props.handleClose();
                }, 1500);
            }
        } catch (e) {
            setErrorMessage(e.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        setEditUser(null);
        setSelectedFiles([]);
        setSuccessMessage("");
        setErrorMessage("");
        props.handleClose();
    };

    if (!editUser) return null;

    return (
        <Dialog
            open={props.open}
            onClose={handleClose}
            fullWidth
            maxWidth="lg"
        >
            <form name="updateUserForm" onSubmit={handleUpdateUserSubmit}>
                <DialogContent
                    sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', width: '100%', alignItems: 'center' }}
                >
                    <DialogTitle sx={{ p: 0 }}>
                        {hasWriteAccess ? 'View User' : 'View User (Read Only)'}
                    </DialogTitle>
                    {submitErrorMessage?.length > 0 && (
                        <ErrorDisplay error={submitErrorMessage} />
                    )}
                    <ImageUpload label="Upload Photos" selectedFiles={selectedFiles} onChange={handleFileInputChange} readonly={!hasWriteAccess} />
                    {!hasWriteAccess && (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1, fontStyle: 'italic' }}>
                            This form is read-only. You need write permissions to edit user information.
                        </Typography>
                    )}
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
                            value={editUser.firstName || ''}
                            onChange={handleChange}
                            disabled={!hasWriteAccess}
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
                            value={editUser.lastName || ''}
                            onChange={handleChange}
                            disabled={!hasWriteAccess}
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
                            value={editUser.userName || ''}
                            onChange={handleChange}
                            disabled={!hasWriteAccess}
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
                            value={editUser.email || ''}
                            disabled
                            sx={{ 
                                '& .MuiInputBase-input.Mui-disabled': {
                                    WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
                                }
                            }}
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
                                value={editUser.roleNames || []}
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
                                disabled={availableRoles?.length > 0 ? !hasWriteAccess : true}
                            >
                                {availableRoles?.length > 0 && (availableRoles.map(m =>
                                    <MenuItem key={m.name} value={m.name}>{m.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                </DialogContent>
                <DialogActions sx={{ pb: 3, px: 3 }}>
                    <Button onClick={handleClose} disabled={isSaving} variant="contained" color="secondary">
                        {hasWriteAccess ? 'Cancel' : 'Close'}
                    </Button>
                    {hasWriteAccess && (
                        <Button 
                            variant="contained" 
                            color="info" 
                            type="submit"
                            disabled={isSaving}
                            startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {isSaving ? 'Updating...' : 'Update'}
                        </Button>
                    )}
                </DialogActions>
            </form>
        </Dialog>
    );
}
