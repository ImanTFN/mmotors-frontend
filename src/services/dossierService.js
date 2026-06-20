import API from './api';

export const createDossier = (data) => API.post('/dossiers/', data);
export const getMesDossiers = () => API.get('/dossiers/mes-dossiers');
export const getAllDossiers = () => API.get('/dossiers/');
export const updateDossier = (id, data) => API.patch(`/dossiers/${id}`, data);

export const uploadDocument = (dossierId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return API.post(`/dossiers/${dossierId}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getDocuments = (dossierId) => API.get(`/dossiers/${dossierId}/documents`);