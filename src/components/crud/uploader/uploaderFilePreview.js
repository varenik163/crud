import React from 'react'
import { Icon } from 'antd'

const layoutStyle = {
	position: 'fixed',
	top: 0, left: 0,
	width: '100%',
	height: '100%',
	background: '#000',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	zIndex: 999
};

const imgStyle = {
	maxWidth: '100%',
	maxHeight: '100%'
};

const closeIconStyle = {
	position: 'fixed',
	top: '10px',
	right: '25px',
	fontSize: '25px'
};

function UploaderFilePreview(props) {
	const { preview, setPreview, files } = props;

	if (!preview) return null;
	console.log(files, preview)
	const file = files.find(e => e.uid === preview);
	const url = file.url || window.URL.createObjectURL(file);

	return (
		<div style={layoutStyle} onClick={() => setPreview(null)}>
			<a style={closeIconStyle}><Icon type={'close'} /></a>
			<img src={url} style={imgStyle} />
		</div>
	);
}

export default UploaderFilePreview
