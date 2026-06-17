import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVehicles } from '../../services/vehicleService';

const VehicleList = () => {
  const { type } = useParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getVehicles(type)
      .then((res) => setVehicles(res.data))
      .finally(() => setLoading(false));
  }, [type]);

  if (loading) return <div style={styles.loading}>Chargement...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        Véhicules disponibles à l'{type === 'achat' ? 'achat' : 'la location'}
      </h2>
      {vehicles.length === 0 ? (
        <p style={styles.empty}>Aucun véhicule disponible pour le moment.</p>
      ) : (
        <div style={styles.grid}>
          {vehicles.map((v) => (
            <div key={v.id} style={styles.card} onClick={() => navigate(`/vehicule/${v.id}`)}>
              <div style={styles.cardImage}>🚗</div>
              <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{v.marque} {v.modele}</h3>
                <p style={styles.cardInfo}>{v.annee} • {v.kilometrage.toLocaleString()} km • {v.motorisation}</p>
                <p style={styles.cardPrice}>
                  {type === 'achat'
                    ? `${v.prix.toLocaleString()} €`
                    : `${v.prix_location_mois?.toLocaleString()} €/mois`}
                </p>
                <button style={styles.button}>Voir le détail</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  title: { color: '#1a1a2e', marginBottom: '2rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' },
  card: { background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s' },
  cardImage: { background: '#f0f0f0', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' },
  cardBody: { padding: '1rem' },
  cardTitle: { color: '#1a1a2e', marginBottom: '0.5rem' },
  cardInfo: { color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' },
  cardPrice: { color: '#e94560', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem' },
  button: { width: '100%', padding: '0.5rem', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  loading: { textAlign: 'center', padding: '4rem', fontSize: '1.2rem' },
  empty: { textAlign: 'center', color: '#666', fontSize: '1.1rem' },
};

export default VehicleList;