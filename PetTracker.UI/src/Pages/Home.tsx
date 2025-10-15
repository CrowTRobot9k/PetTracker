import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppTheme from '../Theme/AppTheme';
import AppAppBar from '../Components/AppAppBar';
import AuthorizeView from "../Components/AuthorizeView.tsx";
import { Button, Typography, Box, Card, CardContent } from '@mui/material';
import { Pets, People, Event, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../Stores/AuthStore';

export default function Home(props: { disableCustomTheme?: boolean }) {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    // Helper function to check if user has permission to see a menu item
    const hasPermission = (menuItem: string): boolean => {
        if (!user || !user.roles) {
            return false;
        }

        const userRoles = user.roles.map(role => role.name);

        switch (menuItem) {
            case 'owners':
                return userRoles.some(role => 
                    role === 'Administrator' || 
                    role === 'Owners Read' || 
                    role === 'Owners Write'
                );
            case 'pets':
                return userRoles.some(role => 
                    role === 'Administrator' || 
                    role === 'Pets Read' || 
                    role === 'Pets Write'
                );
            case 'appointments':
                return userRoles.some(role => 
                    role === 'Administrator' || 
                    role === 'Appointments Read' || 
                    role === 'Appointments Write'
                );
            case 'users':
                return userRoles.some(role => 
                    role === 'Administrator' || 
                    role === 'Users Read' || 
                    role === 'Users Write'
                );
            default:
                return false;
        }
    };
    
    return (
        <AuthorizeView>
            <AppTheme {...props}>
                <CssBaseline enableColorScheme />
                <AppAppBar currentPage="home"/>
                <Container
                    maxWidth="lg"
                    component="main"
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        my: 4, 
                        gap: 4
                    }}
                >
                    {/* Welcome Message */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography 
                            variant="h2" 
                            component="h1" 
                            gutterBottom 
                            className="gradient-text"
                            sx={{ 
                                fontWeight: 'bold',
                                mb: 2 
                            }}
                        >
                            Welcome to Pet Tracker
                        </Typography>
                        <Typography variant="h5" component="h2" color="text.secondary" sx={{ mb: 3 }}>
                            Your solution for managing pets, owners, and appointments
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                            Streamline your pet care business with our platform designed to help you manage 
                            pet information, owner details, and scheduling all in one place.
                        </Typography>
                    </Box>

                    {/* Feature Cards */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 3 }}>
                        <Card 
                            sx={{ 
                                height: '100%', 
                                textAlign: 'center', 
                                p: 2,
                                cursor: hasPermission('owners') ? 'pointer' : 'default',
                                transition: 'all 0.3s ease-in-out',
                                opacity: hasPermission('owners') ? 1 : 0.6,
                                '&:hover': hasPermission('owners') ? {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                    backgroundColor: 'action.hover'
                                } : {}
                            }}
                            onClick={hasPermission('owners') ? () => navigate('/owners') : undefined}
                        >
                            <CardContent>
                                <People 
                                    className={hasPermission('owners') ? 'gradient-icon' : ''}
                                    sx={{ 
                                        fontSize: 48, 
                                        mb: 2,
                                        color: hasPermission('owners') ? undefined : 'text.disabled',
                                    }} 
                                />
                                <Typography variant="h6" component="h3" gutterBottom>
                                    Owner Profiles
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Maintain owner information and contact details
                                </Typography>
                                {!hasPermission('owners') && (
                                    <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic', mt: 1, display: 'block' }}>
                                        Access required
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>

                        <Card 
                            sx={{ 
                                height: '100%', 
                                textAlign: 'center', 
                                p: 2,
                                cursor: hasPermission('pets') ? 'pointer' : 'default',
                                transition: 'all 0.3s ease-in-out',
                                opacity: hasPermission('pets') ? 1 : 0.6,
                                '&:hover': hasPermission('pets') ? {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                    backgroundColor: 'action.hover'
                                } : {}
                            }}
                            onClick={hasPermission('pets') ? () => navigate('/pets') : undefined}
                        >
                            <CardContent>
                                <Pets 
                                    className={hasPermission('pets') ? 'gradient-icon' : ''}
                                    sx={{ 
                                        fontSize: 48, 
                                        mb: 2,
                                        color: hasPermission('pets') ? undefined : 'text.disabled',
                                    }} 
                                />
                                <Typography variant="h6" component="h3" gutterBottom>
                                    Pet Management
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Keep records of all pets including breed, age, and medical information
                                </Typography>
                                {!hasPermission('pets') && (
                                    <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic', mt: 1, display: 'block' }}>
                                        Access required
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>

                        <Card 
                            sx={{ 
                                height: '100%', 
                                textAlign: 'center', 
                                p: 2,
                                cursor: hasPermission('appointments') ? 'pointer' : 'default',
                                transition: 'all 0.3s ease-in-out',
                                opacity: hasPermission('appointments') ? 1 : 0.6,
                                '&:hover': hasPermission('appointments') ? {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                    backgroundColor: 'action.hover'
                                } : {}
                            }}
                            onClick={hasPermission('appointments') ? () => navigate('/appointments') : undefined}
                        >
                            <CardContent>
                                <Event 
                                    className={hasPermission('appointments') ? 'gradient-icon' : ''}
                                    sx={{ 
                                        fontSize: 48, 
                                        mb: 2,
                                        color: hasPermission('appointments') ? undefined : 'text.disabled',
                                    }} 
                                />
                                <Typography variant="h6" component="h3" gutterBottom>
                                    Appointment Scheduling
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Efficiently manage appointments and track scheduling conflicts
                                </Typography>
                                {!hasPermission('appointments') && (
                                    <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic', mt: 1, display: 'block' }}>
                                        Access required
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>

                        <Card 
                            sx={{ 
                                height: '100%', 
                                textAlign: 'center', 
                                p: 2,
                                cursor: hasPermission('users') ? 'pointer' : 'default',
                                transition: 'all 0.3s ease-in-out',
                                opacity: hasPermission('users') ? 1 : 0.6,
                                '&:hover': hasPermission('users') ? {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                    backgroundColor: 'action.hover'
                                } : {}
                            }}
                            onClick={hasPermission('users') ? () => navigate('/users') : undefined}
                        >
                            <CardContent>
                                <Person 
                                    className={hasPermission('users') ? 'gradient-icon' : ''}
                                    sx={{ 
                                        fontSize: 48, 
                                        mb: 2,
                                        color: hasPermission('users') ? undefined : 'text.disabled',
                                    }} 
                                />
                                <Typography variant="h6" component="h3" gutterBottom>
                                    User Management
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Control access and manage user roles within your organization
                                </Typography>
                                {!hasPermission('users') && (
                                    <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic', mt: 1, display: 'block' }}>
                                        Access required
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Box>

                </Container>
{/*                <PtFooter />*/}
            </AppTheme>
        </AuthorizeView>
    );
}
