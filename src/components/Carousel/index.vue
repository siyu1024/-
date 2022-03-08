// 全局组件，只需要注册一次 - 入口文件

<template>
  <div class="swiper-container" id="floor1Swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="carousel in list" :key="carousel.id">
        <img :src="carousel.imgUrl" />
      </div>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>

    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
//引入swiper
import Swiper from 'swiper';

export default {
  name: 'Carousel',
  //父级（floor）传数据，动态传
  props: ['list'],
  watch: {
    //监听list（原本的bannerList和list.carousel，在这里都叫list）的变化，[]->[sth]
    list: {
      //不管数据有没有变化，上来就立即监听
      immediate: true,
      handler(newValue, oldValue) {
        //为什么用nextTick？因为只能监听到数据有了，但是v-for还没有渲染
        this.$nextTick(() => {
          //当进行nextTick的时候，服务器的数据回来了，v-for执行完了，结构都有了
          // (相当于第一次DOM渲染的时候，不执行nextTick，再一次渲染的时候执行这个代码)
          var mySwiper = new Swiper('.swiper-container', {
            loop: true, // 循环模式选项

            // 如果需要分页器
            pagination: {
              el: '.swiper-pagination',
              clickable: true
            },

            // 如果需要前进后退按钮
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev'
            }
          });
        });
      }
    }
  }
};
</script>

<style scpoed>
</style>