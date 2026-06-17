import { useEffect, useState } from 'react';
import { getMesDossiers } from '../../services/dossierService';
import { useAuth } from '../../context/AuthContext';

const statusColors = {
  en_attente: '#f39c12',
  en_cours: '#3498db',
  valide: '#27ae60',
  refuse: '#e74c3c',
};

const statusLabels = {
  en_attente: 'En attente',
  en_cours: 'En cours',
  valide: 'Validé',
  refuse: 'Refusé',
};

const Dashboard = () => {
  const { user } = useAuth();
  const [dossiers, setDossiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMesDossiers()
      .then((res) => setDossiers(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={styles.loading}>Chargement...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Bonjour, {user?.prenom} {user?.nom} 👋</h2>
      <h3 style={styles.subtitle}>Mes dossiers</h3>
      {dossiers.length === 0 ? (
        <p style={styles.empty}>Vous n'avez aucun dossier pour le moment.</p>
      ) : (
        <div style={styles.list}>
          {dossiers.map((d) => (
            <div key={d.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.type}>{d.type_dossier === 'achat' ? '🚗 Achat' : '🔑 Location'}</span>
                <span style={{ ...styles.status, background: statusColors[d.statut] }}>
                  {statusLabels[d.statut]}
                </span>
              </div>
              <p style={styles.cardInfo}>Véhicule ID : {d.vehicle_id}</p>
              <p style={styles.cardInfo}>Soumis le : {new Date(d.created_at).toLocaleDateString('fr-FR')}</p>
              {d.commentaire && <p style={styles.comment}>💬 {d.commentaire}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  title: { color: '#1a1a2e', marginBottom: '0.5rem' },
  subtitle: { color: '#666', marginBottom: '1.5rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  type: { fontWeight: 'bold', color: '#1a1a2e' },
  status: { color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem' },
  cardInfo: { color: '#666', margin: '0.25rem 0' },
  comment: { color: '#333', marginTop: '0.5rem', fontStyle: 'italic' },
  loading: { textAlign: 'center', padding: '4rem' },
  empty: { color: '#666', textAlign: 'center' },
};

export default Dashboard;