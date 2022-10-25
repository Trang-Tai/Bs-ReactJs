import axios from '../axios';

const handleLogin = (email, password) => {
    return axios.post('/api/login', { email, password });
}

const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`);
}

const createNewUser = (data) => {
    return axios.post('/api/create-new-user', data);
}

const deleteUser = (userId) => {
    return axios.delete('/api/delete-user', { data: { id: userId } })
}

const editUser = (inputData) => {
    return axios.put('/api/edit-user', { user: inputData })
}

const getAllCode = (typeInput) => {
    return axios.get(`/api/allcode?type=${typeInput}`);
}

const getTopDoctorHome = (limit = '') => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`)
}

const getAllDoctors = () => {
    return axios.get('/api/get-all-doctors');
}

const saveDetailDoctor = (data) => {
    return axios.post('/api/save-infor-doctors', data);
}

const getDetailInfoDoctor = (id) => {
    return axios.get(`/api/get-detail-doctor-by-id?id=${id}`);
}

const saveBulkScheduleDoctor = (data) => {
    return axios.post('/api/bulk-create-schedule', { arrSchedule: data });
}

const getScheduleDoctorByDate = (doctorId, date) => {
    return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`);
}

const getExtraInforDoctorById = (doctorId) => {
    return axios.get(`/api/get-extra-info-doctor-by-id?doctorId=${doctorId}`);
}

const getProfileDoctorById = (doctorId) => {
    return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`);
}

const postPatientBookAppointment = (data) => {
    return axios.post('/api/patient-book-appointment', data);
}

const postVerifyBookAppointment = (data) => {
    return axios.post('/api/verify-book-appointment', data);
}

const createNewSpecialty = (data) => {
    return axios.post('/api/create-new-specialty', data);
}

export default {
    handleLogin,
    getAllUsers,
    createNewUser,
    deleteUser,
    editUser,
    getAllCode,
    getTopDoctorHome,
    getAllDoctors,
    saveDetailDoctor,
    getDetailInfoDoctor,
    saveBulkScheduleDoctor,
    getScheduleDoctorByDate,
    getExtraInforDoctorById,
    getProfileDoctorById,
    postPatientBookAppointment,
    postVerifyBookAppointment,
    createNewSpecialty,
}