import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

import Logo from "../img/LOGO-1.png";

const Navbar = () => {
  return ( 
    <nav className="navbar">
      <Link to={`/`}>
        <img src={Logo} alt="Logo LEAPUC" />
      </Link>
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
        <li>
          <Link className="default-btn" to={`/login`}>Login</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar