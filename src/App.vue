<template>
  <div>
    <Header></Header>
    <!-- 路由组件出口地方 -->
    <router-view></router-view>
    <!-- 利用路由元信息meta，控制显示场景 -->
    <Footer v-show="$route.meta.show"></Footer>
  </div>
</template>

<script>
// 引入
import Header from './components/Header';
import Footer from './components/Footer';

export default {
  name: '',
  components: {
    Header,
    Footer
  },
  mounted() {
    //通知Vuex发请求，获取数据，存储于仓库当中 | 派发一次action，就可以获取三级列表的数据 | App父组件全程只会挂载一次
    this.$store.dispatch('categoryList');
  }
};
</script>

<style scpoed>
</style>
