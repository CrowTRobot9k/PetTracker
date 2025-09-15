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
    const { logout } = useAuthStore();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const toggleDrawer = (newOpen?: boolean) => () =>
    {
            setOpen(newOpen||!open);
    };

    const navLogout = () =>
    {
        // Clear localStorage and update store immediately
        logout();
        
        fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: ""
        })
        .then((data) => {
            if (data.ok) {
                navigate("/signin");
            } else {
                // Even if server logout fails, we've already cleared local state
                navigate("/signin");
            }
        })
        .catch((error) => {
            console.error(error);
            // Even if server logout fails, we've already cleared local state
            navigate("/signin");
        })
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
                      <Button onClick={() => navigate('/owners')} variant={props.currentPage == "owners" ? "contained" : "text"} color="info" size="small">
                          Owners
                      </Button>
                      <Button onClick={() => navigate('/pets')} variant={props.currentPage == "pets" ? "contained" : "text"} color="info" size="small">
                          Pets
                      </Button>
                      <Button onClick={() => navigate('/appointments')} variant={props.currentPage == "appointments" ? "contained" : "text"} color="info" size="small">
                          Appointments
                      </Button>
                      <Button onClick={() => navigate('/users')} variant={props.currentPage == "users" ? "contained" : "text"} color="info" size="small">
                          Users
                      </Button>
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
            <Button onClick={navLogout} color="primary" variant="contained" size="small">
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
                    justifyContent: 'flex-end',
                    mb: 2
                  }}
                >
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <MenuItem onClick={() => { navigate('/'); toggleDrawer(false); }}>
                    <Typography>Home</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/owners'); toggleDrawer(false); }}>
                    <Typography>Owners</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/pets'); toggleDrawer(false); }}>
                    <Typography>Pets</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/appointments'); toggleDrawer(false); }}>
                    <Typography>Appointments</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/users'); toggleDrawer(false); }}>
                    <Typography>Users</Typography>
                  </MenuItem>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <MenuItem sx={{ p: 0 }}>
                  <Button onClick={() => { navLogout(); toggleDrawer(false); }} color="primary" variant="outlined" fullWidth>
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
