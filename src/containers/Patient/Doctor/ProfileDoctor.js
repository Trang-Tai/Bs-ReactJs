import React, { Component } from 'react';
import { connect } from "react-redux";
import { userService } from '../../../services';
import { LANGUAGES } from '../../../utils';
import './ProfileDoctor.scss';
import { NumericFormat } from 'react-number-format';
import moment from 'moment';
import localization from 'moment/locale/vi'

class ProfileDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {}
        }
    }

    async componentDidMount() {
        let id = this.props.doctorId;
        let data = await this.getInforDoctor(id);
        this.setState({
            dataProfile: data,
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {

        }
    }

    getInforDoctor = async (id) => {
        let result = {};
        if (id) {
            let res = await userService.getProfileDoctorById(id);
            if (res && res.errCode === 0) {
                result = res.data;
            }
        }
        return result;
    }

    renderTimeBooking = (dataTime) => {
        // console.log(moment.unix(dataTime.date))
        if(dataTime) {
            let date = this.props.language === LANGUAGES.VI ?
                moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY') // file localization ở trên khai báo mặc định là 'vi' rồi
                :
                moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY');
            let time = this.props.language === LANGUAGES.VI ?
                dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;

            return (
                <>
                    <div>{time}  {date}</div>
                    <div>Miễn phí đặt lịch</div>
                </>
            )
        }
        return <></>
    }

    render() {
        const { dataProfile } = this.state;
        const { language, isShowDescriptionDoctor, dataTime } = this.props;
        let nameVi = '', nameEn = '';
        if (dataProfile?.positionData) {
            nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.firstName} ${dataProfile.lastName}`;
            nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`;
        }
        console.log(this.state)
        return (
            <div className='profile-doctor-container'>
                <div className='intro-doctor'>
                    <div className='content-left'
                        style={{ backgroundImage: `url(${dataProfile?.image})` }}
                    >
                    </div>
                    <div className='content-right'>
                        <div className='up'>
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                        </div>
                        <div className='down'>
                            {isShowDescriptionDoctor === true ? dataProfile?.Markdown && dataProfile.Markdown.description &&
                                <span>
                                    {dataProfile.Markdown.description}
                                </span>
                                :
                                this.renderTimeBooking(dataTime)
                            }
                        </div>
                    </div>
                </div>
                <div className='price'>
                    Giá khám: 
                    <NumericFormat
                        className='currency'
                        value={language === LANGUAGES.VI ? dataProfile.Doctor_Infor?.priceTypeData?.valueVi : dataProfile.Doctor_Infor?.priceTypeData?.valueEn}
                        displayType={'text'}
                        thousandSeparator={true}
                        suffix={language === LANGUAGES.VI ? 'VND' : 'USD'}
                    />
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
