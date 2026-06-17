import API from './api';

export const getVehicles = (type) => API.get(`/vehicles/?type=${type}`);
export const getVehicle = (id) => API.get(`/vehicles/${id}`);
export const createVehicle = (data) => API.post('/vehicles/', data);
export const updateVehicle = (id, data) => API.put(`/vehicles/${id}`, data);
export const basculerVehicle = (id) => API.patch(`/vehicles/${id}/basculer`);
export const deleteVehicle = (id) => API.delete(`/vehicles/${id}`);