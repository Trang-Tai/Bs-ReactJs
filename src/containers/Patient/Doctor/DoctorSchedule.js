import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorSchedule.scss';
import moment from 'moment';
import { LANGUAGES } from '../../../utils';
import { userService } from '../../../services';
import { FormattedMessage } from 'react-intl';
import BookingModal from './Modal/BookingModal';

// const date = moment(new Date()).add(2, 'days');
let date = moment(new Date());
let dow = date.day();
// console.log(dow); // console the day of week number => Chủ nhật: 0 , thứ hai: 1, ....

// update defined days name in Vietnamese(uppercase first letter)
// const days = 'Thứ hai_Thứ ba_Thứ tư_Thứ năm_Thứ sáu_Thứ bảy_Chủ nhật'.split('_');
const daysOfWeek = ['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy']
let formatedDays = daysOfWeek.slice(dow).concat(daysOfWeek.slice(0, dow));
console.log(formatedDays)
moment.updateLocale('vi', {
    weekdays : daysOfWeek,
});

class DoctorSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDays: [],
            allAvailableTime: [],
            isOpenModalBooking: false,
            dataScheduleTimeModal: {},
        }
    }

    componentDidMount() {
        let { language } = this.props;
        // console.log('moment vie: ', moment(new Date()).format('dddd - DD/MM'));
        // console.log('moment en: ', moment(new Date()).locale('en').format('ddd - DD/MM'));
        let allDays = this.getArrDays(language);
        this.setState({
            arrDays: allDays,
        })
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            let allDays = this.getArrDays(this.props.language);
            this.setState({
                arrDays: allDays
            })
        }
        if (prevProps.doctorIdFromParent !== this.props.doctorIdFromParent) {
            let doctorId = this.props.doctorIdFromParent;
            let res = await userService.getScheduleDoctorByDate(doctorId, this.state.arrDays[0].value);
            if (res && res.errCode === 0) {
                this.setState({
                    allAvailableTime: res.data || [],
                })
            }
        }
    }

    getArrDays = (language) => {
        let arrDays = [];
        for (let i = 0; i < 7; i++) {
            let obj = {};
            if(i === 0) {
                let ddMM = moment(new Date()).add(i, 'days').format('DD/MM'); // 09/10
                let today = language === LANGUAGES.VI ? 'Hôm nay' : 'Today';
                obj.label = `${today} - ${ddMM}`;
            } else {
                if (language === LANGUAGES.VI) {
                    obj.label = moment(new Date()).add(i, 'days').locale('vi').format('dddd - DD/MM'); // Chủ nhật 09/10
                } else {
                    obj.label = moment(new Date()).add(i, 'days').locale('en').format('ddd - DD/MM'); // Sun 09/10
                }
            }
            obj.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
            arrDays.push(obj);
        }
        return arrDays;
    }

    handleOnChangeSelect = async (e) => {
        if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
            let doctorId = this.props.doctorIdFromParent;
            let date = e.target.value;
            let res = await userService.getScheduleDoctorByDate(doctorId, date);
            console.log(res);
            if (res && res.errCode === 0) {
                this.setState({
                    allAvailableTime: res.data || [],
                })
            }
        }
    }

    closeBookingClose = () => {
        this.setState({
            isOpenModalBooking: false,
        })
    }

    handleClickScheduleTime = (time) => {
        this.setState({
            isOpenModalBooking: true,
            dataScheduleTimeModal: time,
        })
        console.log(time)
    }

    render() {
        const { arrDays, allAvailableTime, isOpenModalBooking, dataScheduleTimeModal } = this.state;
        const { language } = this.props;
        return (
            <>
                <div className='doctor-schedule-container'>
                    <div className='all-schedule'>
                        <select onChange={(e) => this.handleOnChangeSelect(e)}>
                            {arrDays && arrDays.length &&
                                arrDays.map((item, index) => {
                                    return (
                                        <option value={item.value} key={index}>{item.label}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className='all-availabel-time'>
                        <div className='text-calendar'>
                            <span>
                                <i className='fas fa-calendar-alt' />
                                <FormattedMessage id={"patient.detail-doctor.schedule"} />
                            </span>
                        </div>
                        <div className='time-content'>
                            {allAvailableTime && allAvailableTime.length > 0 &&
                                <>
                                    <div className='time-content-btns'>
                                        {allAvailableTime.map((item, index) => {
                                            let timeDisplay = language === LANGUAGES.VI && item?.timeTypeData.valueVi || item?.timeTypeData.valueEn;
                                            let className = language === LANGUAGES.VI ? 'btn-vi' : 'btn-en';
                                            return (
                                                <button key={index} 
                                                    className={className}
                                                    onClick={() => this.handleClickScheduleTime(item)}
                                                >
                                                    {timeDisplay}
                                                </button>
                                            )
                                        })}
                                    </div>
                                    <div className='book-free'>
                                        <span>Choose <i className='far fa-hand-point-up'></i> and book(free)</span>
                                    </div>
                                </>
                                ||
                                <div><FormattedMessage id={"patient.detail-doctor.no-schedule"} /></div>
                            }
                        </div>
                    </div>
                </div>
                <BookingModal
                    isOpenModal={isOpenModalBooking}
                    closeBookingClose={this.closeBookingClose}
                    dataTime={dataScheduleTimeModal}
                />
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
