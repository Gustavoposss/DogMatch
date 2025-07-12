import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PrivateRoute from './PrivateRoute'
import Pets from './pages/Pets';
import Navbar from './Navbar';
import Swipe from './pages/Swipe';
import Matches from './pages/Matches';

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
      </Routes>
    </>
  )
}

export default App