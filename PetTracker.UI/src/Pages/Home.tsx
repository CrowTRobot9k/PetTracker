import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppTheme from '../Theme/AppTheme';
import AppAppBar from '../Components/AppAppBar';
import PtFooter from '../Components/PtFooter';
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";
import { Paper, Button } from '@mui/material';

export default function Blog(props: { disableCustomTheme?: boolean }) {


    
    return (
        <AuthorizeView>
            <AppTheme {...props}>
                <CssBaseline enableColorScheme />
                <AppAppBar currentPage="home"/>
                <Container
                    maxWidth="lg"
                    component="main"
                    sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
                >
                </Container>
{/*                <PtFooter />*/}
            </AppTheme>
        </AuthorizeView>

    );
}
