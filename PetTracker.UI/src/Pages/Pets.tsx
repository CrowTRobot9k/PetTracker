import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../Theme/AppTheme';
import AppAppBar from '../Components/AppAppBar';
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";
import ViewPets from '../Components/Pets/ViewPets.tsx';
import SearchProvider from '../Components/SearchProvider.tsx';

export default function Pets(props: { disableCustomTheme?: boolean }) {

    return (
       /* <AuthorizeView>*/
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <SearchProvider>
                <AppAppBar currentPage="pets" />
                <ViewPets />
            </SearchProvider>
        </AppTheme>
       /* </AuthorizeView>*/
    );
}
