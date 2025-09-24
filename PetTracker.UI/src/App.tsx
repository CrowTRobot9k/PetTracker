import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './Pages/Home.tsx';
import SignUp from './Pages/SignUp.tsx';
import SignIn from './Pages/SignIn.tsx';
import EmailConfirmation from './Pages/EmailConfirmation.tsx';
import Pets from './Pages/Pets.tsx';
import Owners from './Pages/Owners.tsx';
import Appointments from './Pages/Appointments.tsx';
import Users from './Pages/Users.tsx';
import Blog from './Pages/Blog.tsx';
import '../src/Styles/petTracker.css';
import './Utils/AuthInterceptor'; // Import global auth interceptor

function App() {
    return (
            <BrowserRouter>
                <Routes>
                     <Route path="/" element={<Home />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/confirm-email" element={<EmailConfirmation />} />
                    <Route path="/owners" element={<Owners />} />
                    <Route path="/pets" element={<Pets />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/users" element={<Users />} />
                </Routes>
            </BrowserRouter>
    );

}
export default App;