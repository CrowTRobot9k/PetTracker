import React, { useState, useEffect, useContext } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../Theme/AppTheme';
import AppAppBar from '../Components/AppAppBar';
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";
import ViewOwners from '../Components/ViewOwners.tsx';
import SearchProvider from '../Components/SearchProvider.tsx';

export default function Owners(props: { disableCustomTheme?: boolean }) {
    return (
        <AuthorizeView>
            <AppTheme {...props}>
                <CssBaseline enableColorScheme />
                <SearchProvider>
                    <AppAppBar currentPage="owners" />
                    <ViewOwners />
                </SearchProvider>
            </AppTheme>
        </AuthorizeView>

    );
}
