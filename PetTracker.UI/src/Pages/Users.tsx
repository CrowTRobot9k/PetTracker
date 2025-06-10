import React, { useState, useEffect, useContext } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../Theme/AppTheme';
import AppAppBar from '../Components/AppAppBar';
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";
import ViewUsers from '../Components/Users/ViewUsers.tsx';
import SearchProvider from '../Components/SearchProvider.tsx';

export default function Users(props: { disableCustomTheme?: boolean }) {
    return (
        <AuthorizeView>
            <AppTheme {...props}>
                <CssBaseline enableColorScheme />
                <SearchProvider>
                    <AppAppBar currentPage="users" />
                    <ViewUsers />
                </SearchProvider>
            </AppTheme>
        </AuthorizeView>

    );
}
