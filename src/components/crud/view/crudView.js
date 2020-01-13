import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { Icon, Table } from 'antd';
import crudActions from '../../../redux/actions'
import filterRenderer from '../filter/filterRenderer'
import dataRenderer from '../dataRenderer'
import Loader from '../loader'
import ColumnSelect from '../columnSelect';

const { fetchCrudModels, fetchCrudChildren, setCrudParams } = crudActions;
const viewWidth = Math.min(window.innerWidth, screen.width);
const isNotMiddleSizeWindow = viewWidth > 1640 || viewWidth < 800;

class CrudView extends Component {

	componentDidMount() {
		const { modelName, url } = this.props;
		this.props.fetchCrudModels({
			modelName,
			url
		});
	}

	handleTableChange = (pagination, filters, sorter) => {
		this.props.fetchCrudModels({
			modelName: this.props.modelName,
			url: this.props.url,
			page: pagination.current,
			order_by: sorter.columnKey,
			order: sorter.order
		}, filters);

		this.props.setCrudParams({
			...this.props.crudParams[this.props.modelName],
			page: pagination.current,
			order_by: sorter.columnKey,
			order: sorter.order,
			filters
		})
	};

	handleExpand = (isExpanded, row) => {

		if (isExpanded) {
			this.props.fetchCrudChildren(row.id, this.props.modelName, this.props.getChildrenUrl(row.id))
		}
	};

	getFilterValues = (col) => {
		const { filterValues } = this.props;

		return filterValues && col.filter.can && filterValues[col.id] ?
			filterValues[col.id].map(elem => ({
				text: elem.name,
				value: elem.id
			}))
			: []
	};

	render() {
		const {
			items,
			modelName,
			tableStyle,
			TableWrapper,
			fixActionColumn,
			iconTheme,
			size,
			tdClass,
			scrollX,
			pageSize,
			rowSelection,
			bordered,
			tableProps,
			filteredColumns
		} = this.props;

		if (items && !items.data && items.loading) return <Loader />;
		if (!items || !items.data) return null;

		const listItems = items.data.items.map(elem => ({
			...elem,
			key: elem.id,
			children: elem.has_child ? elem.children || [] : null
		}));
		// console.log(fixActionColumn, isNotMiddleSizeWindow)

		const columnsDirty = filteredColumns[modelName];
		console.log(filteredColumns);
		const columns = (columnsDirty || []).filter(e => e.visible).map(col => ({
			id: col.id,
			className: 'crud-table-column' + (tdClass ? ' ' + tdClass : ''),
			title: <span dangerouslySetInnerHTML={{ __html: col.title }} />, // <IntlMessages id="antTable.title.id"/>,
			key: col.id,
			fixed: col.id === 'actions' && !isNotMiddleSizeWindow && fixActionColumn ? 'right' : null,
			width: col.id === 'actions' && !isNotMiddleSizeWindow && fixActionColumn ? 150 : 'auto',
			render: object => dataRenderer(object, col, modelName, iconTheme),
			filters: this.getFilterValues(col),
			filterIcon: col.filter.can
				? filtered => (
					<Icon
						type="filter"
						style={{ color: filtered ? '#108ee9' : '#aaa' }}
						theme="outlined"
					/>)
				: null,
			filterDropdown: col.filter.can
				? filterRenderer(col.filter.type, col.id, this.getFilterValues(col))
				: null,
			sorter: col.order.can ? () => {
			} : null// (a, b) => Number(a.id) - Number(b.id),
		}));

		const TableComponent = TableWrapper || Table;
		const scrollXPTable = !isNotMiddleSizeWindow && fixActionColumn ? { x: scrollX } : {};

		return (
			<div style={{ position: 'relative' }}>
				<ColumnSelect modelName={modelName} />
				<TableComponent
					{...tableProps}
					columns={columns}
					dataSource={listItems}
					className="isoSortingTable"
					onChange={this.handleTableChange}
					pagination={{
						defaultCurrent: 1,
						pageSize: items.data.filter.limit || pageSize,
						total: items.data.count,
						hideOnSinglePage: true
					}}
					loading={items.loading}
					scroll={{
						...tableProps.scroll,
						...scrollXPTable
					}}
					onExpand={this.handleExpand}
					size={size}
					tableStyle={tableStyle}
					rowClassName={record => (record.row ? record.row.state : 'default')}
					rowSelection={rowSelection}
					bordered={bordered}
				/>
			</div>
		);
	}
}

CrudView.propTypes = {
	modelName: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	fixActionColumn: PropTypes.bool,
	iconTheme: PropTypes.string,
	getChildrenUrl: PropTypes.func,
	size: PropTypes.string,
	tdClass: PropTypes.string,
	scrollX: PropTypes.number,
	pageSize: PropTypes.number,
	rowSelection: PropTypes.func,
	tableProps: PropTypes.object,
};

CrudView.defaultProps = {
	fixActionColumn: true,
	scrollX: 1300,
	pageSize: 20,
	tableProps: {}
};

export default connect((state, props) => ({
	items: state.crudModels[props.modelName],
	filterValues: state.crudFilterValues[props.modelName],
	crudParams: state.crudParams,
	filteredColumns: state.crudColumns
}), {
	fetchCrudModels,
	fetchCrudChildren,
	setCrudParams
})(CrudView);
