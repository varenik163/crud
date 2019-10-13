import React from 'react'
import { connect } from 'react-redux'
import { CrudFull } from '../../dist';
import createCommissionFields from './createCategoryFields';

// commission_list_container

function CrudCommisionList({ taskType, userTag }) {

	return (
		<div className="box box-body crud-table">
			<CrudFull
				bordered
				crudRead="/v2/admin/task/commission/list"
				crudCreate="/v2/admin/task/commission"
				modelName="crudCommisionList"
				createDisabled={false}
				fixActionColumn={false}
				createFormOptions={{
					fields: createCommissionFields.map((elem) => {
						if (elem.name === 'task_type_id') {
							return {
								...elem,
								options: taskType
							}
						}
						if (elem.name === 'user_tag_id') {
							return {
								...elem,
								options: userTag,
							}
						}
						return elem
					}),
					title: 'Добавить данные',
					editTitle: 'Редактировать данные',
				}}

				submitShape={form => ({
					TaskTypeCommission: {
						task_type_id: form.task_type_id,
						user_tag_id: form.user_tag_id,
						task_type_commission: +form.task_type_commission,
					}
				})}
				updateShape={form => ({
					task_type_id: form.task_type.id,
					user_tag_id: form.user_tag.id,
					task_type_commission: +form.task_type_commission,
				})}
			/>
		</div>
	)
}

const mapState = state => ({
	taskType: state.crudFilterValues && state.crudFilterValues.crudCommisionList
		? state.crudFilterValues.crudCommisionList.task_type
		: [],
	userTag: state.crudFilterValues && state.crudFilterValues.crudCommisionList
		? state.crudFilterValues.crudCommisionList.user_tag
		: [],
})
export default connect(
	mapState,
	null,
)(CrudCommisionList)
