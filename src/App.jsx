import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import FlightSearch from './pages/FlightSearch';
import FlightDetail from './pages/FlightDetail';
import SeatSelection from './pages/SeatSelection';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import Reservations from './pages/Reservations'; 
import MainLayout from './layouts/MainLayout';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        <Route
          path="/profile"
          element={
            <MainLayout>
              <Profile />
            </MainLayout>
          }
        />
        <Route
          path="/flights"
          element={
            <MainLayout>
              <FlightSearch />
            </MainLayout>
          }
        />
        <Route
          path="/flights/:id"
          element={
            <MainLayout>
              <FlightDetail />
            </MainLayout>
          }
        />
        <Route
          path="/reservations"
          element={
            <MainLayout>
              <Reservations />
            </MainLayout>
          }
        />

        <Route path="/flights/:id/seats" element={<SeatSelection />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
