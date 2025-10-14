import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PrivateRoute from './PrivateRoute'
import Pets from './pages/Pets';
import Navbar from './Navbar';
import Swipe from './pages/Swipe';
import Matches from './pages/Matches';
import Plans from './pages/Plans';
import Subscription from './pages/Subscription';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import PaymentPix from './pages/PaymentPix';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pets" element={
          <PrivateRoute>
            <Pets />
          </PrivateRoute>
        } />
        <Route path="/swipe" element={
          <PrivateRoute>
            <Swipe />
          </PrivateRoute>
        } />
        <Route path="/matches" element={
          <PrivateRoute>
            <Matches />
          </PrivateRoute>
        } />
        <Route path="/plans" element={<Plans />} />
        <Route path="/subscription" element={
          <PrivateRoute>
            <Subscription />
          </PrivateRoute>
        } />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failure" element={<PaymentFailure />} />
        <Route path="/payment/pix/:paymentId" element={
          <PrivateRoute>
            <PaymentPix />
          </PrivateRoute>
        } />
      </Routes>
    </>
  )
}

export default App