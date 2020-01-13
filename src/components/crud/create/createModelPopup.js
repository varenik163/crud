import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal } from 'antd';
import { reduxForm, Field } from 'redux-form'
import { renderField } from '../../../helpers/renderField'

class CreateModalForm extends Component {

	static propTypes = {
		modalType: PropTypes.string,
		onClose: PropTypes.func.isRequired,
		onCreate: PropTypes.func.isRequired,
		title: PropTypes.string,
		titleEdit: PropTypes.string,
		fields: PropTypes.array.isRequired,
		renderField: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.object
		]),
		handleSubmit: PropTypes.func.isRequired,
		uploadFileUrl: PropTypes.string
	};

	static defaultProps = { renderField };

	componentDidMount() {

	}

	handleCancel = () => {
		this.props.onClose();
	};

	handleSubmit = (form) => {
		this.props.onCreate(form)
	};

	handleAdd = () => {

	};

	mapFields = fields => fields.map(props => (props.fields ? (
		<div key={props.name}>
			{this.mapFields(props.fields)}
		</div>
	) : <Field
		{...props}
		component={props.component || this.props.renderField}
		key={props.name}
		options={this.props.options[props.optionsKey] || props.options || []}
	/>));

	render() {
		const {
			modalType, title, titleEdit, fields, crudCreateModalLoading
		} = this.props;

		return (
			<Modal
				title={modalType === 'edit' ? titleEdit : title}
				visible
				onCancel={this.handleCancel}
				cancelText="Отмена"
				confirmLoading={crudCreateModalLoading}
				onOk={this.props.handleSubmit(this.handleSubmit)}
				okText={modalType === 'edit' ? 'Сохранить' : 'Создать'}
			>
				<form onSubmit={this.props.handleSubmit(this.handleSubmit)}>
					{this.mapFields(fields)}
				</form>
			</Modal>
		)
	}
}

CreateModalForm = reduxForm({
	form: 'createModel',
	validate: (values, props) => {
		let errors = {};
		// if(!values.name) errors.name = 'Введите название';
		props.fields.forEach((field) => {
			if (field.validateFunc) errors = field.validateFunc(values, errors)
		});

		return errors;
	},
	// initialValues comes from outside
})(CreateModalForm);

CreateModalForm = connect((state, props) => {
	const options = props.fields.reduce((acc, field) => {
		if (state[field.optionsKey]) {
			acc[field.optionsKey] = state[field.optionsKey].data
		}

		return acc;
	}, {});

	return {
		crudCreateModalLoading: state.crudCreateModalLoading,
		options
	}
}, {})(CreateModalForm);

export default CreateModalForm
