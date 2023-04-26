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
            <el-button @click="createUserDialog = true" type="success">
              创建用户
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
          <el-table-column prop="id" label="id" width="80"/>
          <el-table-column prop="avatar" label="头像" width="100">
            <template #default="scope">
              <el-image style="width: 60px; height: 60px" :src="scope.row.avatar"/>
            </template>
          </el-table-column>
          <el-table-column prop="uid" label="uid" width="200"/>
          <el-table-column prop="username" label="用户名" width="160"/>
          <el-table-column prop="email" label="邮箱" width="200"/>
          <el-table-column prop="createTime" label="注册时间" width="200"/>
          <el-table-column prop="description" label="简介"/>
          <el-table-column fixed="right" label="操作" width="120">
            <template #default>
              <el-button type="primary">编辑</el-button>
            </template>
          </el-table-column>
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

  <el-dialog v-model="createUserDialog" :show-close="false" width="500px">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <span :id="titleId" :class="titleClass">创 建 用 户</span>
        <el-button type="danger" @click="close">
          <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
          Close
        </el-button>
      </div>
    </template>
    <el-form label-position="left" label-width="150px" :model="createUserInfo">
      <el-form-item label="名称">
        <el-input v-model="createUserInfo.username" placeholder="登录用户名最好是英文"></el-input>
      </el-form-item>
      <el-form-item label="登录密码">
        <el-input v-model="createUserInfo.password" placeholder="登录密码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="createUserInfo.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="头像">
        <el-input v-model="createUserInfo.avatar" placeholder="头像"></el-input>
      </el-form-item>
      <el-form-item label="个人简介">
        <el-input v-model="createUserInfo.description" placeholder="个人简介"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="createUserDialog = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定 添 加</el-button>
        </span>
    </template>
  </el-dialog>


</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'
import { ElButton, ElDialog } from 'element-plus'
import { CircleCloseFilled } from '@element-plus/icons-vue'
import { userPageList, userCreate } from '@/api'



const tableData = ref([])
const search_text = ref('')
const createUserDialog = ref(false)

const timeRange = ref([])
const page = reactive({
  currentPage: 1,
  pageSize: 50,
  total: 0
})

const createUserInfo = reactive({
  username: '',
  password: '',
  email: '',
  avatar: '',
  description: '',
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

function addUser() {
  userCreate(createUserInfo).then(response => {
    console.info(response)
  })
}

function resetPageThenQuery() {
  page.currentPage = 1
  queryAllEvent()
}

interface UserInfo {
  totalUsage?: number
}

async function queryAllEvent() {
  let startTime = null
  let endTime = null
  if (timeRange && timeRange.value && timeRange.value.length == 2) {
    startTime = timeRange.value[0]
    endTime = timeRange.value[1]
  }

  userPageList(page.currentPage, page.pageSize).then(response => {
    tableData.value = response.data.dataList
    page.total = response.data.totalCount
  })
}
</script>

<style scoped>
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
