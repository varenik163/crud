import React from 'react'
import { Input, Button, Checkbox, Select, DatePicker } from 'antd';
import moment from 'moment/moment'
import 'moment/locale/ru'

const { Option } = Select;

export default (name, type, options) => ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
	<div
		className="custom-filter-dropdown"
	>
		{type === 'checkbox' ? (
			<span>
				<Checkbox
					value={selectedKeys}
					onChange={e => setSelectedKeys(e.target.checked.toString())}
					onPressEnter={() => { confirm() }}
				/>
				<br />
			</span>
		)
			: type === 'select' ? (
				<Select
					value={selectedKeys}
					placeholder="Выбрать"
					onChange={(e) => { setSelectedKeys(e); confirm(); }}
					onPressEnter={() => { confirm() }}
					style={{ width: '130px', marginRight: '8px' }}
					showSearch
					filterOption={(search, option) =>
						option.props.children.toLowerCase().indexOf(search.toLowerCase()) >= 0
					}
					onSearch={() => {}}
				>
					{options.map(opt => (
						<Option
							value={opt.value}
					        key={opt.value}
					        onClick={(e) => {
						        setSelectedKeys(opt.value); setTimeout(() => confirm(), 100);
					        }}
						>
							{opt.text}
						</Option>
					))}
				</Select>
			)
				: type === 'date' ? (
					<DatePicker
						value={selectedKeys && !(selectedKeys instanceof Array)
							? moment(selectedKeys, 'DD/MM/YYYY').locale('ru')
							: null
						}
						onChange={value => setSelectedKeys(value)}
						onPressEnter={() => { confirm() }}
						placeholder="Выберите дату"
						format={'DD/MM/YYYY'}
						style={{ marginRight: '8px' }}
					/>
				)
					: (
						<Input
							type={type}
							placeholder="Поиск"
							value={selectedKeys}
							onChange={e => setSelectedKeys(e.target.value ? e.target.value : null)}
							onPressEnter={() => { confirm() }}
						/>
					)
		}
		<Button type="primary" onClick={() => { confirm() }}>Поиск</Button>
		<Button onClick={() => { clearFilters() }}>Сбросить</Button>
	</div>
);
