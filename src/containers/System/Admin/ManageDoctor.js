import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageUser.scss';
import * as actions from '../../../store/actions';
import './ManageDoctor.scss';
import { CRUD_ACTIONS, LANGUAGES } from '../../../utils';
import { userService } from '../../../services';

import Select from 'react-select';

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Select React document
/*const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];*/

class ManageDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // Save to markdowns table
            contentMarkdown: '',
            contentHTML: '',
            selectedDoctor: '',
            description: '',
            listDoctors: '',
            hasOldData: false,

            // Save to doctor_infor table
            listPrice: [],
            listPayment: [],
            listProvince: [],
            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            nameClinic: '',
            addressClinic: '',
            note: '',
        }
    }

    componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.getAllRequiredDoctorInfo();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'DOCTOR');
            this.setState({
                listDoctors: dataSelect,
            })
        }
        if(prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'DOCTOR');
            let { resPayment, resPrice, resProvince } = this.props.allRequiredDoctorInfor;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            this.setState({
                listDoctors: dataSelect,
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listPrice: dataSelectPrice,
            })
        }
        if(prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor) {
            let { resPayment, resPrice, resProvince } = this.props.allRequiredDoctorInfor;
            let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
            let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
            let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
            this.setState({
                listPayment: dataSelectPayment,
                listProvince: dataSelectProvince,
                listPrice: dataSelectPrice,
            })
        }
    }

    // Finish!
    handleEditorChange({ html, text }) {
        this.setState({
            contentHTML: html,
            contentMarkdown: text,
        })
    }

    buildDataInputSelect = (inputData, type = '') => {
        let result = [];
        let {language} = this.props;
        if(inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let obj = {};
                if(type === 'DOCTOR') {
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    obj.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    obj.value = item.id;
                }
                if(type === 'PAYMENT' || type === 'PROVINCE') {
                    let labelEn = item.valueEn;
                    let labelVi = item.valueVi;
                    obj.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    obj.value = item.keyMap;
                }
                if(type === 'PRICE') {
                    let labelEn = `${item.valueEn} USD`;
                    let labelVi = `${item.valueVi} VND`;
                    obj.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    obj.value = item.keyMap;
                }
                result.push(obj);
            })
        }
        return result;
    }

    handleChangeSelect = async (selectedDoctor) => {
        this.setState({ selectedDoctor: selectedDoctor }, () =>
            console.log(`Option selected:`, this.state.selectedDoctor)
        );
        let res = await userService.getDetailInfoDoctor(selectedDoctor.value);
        if(res?.errCode === 0 && res?.data?.Markdown) {
            let markdown = res.data.Markdown;
            if(!res.data?.Doctor_Infor) res.data.Doctor_Infor = {}
            let { addressClinic = '', nameClinic = '', note = '',
                paymentId = '', priceId = '', provinceId = '',
                paymentTypeData = '', priceTypeData = '', provinceTypeData = ''} = res.data.Doctor_Infor;
            this.setState({
                contentHTML: markdown.contentHTML,
                contentMarkdown: markdown.contentMarkdown,
                description: markdown.description,
                hasOldData: true,
                addressClinic: addressClinic,
                nameClinic: nameClinic,
                note: note,
                selectedPayment: paymentId && { label: this.props.language === LANGUAGES.VI ? paymentTypeData.valueVi : paymentTypeData.valueEn, value: paymentId },
                selectedPrice: priceId && { label: this.props.language === LANGUAGES.VI ? `${priceTypeData.valueVi} VND` : `${priceTypeData.valueEn} USD`, value: priceId },
                selectedProvince: provinceId && { label: this.props.language === LANGUAGES.VI ? provinceTypeData.valueVi : provinceTypeData.valueEn, value: provinceId },
            })
        } else {
            this.setState({
                contentHTML: '',
                contentMarkdown: '',
                description: '',
                hasOldData: false,
                addressClinic: '',
                nameClinic: '',
                note: '',
                selectedPayment: '',
                selectedPrice: '',
                selectedProvince: '',
            })
        }
    };

    handleChangeSelectDoctorInfor = async (selectedOption, name) => {
        console.log(selectedOption, name);
        const stateName = name.name;
        this.setState({
            [stateName]: selectedOption,
        })
    }

    handleOnChangeText = (e, type) => {
        this.setState({
            [type]: e.target.value,
        })
    }

    handleSaveContentMarkdown = () => {
        this.props.saveDetailDoctor({
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            doctorId: this.state.selectedDoctor.value,
            action: this.state.hasOldData ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,

            priceId: this.state.selectedPrice.value,
            paymentId: this.state.selectedPayment.value,
            provinceId: this.state.selectedProvince.value,
            nameClinic: this.state.nameClinic,
            addressClinic: this.state.addressClinic,
            note: this.state.note,
        })
        console.log(this.state)
    }

    render() {
        const { hasOldData } = this.state;
        console.log(this.state);
        return (
            <div className='manage-doctor-container'>
                <div className='manage-doctor-title'>
                    <FormattedMessage id={'admin.manage-doctor.title'} />
                </div>
                <div className='more-info'>
                    <div className='content-left form-group'>
                        <label><FormattedMessage id={'admin.manage-doctor.select-doctor'} /></label>
                        <Select
                            value={this.state.selectedDoctor}
                            onChange={(e) => this.handleChangeSelect(e)}
                            options={this.state.listDoctors}
                            placeholder={'Chọn bác sĩ'}
                        />
                    </div>
                    <div className='content-right'>
                        <label><FormattedMessage id={'admin.manage-doctor.intro'} /></label>
                        <textarea className='form-control'
                            rows={4}
                            onChange={(e) => this.handleOnChangeText(e, 'description')}
                            value={this.state.description}
                        />
                    </div>
                </div>
                <div className='more-info-extra row'>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id={'admin.manage-doctor.price'} /></label>
                        <Select
                            value={this.state.selectedPrice}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listPrice}
                            placeholder={'Chọn Giá'}
                            name={'selectedPrice'}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id={'admin.manage-doctor.payment'} /></label>
                        <Select
                            value={this.state.selectedPayment}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listPayment}
                            placeholder={'Chọn Phương thức thanh toán'}
                            name={'selectedPayment'}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id={'admin.manage-doctor.province'} /></label>
                        <Select
                            value={this.state.selectedProvince}
                            onChange={this.handleChangeSelectDoctorInfor}
                            options={this.state.listProvince}
                            placeholder={'Chọn tỉnh thành'}
                            name={'selectedProvince'}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id={'admin.manage-doctor.nameClinic'} /></label>
                        <input className='form-control'
                            onChange={(e) => this.handleOnChangeText(e, 'nameClinic')}
                            value={this.state.nameClinic}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id={'admin.manage-doctor.addressClinic'} /></label>
                        <input className='form-control'
                            onChange={(e) => this.handleOnChangeText(e, 'addressClinic')}
                            value={this.state.addressClinic}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label><FormattedMessage id={'admin.manage-doctor.note'} /></label>
                        <input className='form-control' 
                            onChange={(e) => this.handleOnChangeText(e, 'note')}
                            value={this.state.note}
                        />
                    </div>
                </div>
                <div className='manage-doctor-editor'>
                    <MdEditor style={{ height: '500px' }}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange.bind(this)}
                        value={this.state.contentMarkdown}
                    />
                </div>
                <button className={hasOldData ? 'save-content-doctor': 'create-content-doctor'}
                    onClick={this.handleSaveContentMarkdown}>
                    {hasOldData ? 
                        <span><FormattedMessage id={'admin.manage-doctor.save'} /></span> :
                        <span><FormattedMessage id={'admin.manage-doctor.add'} /></span>
                    }
                </button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        allDoctors: state.admin.allDoctors,
        language: state.app.language,
        allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
        getAllRequiredDoctorInfo: () => dispatch(actions.getRequiredDoctorInfor()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
