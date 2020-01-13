import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Uploader from '../../custom/Uploader';
import { connect } from 'react-redux'
import actions from '../../../redux/actions'

const { setUploaderFiles, setUploaderDefaultFileList, fetchFileConfig } = actions;

function CrudUploader(props) {
	useEffect(() => {
		props.setUploaderFiles(props.defaultFileList, props.modelName);
		props.fetchFileConfig(props.crudParams[props.modelName].crudCreate + '/config', props.modelName);

		return () => props.setUploaderFiles([], props.modelName)
	}, []);
	console.log(props.config[props.modelName])
	return (
		<Uploader
			{...props}
			config={
				props.config[props.modelName] &&  props.config[props.modelName].data
					? props.config[props.modelName].data.files.config
					: {}
			}
			onChange={files => props.setUploaderFiles(files, props.modelName)}
		/>
	);
}

CrudUploader.propTypes = {
	setUploaderFiles: PropTypes.func.isRequired,
	modelName: PropTypes.string.isRequired,
	setUploaderDefaultFileList: PropTypes.func.isRequired,
	crudParams: PropTypes.object.isRequired,
	fetchFileConfig: PropTypes.func.isRequired,
	defaultFileList: PropTypes.array
};

export default connect(
	(state, props) => ({
		modelName: state.isOpenModelModal || props.modelName,
		crudParams: state.crudParams,
		config: state.fileConfig
	}),
	{
		setUploaderFiles,
		setUploaderDefaultFileList,
		fetchFileConfig
	}
)(CrudUploader)
