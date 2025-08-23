import React, { useState, useEffect, useContext } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../Theme/AppTheme';
import AppAppBar from '../Components/AppAppBar';
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";
import ViewOwners from '../Components/Owners/ViewOwners.tsx';
import SearchProvider from '../Components/SearchProvider.tsx';
import { Box } from '@mui/material';

export default function Owners(props: { disableCustomTheme?: boolean }) {
    return (
        <AuthorizeView>
            <AppTheme {...props}>
                <CssBaseline enableColorScheme />
                <SearchProvider>
                    <AppAppBar currentPage="owners" />
                    {/* Spacer to prevent content from be hidden behind fixed App Bar */}
                    <Box sx={{ height: '120px' }} />
                    <ViewOwners />
                </SearchProvider>
            </AppTheme>
        </AuthorizeView>

    );
}
