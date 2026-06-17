import API from './api';

export const createDossier = (data) => API.post('/dossiers/', data);
export const getMesDossiers = () => API.get('/dossiers/mes-dossiers');
export const getAllDossiers = () => API.get('/dossiers/');
export const updateDossier = (id, data) => API.patch(`/dossiers/${id}`, data);