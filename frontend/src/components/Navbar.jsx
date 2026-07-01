import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isOrganizer } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🎫</span>
          EventHub
        </Link>
        <div className="navbar-links">
          <Link to="/events">Events</Link>
          {user && <Link to="/my-tickets">My Tickets</Link>}
          {isOrganizer && (
            <>
              <Link to="/create-event">Create Event</Link>
              <Link to="/checkin">QR Check-in</Link>
              <Link to="/dashboard">Analytics</Link>
            </>
          )}
        </div>
        <div className="navbar-auth">
          {user ? (
            <div className="user-menu">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
