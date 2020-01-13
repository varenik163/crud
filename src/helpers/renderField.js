import React from 'react';
import { Input, Form, Checkbox, Select, DatePicker } from 'antd'
import moment from 'moment'
import 'moment/locale/ru'
import { Field } from 'redux-form'
//import locale from 'antd/lib/date-picker/locale/ru_RU'
//moment.locale('ru');
import Editor from '../components/custom/Editor'
import Uploader from '../components/crud/uploader/uploader';

const { Option: SelectOption } = Select;
const Search = Input.Search;

export const renderField = ({
	input,
	label,
	type,
	options,
	mode,
	min,
	max,
	step,
	meta: { touched, error, warning },
	validating,
	placeholder,
	rows,
	size,
	layout,
	onPressEnter,
	defaultValue,
	addonAfter,
	enterButton,
	dropdownRender,
	uploaderParams,
	locale
}) => (<Form.Item
	hasFeedback
	{...layout}
	label={label}
	validateStatus={error && touched ? 'error'
		: warning && touched ? 'warning'
			: validating ? 'validating'
				: ''}
	help={touched && error ? error : ''}
>
	{(() => {
		switch (type) {
		case 'select':
			return (<Select
				{...input}
				value={input.value || []}
				mode={mode}
				showSearch
				optionFilterProp="children"
				disabled={input.disabled ? true : false}
				style={{ width: '100%' }}
				placeholder={placeholder}
				dropdownRender={dropdownRender}
			>
				{options.map(elem => (<SelectOption value={elem.id} key={elem.id}>
					{elem.name}
				</SelectOption>))}
			</Select>);
		case 'textarea':
			return (<Input.TextArea
				{...input}
				placeholder={placeholder}
				type={type}
				className="form-control"
				rows={rows}
			/>);
		case 'checkbox':
			return (<Checkbox {...input}>
				{placeholder}
			</Checkbox>);
		case 'search':
			return (<Search
				onPressEnter={onPressEnter}
				{...input}
				value={input.value || defaultValue}
				placeholder={placeholder}
				enterButton={enterButton}
			/>);
		case 'date':
			return (<DatePicker
				style={{ width: '100%' }}
				onPressEnter={onPressEnter}
				{...input}
				value={input.value ? moment(input.value, 'DD/MM/YYYY').locale('ru') : null}
				placeholder={placeholder}
				// onChange={(value) => console.log(value)}
				format="DD/MM/YYYY"
				//locale={locale}
			/>);
		case 'editor':
			return <Field name={input.name} component={Editor} />;
		case 'uploader':
			return <Uploader {...uploaderParams} defaultFileList={input.value} />;
		default:
			return (<Input
				onPressEnter={onPressEnter}
				{...input}
				value={input.value || defaultValue}
				placeholder={placeholder}
				type={type}
				className="form-control"
				min={min}
				max={max}
				step={step}
				size={size}
				addonAfter={addonAfter}
			/>);
		}
	})()}
</Form.Item>);
