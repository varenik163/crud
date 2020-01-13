import { configure, mount, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16/build/index'
import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'redux-mock-store'
import jsdom from 'jsdom'
import CrudFull, {CrudFull as CrudFullClass} from '../components/crud/crudFull'
import thunk from 'redux-thunk'
import { shallowToJson } from 'enzyme-to-json'
import { BrowserRouter } from 'react-router-dom'
import CreateModalForm from '../components/crud/create/createModelPopup'
import CrudView from '../components/crud/view/crudView'
import actions from '../redux/actions'
import responseMock from './responseMock'

const toggleCreateModelModal = jest.fn();
const { JSDOM } = jsdom;
const doc = new JSDOM('<!doctype html><html><body></body></html>');
global.document = doc;
global.window = {...doc.defaultView, confirm: jest.fn(() => true)};
global.navigator = { userAgent: 'node.js', };

// const {SignUpClass} = require('../../../containers/Page/signup');

configure({ adapter: new Adapter() });

const mockStore = configureStore([thunk]);

describe('it should render CrudFull', () => {
	let container;

	beforeAll(() => {
		container = shallow(<CrudFull store={mockStore({})} />);
	});

	it('it should render CrudFull connected container', () => {
		expect(shallowToJson(container)).toMatchSnapshot();
	});
});

describe('should mount CrudFull', () => {
	let container, store;
	const modelName = 'model';
	const crudActionsFunc = jest.fn();

	beforeAll(() => {
		store = mockStore({
			form: {},
			crudActionsFunc: { [modelName]: crudActionsFunc },
			crudModels: { [modelName]: responseMock },
			crudFilterValues: { [modelName]: {} },
			crudColumns: { [modelName]: responseMock.data.columns.map(e => ({ ...e, visible: true })) },
			isModalOpen: true
		});
		container = mount(<Provider store={store}>
			<BrowserRouter>
				<CrudFull
					crudRead="url"
					modelName="model"
					createDisabled={false}
				/>
			</BrowserRouter>
		</Provider>);
	});

	it('it should contains creatButton', () => {
		const button = container.find('button').filterWhere(btn => btn.props().name === 'createButton');
		expect(button.length).toBe(1);
	});

	it('it should contains crudView', () => {
		expect(container.find(CrudView).length).toBe(1);
	});

	it('should dispatch TOGGLE_CREATE_MODEL_MODAL by click', () => {
		const expectedAction = { type: actions.TOGGLE_CREATE_MODEL_MODAL };
		const button = container.find('button').filterWhere(btn => btn.props().name === 'createButton').first();

		button.simulate('click');
		const searched = store.getActions().find(e => e.type === expectedAction.type);

		expect(searched).toEqual(expectedAction)
	});

	it('it should contains crud modal', () => {
		const wrp = shallow(<CrudFullClass
			store={store}
			crudRead="url"
			modelName="model"
			createDisabled={false}
			setCrudActionsFunc={jest.fn()}
			setCrudParams={jest.fn()}
			filteredColumns={{}}
			isModalOpen={true}
			objectModal={{}}
		/>);
		expect(wrp.find(CreateModalForm).length).toBe(1);
	});
});
