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
          <el-table-column prop="category" label="分组" width="100" />
          <el-table-column prop="word" label="敏感内容"/>
          <el-table-column prop="createdAt" label="创建时间" width="200"/>
          <el-table-column prop="updatedAt" label="更新时间" width="200"/>
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
    <el-form label-position="right" label-width="150px" :model="sensitiveInfo" :rules="rules" ref="ruleFormRef">
      <el-form-item label="分组" prop="category">
        <el-input v-model="sensitiveInfo.category" placeholder="分组名称"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="word">
        <el-input v-model="sensitiveInfo.word" placeholder="敏感内容"></el-input>
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
import { CircleCloseFilled, InfoFilled } from '@element-plus/icons-vue'
import {querySensitiveWordsPage, sensitiveWordCreate, sensitiveWordModify, sensitiveWordDelete} from '@/api'

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
  category: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 2, max: 20, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  word: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 2, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
})

interface SensitiveWordInfo {
  id: number | null
  category: string
  word: string
}

const sensitiveInfo = reactive<SensitiveWordInfo>({
  id: null,
  category: '',
  word: '',
})

const openAddDialog = () => {
  showUserDialog.value = true
  createUserOp.value = true
  resetUserInfo()
}

const openEditDialog = (row: SensitiveWordInfo) => {
  showUserDialog.value = true
  createUserOp.value = false
  sensitiveInfo.id = row.id
  sensitiveInfo.category = row.category
  sensitiveInfo.word = row.word
}

const resetUserInfo = () => {
  sensitiveInfo.id = null
  sensitiveInfo.category = ''
  sensitiveInfo.word = ''
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

const confirmDelete = (id: number) => {
  sensitiveWordDelete(id).then(response => {
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
        opfun = sensitiveWordCreate(sensitiveInfo)
      } else {
        opfun = sensitiveWordModify(sensitiveInfo)
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

  querySensitiveWordsPage(page.currentPage, page.pageSize, search_text.value).then(response => {
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
