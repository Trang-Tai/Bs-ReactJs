import React, { Component } from 'react';
import { connect } from "react-redux";
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import './ManageSpecialty.scss';
import { CommonUtils } from '../../../utils';
import { userService } from '../../../services';
import { toast } from 'react-toastify';
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageSpecialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
        }
    }

    async componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {

        }
    }

    handleOnChangeInput = (e, type) => {
        this.setState({
            [type]: e.target.value,
        })
    }

    handleEditorChange({ html, text }) {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
        })
    }

    handleOnChangeImg = async (e) => {
        const data = e.target.files;
        const file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64,
            })
        }
    }

    handleSaveNewSpecialty = async () => {
        let res = await userService.createNewSpecialty(this.state);
        if (res && res.errCode === 0) {
            toast.success('Add new specialty succeed')
        } else {
            toast.error('Something wrongs...')
        }
        console.log(this.state, res)
    }

    render() {
        return (
            <div className='manage-specialty-container'>
                <div className='ms-title'>Quản lý chuyên khoa</div>
                <div className='add-new-specialty row'>
                    <div className='col-6 form-group'>
                        <label>Tên chuyên khoa</label>
                        <input className='form-control' type='text' 
                            value={this.state.name}
                            onChange={(e) => this.handleOnChangeInput(e, 'name')}
                        />
                    </div>
                    <div className='col-6 form-group'>
                        <label>Ảnh chuyên khoa</label>
                        <input className='form-control-file' type='file' 
                            onChange={(e) => this.handleOnChangeImg(e)}
                        />
                    </div>
                    <div className='col-12'>
                        <MdEditor style={{ height: '250px' }}
                            renderHTML={text => mdParser.render(text)}
                            onChange={this.handleEditorChange.bind(this)}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    <div className='col-12'>
                        <button className='btn-save-specialty'
                            onClick={() => this.handleSaveNewSpecialty()}
                        >
                            Save
                        </button>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
