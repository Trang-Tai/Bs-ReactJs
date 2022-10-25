import React, { Component } from 'react';
import { connect } from "react-redux";
import { userService } from '../../services';
import HomeHeader from '../HomePage/HomeHeader';
import './VerifyEmail.scss'

class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusVerify: false,
            errCode: 0,
        }
    }

    async componentDidMount() {
        if(this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search);
            let token = urlParams.get('token');
            let doctorId = urlParams.get('doctorId');
            // console.log(token, doctorId);
            let res = await userService.postVerifyBookAppointment({
                token,
                doctorId: +doctorId,
            })
            if(res && res.errCode === 0) {
                this.setState({
                    statusVerify: true,
                    errCode: res.errCode,
                })
            } else {
                this.setState({
                    statusVerify: true,
                    errCode: res?.errCode || -1,
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.language !== this.props.language) {
            
        }
    }

    render() {
        const { statusVerify, errCode } = this.state;
        return (
            <>
                <HomeHeader />
                <div className='verify-email-container'>
                    {!statusVerify && 
                        <div>
                            Loading data ...
                        </div>
                        ||
                        <div>
                            {
                                errCode === 0?
                                <div className='infor-booking'>Đã xác nhận thành công</div>:
                                <div className='infor-booking'>Lịch hẹn không tồn tại hoặc đã dc xác nhận</div>
                            }
                        </div>
                    }
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
