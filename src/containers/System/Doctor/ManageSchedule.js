import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManageSchedule.scss';
import Select from 'react-select';
import * as actions from '../../../store/actions';
import { LANGUAGES } from '../../../utils';
import { userService } from '../../../services';
import { DatePicker } from '../../../components/Input';
import { toast } from 'react-toastify';
import _ from 'lodash';
import moment from 'moment';

class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],
            selectedDoctor: '',
            currentDate: '',
            rangeTime: '',
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.fetchAllScheduleTime();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            this.setState({
                listDoctors: dataSelect,
            })
        }
        if(prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime;
            if(data && data.length > 0) {
                data = data.map((item) => ({ ...item, isSelected: false, }))
            }
            this.setState({
                rangeTime: data,
            })
        }
        // if(prevProps.language !== this.props.language) {
        //     let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
        //     this.setState({
        //         listDoctors: dataSelect,
        //     })
        // }
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        let { language } = this.props;
        if (inputData && inputData.length > 0) {
            inputData.map((doctor, index) => {
                let obj = {};
                let labelEn = `${doctor.firstName} ${doctor.lastName}`;
                let labelVi = `${doctor.lastName} ${doctor.firstName}`;
                obj.label = language === LANGUAGES.VI ? labelVi : labelEn;
                obj.value = doctor.id;
                result.push(obj);
            })
        }
        return result;
    }

    handleChangeSelect = async (selectedDoctor) => {
        this.setState({ selectedDoctor }, () =>
            console.log(`Option selected:`, this.state.selectedDoctor)
        );
    };

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0],
        }, () => console.log(this.state.currentDate, date))
    }

    handleClickBtnTime = (time) => {
        let { rangeTime } = this.state;
        if(rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if(item.id === time.id) item.isSelected = !item.isSelected;
                return item;
            })
            this.setState({
                rangeTime: rangeTime,
            })
        }
    }

    handleSaveSchedule = async () => {
        let { currentDate, selectedDoctor, rangeTime } = this.state;
        let result = [];
        if(!currentDate) {
            toast.error('Invalid date!');
            return;
        }
        if(!selectedDoctor && _.isEmpty(selectedDoctor)) {
            toast.error('Invalid selected doctor');
            return;
        }
        // let formattedDate = moment(currentDate).format('DD/MM/YYYY'); // formattedDate dạng string
        let formattedDate = new Date(currentDate).getTime(); // formattedDate dạng timestamp
        if(rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter(item => item.isSelected === true);
            if(selectedTime && selectedTime.length > 0) {
                selectedTime.map(schedule => {
                    let obj = {};
                    obj.doctorId = selectedDoctor.value;
                    obj.timeType = schedule.keyMap; // cột keyMap trong bảng allcodes
                    obj.date = formattedDate;
                    result.push(obj);
                })
            } else {
                toast.error('You must choose at least 1 timeframe');
                return;
            }
        }
        console.log(result);
        let res = await userService.saveBulkScheduleDoctor(result);
        if(res && res.errCode === 0) {
            toast.success('Save info success');
        } else {
            toast.error('Save failed')
        }
    }

    render() {
        const { rangeTime } = this.state;
        const { language } = this.props;
        let yesterday = new Date(new Date().setDate(new Date().getDate()-1));
        return (
            <div className='manage-schedule-container'>
                <div className='m-s-title'>
                    <FormattedMessage id={'manage-schedule.title'} />
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id={'manage-schedule.choose-doctor'} /></label>
                            <Select
                                value={this.state.selectedDoctor}
                                onChange={this.handleChangeSelect}
                                options={this.state.listDoctors}
                            />
                        </div>
                        <div className='col-6 form-group'>
                            <label><FormattedMessage id={'manage-schedule.choose-date'} /></label>
                            <DatePicker 
                                onChange={this.handleOnChangeDatePicker} 
                                className='form-control'
                                value={this.state.currentDate}
                                minDate={new Date().setHours(0,0,0,0)}
                            />
                        </div>
                        <div className='col-12 pick-hour-container'>
                            {rangeTime && rangeTime.length > 0 &&
                                rangeTime.map((item, index) => {
                                    return (
                                        <button className={`btn btn-schedule ${item.isSelected && 'active'}`} 
                                                key={index}
                                                onClick={() => this.handleClickBtnTime(item)}>
                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </button>
                                    )
                                })
                            }
                        </div>
                        <div className='col-12'>
                            <button className='btn btn-primary btn-save-schedule'
                                onClick={this.handleSaveSchedule}>
                                <FormattedMessage id={'manage-schedule.save'} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        allScheduleTime: state.admin.allScheduleTime,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
