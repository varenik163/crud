import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Checkbox, Icon } from 'antd';
import actions from '../../redux/actions';

const { setCrudColumns } = actions;
const listStyle = {
	background: '#fff',
	padding: '10px',
	width: '300px',
	zIndex: '9999',
	display: 'flex',
	flexDirection: 'column',
	direction: 'ltr',
	border: '1px #cccccc70 solid'
};

const ColumnSelect = ({ setCrudColumns: setCrudColumnsConnected, filteredColumns, modelName }) => {
	const [selectIsOpen, setSelectIsOpen] = useState(false);

	const handleColumnsSelect = useCallback((column, checked, index) => {
		const newColumns = [...filteredColumns];
		newColumns[index].visible = checked;

		setCrudColumnsConnected(newColumns, modelName);
	}, [filteredColumns, setCrudColumnsConnected]);

	const isDisabled = useCallback(
		column => filteredColumns.length === 1 || filteredColumns
			.filter(e => e.visible).length === 2 && column.visible
		, [filteredColumns]
	);

	const inner = (
		<span>
			{!selectIsOpen
				? <Icon type="setting" onClick={() => setSelectIsOpen(true)} />
				: <Icon type="close" onClick={() => setSelectIsOpen(false)} />
			}
			{selectIsOpen && (
				<span style={listStyle}>{
					filteredColumns
						.filter(column => column.id !== 'actions')
						.map((column, i) => (
							<Checkbox
								onChange={ev => handleColumnsSelect(column, ev.target.checked, i)}
								checked={column.visible}
								style={{ display: 'block', marginLeft: '0px' }}
								disabled={isDisabled(column)}
							>
								{column.title}
							</Checkbox>
						))
				}
				</span>
			)}
		</span>
	);

	return (
		<span style={{
			display: 'flex', direction: 'rtl', position: 'absolute', top: '-40px', right: '0px', zIndex: '9999'
		}}
		>
			{inner}
		</span>
	);
};

ColumnSelect.propTypes = {
	setCrudColumns: PropTypes.func.isRequired,
	filteredColumns: PropTypes.array.isRequired,
	modelName: PropTypes.string.isRequired,
};

export default connect((state, props) => ({ filteredColumns: state.crudColumns[props.modelName] }), { setCrudColumns })(ColumnSelect)
