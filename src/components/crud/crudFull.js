/* eslint-disable indent */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import actions from '../../redux/actions';
import CrudView from './view/crudView'
import CreateModel from './create/createModelPopup'
import CreateModelView from './create/createModelPage'
import ShowModelView from './view/modelView'
import { Button } from 'antd';
import '../../style.css'

const {
	toggleCreateModelModal,
	deleteModel,
	restoreModel,
	createModel,
	changeModel,
	setModelModalForm,
	setCrudActionsFunc,
	setCrudParams
} = actions;

export class CrudFull extends Component {

	componentDidMount() {
		this.props.setCrudActionsFunc(this.actionsFunc, this.props.modelName);
		this.props.setCrudParams({
			crudRead: this.props.crudRead,
			crudCreate: this.props.crudCreate,
			modelName: this.props.modelName,
			submitShape: this.props.submitShape,
			initialValues: this.props.initialValues,
			iconsProvider: this.props.iconsProvider,
			uploadFilesSettings: this.props.uploadFilesSettings
		})
	}

	actionsFunc = (action, elem) => {
		const { customActionsFunc } = this.props;

		switch (action.id) {
			case 'update':
				this.openUpdateFrom(action, elem);
				break;
			case 'view':
				this.openViewFrom(action, elem);
				break;
			case 'delete':
				this.handleDelete(action, elem);
				break;
			case 'restore':
				this.handleRestore(action, elem);
				break;
			default:
				return customActionsFunc ? customActionsFunc(action, elem) : null;
		}
	};


	openUpdateFrom = (action, elem) => {
		this.props.setModelModalForm('edit', elem, action);
		this.toggleModal(this.props.modelName);
	};

	openViewFrom = (action, elem) => {
		this.props.setModelModalForm('view', elem, action);
		this.toggleModal(this.props.modelName);
	};

	toggleModal = (modelName) => {
		this.props.toggleCreateModelModal(modelName);
	};

	handleClose = () => {
		this.toggleModal();
		this.props.setModelModalForm(null, null);
	};

	handleUpdate = (form) => {
		this.props.changeModel(form, this.props.objectModal.action, this.props.modelName)
	};

	handleCreate = (form) => {
		this.props.createModel(form, this.props.crudCreate, this.props.modelName)
	};

	handleDelete = (action, elem) => {
		const conf = window.confirm(this.props.onDeleteConfirmMessageFunc(elem));

		if (conf) this.props.deleteModel(elem.id, action, this.props.modelName)
	};

	handleRestore = (action, elem) => {
		const conf = window.confirm(`Хотите восстановить "${elem.name}" (ID: ${elem.id})?`);

		if (conf) this.props.restoreModel(elem.id, action.url, this.props.modelName)
	};

