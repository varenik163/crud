import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { renderField } from '../../../helpers/renderField'
import { Form, Input, Button, Col, Row, Typography } from 'antd'
import { reduxForm } from 'redux-form'

class CreateViewForm extends Component {

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
		type: PropTypes.string,
		options: PropTypes.object,
		initialValues: PropTypes.object,
		handleSubmit: PropTypes.func,
	};

	static defaultProps = { renderField };

	handleCancel = () => this.props.onClose();

	handleSubmit = form => this.props.onCreate(form);


	mapFields = (fields) => {
		if (fields.length) {
			return fields.map(elem => (
				<Form key={elem.name}>
					<Form.Item label={elem.placeholder}>
						<Input type="text" disabled value={this.props.initialValues[elem.name]} />
					</Form.Item>
				</Form>))
		}
		return null
	};

	render() {
		const { fields } = this.props;
		const { Title } = Typography;
		return (
			<Row align="middle" justify="space-between">
				<Col span={20}>
					<Title level={2}>Просмотр алерта</Title>
					{this.mapFields(fields)}
				</Col>
				<Col span={20} style={{ textAlign: 'right' }}>
					<Button style={{ marginLeft: 8 }} onClick={this.handleCancel}>Назад</Button>
				</Col>
			</Row>
		)
	}
}

const reduxFormConfig = {
	form: 'createModel',
	validate: (values, props) => {
		let errors = {};

		props.fields.forEach((field) => {
			if (field.validateFunc) errors = field.validateFunc(values, errors)
		});

		return errors;
	}
};

const mapStateToProps = (state, props) => {
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
};

export default connect(mapStateToProps, {})(reduxForm(reduxFormConfig)(CreateViewForm))
