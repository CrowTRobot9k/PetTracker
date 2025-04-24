import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './Pages/Home.tsx';
import SignUp from './Pages/SignUp.tsx';
import SignIn from './Pages/SignIn.tsx';
import Pets from './Pages/Pets.tsx';
import Owners from './Pages/Owners.tsx';
import Appointments from './Pages/Appointments.tsx';

function App() {
    return (
            <BrowserRouter>
                <Routes>
                     <Route path="/" element={<Home />} />
                    {/*<Route path="/blog" element={<Blog />} />*/}
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/owners" element={<Owners />} />
                    <Route path="/pets" element={<Pets />} />
                    <Route path="/appointments" element={<Appointments />} />
                </Routes>
            </BrowserRouter>
    );

}
export default App;