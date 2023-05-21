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
            <el-button @click="openAddDialog" type="success">
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
          <el-table-column prop="nickname" label="昵称" width="160"/>
          <el-table-column prop="username" label="用户名" width="160"/>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag
                  :type="scope.row.status === 1 ? 'success' : 'danger'"
                  disable-transitions>
                {{ scope.row.status == 1 ? '正常': scope.row.status == 2 ? '禁止登录' : '账号过期' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="email" label="邮箱" width="200"/>
          <el-table-column prop="createTime" label="注册时间" width="200"/>
          <el-table-column prop="expiredTime" label="过期时间" width="200"/>
          <el-table-column prop="description" label="简介"/>
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
              <el-button type="primary" @click="openEditDialog(scope.row)">编辑</el-button>
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

  <el-dialog v-model="showUserDialog" :show-close="false" width="500px">
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <span :id="titleId" :class="titleClass">{{ createUserOp ? "创 建 用 户" : '修 改 信 息'}}</span>
        <el-button type="danger" @click="close">
          <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
          Close
        </el-button>
      </div>
    </template>
    <el-form label-position="right" label-width="150px" :model="userInfo" :rules="rules" ref="ruleFormRef">
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="userInfo.nickname" placeholder="昵称"></el-input>
      </el-form-item>
      <el-form-item label="登录用户名" prop="username">
        <el-input v-model="userInfo.username" placeholder="登录用户名最好是英文"></el-input>
      </el-form-item>
      <el-form-item label="过期时间" prop="expiredTime">
        <el-date-picker
            v-model="userInfo.expiredTime"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="Select date and time"
        />
      </el-form-item>
      <el-form-item label="登录密码" prop="passwordHash" v-show="createUserOp">
        <el-input v-model="userInfo.passwordHash" placeholder="登录密码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="userInfo.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="userInfo.status" >
          <el-option label="正常" :value="1"/>
          <el-option label="禁止登录" :value="2"/>
          <el-option label="账号过期" :value="3"/>
        </el-select>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-input v-model="userInfo.avatar" placeholder="头像"></el-input>
      </el-form-item>
      <el-form-item label="个人简介" prop="description">
        <el-input v-model="userInfo.description" placeholder="个人简介"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="showUserDialog=false">取 消</el-button>
          <el-button type="primary" @click="addOrModifyUser(ruleFormRef)">确 定 {{ createUserOp ? '添 加' : '修 改'}}</el-button>
        </span>
    </template>
  </el-dialog>


</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'
import {ElButton, ElDialog, ElMessage} from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { CircleCloseFilled } from '@element-plus/icons-vue'
import { userPageList, userCreate, userModify } from '@/api'

const ruleFormRef = ref<FormInstance>()
const tableData = ref([])
const search_text = ref('')

const showUserDialog = ref(false)
const createUserOp = ref(false)

const timeRange = ref([])
const page = reactive({
  currentPage: 1,
  pageSize: 50,
  total: 0
})

const rules = reactive<FormRules>({
  nickname: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 20, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  username: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 20, message: '请设置 8 - 20 位的登录用户名', trigger: 'blur' },
  ],
  passwordHash: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 8, max: 20, message: '请设置 8 - 20 位的密码', trigger: 'blur' },
  ],
  avatar: [
    { required: true, message: '选择一个合适的头像', trigger: 'blur' },
  ],
  expiredTime: [
    { required: true, message: '设置合理的过期时间', trigger: 'blur' },
  ],
})

interface UserInfo {
  id: number | null
  nickname: string
  username: string
  passwordHash: string
  email: string
  avatar: string
  status: number
  description: string,
  expiredTime: string | null,
}

const userInfo = reactive<UserInfo>({
  id: null,
  nickname: '',
  username: '',
  passwordHash: '',
  email: '',
  avatar: '',
  status: 1,
  description: '',
  expiredTime: '',
})

const openAddDialog = () => {
  showUserDialog.value = true
  createUserOp.value = true
  resetUserInfo()
}

const openEditDialog = (row: UserInfo) => {
  showUserDialog.value = true
  createUserOp.value = false
  userInfo.id = row.id
  userInfo.nickname = row.nickname
  userInfo.status = row.status
  userInfo.username = row.username
  userInfo.passwordHash = row.passwordHash
  userInfo.email = row.email
  userInfo.avatar = row.avatar
  userInfo.description = row.description
  userInfo.expiredTime = row.expiredTime
}

const resetUserInfo = () => {
  userInfo.id = null
  userInfo.nickname = ''
  userInfo.status = 1
  userInfo.username = ''
  userInfo.passwordHash = ''
  userInfo.email = ''
  userInfo.avatar = ''
  userInfo.description = ''
  userInfo.expiredTime = ''
}

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

const addOrModifyUser = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      let opfun = null
      if (createUserOp.value) {
        opfun = userCreate(userInfo)
      } else {
        opfun = userModify(userInfo)
      }
      opfun.then(response => {
        if (response.status === 'Success') {
          ElMessage.success(createUserOp.value ? '添加成功' : '修改成功')
          showUserDialog.value = false
          queryAllEvent()
          resetUserInfo()
        } else {
          ElMessage.error(response.message as string)
        }
      }).catch(error => {
        console.info(error)
        ElMessage.error(error.message)
      })
    } else {
      console.log('error submit!', fields)
    }
  })
}

function resetPageThenQuery() {
  page.currentPage = 1
  queryAllEvent()
}

async function queryAllEvent() {
  let startTime = null
  let endTime = null
  if (timeRange && timeRange.value && timeRange.value.length == 2) {
    startTime = timeRange.value[0]
    endTime = timeRange.value[1]
  }

  userPageList(page.currentPage, page.pageSize, search_text.value, startTime, endTime).then(response => {
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
