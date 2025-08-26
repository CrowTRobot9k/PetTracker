import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../Theme/AppTheme';
import AppAppBar from '../Components/AppAppBar';
import AppointmentScheduler from '../Components/AppointmentScheduler.tsx'
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";
import SearchProvider from '../Components/SearchProvider.tsx';
import { Box } from '@mui/material';

export default function Appointments(props: { disableCustomTheme?: boolean }) {
    return (
        <AuthorizeView>
            <AppTheme {...props}>
                <CssBaseline enableColorScheme />
                <SearchProvider>
                    <AppAppBar currentPage="appointments" />
                    {/* Spacer to prevent content from being hidden behind fixed App Bar */}
                    <Box sx={{ height: '180px' }} />
                    <AppointmentScheduler></AppointmentScheduler>
                </SearchProvider>
            </AppTheme>
        </AuthorizeView>

    );
}
