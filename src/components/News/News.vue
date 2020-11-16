<template>
  <div>
    <el-input class="input-sea" v-model="searchTitle" placeholder="请输入搜索的标题"></el-input>
    <el-button type='info' @click="search(searchTitle)">确认搜索</el-button>

    <div class='table-wrapper'>
      <el-table :data="tableData" style="width: 100%" stripe>

        <el-table-column label="标题" min-width="40%">
          <template slot-scope="scope">
            {{(scope.row.newsTitle) }}
          </template>
        </el-table-column>
        <el-table-column label="类型" min-width="40%">
          <template slot-scope="scope">
            {{(scope.row.newsType) }}
          </template>
        </el-table-column>
        <el-table-column label="内容" min-width="40%">
          <template slot-scope="scope">
            <div slot="reference" class="cntent-wrapper">
              <el-tag size="medium">{{ scope.row.newsContent }}</el-tag>
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
      <div class='create-button'>
        <el-button type='info' @click='handleCreate'>新建新闻</el-button>
      </div>
    </div>

    <el-dialog width='80%' title="新闻信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="新闻标题" :label-width="formLabelWidth">
          <el-input v-model="form.newsTitle" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新闻类型" :label-width="formLabelWidth">
          <el-input v-model="form.newsType" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新闻内容" :label-width="formLabelWidth">
          <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="form.newsContent">
          </el-input>
        </el-form-item>
        <!-- 这是新增/修改新闻时上传新闻对应图片的input，以后会用到，可以去掉注释看一看 -->
        <!-- <el-form-item label="头像图片" :label-width="formLabelWidth">
          <input ref="input_file" name="file" type="file" />
        </el-form-item> -->
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
      address: '',
      handleAddress: '',
      limit: 1,
      tableData: [],
      searchTitle: '',
      dialogFormVisible: false,
      form: {
        newsContent: '',
        newsTitle: '',
        newsType: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      formLabelWidth: '120px'
    }
  },
  methods: {

    handleEdit (index, row) {
      this.handleAddress = row.newsId
      this.dialogFormVisible = true
    },

    handleDelete (index, row) {
      this.confirmDelete().then(() => {
        this.axios.post('/api/news/delete', row).then(res => {
          this._getData()
        })
      }).catch(() => this.$message({
        type: 'info',
        message: '已取消删除'
      }))
      this.handleAddress = row.address
    },

    handleCreate () {
      this.handleAddress = ''
      this.dialogFormVisible = true
    },

    submitForm () {
      let form = Object.assign({}, this.form)
      // 后台news接口写好了之后要用param
      // let newsImg = this.$refs.input_file.files[0]
      // let param = new FormData(); //创建form对象
      // param.append('newsImg', newsImg);//通过append向form对象添加数据
      form.newsId = this.handleAddress;

      let config = {
        headers: { 'Content-Type': 'application/json' }//到时候news的后端接口写好了，这里需要变成multipart/form-data,到时候注意一下
      };  //添加请求头

      if (this.handleAddress) {//handleAddress有值了，所以是修改(update)
        this.emptyProperty(this.form, /news/);
        // 后台news接口写好了之后要用param
        // Object.keys(form).forEach(function (key) {
        //   param.append(key.toString(), form[key].toString())
        // })
        this.axios.post('/api/news/update', form, config).then(res => {
          this.handleAddress = ''
          this.emptyProperty(this.form, /news/)
          this._getData()
        })

      } else {//handleAddress为空，所以是新增
        // 后台news接口写好了之后要用param
        // Object.keys(form).forEach(function (key) {
        //   param.append(key.toString(), form[key].toString())
        // })
        this.axios.post('/api/news/add', form, config).then(res => {
          //console.log(res)
          this.emptyProperty(this.form, /news/)
          this._getData()
        })
      }
      this.handleAddress = ''
      this.dialogFormVisible = false
    },
    cancelForm () {
      this.dialogFormVisible = false
      this.form.newsTextarea = this.form.newsTitle = this.handleAddress = ''
    },
    confirmDelete () {
      return this.$confirm('删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    search (title) {
      this.axios.post('/api/news/search', { newsTitle: title }).then(res => {
        this.tableData = []
        this.tableData = res.data.news.slice()//slice无参数代表浅拷贝
      })
    },
    _getData () {
      this.axios.get('/api/news/list').then((res) => {
        this.tableData = res.data.news.slice()//浅拷贝
      })
    },
    emptyProperty (obj, keyReg) {
      Object.keys(obj).forEach(function (key) {
        if (keyReg.test(key)) {
          obj[key] = ''
        }
      });
    },
  },
  created () {
    this._getData()
  }
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
.input-sea {
  display: inline;
  width: 40px;
}
</style>
