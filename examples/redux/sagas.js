import regeneratorRuntime from 'regenerator-runtime'
import { saga } from '../../src/index'
import { takeEvery, all, put, call } from 'redux-saga/effects'
import { START, ERROR, SUCCESS } from './constants';
import { request } from 'sm-redux-saga-request';
import actions from './actions'

export const API = 'https://api.rentrika.kosmoz.online';
export const token = '8b9e2568e2fc85a9ae1b5b8ac7e81d00';

export function* requestSaga(action) {
	const {
		payload, method, url, auth, oldType: type, token_is_active
	} = action;

	//'f9ad75859d9a7acd94e7a3acc639e0be';
	//'cef506b12fd189faf83b95c2af29d6c6'

	//if (auth && !token_is_active) return;

	try {
		yield put({
			...action,
			type: type + START
		});

		const body = payload ? JSON.stringify(payload) : '';
		const headers = new Headers({ 'Content-Type': 'application/json' });
		if (auth) headers.set('Authorization', 'Bearer ' + token);

		const params = {
			method,
			headers,
			mode: 'cors'
		};

		if (body && method !== 'GET') params.body = body;

		const data = yield call(
			fetch,
			API + url,
			params
		);

		const response = yield data.json();

		if (data.status !== 200 || (data.status === 200 && response.status === 100)) {
			const error = getError(data, response);
			yield put({
				...action,
				type: type + ERROR,
				error
			})
		} else {
			yield put({
				...action,
				type: type + SUCCESS,
				response: {
					data: response.response,
					error: response.status === 100 || response.messages[0].type === 2
						? response.messages[0].message
						: null,
					status: response.status,
					message: response.status === 0 || response.messages[0].type === 0
						? response.messages[0].message
						: null
				}
			});
		}
	} catch (err) {
		console.log(err)
	}
}


export const getError = (data, response) => {
	if (data.status === 0) return {
		message: 'Unknow error: check your authorization. ' +
			'No \'Access-Control-Allow-Origin\' header is present on the requested resource.'
	};
	if (data.status === 500) return response;
	if (response.messages) return response.messages[0];

	return ''
};

const WHO_API = 'http://api.workhard.kosmoz.online';

export function* requestWHOSaga(action) {
	const {
		payload, method, url, auth, oldType: type, token_is_active
	} = action;

	const token = '1a057e41a979648f466d3327de0962b3';
	try {
		yield put({
			...action,
			type: type + START
		});

		const body = payload ? JSON.stringify(payload) : '';
		const headers = new Headers({ 'Content-Type': 'application/json' });
		if (auth) headers.set('Authorization', 'Bearer ' + token);

		const params = {
			method,
			headers,
			mode: 'cors'
		};

		if (body && method !== 'GET') params.body = body;

		const data = yield call(
			fetch,
			WHO_API + url,
			params
		);

		const response = yield data.json();
		if (data.status !== 200 || (data.status === 200 && response.status === 100)) {
			const error = getError(data, response);

			yield put({
				...action,
				type: type + ERROR,
				error,
				messages: response.messages,
			})
		} else {
			yield put({
				...action,
				type: type + SUCCESS,
				response: {
					data: response.response,
					status: response.status,
					message: response.status === 0 || response.messages[0].type === 0
						? response.messages[0].message
						: null
				}
			});
		}
	} catch (err) {
		console.log(err)
	}
}

function* fetchFileConfigSaga(action) {
	yield put(request({
		...action,
		method: 'GET',
		auth: true,
		url: '/v1/owner/object/57/key/config'
	}))
}

export default function* rootSaga() {
	yield all([
		saga(),
		takeEvery('REQUEST', requestSaga),
		takeEvery(actions.FETCH_FILE_CONFIG, fetchFileConfigSaga),
		// takeEvery('REQUEST', requestWHOSaga),
	]);
}
