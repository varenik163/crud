import React from 'react'
import filterDropdown from './filterDropdown'

export default function filterRenderer(filterType, columnName, options) {

	switch (filterType) {
	case 'input_number':
		return filterDropdown(columnName, 'number');
	case 'input_text':
		return filterDropdown(columnName, 'text');
	case 'date_picker':
		return filterDropdown(columnName, 'date');
	case 'select_one':
		return filterDropdown(columnName, 'select', options);
	case 'boolean':
		return filterDropdown(columnName, 'checkbox');
	default:
		return null;
	}
}
