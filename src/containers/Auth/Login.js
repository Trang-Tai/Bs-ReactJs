import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';

import { userService } from '../../services'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowPassword: false,
            errMessage: '',
        }
    }

    handleOnChangeUsername = (e) => {
        this.setState({
            username: e.target.value,
        })
    }

    handleOnChangePassword = (e) => {
        this.setState({
            password: e.target.value,
        })
    }

    handleLogin = async () => {
        this.setState({
            errMessage: ''
        })
        try {
            const data = await userService.handleLogin(this.state.username, this.state.password);
            // mặc định trả về là 1 response nhưng trong middleware của response axios trả về là response.data
            console.log(data);
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message,
                })
            }
            if(data && data.errCode === 0) {
                this.props.userLoginSuccess(data.userInfo);
                console.log('Login succeeds');
            }
        } catch(err) {
            console.log(err.response)
            if(err?.response?.data) {
                this.setState({
                    errMessage: err.response.data.message,
                })
            }
        }
    }

    handleShowHidePassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword,
        })
    }

    handleKeyDown = (e) => {
        if(e.key === 'Enter' || e.keyCode === 13) {
            this.handleLogin();
        }
    }

    render() {
        return (
            <div className='login-background'>
                <div className='login-container'>
                    <div className='login-content row'>
                        <div className='col-12 text-login'>Login</div>
                        <div className='col-12 form-group login-input'>
                            <label>Username: </label>
                            <input type='text' className='form-control' placeholder='Enter your name'
                                value={this.state.username} onChange={(e) => this.handleOnChangeUsername(e)}/>
                        </div>
                        <div className='col-12 form-group login-input'>
                            <label>Password: </label>
                            <div className='form-control custom-pass'>
                                <input type={this.state.isShowPassword ? 'text' : 'password'} 
                                        className='pass-inp' 
                                        placeholder='Enter your password'
                                        value={this.state.password} onChange={(e) => this.handleOnChangePassword(e)} 
                                        onKeyDown={(e) => this.handleKeyDown(e)}
                                />
                                <span onClick={this.handleShowHidePassword}>
                                    { this.state.isShowPassword && <i className="fas fa-eye"></i>
                                     || <i className="fas fa-eye-slash"></i> }
                                </span>
                            </div>
                        </div>
                        <div className='col-12' style={{ color: 'red' }}>
                            { this.state.errMessage }
                        </div>
                        <div className='col-12'>
                            <button className='btn-login' onClick={this.handleLogin}>Login</button>
                        </div>
                        <div className='col-12'>
                            <span className='forgot-password'>Forgot your password?</span>
                        </div>
                        <div className='col-12 text-center'>
                            <span className='text-other-login'>Or login with: </span>
                        </div>
                        <div className='col-12 social-login'>
                            <i className="fab fa-google google"></i>
                            <i className="fab fa-facebook facebook"></i>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        // userLoginFail: () => dispatch(actions.adminLoginFail()),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
