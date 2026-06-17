import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>M-Motors</Link>
      <div style={styles.links}>
        <Link to="/vehicules/achat" style={styles.link}>Acheter</Link>
        <Link to="/vehicules/location" style={styles.link}>Louer</Link>
        {user ? (
          <>
            <Link to="/dashboard" style={styles.link}>Mon espace</Link>
            {user.is_admin && <Link to="/admin" style={styles.link}>Admin</Link>}
            <button onClick={handleLogout} style={styles.button}>Déconnexion</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Connexion</Link>
            <Link to="/register" style={styles.link}>Inscription</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#1a1a2e', color: 'white' },
  brand: { color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' },
  links: { display: 'flex', gap: '1.5rem', alignItems: 'center' },
  link: { color: 'white', textDecoration: 'none' },
  button: { background: '#e94560', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' },
};

export default Navbar;