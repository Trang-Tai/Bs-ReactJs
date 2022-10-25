import actionTypes from './actionTypes';
import { userService } from '../../services';
import { toast } from "react-toastify";
import { dispatch } from '../../redux';

// export const fetchGenderStart = () => ({
//     type: actionTypes.FETCH_GENDER_START,
// })

export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_GENDER_START })
            const res = await userService.getAllCode('GENDER');
            if(res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data));
            } else {
                dispatch(fetchGenderFailed());
            }
        } catch (error) {
            console.log(error);
            dispatch(fetchGenderFailed());
        }
    }
}

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData,
})

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED,
})

export const fetchPositionStart = () => {
    return async (dispatch, getState) => {
        try {
            const res = await userService.getAllCode('POSITION');
            if(res && res.errCode === 0) {
                dispatch(fetchPositionSuccess(res.data));
            } else {
                dispatch(fetchPositionFailed());
            }
        } catch (error) {
            console.log(error);
            dispatch(fetchPositionFailed());
        }
    }
}

export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData,
})

export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED,
})

export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            const res = await userService.getAllCode('ROLE');
            if(res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data));
            } else {
                dispatch(fetchRoleFailed());
            }
        } catch (error) {
            console.log(error);
            dispatch(fetchRoleFailed());
        }
    }
}

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData,
})

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED,
})

export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            const res = await userService.createNewUser(data);
            if(res && res.errCode === 0) {
                toast.success("CREATE A NEW USER SUCCEED");
                dispatch(saveUserSuccess());
                dispatch(fetchAllUsersStart()); // auto loading list users after created user
            } else {
                dispatch(saveUserFailed());
            }
        } catch (error) {
            console.log(error);
            dispatch(saveUserFailed());
        }
    }
}

export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS,
})

export const saveUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED,
})

export const fetchAllUsersStart = () => {
    return async (dispatch, getState) => {
        try {
            const res = await userService.getAllUsers('ALL');
            if(res && res.errCode === 0) {
                dispatch(fetchAllUsersSuccess(res.users.reverse())); // hàm reverse giúp đảo thứ tự trong mảng => giúp hiển thị thằng mới vừa tạo lên đầu
            } else {
                dispatch(fetchAllUsersFailed());
            }
        } catch (error) {
            console.log(error);
            dispatch(fetchAllUsersFailed());
        }
    }
}

export const fetchAllUsersSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    users: data,
})

export const fetchAllUsersFailed = () => ({
    type: actionTypes.FETCH_ALL_USERS_FAILED,
})

export const deleteUserStart = (userId) => {
    return async (dispatch, getState) => {
        try {
            const res = await userService.deleteUser(userId);
            if(res && res.errCode === 0) {
                toast.success("DELETE USER SUCCEED");
                dispatch(deleteUserSuccess());
                dispatch(fetchAllUsersStart()); // auto loading list users after created user
            } else {
                toast.error("DELETE USER ERROR");
                dispatch(deleteUserFailed());
            }
        } catch (error) {
            console.log(error);
            toast.error("DELETE USER ERROR");
            dispatch(deleteUserFailed());
        }
    }
}

export const deleteUserSuccess = () => {
    return {
        type: actionTypes.DELETE_USER_SUCCESS,
    }
}

export const deleteUserFailed = () => {
    return {
        type: actionTypes.DELETE_USER_FAILED,
    }
}

export const editUserStart = (user) => {
    return async (dispatch, getState) => {
        try {
            const res = await userService.editUser(user);
            if(res && res.errCode === 0) {
                toast.success("UPDATE USER SUCCEED");
                dispatch(editUserSuccess());
                dispatch(fetchAllUsersStart()); // auto loading list users after created user
            } else {
                toast.error("UPDATE USER ERROR");
                dispatch(editUserFailed());
            }
        } catch (error) {
            console.log(error);
            toast.error("UPDATE USER ERROR");
            dispatch(editUserFailed());
        }
    }
}

export const editUserSuccess = () => {
    return {
        type: actionTypes.EDIT_USER_SUCCESS,
    }
}

export const editUserFailed = () => {
    return {
        type: actionTypes.EDIT_USER_FAILED,
    }
}

export const fetchTopDoctor = () => {
    return async (dispatch, getState) => {
        try {
            let res = await userService.getTopDoctorHome();
            console.log(res);
            if(res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
                    dataDoctors: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_TOP_DOCTORS_FAILED,
                })
            }
        } catch (err) {
            console.log(err);
            dispatch({
                type: actionTypes.FETCH_TOP_DOCTORS_FAILED,
            })
        }
    }
}

export const fetchAllDoctors = () => {
    return async (dispatch, getState) => {
        try {
            let res = await userService.getAllDoctors();
            if(res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
                    dataDoctors: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_DOCTORS_FAILED,
                })
            }
        } catch (err) {
            console.log(err);
            dispatch({
                type: actionTypes.FETCH_ALL_DOCTORS_FAILED,
            })
        }
    }
}

export const saveDetailDoctor = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await userService.saveDetailDoctor(data);
            if(res && res.errCode === 0) {
                toast.success("SAVE INFO DETAIL DOCTOR SUCCEED");
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTORS_SUCCESS,
                })
            } else {
                toast.error("SAVE INFO DETAIL DOCTOR FAILED");
                dispatch({
                    type: actionTypes.SAVE_DETAIL_DOCTORS_FAILED,
                })
            }
        } catch (err) {
            console.log(err);
            toast.error("SAVE INFO DETAIL DOCTOR FAILED");
            dispatch({
                type: actionTypes.SAVE_DETAIL_DOCTORS_FAILED,
            })
        }
    }
}

export const fetchAllScheduleTime = () => {
    return async (dispatch, getState) => {
        try {
            let res = await userService.getAllCode('TIME');
            if(res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
                    dataTime: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,
                })
            }
        } catch (err) {
            console.log(err);
            dispatch({
                type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,
            })
        }
    }
}

export const getRequiredDoctorInfor = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_START })
            const resPrice = await userService.getAllCode('PRICE');
            const resPayment = await userService.getAllCode('PAYMENT');
            const resProvince = await userService.getAllCode('PROVINCE');
            if(resPrice && resPrice.errCode === 0 &&
                resPayment && resPayment.errCode === 0 &&
                resProvince && resProvince.errCode === 0) {
                let data = {
                    resPrice: resPrice.data,
                    resPayment: resPayment.data,
                    resProvince: resProvince.data,
                }
                dispatch(fetchRequiredDoctorInforSuccess(data));
            } else {
                dispatch(fetchRequiredDoctorInforFailed());
            }
        } catch (error) {
            console.log(error);
            dispatch(fetchRequiredDoctorInforFailed());
        }
    }
}

export const fetchRequiredDoctorInforSuccess = (data) => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS,
    data: data,
})

export const fetchRequiredDoctorInforFailed = () => ({
    type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED,
})