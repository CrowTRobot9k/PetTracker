import React, { useState, useEffect, useContext } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../Theme/AppTheme';
import AppAppBar from '../Components/AppAppBar';
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";
import ViewUsers from '../Components/Users/ViewUsers.tsx';
import SearchProvider from '../Components/SearchProvider.tsx';
import { Box } from '@mui/material';

export default function Users(props: { disableCustomTheme?: boolean }) {
    return (
        <AuthorizeView>
            <AppTheme {...props}>
                <CssBaseline enableColorScheme />
                <SearchProvider>
                    <AppAppBar currentPage="users" />
                    {/* Spacer to prevent content from being hidden behind fixed App Bar */}
                    <Box sx={{ height: '180px' }} />
                    <ViewUsers />
                </SearchProvider>
            </AppTheme>
        </AuthorizeView>

    );
}
