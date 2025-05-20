import * as React from 'react';
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
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ColorModeIconDropdown from '../Theme/ColorModeIconDropdown';
import Sitemark from './SitemarkIcon';
import { useNavigate } from "react-router";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
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

export default function AppAppBar({currentPage})
{
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    const toggleDrawer = (newOpen: boolean) => () => {
      setOpen(newOpen);
    };

    const navLogout = () =>
    {
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
            }
        })
        .catch((error) => {
            console.error(error);
        })
    }

  return (
      <AppBar
          position="static"
          enableColorOnDark
          sx={{
            boxShadow: 0,
            bgcolor: 'transparent',
            backgroundImage: 'none',
            mt: 'calc(var(--template-frame-height, 0px) + 28px)',
          }}
      >

      <Container maxWidth="xl">
        <img src="../src/assets/PetTrackerLogoWide.png" width="400" height="120" />
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button onClick={() => navigate('/owners')} variant={currentPage == "owners" ?"contained": "text"} color="info" size="small">
                Owners
              </Button>
              <Button onClick={() => navigate('/pets')} variant={currentPage == "pets" ? "contained" : "text"} color="info" size="small">
                Pets
              </Button>
              <Button onClick={() => navigate('/appointments')} variant={currentPage == "appointments" ? "contained" : "text"} color="info" size="small">
                Appointments
              </Button>
              {/*<Button onClick={() => navigate('/blog')} variant={currentPage == "blog" ? "contained" : "text"} color="info" size="small">*/}
              {/*    Blog*/}
              {/*</Button>*/}
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
          {/*  <ColorModeIconDropdown />*/}
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            {/*<ColorModeIconDropdown size="medium" />*/}
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <MenuItem onClick={() => navigate('/owners')}>Owners</MenuItem>
                <MenuItem onClick={() => navigate('/pets')}>Pets</MenuItem>
                <MenuItem onClick={() => navigate('/appointments')}>Appointments</MenuItem>
{/*                <MenuItem onClick={() => navigate('/blog')}>Blog</MenuItem>*/}
                 <Divider sx={{ my: 3 }} />
                  <MenuItem>
                      <Button onClick={navLogout} color="primary" variant="outlined" fullWidth>
                          Logout
                      </Button>
                  </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
