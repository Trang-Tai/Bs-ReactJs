import React, { Component } from 'react';
import { connect } from "react-redux";
import './BookingModal.scss';
import { Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import DatePicker from '../../../../components/Input/DatePicker';
import * as actions from '../../../../store/actions'
import { LANGUAGES } from '../../../../utils';
import Select from 'react-select';
import { userService } from '../../../../services';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import localization from 'moment/locale/vi';

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            selectedGender: '',
            doctorId: '',
            timeType: '',
            medicalExaminationDate: '',

            genders: '',
        }
    }

    buildDataGender = (data) => {
        let result = [];
        let language = this.props.language;
        if (data && data.length > 0) {
            data.map((item) => {
                let obj = {};
                obj.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                obj.value = item.keyMap;
                result.push(obj);
            })
        }
        return result;
    }

    async componentDidMount() {
        this.props.getGenders();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            this.setState({
                genders: this.buildDataGender(this.props.genders),
            })
        }
        if (prevProps.genders !== this.props.genders) {
            this.setState({
                genders: this.buildDataGender(this.props.genders),
            })
        }
        if (prevProps.dataTime !== this.props.dataTime) {
            let doctorId = this.props.dataTime?.doctorId || '';
            this.setState({
                doctorId,
                timeType: this.props.dataTime.timeType,
                medicalExaminationDate: this.props.dataTime.date,
            })
        }
    }

    handleOnChangeInput = (e, type) => {
        this.setState({
            [type]: e.target.value,
        })
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0],
        }, () => console.log(this.state.birthday, date))
    }

    handleChangeSelect = async (selectedGender) => {
        this.setState({ selectedGender }, () =>
            console.log(`Option selected:`, this.state.selectedGender)
        );
    };

    buildTimeBooking = (dataTime) => {
        // console.log(moment.unix(dataTime.date))
        if(dataTime) {
            let date = this.props.language === LANGUAGES.VI ?
                moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY') // file localization ở trên khai báo mặc định là 'vi' rồi
                :
                moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY');
            let time = this.props.language === LANGUAGES.VI ?
                dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;

            return `${time} ${date}`
        }
        return ''
    }

    buildDoctorName = (dataTime) => {
        if(dataTime) {
            let name = this.props.language === LANGUAGES.VI ?
                `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`:
                `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`

            return name;
        }
        return ''
    }

    handleConfirmBooking = async () => {
        console.log('Confirm booking: ', this.state);
        let timeString = this.buildTimeBooking(this.props.dataTime);
        let doctorName = this.buildDoctorName(this.props.dataTime);
        let res = await userService.postPatientBookAppointment({
            fullName: this.state.fullName,
            // phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            // address: this.state.address,
            // reason: this.state.reason,
            // birthday: this.state.birthday,
            // selectedGender: this.state.selectedGender.value,
            doctorId: this.state.doctorId,
            timeType: this.state.timeType,
            date: this.state.medicalExaminationDate,
            timeString: timeString,
            doctorName,
            language: this.props.language,
        })
        if(res && res.errCode === 0) {
            toast.success('Booking a new appointment succeed');
            this.props.closeBookingClose();
        } else {
            toast.error('Booking a new appointment error')
        }
    }

    render() {
        let { isOpenModal, closeBookingClose, dataTime } = this.props;
        
        return (
            <div>
                <Modal
                    isOpen={isOpenModal}
                    className={'booking-modal-container'}
                    centered
                    size='lg'
                >
                    <div className='booking-modal-content'>
                        <div className='booking-modal-header'>
                            <span className='left'>
                                <FormattedMessage id={'patient.booking-modal.title'} />
                            </span>
                            <span className='right' onClick={closeBookingClose}>
                                <i className='fas fa-times'></i>
                            </span>
                        </div>
                        <div className='booking-modal-body'>
                            <div className='doctor-infor'>
                                <ProfileDoctor
                                    doctorId={this.state.doctorId}
                                    isShowDescriptionDoctor={false}
                                    dataTime={dataTime}
                                />
                            </div>
                            <div className='row'>
                                <div className='col-6 form-group'>
                                    <label>
                                        <FormattedMessage id={'patient.booking-modal.fullName'} />
                                    </label>
                                    <input className='form-control'
                                        value={this.state.fullName}
                                        onChange={(e) => this.handleOnChangeInput(e, 'fullName')}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label>
                                        <FormattedMessage id={'patient.booking-modal.phoneNumber'} />
                                    </label>
                                    <input className='form-control'
                                        value={this.state.phoneNumber}
                                        onChange={(e) => this.handleOnChangeInput(e, 'phoneNumber')}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label>
                                        <FormattedMessage id={'patient.booking-modal.email'} />
                                    </label>
                                    <input className='form-control'
                                        value={this.state.email}
                                        onChange={(e) => this.handleOnChangeInput(e, 'email')}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label>
                                        <FormattedMessage id={'patient.booking-modal.address'} />
                                    </label>
                                    <input className='form-control'
                                        value={this.state.address}
                                        onChange={(e) => this.handleOnChangeInput(e, 'address')}
                                    />
                                </div>
                                <div className='col-12 form-group'>
                                    <label>
                                        <FormattedMessage id={'patient.booking-modal.reason'} />
                                    </label>
                                    <input className='form-control'
                                        value={this.state.reason}
                                        onChange={(e) => this.handleOnChangeInput(e, 'reason')}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label>
                                        <FormattedMessage id={'patient.booking-modal.birthday'} />
                                    </label>
                                    <DatePicker
                                        onChange={this.handleOnChangeDatePicker}
                                        className='form-control'
                                        value={this.state.birthday}
                                    />
                                </div>
                                <div className='col-6 form-group'>
                                    <label>
                                        <FormattedMessage id={'patient.booking-modal.gender'} />
                                    </label>
                                    <Select
                                        value={this.state.selectedGender}
                                        onChange={this.handleChangeSelect}
                                        options={this.state.genders}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='booking-modal-footer'>
                            <button className='btn-booking-confirm'
                                onClick={this.handleConfirmBooking}
                            >
                                <FormattedMessage id={'patient.booking-modal.btnConfirm'} />
                            </button>
                            <button className='btn-booking-cancel'
                                onClick={closeBookingClose}>
                                <FormattedMessage id={'patient.booking-modal.btnCancel'} />
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genders: state.admin.genders,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenders: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
