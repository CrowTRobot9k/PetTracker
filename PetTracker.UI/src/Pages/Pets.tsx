import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../Theme/AppTheme';
import AppAppBar from '../Components/AppAppBar';
import AuthorizeView, { AuthorizedUser } from "../Components/AuthorizeView.tsx";
import ViewPets from '../Components/ViewPets';
export default function Pets(props: { disableCustomTheme?: boolean }) {

    return (
       /* <AuthorizeView>*/
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <AppAppBar currentPage="pets" />
            <ViewPets/>
            </AppTheme>
       /* </AuthorizeView>*/
    );
}
