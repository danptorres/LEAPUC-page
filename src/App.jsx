import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import './App.css';

// Importar os componentes
import Navbar from './components/Navbar'
import NavbarAccessed from './components/NavbarAccessed'
import Footer from './components/Footer'

function App() {
   const { isAuthenticated } = useContext(AuthContext);
  
  return (
    <div className='App'>
      {/* <Navbar/> */}
      {isAuthenticated ? <NavbarAccessed /> : <Navbar />}
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default App
