import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path='/' element={<LoginPage />} />
      <Route path='/Home' element={<Provider store={store}><HomePage /></Provider>} />
    </Routes>
  );
}

export default App;