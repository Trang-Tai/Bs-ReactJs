import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManager.scss'
import { userService } from '../../services'
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { emitter } from '../../utils/emitter';
class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            userEdit: {},
        }
    }

    getAllUsersFromReact = async () => {
        let data = await userService.getAllUsers('ALL');// data = res.data do middleware axios)
        if (data && data.errCode === 0) {
            this.setState({
                arrUsers: data.users,
            }, () => {
                console.log('check state user: ', this.state.arrUsers); // []
            })
            console.log('check state user: ', this.state.arrUsers); // []
        }
    }

    async componentDidMount() {
        await this.getAllUsersFromReact();
    }

    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true,
        })
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser,
        })
    }

    toggleUserEditModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser,
        })
    }

    createNewUser = async (data) => {
        try {
            let resData = await userService.createNewUser(data);
            if (resData && resData.errCode !== 0) {
                alert(resData.errMessage);
            } else {
                await this.getAllUsersFromReact();
                this.setState({
                    isOpenModalUser: false,
                })
                emitter.emit('EVENT_CLEAR_MODAL_DATA', { 'id': 'your id' })
            }
        } catch (error) {
            console.log(error);
        }
    }

    handleDeleteUser = async (user) => {
        console.log(user)
        try {
            let res = await userService.deleteUser(user.id)
            if (res && res.errCode === 0) {
                await this.getAllUsersFromReact();
            } else {
                alert(res.errMessage);
            }
        } catch (error) {
            console.log(error)
        }
    }

    handleEditUser = async (user) => {
        try {
            const res = await userService.editUser(user);
            if(res && res.errCode === 0) {
                this.setState({
                    isOpenModalEditUser: false,
                })
                await this.getAllUsersFromReact();
            } else {
                alert(res.errCode);
            }
        } catch (error) {
            console.log(error);
        }
    }

    openModalEditUser = (user) => {
        console.log('check edit user: ', user);
        this.setState({
            isOpenModalEditUser: true,
            userEdit: user,
        })
    }

    render() {
        const arrUsers = this.state.arrUsers;
        return (
            <div className="users-container">
                <ModalUser
                    isOpen={this.state.isOpenModalUser}
                    toggleFromParent={this.toggleUserModal}
                    createNewUser={this.createNewUser}
                />
                {this.state.isOpenModalEditUser &&
                    <ModalEditUser
                        isOpen={this.state.isOpenModalEditUser}
                        toggleFromParent={this.toggleUserEditModal}
                        currentUser={this.state.userEdit}
                        editUser={this.handleEditUser}
                    />
                }
                <div className='title text-center'>Manage users with Tao</div>
                <div className='mx-1'>
                    <button className='btn btn-primary px-3' onClick={this.handleAddNewUser}>
                        <i className="fas fa-plus"></i> Add new user
                    </button>
                </div>
                <div className='users-table mt-3 mx-1'>
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th>Email</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                            {arrUsers && arrUsers.map((user, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{user.email}</td>
                                        <td>{user.firstName}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.address}</td>
                                        <td>
                                            <button className='btn-edit' onClick={() => this.openModalEditUser(user)}><i className="fas fa-edit"></i></button>
                                            <button className='btn-delete' onClick={() => this.handleDeleteUser(user)}><i className="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
