import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
    <React.Fragment>
        <CssBaseline />
        <StrictMode>
        <App />
        </StrictMode>
    </React.Fragment >,
)
