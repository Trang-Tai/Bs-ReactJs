import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import Slider from "react-slick";

class About extends Component {

    render() {
        let settings = this.props.settings;
        return (
            <div className='section-share section-about'>
                <div className='section-about-header'>
                    Truyền thông nói về BookingCare
                </div>
                <div className='section-about-content'>
                    <div className='content-left'>
                        <iframe width="100%" height="400px"
                            src="https://www.youtube.com/embed/1auIlCmDLZs"
                            title='🔴28/09:  Trương Quốc Huy Kể Chuyện " bác Hồ" Có " Đạo Đức" Và Giản Dị Như  Đảng Nói Hay Không ?'
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen>
                        </iframe>
                    </div>
                    <div className='content-right'>
                        <p>Sự Thật Về Vụ Kiện Chất Độc Da Cam
                        Màn Kịch Chất Độc Màu Da Cam Bị Vạch Trần Và Thua Kiện Tại Mỹ
                        Hảy Ủng Hộ Chúng Tôi Bấm theo dỏi (Subsriber) và chia sẽ
                        Tham Gia Ủng Hộ Thành Lập M16 - N10Tv - Trương Quốc Huy Team</p>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
