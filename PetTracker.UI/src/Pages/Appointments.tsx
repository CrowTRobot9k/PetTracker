import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../Theme/AppTheme';
import AppAppBar from '../Components/AppAppBar';
import AppointmentScheduler from '../Components/AppointmentScheduler.tsx'
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";
import SearchProvider from '../Components/SearchProvider.tsx';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';


export default function Appointments(props: { disableCustomTheme?: boolean }) {
    return (
        <AuthorizeView>
            <AppTheme {...props}>
                <CssBaseline enableColorScheme />
                <SearchProvider>
                    <AppAppBar currentPage="appointments" />
                    <Container
                        maxWidth="xl"
                        component="main"
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            my: 2, 
                            gap: 2
                        }}
                    >
                        <AppointmentScheduler></AppointmentScheduler>
                    </Container>
                </SearchProvider>
            </AppTheme>
        </AuthorizeView>

    );
}
