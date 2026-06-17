import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Bienvenue chez M-Motors</h1>
        <p style={styles.subtitle}>Spécialiste en véhicules d'occasion depuis 1987</p>
        <div style={styles.buttons}>
          <Link to="/vehicules/achat" style={styles.btnPrimary}>Acheter un véhicule</Link>
          <Link to="/vehicules/location" style={styles.btnSecondary}>Louer un véhicule</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#f5f5f5' },
  hero: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center', padding: '2rem' },
  title: { fontSize: '3rem', color: '#1a1a2e', marginBottom: '1rem' },
  subtitle: { fontSize: '1.2rem', color: '#666', marginBottom: '2rem' },
  buttons: { display: 'flex', gap: '1rem' },
  btnPrimary: { background: '#1a1a2e', color: 'white', padding: '1rem 2rem', borderRadius: '8px', textDecoration: 'none', fontSize: '1rem' },
  btnSecondary: { background: '#e94560', color: 'white', padding: '1rem 2rem', borderRadius: '8px', textDecoration: 'none', fontSize: '1rem' },
};

export default Home;