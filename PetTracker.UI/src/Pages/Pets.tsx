import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../Theme/AppTheme';
import AppAppBar from '../Components/AppAppBar';
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";
import ViewPets from '../Components/Pets/ViewPets.tsx';
import SearchProvider from '../Components/SearchProvider.tsx';
import { Box } from '@mui/material';

export default function Pets(props: { disableCustomTheme?: boolean }) {

    return (
       /* <AuthorizeView>*/
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <SearchProvider>
                <AppAppBar currentPage="pets" />
                {/* Spacer to prevent content from being hidden behind fixed App Bar */}
                <Box sx={{ height: '120px' }} />
                <ViewPets />
            </SearchProvider>
        </AppTheme>
       /* </AuthorizeView>*/
    );
}
