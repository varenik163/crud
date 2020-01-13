import React from 'react';
import crudFull from './components/crud/crudFull'
import crudView from './components/crud/view/crudView'
import crudActions from './redux/actions'
import crudReducers from './redux/reducer'
import crudUploader from './components/crud/uploader/uploader'
import crudSagas, { updateModelsSaga } from './redux/saga'
import { requests } from './redux/requestSaga'
import './style.css'
import regeneratorRuntime from 'regenerator-runtime'

export const reducer = crudReducers;
export const saga = crudSagas;
export const updateModel = updateModelsSaga;
export const requestSaga = requests;
export const actions = crudActions;
export const CrudView = crudView;
export const CrudFull = crudFull;
export const CrudUploader = crudUploader;
