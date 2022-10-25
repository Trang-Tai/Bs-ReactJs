import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { userService } from '../../../services';
import { LANGUAGES, CRUD_ACTIONS } from '../../../utils/constant';
import { CommonUtils } from '../../../utils'
import * as actions from '../../../store/actions';
import './UserRedux.scss';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import TableManageUser from './TableManageUser';

class UserRedux extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImageURL: {},
            isOpen: false,

            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avatar: '',

            action: '',
            userEditId: '',
        }
    }

    componentDidMount() {
        this.props.getGenderStart();
        this.props.getPositionStart();
        this.props.getRoleStart();
        // try {
        //     const res = await userService.getAllCode('GENDER');
        //     if(res && res.errCode === 0) {
        //         this.setState({
        //             genderArr: res.data,
        //         })
        //     }
        // } catch (error) {
        //     console.log(error)
        // }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: this.props.genderRedux, // loading array genders list when run page on the first time
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '', // set default gender value when user do not choose
            })
        }
        if (prevProps.positionRedux !== this.props.positionRedux) {
            let arrPositions = this.props.positionRedux;
            this.setState({
                positionArr: this.props.positionRedux,
                position: arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : '',
            })
        }
        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux;
            this.setState({
                roleArr: this.props.roleRedux,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : '',
            })
        }
        if (prevProps.listUsers !== this.props.listUsers) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                address: '',
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : '',
                position: '',
                role: '',
                avatar: '',
                action: CRUD_ACTIONS.CREATE,
                previewImageURL: '',
            })
        }
    }

    componentWillUnmount() {
        if (Object.keys(this.state.previewImageURL).length !== 0) { // previewImageURL is not empty obj
            URL.revokeObjectURL(this.state.previewImageURL);
        }
    }

    handleOnChangeImg = async (e) => {
        if (Object.keys(this.state.previewImageURL).length !== 0) { // previewImageURL is not empty obj
            URL.revokeObjectURL(this.state.previewImageURL);
        }
        const data = e.target.files;
        const file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            console.log(base64);
            let objectURL = URL.createObjectURL(file);
            this.setState({
                previewImageURL: objectURL,
                avatar: base64,
            })
        }
    }

    openPreviewImg = () => {
        if (Object.keys(this.state.previewImageURL).length === 0) return; // previewImageURL is a empty obj
        this.setState({
            isOpen: true,
        })
    }

    onChangeInput = (e, type) => {
        this.setState({
            [type]: e.target.value,
        })
    }

    // checkValidateInput = () => {
    //     let isValid = true;
    //     let arrCheck = ['address', 'email', 'firstName', 'lastName', 'password', 'phoneNumber'];
    //     for(let i = 0; i <= arrCheck.length; i++) {
    //         if(!this.state[arrCheck[i]]) {
    //             isValid = false;
    //             alert('This input is required: ' + arrCheck[i]);
    //             break;
    //         }
    //     }
    //     return isValid;
    // }

    checkValidateInput = () => {
        let isValid = true;
        let arrCheck = ['address', 'email', 'firstName', 'lastName', 'password', 'phoneNumber'];
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert('This input is required: ' + arrCheck[i]);
                break;
            }
        }
        return isValid;
    }

    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if (!isValid) return;

        if(this.state.action ===  CRUD_ACTIONS.CREATE) {
            // fire redux create user action
            this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                phoneNumber: this.state.phoneNumber,
                address: this.state.address,
                gender: this.state.gender,
                position: this.state.position,
                role: this.state.role,
                avatar: this.state.avatar,
            })
        }
        if(this.state.action === CRUD_ACTIONS.EDIT) {
            // fire redux edit user action
            this.props.editUser({
                id: this.state.userEditId,
                email: this.state.email,
                password: this.state.password,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                phoneNumber: this.state.phoneNumber,
                address: this.state.address,
                gender: this.state.gender,
                position: this.state.position,
                role: this.state.role,
                avatar: this.state.avatar,
            })
        }
    }

    handleEditUserFromParent = (user) => {
        // console.log(user);
        let imageBase64 = '';
        if(user?.image) {
            imageBase64 = Buffer.from(user.image, 'base64').toString('binary');
        }
        this.setState({
            email: user.email,
            password: '000',
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            address: user.address,
            gender: user.gender,
            position: user.positionId,
            role: user.roleId,
            avatar: '',
            userEditId: user.id,
            previewImageURL: imageBase64,

            action: CRUD_ACTIONS.EDIT,
        })
    }

    render() {
        const genders = this.state.genderArr;
        const language = this.props.language;
        const isLoadingGender = this.props.isLoadingGender;
        const positions = this.state.positionArr;
        const roles = this.state.roleArr;
        const { address, avatar, email, firstName, gender,
            lastName, password, phoneNumber, position, role } = this.state;

        return (
            <div className='user-redux-container'>
                <div className='title'>
                    User Redux
                </div>
                <div className="user-redux-body" >
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 my-3'><FormattedMessage id="manage-user.add" /></div>
                            {isLoadingGender && <div className='col-12 my-3'>Loading Gender</div>}
                            <div className='col-6'>
                                <label><FormattedMessage id="manage-user.email" /></label>
                                <input className='form-control' type='email'
                                    value={email}
                                    onChange={(e) => this.onChangeInput(e, 'email')}
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT} />
                            </div>
                            <div className='col-6'>
                                <label><FormattedMessage id="manage-user.password" /></label>
                                <input className='form-control' type='password'
                                    value={password}
                                    onChange={(e) => this.onChangeInput(e, 'password')}
                                    disabled={this.state.action === CRUD_ACTIONS.EDIT} />
                            </div>
                            <div className='col-6'>
                                <label><FormattedMessage id="manage-user.first-name" /></label>
                                <input className='form-control' type='text'
                                    value={firstName}
                                    onChange={(e) => this.onChangeInput(e, 'firstName')} />
                            </div>
                            <div className='col-6'>
                                <label><FormattedMessage id="manage-user.last-name" /></label>
                                <input className='form-control' type='text'
                                    value={lastName}
                                    onChange={(e) => this.onChangeInput(e, 'lastName')} />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.phone-number" /></label>
                                <input className='form-control' type='text'
                                    value={phoneNumber}
                                    onChange={(e) => this.onChangeInput(e, 'phoneNumber')} />
                            </div>
                            <div className='col-9'>
                                <label><FormattedMessage id="manage-user.address" /></label>
                                <input className='form-control' type='text'
                                    value={address}
                                    onChange={(e) => this.onChangeInput(e, 'address')} />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.gender" /></label>
                                <select className="form-control" value={this.state.gender} onChange={(e) => this.onChangeInput(e, 'gender')}>
                                    {genders && genders.length > 0 &&
                                        genders.map((gender, index) => {
                                            return (<option key={index} value={gender.keyMap} >
                                                {(language === LANGUAGES.VI) && gender.valueVi || gender.valueEn}
                                            </option>)
                                        })
                                    }
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.position" /></label>
                                <select className="form-control" value={this.state.position} onChange={(e) => this.onChangeInput(e, 'position')}>
                                    {positions && positions.length > 0 &&
                                        positions.map((position, index) => {
                                            return <option key={index} value={position.keyMap}>
                                                {(language === LANGUAGES.VI) && position.valueVi || position.valueEn}
                                            </option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.role" /></label>
                                <select className="form-control" value={this.state.role} onChange={(e) => this.onChangeInput(e, 'role')}>
                                    {roles && roles.length > 0 &&
                                        roles.map((role, index) => {
                                            return <option key={index} value={role.keyMap}>
                                                {(language === LANGUAGES.VI) && role.valueVi || role.valueEn}
                                            </option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id="manage-user.image" /></label>
                                <div className='preview-img-container'>
                                    <input id='previewImg' type='file' onChange={(e) => this.handleOnChangeImg(e)} hidden />
                                    <label className='label-upload' htmlFor='previewImg'>Tải ảnh <i className='fas fa-upload'></i></label>
                                    {/* ở đây ta sử dụng label để khi click vào label thì tự động nó sẽ click vào input */}
                                    {/* htmlFor phải trùng với id của input thì mới tự động click dc */}
                                    <div className='preview-image'
                                        style={{ backgroundImage: `url(${this.state.previewImageURL})` }}
                                        onClick={() => this.openPreviewImg()} >
                                    </div>
                                </div>
                            </div>
                            <div className='col-12 my-3'>
                                <button className={this.state.action === CRUD_ACTIONS.EDIT?'btn btn-warning':'btn btn-primary'} 
                                        onClick={this.handleSaveUser}>
                                    {this.state.action === CRUD_ACTIONS.EDIT && 
                                        <FormattedMessage id="manage-user.edit" /> ||
                                        <FormattedMessage id="manage-user.save" />
                                    }
                                </button>
                            </div>
                            <div className='col-12 mb-5'>
                                <TableManageUser 
                                    handleEditUserFromParentByKey={this.handleEditUserFromParent}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {this.state.isOpen &&
                    <Lightbox
                        mainSrc={this.state.previewImageURL}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                }
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        positionRedux: state.admin.positions,
        roleRedux: state.admin.roles,
        isLoadingGender: state.admin.isLoadingGender,
        listUsers: state.admin.users,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        editUser: (user) => dispatch(actions.editUserStart(user)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
