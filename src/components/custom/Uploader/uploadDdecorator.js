import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { message } from 'antd'
import { connect } from 'react-redux'
import { compose } from 'redux'
import actions from '../../../redux/actions'
import UploaderFilePreview from '../../crud/uploader/uploaderFilePreview';

const { setUploaderDefaultFileList } = actions;

const UploadDecorator = UploaderComponent => class Uploader extends Component {

	constructor(props) {
		super(props);

		this.state = { preview: null };
	}

	setPreview = (id) => {
		this.setState({ preview: id })
	};

	handleFileRemove = (file) => {
		const newFileList = this.props.fileListStored.filter(f => f.uid !== file.uid);
		this.props.onChange(newFileList);
	};

	render() {
		const { config } = this.props;
		const listType = this.props.listType || 'text';
		const multiple = this.props.multiple || false;
		const buttonText = this.props.buttonText || undefined;
		const { preview } = this.state;
		const { fileListStored } = this.props;

		const uploaderProps = {
			onRemove: this.handleFileRemove,
			accept: config.mimeTypes,
			beforeUpload: (file) => {
				const isMax = fileListStored.length === (config.maxFiles || 100);
				if (file.size > (config.maxSize || 10000000)) {
					message.error('Ошибка загрузки, файл превышает допустимый размер');
					return false;
				}

				if (multiple && isMax) {
					message.error('Ошибка загрузки, превышено допустимое количество загружаемых файлов');
					return false
				}

				const newFileList = !multiple
					? [file]
					: isMax
						? fileListStored
						: [...fileListStored, file];

				this.props.onChange(newFileList);

				return false
			},
			// disabled: fileListStored.length === (config.maxFiles || 100),
			onPreview: file => this.setPreview(file.uid),
			fileList: fileListStored.map(f => ({
				old: !!f.old,
				url: f.old ? f.url : window.URL.createObjectURL(f),
				name: f.name,
				uid: f.uid,
				lastModified: f.lastModified,
				lastModifiedDate: f.lastModifiedDate,
				size: f.size,
				type: f.type,
				webkitRelativePath: f.webkitRelativePath
			})),
			listType,
			buttonText
		};

		return (
			<div>
				<UploaderComponent {...uploaderProps} />
				<UploaderFilePreview
					setPreview={this.setPreview}
					preview={preview}
					files={fileListStored}
				/>
			</div>
		);
	}
};

UploadDecorator.propTypes = {
	onChange: PropTypes.func.isRequired,
	setUploaderDefaultFileList: PropTypes.func.isRequired,
	modelName: PropTypes.string.isRequired,
	listType: PropTypes.string,
	multiple: PropTypes.bool,
	defaultFileList: PropTypes.array,
	fileListStored: PropTypes.array.isRequired,
};

const mapStateToProps = (state, props) => {
	const { uploaderFiles } = state;
	const { modelName } = props;
	const uploaderModelFiles = uploaderFiles && uploaderFiles[modelName]
		? uploaderFiles[modelName] : {};

	return {
		defaultFileListStored: uploaderModelFiles.defaultFileList || [],
		fileListStored: uploaderModelFiles.fileList || [],
	}
};

export default compose(
	connect(mapStateToProps, { setUploaderDefaultFileList }),
	UploadDecorator
)
