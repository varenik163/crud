import 'antd/dist/antd.css';
import React, { Suspense } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import AppWHO from './AppWHO'
import { store } from './redux/store';

function LazyRoute(props) {
	const { component } = props
	return <Suspense fallback={<div />}>{component}</Suspense>
}

render(
	<Provider store={store}>
		<Router>
			{/*<App />*/}
			<LazyRoute component={<AppWHO />} />
		</Router>
	</Provider>,
	document.getElementById('root')
);
