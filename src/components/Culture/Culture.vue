<template>
  <div>

    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="图片区块" class="form_pic">
        <el-select v-model="form.region" placeholder="请选择图片区块">
          <el-option label="工作环境" value="work"></el-option>
          <el-option label="团队照片" value="team"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择年份" v-show='form.region === "team"'>
        <el-input v-model="form.year" placeholder="请输入标准格式年份，如：2018"></el-input>
      </el-form-item>
      <div class="file_wrapper">
        <input ref="input_file" name="file" type="file" />
      </div>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
    </el-form>

    <div v-if="imgs">
      <div class='img_button_wrapper' v-for="img in imgs" :key="img.imgId">
        <div class="img_button">

          <img :src="img.imgUrl" width="100" height="100" />
          <div class="delete_button">
            <el-button type="danger" @click="deleteImg(img.imgId)">刪除图片</el-button>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
export default {
  data () {
    return {
      imgs: [],
      imgUrl: '',
      form: {
        name: '',
        region: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        year: ''
      },
      dialogImageUrl: '',
      dialogVisible: false,
    };
  },
  watch: {
    form: function (newVal) {
      ////console.log(newVal)
    }
  },
  methods: {
    handleRemove (file, fileList) {
      ////console.log(file, fileList);
    },
    handlePreview (file) {
      ////console.log(file);
    },
    onSubmit () {
      let form = this.form
      ////console.log('submit!', this.form.region)
      let file = this.$refs.input_file.files[0]
      ////console.log(file)
      let param = {}
      param = new FormData(); //创建form对象
      param.append('file', file);//通过append向form对象添加数据
      if (form.region === 'team') {
        param.append('year', form.year)
      } else {
        param.append('year', '')
      }
      param.append('flag', form.region)
      let config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };  //添加请求头
      ////console.log(param.get('file'))
      // ////console.log(param.get('flag'))
      // ////console.log(param.get('year'))
      this.axios.post('/api/upload', param, config)
        .then(response => {
          ////console.log(response);
          this._getData()
        })
    },
    handleRemove (file, fileList) {
      ////console.log(file, fileList);
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    deleteImg (imgId) {
      this.axios.post('/api/culture/delete', { imgId: imgId }).then(res => {
        this.imgs.length != 1 ? this._getData() : location.reload()
      })
    },
    _getData () {
      this.axios.post('/api/culture/imgs').then(res => {
        this.imgs = res.data
        ////console.log(this.imgs)
      })
    }
  },
  created () {
    this._getData()
  },
}
</script>

<style>
.upload-demo {
  width: 40%;
  padding: 3%;
}
.img_button_wrapper {
  display: inline-block;
  padding: 20px;
}
.img_button {
  display: flex;
  flex-direction: column;
}
.delete_button {
  box-sizing: border-box;
  padding: 10px;
}
.file_wrapper {
  padding: 10px;
  display: inline-block;
}
.form_pic {
  padding-top: 20px;
}
</style>
