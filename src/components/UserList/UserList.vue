<template>
  <div>

    <div class='table-wrapper'>
      <el-table
        v-if="showTable"
        :data="tableData"
        style="width: 100%"
        stripe
      >

        <el-table-column
          label="权限"
          min-width="30%"
        >
          <template slot-scope="scope">

            {{ computeLimit(scope.row.userLimit) }}
          </template>
        </el-table-column>
        <el-table-column
          label="姓名"
          min-width="30%"
        >
          <template slot-scope="scope">
            <div
              slot="reference"
              class="name-wrapper"
            >
              <el-tag size="medium">{{ scope.row.userName }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="邮箱"
          min-width="80%"
        >
          <template slot-scope="scope">
            <div slot="reference">
              <el-tag size="medium">{{ scope.row.userEmail }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              :disabled="computeDisabled(scope.row)"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              :disabled="disabled"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button
        class='create-button'
        type='info'
        @click='handleCreate'
        :disabled="disabled"
      >新建用户</el-button>
    </div>

    <el-dialog
      title="用户信息"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form">
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.userName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-show="showMail"
          label="邮箱"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.userEmail"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="form.userPassword"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="cancelForm">取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import Vue from 'vue'
// import this.axios from 'this.axios'
import { mapGetters } from 'vuex';
import { confirmDelete } from '../../utils/util'
export default {
  data () {
    return {
      showTable: true,
      showMail: true,
      userEmail: '',
      // 暂时写这个limit，回来用vuex管理
      limit: 1,
      tableData: [],
      dialogFormVisible: false,
      form: {
        userName: '',
        userLimit: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        userEmail: '',
        userPassword: ''
      },
      formLabelWidth: '120px'
    }
  },
  computed: {
    disabled () {
      return +this.userLimit === 0
    },
    ...mapGetters([
      'userLimit',
      'address'
    ])
  },
  methods: {
    computeDisabled (row) {
      ////console.log(row.userEmail)
      ////console.log(this.address)
      if ((row.userEmail === this.address) || +this.userLimit === 1) {
        return false
      }
      return true
      // return false
    },
    handleEdit (index, row) {
      this.showMail = false
      this.userEmail = row.userEmail
      // ////console.log(index, row);
      // ////console.log(this.address)
      this.dialogFormVisible = true
    },

    handleDelete (index, row) {
      // 超级管理员不删除自己
      if (this.userLimit && row.userLimit) {
        this.$alert('您是超级管理员，不应删除', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      this.confirmDelete().then(() => this.axios.post('/api/user/delete', row).then(res => {
        ////console.log(res)
        this._getData()
        // this.$router.go(0)
        // this.$router.replace({ path: '/user/list' })
      })).catch(() => this.$message({
        type: 'info',
        message: '已取消删除'
      }))
    },

    handleCreate () {
      this.dialogFormVisible = true
    },

    computeLimit (lim) {
      return (+lim) ? '管理员' : '普通用户'
    },

    submitForm () {
      this.dialogFormVisible = false
      // ////console.log(this.form)
      if (!this.form.userEmail) {
        this.form.userEmail = this.userEmail
        this.axios.post('/api/user/update', this.form).then(res => {
          ////console.log(res)
          // if (res.data.errno === 0) {
          this._getData()
          this.form.userEmail = this.form.userName = ''
          // } else {
          //   this.$message({
          //     type: 'info',
          //     message: '提交失败'
          //   })
          // }
          // this.form.userEmail = this.form.userName = ''  在这里是同步操作！！！而请求异步操作！！
          // 导致了那样没发出去就使它的值为 "
        })
      } else {
        this.axios.post('/api/user/add', this.form).then(res => {
          ////console.log(res)
          this._getData()
          this.form.userEmail = this.form.userName = ''
          this.showMail = true
        })
      }
      // ////console.log(this.form)
      // this.axios.post('/api/user/update', this.form).then(res => ////console.log(res))

      // this.form.userEmail = this.form.userName = ''  在这里是同步操作！！！而请求异步操作！！
      // 导致了那样没发出去就使它的值为 ""
    },

    cancelForm () {
      this.dialogFormVisible = false
      this.form.name = this.handleAddress = ''
    },
    confirmDelete () {
      return this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    _getData () {
      this.axios.get('/api/user/list').then((res) => {
        ////console.log(res.data.user_message)
        ////console.log('login以后的list界面的response：', res)
        this.tableData = res.data.user_message.slice()
      })
    }
  },

  created () {
    this._getData()
  },
}
</script>

<style>
.table-wrapper {
  position: relative;
}
.create-button {
  position: absolute;
  top: 0.3rem;
  right: 0.3rem;
}
</style>
