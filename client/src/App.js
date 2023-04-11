import { Routes, Route } from 'react-router-dom';
import LoginPage from './Components/LoginPage';
import HomePage from './Components/HomePage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/Home' element={<HomePage />} />
    </Routes>
  );
}

export default App;