<template>
	<div class="container-fluid">
		<div class="panel">
			<div class="panel-body">

				<el-form :inline="true" class="demo-form-inline">
					<el-form-item>
						<el-date-picker
								v-model="timeRange"
								type="datetimerange"
								:shortcuts="shortcuts"
								range-separator="To"
								start-placeholder="Start date"
								end-placeholder="End date"
								format="YYYY-MM-DD HH:mm:ss"
								value-format="YYYY-MM-DD HH:mm:ss"
						/>
					</el-form-item>
					<el-form-item>
						<el-input placeholder="搜你想搜" v-model="search_text" style="width: 300px"/>
					</el-form-item>
					<el-form-item>
						<el-button @click="resetPageThenQuery" type="primary">
							<el-icon>
								<Search/>
							</el-icon>
						</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>

		<div class="panel">
			<div class="panel-body">
				<el-table
						:data="tableData"
						style="width: 100%"
						height="calc(100vh - 260px)">
					<el-table-column prop="createTime" label="发送时间" width="180"/>
					<el-table-column prop="uid" label="发送用户" width="200"/>
					<el-table-column prop="systemMessage" label="系统消息"/>
					<el-table-column prop="content" label="用户内容"/>
				</el-table>
			</div>
			<div class="panel-footer">
				<el-pagination
						@size-change="resetPageThenQuery"
						@current-change="queryAllEvent"
						v-model:current-page="page.currentPage"
						:page-sizes="[10, 20, 30, 40, 50, 100]"
						v-model:page-size="page.pageSize"
						layout="total, sizes, prev, pager, next, jumper"
						v-model:total="page.total">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'

import {queryChatHistoryRecord} from '@/api'

const tableData = ref([])
const search_text = ref('')

const timeRange = ref([])
const page = reactive({
	currentPage: 1,
	pageSize: 50,
	total: 0
})


const shortcuts = [
	{
		text: 'Last Day',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setTime(start.getTime() - 3600 * 1000 * 24)
			return [start, end]
		},
	},
	{
		text: 'Last 3 Days',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
			return [start, end]
		},
	},
	{
		text: 'Last week',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
			return [start, end]
		},
	},
	{
		text: 'Last month',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
			return [start, end]
		},
	},
	{
		text: 'Last 3 months',
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
			return [start, end]
		},
	},
]

onMounted(() => {
	queryAllEvent()
})

function resetPageThenQuery() {
	page.currentPage = 1
	queryAllEvent()
}

function queryAllEvent() {
	let startTime = null
	let endTime = null
	if (timeRange && timeRange.value && timeRange.value.length == 2) {
		startTime = timeRange.value[0]
		endTime = timeRange.value[1]
	}

	queryChatHistoryRecord(page.currentPage, page.pageSize, startTime, endTime, search_text.value).then(response => {
		tableData.value = response.data.dataList
		page.total = response.data.totalCount
	})
}
</script>

<style scoped>

</style>
