import 'antd/dist/antd.css';
import PropTypes from 'prop-types'
import React from 'react';
import { connect } from 'react-redux'
import { CrudFull } from '../../src/index';
import { Button } from 'antd'
import FormFields from './FormFields/index'
import actions from '../redux/actions'
import { API } from '../redux/sagas';
import { getCookie } from '../../src/redux/requestSaga';

const { fetchFileConfig } = actions;

class CrudSiteAlerts extends React.Component {

	constructor(props) {
		super(props);

		this.state = { selected: [] }
	}

	componentDidMount() {
	}


	actionsFunc = (action, elem) => {
		switch (action.id) {
		case 'start':
			const conf = window.confirm('Начать показ алерта?');
			if (conf) this.props.startShowSiteAlert(elem.id);
			break;
		default:
			return null;
		}
	};

	iconSet = (id) => {
		switch (id) {
		case 'start':
			return 'caret-right'
		default:
			return null;
		}
	};

	render() {
		const { roles, groups, start } = this.props;
		const rowSelection = {
			onChange: (selectedRowKeys, selectedRows) => {
				this.setState({ selected: [...this.state.selected, ...selectedRowKeys] });
			},
			getCheckboxProps: record => ({
				disabled: record.name === 'Disabled User', // Column configuration not to be checked
				name: record.name,
			}),
		};

		return (
			<div className="box box-body crudTable" style={{ width: '1350px' }}>
				<CrudFull
					crudRead="/v1/owner/object/list"
					// crudCreate={`/v1/owner/object/57/key`}
					submitShape={form => ({ ...form })}
					updateShape={elem => ({ config: elem.files.config })}
					createDisabled={false}
					createFormOptions={{ fields: FormFields }}
					modelName="billList"
					createButtonTitleId="sidebar.contractor.work.new"
					ButtonComponent={Button}
					customActionsFunc={this.actionsFunc}
					onDeleteConfirmMessageFunc={() => 'Удалить запись?'}
					// fixActionColumn={false}
					// rowSelection={rowSelection}
					tableProps={{ scroll: { y: 240, x: 1500 } }}
					scrollX={1500}
				/>
				<br/>
				<br/>
				<CrudFull
					crudRead={`/v1/owner/object/103/share/invites`}
					modelName="objectInvites"
					createButtonTitleId="sidebar.keys.type.new"
					fixActionColumn={false}
					ButtonComponent={Button}
				/>
				<br/>
				<br/>
				<CrudFull
					crudRead="/v1/owner/stat"
					modelName="ownerStat"
					// customActionsFunc={this.actionsFunc}
					getChildrenUrl={id => `/v1/owner/stat/child/${id}`}
					iconsProvider={(id) => {
						switch (id) {
						case 'revoke':
							return 'stop';
						case 'custom_delete':
							return 'delete';
						default:
							return null;
						}
					}}
					// fixActionColumn={false}
					// tableProps={{ scroll: { y: 500, x: 2000 } }}
				/>
			</div>
		)
	}
}

CrudSiteAlerts.propTypes = {
	start: PropTypes.object,
	roles: PropTypes.array,
	groups: PropTypes.array,
	startShowSiteAlert: PropTypes.func,
	clearStartShowSiteAlert: PropTypes.func,
};

export default connect(state => ({
	// start: state[moduleName + START_SHOW_SITE_ALERT_RESPONSE],
	roles: state.crudFilterValues && state.crudFilterValues.siteAlerts
		? state.crudFilterValues.siteAlerts.role
		: [],
	groups: state.crudFilterValues && state.crudFilterValues.siteAlerts
		? state.crudFilterValues.siteAlerts.group
		: [],

}), { })(CrudSiteAlerts)
