<template>
  <div>
    <div class="line"></div>
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item
        index="1"
        @click="toList"
      >用户中心</el-menu-item>
      <el-menu-item
        index="2"
        @click="toNews"
      >新闻管理</el-menu-item>
      <el-menu-item
        index="3"
        @click="toMember"
      >成员管理</el-menu-item>
      <!-- <el-menu-item index="3"><a
          href="https://www.ele.me"
          target="_blank"
        >订单管理</a></el-menu-item> -->
      <el-menu-item
        index="4"
        @click="toCulture"
      >文化照片</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: '1',
      activeIndex2: '1'
    };
  },
  methods: {
    handleSelect (key, keyPath) {
      ////console.log(key, keyPath);
    },
    toNews () {
      this.$router.push('/user/news')
    },
    toList () {
      this.$router.push('/user/list')
    },
    toMember () {
      this.$router.push('/user/member')
    },
    toCulture () {
      this.$router.push('/user/culture')
    }
  }
}
</script>

<style>
</style>
