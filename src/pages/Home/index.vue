<template>
  <div>
    <!-- 3.使用三级联动全局组件 - 这个组件是全局组件，因此不需要引入和注册（在入口文件引入&注册了） -->
    <TypeNav />
    <!-- 3.使用其他组件 -->
    <ListContainer />
    <Recommend />
    <Rank />
    <Like />
    <!-- 因为floorList返回的是两个对象，这两个对象（floor模块）是要遍历出来的。 -->
    <!-- 所以不能在floor组件中接受floorList数据，要在遍历floor组件的（父）组件上接收并遍历floorList。 -->
    <!-- 用prop方法动态（：）传数据 -->
    <Floor v-for="floor in floorList"
           :key="floor.id"
           :list="floor" />
    <Brand />
  </div>
</template>

<script>
//1.引入其余组件（非全局组件）
import ListContainer from '@/pages/Home/ListContainer';
import Recommend from '@/pages/Home/Recommend';
import Rank from '@/pages/Home/Rank';
import Like from '@/pages/Home/Like';
import Floor from '@/pages/Home/Floor';
import Brand from '@/pages/Home/Brand';
import { mapState } from 'vuex';

export default {
  name: '',
  data() {
    return {};
  },
  //2.注册组件
  components: {
    ListContainer,
    Recommend,
    Rank,
    Like,
    Floor,
    Brand
  },
  mounted() {
    //1. 派发action，获取floor组件的数据
    this.$store.dispatch('FloorList');
  },
  computed: {
    //2. 获取数据后，保存到这个组件下面
    ...mapState({
      floorList: (state) => state.home.floorList
    })
  }
};
</script>

<style scpoed>
</style>

// 组建通信方式？【面试频率极高】
// 1.props：父给子
// 2.自定义事件：@on @emit 可以实现子给父
// 3.全局时间总线：$bus  全能
// 4.pubsub-js：vue几乎不用  全能
// 5.插槽
// 6.vuex