import './Navbar.css'
import  {Link} from 'react-router'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="nav-link"><h2>Sportiva Base</h2></Link>
      </div>

      <div className="navbar-center">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="explore-activities" className="nav-link">Explore Activities</Link>
        <Link to="how" className="nav-link">How it works</Link>
      </div>

      <div className='navbar-login'>
        <Link to="login" className="nav-link">Login</Link>
      </div>
    </nav>
  )
}

export default Navbar
