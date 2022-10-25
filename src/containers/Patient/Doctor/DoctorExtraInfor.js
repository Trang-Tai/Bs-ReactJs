import React, { Component } from 'react';
import { connect } from "react-redux";
import './DoctorExtraInfor.scss';
import { LANGUAGES } from '../../../utils';
import { userService } from '../../../services';
import { FormattedMessage } from 'react-intl';
import { NumericFormat } from 'react-number-format';


class DoctorExtraInfor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowDetailInfor: true,
            extraInfo: '',
        }
    }

    componentDidMount() {
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
        }
        if (prevProps.doctorIdFromParent !== this.props.doctorIdFromParent) {
            let res = await userService.getExtraInforDoctorById(this.props.doctorIdFromParent);
            if (res && res.errCode === 0) {
                this.setState({
                    extraInfo: res.data,
                })
            }
        }
    }

    showHideDetailInfor = (status) => {
        this.setState({
            isShowDetailInfor: status,
        })
    }

    render() {
        const { isShowDetailInfor, extraInfo } = this.state;
        const { language } = this.props;
        console.log(extraInfo)
        return (
            <div className='doctor-extra-infor-container'>
                <div className='content-up'>
                    <div className='text-address'>
                        <FormattedMessage id={'patient.extra-infor-doctor.text-address'} />
                    </div>
                    <div className='name-clinic'>
                        {extraInfo && extraInfo?.nameClinic}
                    </div>
                    <div className='detail-address-clinic'>
                        {extraInfo && extraInfo?.addressClinic}
                    </div>
                </div>
                <div className='content-down'>
                    {this.state.isShowDetailInfor &&
                        <>
                            <div className='title-price'>
                                <FormattedMessage id={'patient.extra-infor-doctor.price'} />: .
                            </div>
                            <div className='detail-infor'>
                                <div className='price'>
                                    <span className='left'>
                                        <FormattedMessage id={'patient.extra-infor-doctor.price'} />
                                    </span>
                                    <span className='right'>
                                        <NumericFormat
                                            className='currency'
                                            value={language === LANGUAGES.VI ? extraInfo?.priceTypeData?.valueVi : extraInfo?.priceTypeData?.valueEn}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            suffix={language === LANGUAGES.VI ? 'VND' : 'USD'}
                                        />
                                    </span>
                                </div>
                                <div className='note'>
                                    {extraInfo && extraInfo.note}
                                </div>
                            </div>
                            <div className='payment'>
                                <FormattedMessage id={'patient.extra-infor-doctor.payment'} /> 
                                {extraInfo && extraInfo?.paymentTypeData && extraInfo.paymentTypeData.valueVi}
                            </div>
                            <div className='hide-price'>
                                <span onClick={() => this.showHideDetailInfor(false)}>
                                    <FormattedMessage id={'patient.extra-infor-doctor.hide-price'} />
                                </span>
                            </div>
                        </>
                        ||
                        <div className='short-infor'>
                            <FormattedMessage id={'patient.extra-infor-doctor.price'} />:
                            <NumericFormat
                                className='currency'
                                value={language === LANGUAGES.VI ? extraInfo?.priceTypeData?.valueVi : extraInfo?.priceTypeData?.valueEn}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={language === LANGUAGES.VI ? 'VND' : 'USD'}
                            />
                            <span className='detail' onClick={() => this.showHideDetailInfor(true)}>
                                <FormattedMessage id={'patient.extra-infor-doctor.detail'} />
                            </span>
                        </div>
                    }
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor);
