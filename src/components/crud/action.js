import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { Icon } from 'antd'

import styled from 'styled-components';

const ActionStyled = styled.span`
	.crud-action {
		font-size: 20px;
		padding: 0 5px;
	}
`;

class Action extends Component {

    getIcon = (id) => {
    	switch (id) {
	        case 'update':
	            return 'edit';
	        case 'delete':
	            return 'delete';
	        case 'create':
	            return 'plus-circle';
	        case 'restore':
	            return 'select';
	        case 'view-back':
	        case 'view':
	            return 'eye';
	        case 'check':
	            return 'user';
	        case 'took':
	            return 'login';
	        case 'return':
	            return 'logout';
	        case 'finish':
	            return 'check-circle';
	        case 'logs':
	            return 'form';
		    case 'transfer':
			    return 'switcher';
	        default:
	            return this.props.params.iconsProvider(id)
    	}
    };

	handleClick = (ev) => {
		const { data, row } = this.props;

		switch (data.type) {
		case 'query':
			ev.preventDefault();
			this.props.actionsFunc(data, row);
			break;
		case 'link':
			if (data.method === '_blank') return null;
			ev.preventDefault();
			this.props.push(data.url);
			break;
		case 'out-link':
		default:
			return null;
		}
	};

	render() {
		const { data } = this.props;

		return (
			<ActionStyled>
				<a title={data.name} href={data.url} target="_blank" className="crud-action" onClick={this.handleClick}>
					<Icon type={this.getIcon(data.id) || data.icon} />
				</a>
			</ActionStyled>
		)
	}
}

Action.propTypes = {
	data: PropTypes.object.isRequired,
	row: PropTypes.object.isRequired,
	params: PropTypes.object.isRequired,
	modelName: PropTypes.string,
	iconTheme: PropTypes.string,
	iconsProvider: PropTypes.func,
	push: PropTypes.func.isRequired,
	actionsFunc: PropTypes.func.isRequired,
};

Action.defaultProps = { iconTheme: 'outlined' };

export default connect((state, props) => ({
	actionsFunc: state.crudActionsFunc[props.modelName],
	params: state.crudParams[props.modelName]
}), { push })(Action)
