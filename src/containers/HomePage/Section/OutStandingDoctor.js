import React, { Component } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";
import * as actions from '../../../store/actions';
import { LANGUAGES } from '../../../utils';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';

class OutStandingDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctors: [],
        }
    }

    componentDidMount() {
        this.props.loadTopDoctors();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
            this.setState({
                arrDoctors: this.props.topDoctorsRedux,
            })
        }
    }

    handleViewDetailDoctor = (doctor) => {
        this.props.history.push(`/detail-doctor/${doctor.id}`)
    }

    render() {
        let settings = this.props.settings;
        let arrDoctors = this.state.arrDoctors;
        // arrDoctors = arrDoctors.concat(arrDoctors).concat(arrDoctors)
        let language = this.props.language;
        return (
            <div className='section-share section-outstanding-doctor'>
                <div className='section-container'>
                    <div className='section-header'>
                        <span className='title-section'><FormattedMessage id={"homepage.outstanding-doctor"} /></span>
                        <button className='btn-section'><FormattedMessage id={"homepage.more-info"} /></button>
                    </div>
                    <div className='section-body'>
                        <Slider {...settings}>
                            {arrDoctors && arrDoctors.length &&
                                arrDoctors.map((doctor, index) => {
                                    let nameVi = `${doctor.positionData.valueVi}, ${doctor.firstName} ${doctor.lastName}`;
                                    let nameEn = `${doctor.positionData.valueEn}, ${doctor.firstName} ${doctor.lastName}`;
                                    let imageBase64 = '';
                                    if (doctor?.image) {
                                        imageBase64 = Buffer.from(doctor.image, 'base64').toString('binary');
                                    }
                                    return (
                                        <div key={index} className='section-customize' onClick={() => this.handleViewDetailDoctor(doctor)}>
                                            <div className='customize-border'>
                                                <div className='outer-bg'>
                                                    <div style={{ backgroundImage: `url(${imageBase64})`}} className='bg-image section-outstanding-doctor'></div>
                                                </div>
                                                <div className='position text-center'>
                                                    <div>{language === LANGUAGES.VI && nameVi || nameEn}</div>
                                                    <div>Cơ Xương khớp</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        topDoctorsRedux: state.admin.topDoctors,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor));
