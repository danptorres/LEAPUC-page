import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext"; 
import "./Navbar.css";
// import "./NavbarAcessed.css";

import Logo from "../img/LOGO-1.png";


const NavbarAccessed = () => {
  const { isAdmin } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <img src={Logo} alt="Logo LEAPUC"/>
      <ul className="links">
        <li>
          <Link to={`/`}>Home</Link>
        </li>
        <li>
          <Link to={`/who-is-us`}>Quem Somos</Link>
        </li>
        <li>
          <Link to={`/our-teams`}>Nossas equipes</Link>
        </li>
        <li>
          <Link to={`/products`}>Produtos</Link>
        </li>
        <li>
          <Link to={`/contact`}>Fale com a gente</Link>
        </li>
        {isAdmin && (
          <li><Link className="admin-btn" to={`/admin-page`}>Administração</Link></li>
        )}
        <li>
          <Link className="default-btn" to={`/my-account`}>Minha conta</Link>
        </li>
      </ul>
    </nav>
  )
}

export default NavbarAccessed