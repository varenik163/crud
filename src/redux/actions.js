const actions = {
	FETCH_CRUD_FILTER_VALUES: 'FETCH_CRUD_FILTER_VALUES',
	FETCH_CRUD_MODELS: 'FETCH_CRUD_MODELS',
	SET_CRUD_ACTIONS_FUNC: 'SET_CRUD_ACTIONS_FUNC',
	SET_CRUD_PARAMS: 'SET_CRUD_PARAMS',

	DELETE_MODEL: 'DELETE_MODEL',
	RESTORE_MODEL: 'RESTORE_MODEL',
	CHANGE_MODEL: 'CHANGE_MODEL',
	CREATE_MODEL: 'CREATE_MODEL',
	TOGGLE_CREATE_MODEL_MODAL: 'TOGGLE_CREATE_MODEL_MODAL',
	SET_MODEL_MODAL_FORM: 'SET_MODEL_MODAL_FORM',
	FETCH_CRUD_CHILDREN: 'FETCH_CRUD_CHILDREN',
	SET_UPLOADER_FILES: 'SET_UPLOADER_FILES',
	SET_UPLOADER_DEFAULT_FILE_LIST: 'SET_UPLOADER_DEFAULT_FILE_LIST',
	FETCH_FILE_CONFIG: 'FETCH_FILE_CONFIG',
	SET_CRUD_COLUMNS: 'SET_CRUD_COLUMNS',
	setCrudColumns: (columns, modelName) => ({ type: actions.SET_CRUD_COLUMNS, payload: { columns, modelName } }),
	fetchFileConfig: (url, modelName) => ({ type: actions.FETCH_FILE_CONFIG, payload: { url, modelName } }),
	setUploaderDefaultFileList: (defaultFileList, modelName) => ({
		type: actions.SET_UPLOADER_DEFAULT_FILE_LIST,
		payload: { defaultFileList, modelName }
	}),
	setUploaderFiles: (files, modelName) => ({ type: actions.SET_UPLOADER_FILES, payload: { files, modelName } }),
	fetchCrudChildren: (id, modelName, url) => ({
		type: actions.FETCH_CRUD_CHILDREN,
		payload: {
			id, params: { modelName }, url
		}
	}),
	toggleCreateModelModal: modelName => ({ type: actions.TOGGLE_CREATE_MODEL_MODAL, payload: { modelName } }),

	deleteModel: (id, action, modelName) => ({
		type: actions.DELETE_MODEL,
		payload: {
			id, action, modelName
		}
	}),
	restoreModel: (id, url, modelName) => ({
		type: actions.RESTORE_MODEL,
		payload: {
			id, url, modelName
		}
	}),
	createModel: (form, url, modelName) => ({
		type: actions.CREATE_MODEL,
		payload: {
			form, url, modelName
		}
	}),

	changeModel: (form, action, modelName) => ({
		type: actions.CHANGE_MODEL,
		payload: {
			form, action, modelName
		}
	}),

	setModelModalForm: (modalType, initialValues, action) => ({
		type: actions.SET_MODEL_MODAL_FORM,
		payload: {
			modalType, initialValues, action
		}
	}),

	setCrudActionsFunc: (func, modelName) => ({ type: actions.SET_CRUD_ACTIONS_FUNC, payload: { func, modelName } }),
	setCrudParams: params => ({ type: actions.SET_CRUD_PARAMS, payload: params }),
	fetchCrudModels: (params, filters) => ({ type: actions.FETCH_CRUD_MODELS, payload: { params, filters } }),
	fetchCrudFilterValues: (modelName, filter, query) => ({
		type: actions.FETCH_CRUD_FILTER_VALUES,
		payload: {
			query, filter, modelName
		}
	}),
};

export default actions;
