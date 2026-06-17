import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVehicle } from '../../services/vehicleService';
import { createDossier } from '../../services/dossierService';
import { useAuth } from '../../context/AuthContext';

const VehicleDetail = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getVehicle(id)
      .then((res) => setVehicle(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDossier = async (type) => {
    if (!user) { navigate('/login'); return; }
    try {
      await createDossier({ vehicle_id: parseInt(id), type_dossier: type });
      setMessage(`Dossier de ${type} soumis avec succès ! Consultez votre espace client.`);
    } catch {
      setMessage('Erreur lors de la soumission du dossier.');
    }
  };

  if (loading) return <div style={styles.loading}>Chargement...</div>;
  if (!vehicle) return <div style={styles.loading}>Véhicule introuvable.</div>;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.back}>← Retour</button>
      <div style={styles.card}>
        <div style={styles.image}>🚗</div>
        <div style={styles.info}>
          <h1 style={styles.title}>{vehicle.marque} {vehicle.modele}</h1>
          <div style={styles.details}>
            <p><strong>Année :</strong> {vehicle.annee}</p>
            <p><strong>Kilométrage :</strong> {vehicle.kilometrage.toLocaleString()} km</p>
            <p><strong>Motorisation :</strong> {vehicle.motorisation}</p>
            {vehicle.disponible_achat && <p><strong>Prix achat :</strong> {vehicle.prix.toLocaleString()} €</p>}
            {vehicle.disponible_location && <p><strong>Prix location :</strong> {vehicle.prix_location_mois?.toLocaleString()} €/mois</p>}
          </div>
          {message && <p style={styles.success}>{message}</p>}
          <div style={styles.actions}>
            {vehicle.disponible_achat && (
              <button style={styles.btnPrimary} onClick={() => handleDossier('achat')}>
                Déposer un dossier d'achat
              </button>
            )}
            {vehicle.disponible_location && (
              <button style={styles.btnSecondary} onClick={() => handleDossier('location')}>
                Déposer un dossier de location
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  back: { background: 'none', border: '1px solid #ddd', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', marginBottom: '1rem' },
  card: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  image: { background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8rem', minHeight: '300px' },
  info: { padding: '2rem' },
  title: { color: '#1a1a2e', marginBottom: '1rem' },
  details: { marginBottom: '1.5rem', lineHeight: '2' },
  actions: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  btnPrimary: { padding: '0.75rem', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' },
  btnSecondary: { padding: '0.75rem', background: '#e94560', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' },
  success: { color: 'green', marginBottom: '1rem', fontWeight: 'bold' },
  loading: { textAlign: 'center', padding: '4rem' },
};

export default VehicleDetail;