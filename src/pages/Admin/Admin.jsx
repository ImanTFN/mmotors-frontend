import { useEffect, useState } from 'react';
import { getVehicles, createVehicle, basculerVehicle, deleteVehicle } from '../../services/vehicleService';
import { getAllDossiers, updateDossier } from '../../services/dossierService';
import { getDocuments } from '../../services/dossierService';

const Admin = () => {
  const [vehicles, setVehicles] = useState([]);
  const [dossiers, setDossiers] = useState([]);
  const [documents, setDocuments] = useState({});
  const [tab, setTab] = useState('vehicles');
  const [form, setForm] = useState({ marque: '', modele: '', annee: '', kilometrage: '', prix: '', motorisation: '', disponible_achat: true, disponible_location: false, prix_location_mois: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadVehicles();
    loadDossiers();
  }, []);

  const loadVehicles = () => getVehicles('').then((res) => setVehicles(res.data));

  const loadDossiers = () => {
    getAllDossiers().then((res) => {
      setDossiers(res.data);
      res.data.forEach((d) => loadDocuments(d.id));
    });
  };

  const loadDocuments = (dossierId) => {
    getDocuments(dossierId).then((res) => {
      setDocuments((prev) => ({ ...prev, [dossierId]: res.data }));
    });
  };

  const handleCreateVehicle = async (e) => {
    e.preventDefault();
    try {
      await createVehicle({
        ...form,
        annee: parseInt(form.annee),
        kilometrage: parseInt(form.kilometrage),
        prix: parseFloat(form.prix),
        prix_location_mois: form.prix_location_mois ? parseFloat(form.prix_location_mois) : null,
      });
      setMessage('Véhicule ajouté avec succès !');
      loadVehicles();
      setForm({ marque: '', modele: '', annee: '', kilometrage: '', prix: '', motorisation: '', disponible_achat: true, disponible_location: false, prix_location_mois: '' });
    } catch {
      setMessage('Erreur lors de l\'ajout.');
    }
  };

  const handleBasculer = async (id) => {
    await basculerVehicle(id);
    loadVehicles();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce véhicule ?')) {
      await deleteVehicle(id);
      loadVehicles();
    }
  };

  const handleUpdateDossier = async (id, statut) => {
    await updateDossier(id, { statut });
    loadDossiers();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Back-office Admin</h2>
      <div style={styles.tabs}>
        <button style={{ ...styles.tab, ...(tab === 'vehicles' ? styles.activeTab : {}) }} onClick={() => setTab('vehicles')}>Véhicules</button>
        <button style={{ ...styles.tab, ...(tab === 'dossiers' ? styles.activeTab : {}) }} onClick={() => setTab('dossiers')}>Dossiers</button>
        <button style={{ ...styles.tab, ...(tab === 'add' ? styles.activeTab : {}) }} onClick={() => setTab('add')}>Ajouter un véhicule</button>
      </div>

      {tab === 'add' && (
        <div style={styles.card}>
          <h3>Nouveau véhicule</h3>
          {message && <p style={styles.success}>{message}</p>}
          <form onSubmit={handleCreateVehicle}>
            {['marque', 'modele', 'annee', 'kilometrage', 'prix', 'motorisation'].map((field) => (
              <input key={field} style={styles.input} placeholder={field} value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })} required />
            ))}
            <input style={styles.input} placeholder="Prix location/mois (optionnel)" value={form.prix_location_mois}
              onChange={(e) => setForm({ ...form, prix_location_mois: e.target.value })} />
            <label style={styles.label}>
              <input type="checkbox" checked={form.disponible_achat} onChange={(e) => setForm({ ...form, disponible_achat: e.target.checked })} />
              {' '} Disponible à l'achat
            </label>
            <label style={styles.label}>
              <input type="checkbox" checked={form.disponible_location} onChange={(e) => setForm({ ...form, disponible_location: e.target.checked })} />
              {' '} Disponible à la location
            </label>
            <button type="submit" style={styles.btn}>Ajouter</button>
          </form>
        </div>
      )}

      {tab === 'vehicles' && (
        <div>
          {vehicles.map((v) => (
            <div key={v.id} style={styles.row}>
              <span style={styles.rowTitle}>{v.marque} {v.modele} ({v.annee})</span>
              <span style={styles.badge}>{v.disponible_achat ? '🛒 Achat' : ''} {v.disponible_location ? '🔑 Location' : ''}</span>
              <button style={styles.btnSmall} onClick={() => handleBasculer(v.id)}>Basculer</button>
              <button style={{ ...styles.btnSmall, background: '#e74c3c' }} onClick={() => handleDelete(v.id)}>Supprimer</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'dossiers' && (
        <div>
          {dossiers.map((d) => (
            <div key={d.id} style={styles.dossierCard}>
              <div style={styles.dossierHeader}>
                <span>Dossier #{d.id} — {d.type_dossier} — Véhicule #{d.vehicle_id}</span>
                <span style={styles.badge}>{d.statut}</span>
                <select style={styles.select} value={d.statut} onChange={(e) => handleUpdateDossier(d.id, e.target.value)}>
                  <option value="en_attente">En attente</option>
                  <option value="en_cours">En cours</option>
                  <option value="valide">Validé</option>
                  <option value="refuse">Refusé</option>
                </select>
              </div>
              <div style={styles.docSection}>
                <p style={styles.docTitle}>📎 Documents déposés</p>
                {documents[d.id]?.length > 0 ? (
                  <ul style={styles.docList}>
                    {documents[d.id].map((doc) => (
                      <li key={doc.id}>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" style={styles.docLink}>
                          ⬇ {doc.nom_fichier}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={styles.noDoc}>Aucun document déposé pour ce dossier.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '1100px', margin: '0 auto' },
  title: { color: '#1a1a2e', marginBottom: '1.5rem' },
  tabs: { display: 'flex', gap: '1rem', marginBottom: '2rem' },
  tab: { padding: '0.5rem 1.5rem', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', background: 'white' },
  activeTab: { background: '#1a1a2e', color: 'white', border: 'none' },
  card: { background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  input: { display: 'block', width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' },
  label: { display: 'block', marginBottom: '0.75rem', cursor: 'pointer' },
  btn: { padding: '0.75rem 2rem', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' },
  btnSmall: { padding: '0.25rem 0.75rem', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: '0.5rem' },
  row: { display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '0.75rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  rowTitle: { flex: 1, fontWeight: 'bold' },
  badge: { color: '#666', fontSize: '0.9rem' },
  select: { padding: '0.25rem', borderRadius: '4px', border: '1px solid #ddd' },
  success: { color: 'green', marginBottom: '1rem' },
  dossierCard: { background: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '0.75rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  dossierHeader: { display: 'flex', alignItems: 'center', gap: '1rem' },
  docSection: { marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #eee' },
  docTitle: { fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.9rem' },
  docList: { paddingLeft: '1.2rem', margin: 0 },
  docLink: { color: '#1a1a2e', textDecoration: 'underline' },
  noDoc: { color: '#999', fontSize: '0.9rem' },
};

export default Admin;