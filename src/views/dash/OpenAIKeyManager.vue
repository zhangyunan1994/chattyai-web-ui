<template>
  <div class="container-fluid">
    <div class="panel">
      <div class="panel-body">
        <el-form :inline="true" class="demo-form-inline">
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
              添 加
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
          <el-table-column prop="accountId" label="账户" width="150"/>
          <el-table-column prop="openaiKey" label="API key"/>
          <el-table-column prop="totalUseMoney" label="总使用金额" width="120"/>
          <el-table-column prop="totalUseToken" label="总使用 Token" width="120"/>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag
                  :type="scope.row.status === 1 ? 'success' : 'danger'"
                  disable-transitions>
                {{ scope.row.status == 1 ? '可用': scope.row.status == 2 ? '关闭' : '过期关闭' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="expiredTime" label="过期时间" width="200"/>
          <el-table-column prop="createTime" label="添加时间" width="200"/>
          <el-table-column fixed="right" label="操作" width="200">
            <template #default="scope">
              <el-button type="primary" @click="openEditDialog(scope.row)">编辑</el-button>
              <el-popconfirm
                  width="300"
                  confirm-button-text="OK"
                  cancel-button-text="No, Thanks"
                  :icon="InfoFilled"
                  icon-color="#626AEF"
                  @confirm="confirmDelete(scope.row.id)"
                  title="Are you sure to delete this?">
                <template #reference>
                  <el-button type="danger">删除</el-button>
                </template>
              </el-popconfirm>
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
        <span :id="titleId" :class="titleClass">{{ createUserOp ? "添 加" : '修 改'}}</span>
        <el-button type="danger" @click="close">
          <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
          Close
        </el-button>
      </div>
    </template>
    <el-form label-position="right" label-width="150px" :model="keyInfo" :rules="rules" ref="ruleFormRef">
      <el-form-item label="来源账户" prop="accountId">
        <el-input v-model="keyInfo.accountId" placeholder="来源账户"></el-input>
      </el-form-item>
      <el-form-item label="OpenaiKey" prop="openaiKey">
        <el-input v-model="keyInfo.openaiKey" placeholder="sk-"></el-input>
      </el-form-item>
      <el-form-item label="过期时间" prop="expiredTime">
        <el-date-picker
            v-model="keyInfo.expiredTime"
            type="date"
            placeholder="设置过期时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD 00:00:00"
            :disabled-date="disabledDate"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="keyInfo.status" >
          <el-option label="正常" :value="1"/>
          <el-option label="关闭" :value="2"/>
          <el-option label="过期关闭" :value="3"/>
        </el-select>
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
import {CircleCloseFilled, InfoFilled} from '@element-plus/icons-vue'
import {openaiPageList, openaiCreate, openaiModify, openaiDelete} from '@/api'

const ruleFormRef = ref<FormInstance>()
const tableData = ref([])
const search_text = ref('')

const showUserDialog = ref(false)
const createUserOp = ref(false)

const disabledDate = (time: Date) => {
  return time.getTime() < Date.now()
}

const page = reactive({
  currentPage: 1,
  pageSize: 50,
  total: 0
})

interface OpenAIKeyInfo {
  id: number | null
  accountId: string
  openaiKey: string
  totalUseMoney: number
  totalUseToken: number
  status: number
  createTime: string
  expiredTime: string
}

const rules = reactive<FormRules>({
  nickname: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 20, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  username: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 20, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  passwordHash: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 20, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  avatar: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
  ],
})

const keyInfo = reactive<OpenAIKeyInfo>({
  id: null,
  accountId: '',
  openaiKey: '',
  totalUseMoney: -1,
  totalUseToken: -1,
  status: 1,
  createTime: '',
  expiredTime: '',
})

const openAddDialog = () => {
  showUserDialog.value = true
  createUserOp.value = true
  resetUserInfo()
}

const openEditDialog = (row: OpenAIKeyInfo) => {
  showUserDialog.value = true
  createUserOp.value = false
  keyInfo.id = row.id
  keyInfo.accountId = row.accountId
  keyInfo.openaiKey = row.openaiKey
  keyInfo.totalUseMoney = row.totalUseMoney
  keyInfo.totalUseToken = row.totalUseToken
  keyInfo.status = row.status
  keyInfo.createTime = row.createTime
  keyInfo.expiredTime = row.expiredTime
}

const resetUserInfo = () => {
  keyInfo.id = null
  keyInfo.accountId = ''
  keyInfo.openaiKey = ''
  keyInfo.expiredTime = ''
  keyInfo.status = 1
}

onMounted(() => {
  queryAllEvent()
})

const confirmDelete = (id: number) => {
  openaiDelete(id).then(response => {
    if (response.status === 'Success') {
      ElMessage.success('删除成功')
      queryAllEvent()
    } else {
      ElMessage.error(response.message as string)
    }
  }).catch(error => {
    console.info(error)
    ElMessage.error(error.message)
  })
}

const addOrModifyUser = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      let opfun = null
      if (createUserOp.value) {
        opfun = openaiCreate(keyInfo)
      } else {
        opfun = openaiModify(keyInfo)
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
  openaiPageList(page.currentPage, page.pageSize).then(response => {
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
