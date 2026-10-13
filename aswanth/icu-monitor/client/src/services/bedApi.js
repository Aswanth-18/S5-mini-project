import api from './api';
export const getBeds = () => api.get('/beds').then((r) => r.data);
export const createBed = (data) => api.post('/beds', data).then((r) => r.data);