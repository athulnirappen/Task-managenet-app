
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Dashborad from './pages/dashborad';



function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/register" element={<Register/>} />
    <Route path="/dashboard" element={<Dashborad/>} />
   </Routes>
   </BrowserRouter>
  );
}

export default App;