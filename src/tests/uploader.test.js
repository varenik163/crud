import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16/build/index'
import React from 'react'
import configureStore from 'redux-mock-store'
import jsdom from 'jsdom'
import UploderWrapper from '../components/crud/uploader/uploader'
import thunk from 'redux-thunk';
import { shallowToJson } from 'enzyme-to-json';

const { JSDOM } = jsdom;
const doc = new JSDOM('<!doctype html><html><body></body></html>');
global.document = doc;
global.window = doc.defaultView;
global.navigator = {
	userAgent: 'node.js',
};

configure({ adapter: new Adapter() });

const mockStore = configureStore([thunk]);

describe('UploaderWrapper', () => {
	let container;

	beforeAll(() => {
		container = shallow(<UploderWrapper handleSubmit={jest.fn} store={mockStore({})} />);
	});

	it('it should render UploaderWrapper', () => {
		expect(shallowToJson(container)).toMatchSnapshot();
	});
});
