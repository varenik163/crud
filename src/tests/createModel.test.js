import { configure, mount, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16/build/index'
import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import jsdom from 'jsdom'
import { BrowserRouter } from 'react-router-dom'
import CreateModel from '../components/crud/create/createModelPopup'
import thunk from 'redux-thunk';
import { shallowToJson } from 'enzyme-to-json';

const { JSDOM } = jsdom;
const doc = new JSDOM('<!doctype html><html><body></body></html>');
global.document = doc;
global.window = doc.defaultView;
global.navigator = {
	userAgent: 'node.js',
};

// const {SignUpClass} = require('../../../containers/Page/signup');

configure({ adapter: new Adapter() });

const mockStore = configureStore([thunk]);
const fields = [
	{ name: 'name', type: 'text' },
	// { name: 'someField', type: 'number' }
];

describe('it should render CreateModel', () => {
	let container;

	beforeAll(() => {
		container = shallow(<CreateModel handleSubmit={jest.fn} store={mockStore({})} fields={[]} />);
	});

	it('it should render CreateModel connected container', () => {
		expect(shallowToJson(container)).toMatchSnapshot();
	});
});

describe('should mount CreateModel', () => {
	let container;
	const onCreate = jest.fn();

	beforeAll(() => {
		const store = mockStore({ form: {} });
		container = mount(<Provider store={store}>
			<BrowserRouter>
				<CreateModel
					onCreate={onCreate}
					onClose={jest.fn}
					fields={fields}
					initialValues={{ name: 'Name' }}
				/>
			</BrowserRouter>
		</Provider>);
	});

	it('should contains name input', () => {
		const input = container.find('input').filterWhere(btn => btn.props().name === 'name');
		expect(input.length).toBe(1);
	});

	it('should dispatch CREATE_MODEL by click', () => {
		const button = container.find('button').filterWhere(btn => btn.props().className === 'ant-btn ant-btn-primary').first();
		button.simulate('click');
		expect(onCreate.mock.calls.length).toBe(1);
	});

});

