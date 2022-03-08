<template>
  <div class="spec-preview">
    <img :src="selectedImg.imgUrl" />
    <!-- event是放事件的地方 -->
    <div class="event"
         @mousemove="handler"></div>
    <!-- 加了放大镜效果后的那个大图 -->
    <div class="big">
      <img :src="selectedImg.imgUrl"
           ref="big" />
    </div>
    <!-- 绿色蒙版，也就是以鼠标为中心的正方形蒙版 -->
    <div class="mask"
         ref="mask"></div>
  </div>
</template>

<script>
export default {
  name: 'Zoom',
  props: ['skuImageList'],
  //响应式数据 - 如果一个值，随着点击等事件发生变化，就设置为响应式数据。
  data() {
    return {
      currentIndex: 0
    };
  },
  computed: {
    selectedImg() {
      // 防止报错。空数组的第0项可能是undefined。
      //刚开始自动active第一张照片，随后点击哪个就修改响应式数据（data），从而修改被选中的照片，重新渲染页面。
      return this.skuImageList[this.currentIndex] || {};
    }
  },
  methods: {
    handler(event) {
      let mask = this.$refs.mask;
      let big = this.$refs.big;

      let left = event.offsetX - mask.offsetWidth / 2;
      let top = event.offsetY - mask.offsetHeight / 2;
      //约束范围
      if (left <= 0) left = 0;
      //图片和蒙版是两倍关系
      if (left >= mask.offsetWidth) left = mask.offsetWidth;
      if (top <= 0) top = 0;
      if (top >= mask.offsetHeight) top = mask.offsetHeight;
      //1.蒙版
      //修改元素的left，top值
      mask.style.left = left + 'px';
      mask.style.top = top + 'px';

      //2.放大的大图
      //大图与原图是两倍关系（请参考css）
      big.style.left = -2 * left + 'px';
      big.style.top = -2 * top + 'px';
    }
  },
  mounted() {
    //全局时间总线 - 获取兄弟组件传递过来的索引值
    this.$bus.$on('getIndex', (index) => {
      this.currentIndex = index;
    });
  }
};
</script>

<style lang="less">
.spec-preview {
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px solid #ccc;

  img {
    width: 100%;
    height: 100%;
  }

  .event {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 998;
  }

  .mask {
    width: 50%;
    height: 50%;
    background-color: rgba(0, 255, 0, 0.3);
    position: absolute;
    left: 0;
    top: 0;
    display: none;
  }

  .big {
    width: 100%;
    height: 100%;
    position: absolute;
    top: -1px;
    left: 100%;
    border: 1px solid #aaa;
    overflow: hidden;
    z-index: 998;
    display: none;
    background: white;

    img {
      width: 200%;
      max-width: 200%;
      height: 200%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .event:hover ~ .mask,
  .event:hover ~ .big {
    display: block;
  }
}
</style>