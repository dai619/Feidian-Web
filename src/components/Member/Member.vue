
<template>
  <div>
    <div class='table-wrapper'>
      <el-table :data="tableData" style="width: 100%" stripe>

        <el-table-column label="姓名" min-width="40%">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.memberName }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="memberImg" label="图片" min-width="20%">
          <!-- 图片的显示 -->
          <template slot-scope="scope">
            <!-- <el-image :src="scope.row.memberImg"></el-image> -->
            <img :src="scope.row.memberImg" width='40' height="40" />
            <!-- <img
              src="../../assets/img/avatar-3.png"
              alt=""
            > -->
          </template>
        </el-table-column>
        <el-table-column label="个人简介" min-width="40%">
          <template slot-scope="scope">
            <!-- <div slot="reference"> -->
            {{(scope.row.memberIntro) }}
            <!-- </div> -->
          </template>
        </el-table-column>
        <el-table-column label="加入时间" min-width="40%">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium">{{ scope.row.memberYear }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <!-- <el-button @click="dialogFormVisible = true">编辑</el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <el-button class='create-button' type='info' @click='handleCreate'>新建成员</el-button>
    </div>

    <el-dialog width='60%' title="成员信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item v-if="!chosenId" label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.memberName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="个人简介" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="form.memberIntro">
          </el-input>
        </el-form-item>
        <el-form-item v-if="!chosenId" label="进入年份" :label-width="formLabelWidth">
          <div class="container">
            <div class="block">
              <el-date-picker v-model="form.memberYear" type="year" placeholder="选择年">
              </el-date-picker>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="头像图片" :label-width="formLabelWidth">
          <input ref="input_file" name="file" type="file" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelForm">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
export default {
  data () {
    return {
      chosenId: '',
      limit: 1,
      tableData: [
        //   {
        //   memberIntro: 'intro',
        //   memberYear: '1111',
        //   memberImg: require("../../assets/img/avatar-3.png"),
        //   memberName: 'dewfdwe',
        //   memberId: '1'
        // }, {
        //   memberIntro: 'intro',
        //   memberYear: '1111',
        //   memberImg: require("../../assets/img/avatar-2.jpg"),
        //   memberName: 'name',
        //   memberId: '2'
        // }, {
        //   memberIntro: 'intro',
        //   memberYear: '1111',
        //   memberImg: require("../../assets/img/wechat.jpg"),
        //   memberName: 'name',
        //   memberId: '3'
        // }
      ],
      dialogFormVisible: false,
      form: {
        memberName: '',
        memberImg: '',
        memberYear: '',
        memberId: '',
        memberIntro: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        newsTextarea: ''
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    handleEdit (index, row) {
      this.chosenId = row.memberId
      ////console.log(index, row);
      ////console.log(index, row.memberId)
      this.dialogFormVisible = true
      // ////console.log(this.form.title, this.form.limit)
    },
    handleDelete (index, row) {
      ////console.log(row)
      this.confirmDelete().then(() => {
        this.axios.post('/api/member/delete', row).then(res => {
          ////console.log(res)
          this._getData()
        })
      }
      ).catch(() => this.$message({
        type: 'info',
        message: '已取消删除'
      }))
      ////console.log(index, row.title);
      this.chosenId = row.address
    },
    handleCreate () {
      this.chosenId = ''
      this.dialogFormVisible = true
    },
    submitForm () {
      let form = Object.assign({}, this.form)
      form.memberId = this.chosenId

      let memberImg = this.$refs.input_file.files[0]
      ////console.log(memberImg)
      let param = new FormData(); //创建form对象
      param.append('memberImg', memberImg);//通过append向form对象添加数据

      let config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };  //添加请求头
      ////console.log(param.get('memberImg'))

      if (this.chosenId) {
        // ////console.log(this.form)
        this.emptyProperty(this.form, /member/)

        Object.keys(form).forEach(function (key) {
          param.append(key.toString(), form[key].toString())
        })
        ////console.log('MEMEBE', param.get('memberId'))
        // ////console.log(this.form)
        // ////console.log('编辑')

        ////console.log(memberImg)
        ////console.log(this.form)
        ////console.log('编辑')

        // let file = this.$refs.input_file.files[0]
        ////console.log(memberImg)

        this.axios.post('/api/member/update', param, config).then(res => {
          ////console.log(res)
          this.chosenId = ''
          this.emptyProperty(this.form, /member/)
          this._getData()
        })

      } else {
        form.memberYear = form.memberYear ? form.memberYear.getFullYear() : ''

        // let file = this.$refs.input_file.files[0]
        Object.keys(form).forEach(function (key) {
          param.append(key.toString(), form[key].toString())
        })
        ////console.log('MEMEBE', param.get('memberId'))
        ////console.log('MEMEBE', param.get('memberName'))
        ////console.log('MEMEBE', param.get('memberIntro'))
        ////console.log('MEMEBE', param.get('memberYear'))
        ////console.log('MEMEBE', param.get('memberImg'))
        ////console.log(form)
        ////console.log(this.form)
        ////console.log('新建')
        this.axios.post('/api/member/add', param, config).then(res => {
          ////console.log(res)
          // this.chosenId = ''
          this.emptyProperty(this.form, /member/)
          this._getData()
        })
      }
      this.chosenId = ''
      this.dialogFormVisible = false
    },
    cancelForm () {
      this.dialogFormVisible = false
      this.chosenId = ''
    },
    confirmDelete () {
      return this.$confirm('删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    emptyProperty (obj, keyReg) {
      Object.keys(obj).forEach(function (key) {
        if (keyReg.test(key)) {
          obj[key] = ''
        }
      });
    },
    _getData () {
      this.axios.get('/api/member/list').then(res => {
        ////console.log(res)
        this.tableData = res.data.member.slice()
      })
    }
  },
  created () {
    this._getData()
  },
}
</script>

<style>
/* 这些所有的文件，里的都要用...来表示超出的，用那个方法 */
/* 黄轶的音乐app定义了 */

.table-wrapper {
  position: relative;
  overflow: hidden;
}
.create-button {
  position: absolute;
  top: 0.3rem;
  right: 0.3rem;
}
</style>

