<template>
  <div>
    <div>
      <navigation></navigation>
      <!-- <user-list></user-list> -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import navigation from '../components/Navigation/Navigation'
import headerUser from '../components/Header/Header'
import userList from '../components/UserList/UserList'
export default {
  components: {
    navigation,
    headerUser,
    userList
  }
}
</script>

<style>
</style>
