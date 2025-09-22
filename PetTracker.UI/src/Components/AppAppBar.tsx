import React from 'react';
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from "react-router";
import OutlinedInput from '@mui/material/OutlinedInput';
import { useSearch } from '../Components/SearchProvider';
import Typography from '@mui/material/Typography';
import { useAuthStore } from '../Stores/AuthStore';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
    padding: '8px 12px',
}));

export default function AppAppBar(props: { currentPage:string})
{
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();
    const { searchTerm, setSearchTerm } = useSearch() as { searchTerm: string; setSearchTerm: (term: string) => void };
    const { logout, user, isAuthenticated, setLoggingOut } = useAuthStore();

    // Helper function to check if user has permission to see a menu item
    const hasPermission = (menuItem: string): boolean => {
        if (!user || !user.roles) {
            return false;
        }

        const userRoles = user.roles.map(role => role.name);

        switch (menuItem) {
            case 'owners':
                return userRoles.some(role => 
                    role === 'Administrator' || 
                    role === 'Owners Read' || 
                    role === 'Owners Write'
                );
            case 'pets':
                return userRoles.some(role => 
                    role === 'Administrator' || 
                    role === 'Pets Read' || 
                    role === 'Pets Write'
                );
            case 'appointments':
                return userRoles.some(role => 
                    role === 'Administrator' || 
                    role === 'Appointments Read' || 
                    role === 'Appointments Write'
                );
            case 'users':
                return userRoles.some(role => 
                    role === 'Administrator' || 
                    role === 'Users Read' || 
                    role === 'Users Write'
                );
            default:
                return false;
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const toggleDrawer = (newOpen?: boolean) => () =>
    {
            setOpen(newOpen||!open);
    };

    const navLogout = async () =>
    {
        // Set logging out state to prevent AuthorizeView from redirecting
        setLoggingOut(true);
        
        try {
            // Wait for server logout to complete before clearing local state
            await fetch("/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: ""
            });
            
            // Clear localStorage and update store after server logout
            logout();
            
            // Navigate to signin after server logout completes
            navigate("/signin");
        } catch (error) {
            console.error("Server logout failed:", error);
            // Clear local state and navigate even if server logout fails
            logout();
            navigate("/signin");
        }
    }

    return (
        <>
        <AppBar
          position="static"
          enableColorOnDark
          sx={{
            boxShadow: 0,
            bgcolor: 'transparent',
            backgroundImage: 'none',
            width: '90%',
            margin: '0 auto',
            zIndex: 1,
          }}
      >
      <Container maxWidth={false} sx={{ width: '100%' }}>
        <Box 
          component="img"
          src="/PetTrackerLogoWideTransparent.png" 
          sx={{ 
            cursor: 'pointer',
            transition: 'opacity 0.2s ease-in-out',
            maxWidth: '100%',
            height: 'auto',
            width: 'auto',
            maxHeight: { xs: '80px', sm: '100px', md: '120px', lg: '140px', xl: '160px' }
          }}
          onClick={() => navigate('/')}
          alt="PetTracker Logo - Click to go home"
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        />
          <StyledToolbar variant="dense" disableGutters>
            <Box sx={{ display: 'flex', px: 0, mx: 2, flex: 1 }}>
                  <Box sx={{ mx: 2, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                      <Button onClick={() => navigate('/')} variant={props.currentPage == "home" ? "contained" : "text"} color="info" size="small">
                          Home
                      </Button>
                      {hasPermission('owners') && (
                          <Button onClick={() => navigate('/owners')} variant={props.currentPage == "owners" ? "contained" : "text"} color="info" size="small">
                              Owners
                          </Button>
                      )}
                      {hasPermission('pets') && (
                          <Button onClick={() => navigate('/pets')} variant={props.currentPage == "pets" ? "contained" : "text"} color="info" size="small">
                              Pets
                          </Button>
                      )}
                      {hasPermission('appointments') && (
                          <Button onClick={() => navigate('/appointments')} variant={props.currentPage == "appointments" ? "contained" : "text"} color="info" size="small">
                              Appointments
                          </Button>
                      )}
                      {hasPermission('users') && (
                          <Button onClick={() => navigate('/users')} variant={props.currentPage == "users" ? "contained" : "text"} color="info" size="small">
                              Users
                          </Button>
                      )}
                  </Box>
                  <Box
                      sx={{
                          display: { xs: 'none', md: 'flex' },
                          mx: 2,
                          alignItems: 'center',
                          flex: 1,
                          justifyContent: 'center'
                      }}
                  >
                      <OutlinedInput
                              placeholder="Search"
                              type="text"
                              sx={{ width: "100%", maxWidth: "600px" }}
                              value={searchTerm}
                              onChange={handleSearchChange}
                      />
                  </Box>
            </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            {isAuthenticated && user && (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  mr: 1,
                  fontWeight: 500
                }}
              >
                Welcome, {user.fullName || user.email}
              </Typography>
            )}
            <Button onClick={navLogout} color="info" variant="contained" size="small">
                Logout
            </Button>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1, alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
            <OutlinedInput
                placeholder="Search"
                type="text"
                sx={{ flex: 1, mr: 1 }}
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
            />
            <IconButton aria-label="Menu button" onClick={toggleDrawer()} size="small" sx={{ flexShrink: 0 }}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: '120px', // Reduced height for mobile
                  maxHeight: 'calc(100vh - 120px)',
                  backgroundColor: 'background.default',
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  width: '100%'
                },
              }}
            >
              <Box sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  {isAuthenticated && user && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        fontWeight: 500
                      }}
                    >
                      Welcome, {user.firstName || user.fullName || user.email}
                    </Typography>
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <MenuItem onClick={() => { navigate('/'); toggleDrawer(false); }}>
                    <Typography>Home</Typography>
                  </MenuItem>
                  {hasPermission('owners') && (
                    <MenuItem onClick={() => { navigate('/owners'); toggleDrawer(false); }}>
                      <Typography>Owners</Typography>
                    </MenuItem>
                  )}
                  {hasPermission('pets') && (
                    <MenuItem onClick={() => { navigate('/pets'); toggleDrawer(false); }}>
                      <Typography>Pets</Typography>
                    </MenuItem>
                  )}
                  {hasPermission('appointments') && (
                    <MenuItem onClick={() => { navigate('/appointments'); toggleDrawer(false); }}>
                      <Typography>Appointments</Typography>
                    </MenuItem>
                  )}
                  {hasPermission('users') && (
                    <MenuItem onClick={() => { navigate('/users'); toggleDrawer(false); }}>
                      <Typography>Users</Typography>
                    </MenuItem>
                  )}
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <MenuItem sx={{ p: 0 }}>
                  <Button onClick={() => { navLogout(); toggleDrawer(false); }} color="info" variant="outlined" fullWidth>
                    Logout
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
            </AppBar>
        </>
  );
}
