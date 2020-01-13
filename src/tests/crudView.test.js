import { configure, mount, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16/build/index'
import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import jsdom from 'jsdom'
import CrudView from '../components/crud/view/crudView'
import thunk from 'redux-thunk'
import { shallowToJson } from 'enzyme-to-json'
import { BrowserRouter } from 'react-router-dom'
import responseMock from './responseMock'

const { JSDOM } = jsdom;
const doc = new JSDOM('<!doctype html><html><body></body></html>');
global.document = doc;
global.window = doc.defaultView;
global.navigator = {
	userAgent: 'node.js',
};

// const {SignUpClass} = require('../../../containers/Page/signup');

configure({adapter: new Adapter()});

const mockStore = configureStore([thunk]);

describe('it should render CrudView', () => {
	let container, modelName = 'model';

	beforeAll(() => {
		container = shallow(<CrudView handleSubmit={jest.fn} store={mockStore({ crudModels: { [modelName]: responseMock }, crudFilterValues: {} })} modelName={modelName} />);
	});

	it('it should render SignUp connected container', () => {
		expect(shallowToJson(container)).toMatchSnapshot();
	});
});

describe('should mount CrudView', () => {
	let container, store;
	const modelName = 'model';
	const openUpdateFrom = jest.fn();
	const handleDelete = jest.fn();
	const handleRestore = jest.fn();
	const crudActionsFunc = jest.fn((action, elem) => {
		switch (action.id) {
		case 'update':
			openUpdateFrom(action, elem);
			break;
		case 'delete':
			handleDelete(action, elem);
			break;
		case 'restore':
			handleRestore(action, elem);
			break;
		default:
			return null
		}
	});
	const storeData = {
		crudActionsFunc: { [modelName]: crudActionsFunc },
		crudModels: { [modelName]: responseMock },
		crudFilterValues: { [modelName]: {} },
		crudColumns: { [modelName]: responseMock.data.columns.map(e => ({ ...e, visible: true })) }
	};

	beforeAll(() => {
		store = mockStore(storeData);
		container = mount(<Provider store={store}>
			<BrowserRouter>
				<CrudView
					crudRead="url"
					modelName={modelName}
				/>
			</BrowserRouter>
		</Provider>);
	});

	it('should invoke delete func', () => {
		const button = container.find('.anticon-delete').first();

		button.simulate('click');

		expect(handleDelete).toHaveBeenCalled();
	});

	it('should invoke change func', () => {
		const button = container.find('.anticon-edit').first();

		button.simulate('click');

		expect(openUpdateFrom).toHaveBeenCalled();
	});

	it('should invoke restore func', () => {
		const button = container.find('.anticon-select').first();

		button.simulate('click');

		expect(handleRestore).toHaveBeenCalled();
	});

	it('should render items', () => {
		expect(container.find('.ant-table-scroll .ant-table-tbody tr').length)
			.toBe(storeData.crudModels[modelName].data.items.length);
	});

	it('should render columns', () => {
		expect(container.find('.ant-table-scroll th.crud-table-column').length)
			.toBe(storeData.crudModels[modelName].data.columns.length);
	});
});
