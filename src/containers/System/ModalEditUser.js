import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { emitter } from '../../utils/emitter';
import _ from 'lodash'

class ModalEditUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            address: '',
        }
    }

    componentDidMount() {
        let user = this.props.currentUser;
        if(user && !_.isEmpty(user)) {
            this.setState({
                id: user.id,
                email: user.email,
                password: '',
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address,
            })
        }
    }

    toggle = () => {
        this.props.toggleFromParent();
    }

    handleOnChangeInput = (e, id) => {
        this.setState({
            [id]: e.target.value,
        }, () => {
            console.log(this.state);
        })
        // cách viết khác:
        // let copyState = { ...this.state };
        // copyState[id] = e.target.value;
        // this.setState({
        //     ...copyState,
        // }, () => {
        //     console.log(this.state);
        // })
    }

    checkValidInput = () => {
        let isValid = true;
        let arrInput = ['email', 'password', 'firstName', 'lastName', 'address'];
        for(let i = 0; i < arrInput.length; i++) {
            if(!this.state[arrInput[i]]) {
                isValid = false;
                alert('Missing parameter: ' + arrInput[i]);
                break;
            }
        }
        return isValid;
    }

    handleSaveUser = () => {
        let isValid = this.checkValidInput();
        if(isValid === true) {
            // call api update modal
            this.props.editUser(this.state);
        }
    }

    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={this.toggle}
                size='lg'
                className={'abcClassName'}
            >
                <ModalHeader toggle={this.toggle}>Edit a new user</ModalHeader>
                <ModalBody>
                    <div className='modal-user-body'>
                        <div className='input-container'>
                            <label>Email</label>
                            <input disabled type='text' value={this.state.email} onChange={(e) => this.handleOnChangeInput(e, "email")} />
                        </div>
                        <div className='input-container'>
                            <label>Password</label>
                            <input type='password' value={this.state.password} onChange={(e) => this.handleOnChangeInput(e, "password")} />
                        </div>
                        <div className='input-container'>
                            <label>First Name</label>
                            <input type='text' value={this.state.firstName} onChange={(e) => this.handleOnChangeInput(e, "firstName")} />
                        </div>
                        <div className='input-container'>
                            <label>Last Name</label>
                            <input type='text' value={this.state.lastName} onChange={(e) => this.handleOnChangeInput(e, "lastName")} />
                        </div>
                        <div className='input-container max-width-input'>
                            <label>Address</label>
                            <input type='text' value={this.state.address} onChange={(e) => this.handleOnChangeInput(e, "address")} />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" className='px-3' onClick={this.handleSaveUser}>Save Changes</Button>{' '}
                    <Button color="secondary" className='px-3' onClick={this.toggle}>Close</Button>
                </ModalFooter>
            </Modal>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