	render() {
		const {
			objectModal,
			isModalOpen,
			modelName,
			crudRead,
			createButtonTitle,
			createFormOptions,
			createDisabled,
			btnStyle,
			tableStyle,
			tableWrapper,
			fixActionColumn,
			updateShape,
			iconTheme,
			getChildrenUrl,
			ButtonComponent,
			size,
			tdClass,
			initialModal,
			scrollX,
			isView,
			renderField,
			CustomButtons,
			rowSelection,
			bordered,
			tableProps
		} = this.props;

		const { title, titleEdit, fields } = createFormOptions || {};
		const Btn = ButtonComponent || Button;

		// viewMode
		if (isView && isModalOpen === modelName && objectModal.modalType === 'view')
			return (
				<ShowModelView
					title={title || 'Создать'}
					titleEdit={titleEdit || 'Редактировать'}
					type={objectModal.modalType}
					onClose={this.handleClose}
					fields={fields}
					initialValues={objectModal.initialValues
						? updateShape(objectModal.initialValues)
						: initialModal || {}
					}
					renderField={renderField}
				/>);


		if (isView && isModalOpen === modelName && !createDisabled)
			return (
				<CreateModelView
					title={title || 'Создать'}
					titleEdit={titleEdit || 'Редактировать'}
					type={objectModal.modalType}
					onClose={this.handleClose}
					onCreate={objectModal.modalType === 'edit' ? this.handleUpdate : this.handleCreate}
					fields={fields}
					initialValues={objectModal.initialValues
						? updateShape(objectModal.initialValues)
						: initialModal || {}
					}
					renderField={renderField}
				/>);


		return (
			<div>
				{!createDisabled ?
					(
						<Btn
							type="primary"
							name="createButton"
							onClick={() => this.toggleModal(modelName)}
							style={{
								...btnStyle,
								marginBottom: '20px'
							}}
						>
							{createButtonTitle}
						</Btn>)
					: null}
				<CustomButtons />
				<CrudView
					modelName={modelName}
					url={crudRead}
					tableStyle={tableStyle}
					TableWrapper={tableWrapper}
					fixActionColumn={fixActionColumn}
					iconTheme={iconTheme}
					getChildrenUrl={getChildrenUrl}
					size={size}
					tdClass={tdClass}
					scrollX={scrollX}
					rowSelection={rowSelection}
					bordered={bordered}
					tableProps={tableProps}
				/>
				{isModalOpen === modelName && !createDisabled
					? (
						<CreateModel
							title={title || 'Создать'}
							titleEdit={titleEdit || 'Редактировать'}
							modalType={objectModal.modalType}
							onClose={this.handleClose}
							onCreate={objectModal.modalType === 'edit'
								? this.handleUpdate
								: this.handleCreate}
							fields={fields}
							initialValues={objectModal.initialValues
								? updateShape(objectModal.initialValues)
								: initialModal || {}}
							renderField={renderField}
						/>
					) : ''
				}
			</div>)
	}
}

CrudFull.propTypes = {
	crudCreate: PropTypes.string,
	crudRead: PropTypes.string.isRequired,
	modelName: PropTypes.string.isRequired,
	customActionsFunc: PropTypes.func,
	createButtonTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.node]),
	createFormOptions: PropTypes.shape({ fields: PropTypes.array.isRequired }),
	submitShape: PropTypes.func,
	updateShape: PropTypes.func,
	getChildrenUrl: PropTypes.func,
	createDisabled: PropTypes.bool,
	isView: PropTypes.bool,
	btnStyle: PropTypes.object,
	ButtonComponent: PropTypes.object,
	tableStyle: PropTypes.object,
	tableWrapper: PropTypes.oneOfType([PropTypes.object, PropTypes.node]),
	fixActionColumn: PropTypes.bool,
	iconTheme: PropTypes.string,
	size: PropTypes.string,
	tdClass: PropTypes.string,
	initialModal: PropTypes.object,
	iconsProvider: PropTypes.func,
	scrollX: PropTypes.number,
	onDeleteConfirmMessageFunc: PropTypes.func,
	renderField: PropTypes.func,
	setCrudActionsFunc: PropTypes.func,
	rowSelection: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object
	]),
	CustomButtons: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.object
	]),
	uploadFilesSettings: PropTypes.string,
	bordered: PropTypes.bool,
	tableProps: PropTypes.object
};

CrudFull.defaultProps = {
	createButtonTitle: 'Добавить',
	submitShape: form => form,
	updateShape: elem => elem,
	createDisabled: true,
	btnStyle: {},
	tableStyle: {},
	tableWrapper: null,
	iconTheme: 'outline',
	size: 'default',
	iconsProvider: () => '',
	CustomButtons: () => null,
	rowSelection: null,
	onDeleteConfirmMessageFunc: elem => `Хотите удалить "${elem.name}" (ID: ${elem.id})?`,
	uploadFilesSettings: null,
	tableProps: {}
};

export default connect((state, props) => ({
	objectModal: state.modelModalForm,
	isModalOpen: state.isOpenModelModal
}), {
	toggleCreateModelModal,
	deleteModel,
	restoreModel,
	createModel,
	changeModel,
	setModelModalForm,
	setCrudActionsFunc,
	setCrudParams
})(CrudFull)
