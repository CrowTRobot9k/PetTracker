import React, { useState, useEffect, useContext } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../Theme/AppTheme';
import AppAppBar from '../Components/AppAppBar';
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";
import ViewUsers from '../Components/Users/ViewUsers.tsx';
import SearchProvider from '../Components/SearchProvider.tsx';
import { Box } from '@mui/material';
import Container from '@mui/material/Container';

export default function Users(props: { disableCustomTheme?: boolean }) {
    return (
        <AuthorizeView>
            <AppTheme {...props}>
                <CssBaseline enableColorScheme />
                <SearchProvider>
                    <AppAppBar currentPage="users" />
                    <Container
                        maxWidth="lg"
                        component="main"
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            my: 2, 
                            gap: 2,
                            height: 'calc(100vh - 180px)',
                            minHeight: 0,
                            overflow: 'hidden'
                        }}
                    >
                        <ViewUsers />
                    </Container>
                </SearchProvider>
            </AppTheme>
        </AuthorizeView>

    );
}
