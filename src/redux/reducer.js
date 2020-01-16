import actions from './actions'
import { ERROR, SUCCESS, START } from '../constants';

export const crudModelsReducer = (state = {}, action) => {
	const { type, response, error, payload } = action;

	switch (type) {
	case actions.FETCH_CRUD_MODELS + SUCCESS:
		return { ...state, [payload.params.modelName]: response };
	case actions.FETCH_CRUD_MODELS + ERROR:
		return {
			...state,
			[payload.params.modelName]: {
				...state[payload.params.modelName],
				loading: false,
				error
			}
		};
	case actions.FETCH_CRUD_MODELS + START:
		return {
			...state,
			[payload.params.modelName]: {
				...state[payload.params.modelName],
				loading: true
			}
		};
	case actions.FETCH_CRUD_CHILDREN + SUCCESS:
		const model = state[payload.params.modelName];
		return {
			...state,
			[payload.params.modelName]: {
				...model,
				data: {
					...model.data,
					items: model.data.items.map(elem => (elem.id === payload.id ? {
						...elem,
						children: response.data.items
					} : elem))
				}
			}
		};
	default:
		return state;
	}
};

export const childrenReducer = (state = {}, action) => {
	const { type, response, payload } = action;

	if (type === actions.FETCH_CRUD_CHILDREN + SUCCESS) {
		return {
			...state,
			[payload.id]: response.data.items
		}
	}
	return state;
};

export const crudColumnsReducer = (state = {}, action) => {
	const { type, response, payload } = action;

	switch (type) {
	case actions.FETCH_CRUD_MODELS + SUCCESS:
		return { ...state, [payload.params.modelName]: response.data.columns };
	case actions.SET_CRUD_COLUMNS:
		return { ...state, [payload.modelName]: payload.columns };
	default:
		return state;
	}
};

export const crudFilterValuesReducer = (state = {}, action) => {
	const { type, response, error, payload } = action;

	switch (type) {
	case actions.FETCH_CRUD_FILTER_VALUES + SUCCESS:
		return {
			...state,
			loading: false,
			[payload.modelName]: {
				...state[payload.modelName],
				[payload.filter]: response.data,
			}
		};
	case actions.FETCH_CRUD_FILTER_VALUES + ERROR:
		return {
			...state, loading: false, error
		};
	case actions.FETCH_CRUD_FILTER_VALUES + START:
		return { ...state, loading: true };
	default:
		return state;
	}
};

export const crudActionsFuncReducer = (state = null, action) => {
	const { type, payload } = action;

	switch (type) {
	case actions.SET_CRUD_ACTIONS_FUNC:
		return {
			...state,
			[payload.modelName]: payload.func
		};
	default:
		return state;
	}
};


export const isOpenModelModalReducer = (state = false, action) => {
	const { type, payload } = action;

	switch (type) {
	case actions.TOGGLE_CREATE_MODEL_MODAL:
		return state ? null : payload.modelName;
	default:
		return state;
	}
};

export const modelModalFormReducer = (state = {}, action) => {
	const { type, payload } = action;

	switch (type) {
	case actions.SET_MODEL_MODAL_FORM:
		return payload;
	default:
		return state;
	}
};

export const crudParamsReducer = (state = {}, action) => {
	const { type, response, error, payload } = action;

	switch (type) {
	case actions.SET_CRUD_PARAMS:
		return {
			...state,
			[payload.modelName]: payload
		};
	default:
		return state;
	}
};

export const crudCreateModalLoadingReducer = (state = false, action) => {

	switch (action.type) {
	case actions.CREATE_MODEL + START:
	case actions.CHANGE_MODEL + START:
		return true;
	case actions.CREATE_MODEL + SUCCESS:
	case actions.CHANGE_MODEL + SUCCESS:
	case actions.CREATE_MODEL + ERROR:
	case actions.CHANGE_MODEL + ERROR:
		return false;
	default:
		return state;
	}
};

export const uploaderFilesReducer = (state = {}, action) => {
	const { type, payload } = action;

	switch (type) {
	case actions.SET_UPLOADER_FILES:
		return {
			...state,
			[payload.modelName]: { ...state[payload.modelName], fileList: payload.files }
		};
	case actions.SET_UPLOADER_DEFAULT_FILE_LIST:
		return {
			...state,
			[payload.modelName]: { ...state[payload.modelName], defaultFileList: payload.defaultFileList }
		};
	default:
		return state;
	}
};

export function fetchFileConfigReducer(state = {}, action) {
	const { type, response, error, payload } = action;

	switch (type) {
	case actions.FETCH_FILE_CONFIG + SUCCESS:
		return { ...state, [payload.modelName]: response };
	case actions.FETCH_FILE_CONFIG + ERROR:
		return { error };
	default:
		return state;
	}
}

export default {
	crudFilterValues: crudFilterValuesReducer,
	crudModels: crudModelsReducer,
	crudActionsFunc: crudActionsFuncReducer,
	isOpenModelModal: isOpenModelModalReducer,
	modelModalForm: modelModalFormReducer,
	crudParams: crudParamsReducer,
	crudCreateModalLoading: crudCreateModalLoadingReducer,
	uploaderFiles: uploaderFilesReducer,
	fileConfig: fetchFileConfigReducer,
	crudColumns: crudColumnsReducer,
	children: childrenReducer,
}
