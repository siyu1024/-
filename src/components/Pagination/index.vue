<template>
  <div class="pagination">
    <!-- css的cursor:not-allowed，只是显示为不能点击，但其实能点击。button的属性disable才能真实操作能否点击。 -->
    <button :disabled="pageNo == 1"
            @click="$emit('getClickedNo',pageNo-1)">上一页</button>

    <button v-if="startAndEndPage.start >= 2"
            :class="{active: pageNo == 1}"
            @click="$emit('getClickedNo',1)">1</button>
    <button v-if="startAndEndPage.start >= 3"
            disabled=true>...</button>

    <!-- v-for不仅可以array，也可以object，number，string，Iterable -->
    <!-- 代码提示：‘should not mix 'v-for' with 'v-if'’，所以用了v-show -->
    <button v-for="(page,index) in startAndEndPage.end"
            :key="index"
            v-show="page >= startAndEndPage.start"
            :class="{active: pageNo == page}"
            @click="$emit('getClickedNo',page)">{{page}}</button>

    <!-- 跟上面的startAndEndPage.start >= 2 >= 3 对称的计算方式 -->
    <button v-if="startAndEndPage.end <= totalPage - 2"
            disabled=true>...</button>
    <button v-if="startAndEndPage.end <= totalPage - 1"
            :class="{active: pageNo == totalPage}"
            @click="$emit('getClickedNo',totalPage)">{{totalPage}}</button>

    <button :disabled="pageNo == totalPage"
            @click="$emit('getClickedNo',pageNo+1)">下一页</button>
    <button style="margin-left:30px">共 {{total}} 条</button>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: ['pageNo', 'pageSize', 'total', 'continues'],
  computed: {
    //一共多少页
    totalPage() {
      //向上取整（向下应该是floor？）
      return Math.ceil(this.total / this.pageSize);
    },
    //连续页码的起始数字和结束数字
    //分页器的重点及难点：计算连续页码的start和end（下面的代码） + html中的显示
    startAndEndPage() {
      //【技巧】解构：这三个变量下面会常用，如果不解构的话，前面一直得加上'this.',所以先结构。
      const { continues, pageNo, totalPage } = this;
      let start = 0;
      let end = 0;
      //判断总页码数小不小于连续页码数
      if (continues >= totalPage) {
        start = 1;
        end = totalPage;
      } else {
        //取整，也可以Math.floor()
        //continues可能是5或7，所以不要写死（不要直接写数字）
        start = pageNo - parseInt(continues / 2);
        end = pageNo + parseInt(continues / 2);
      }
      //下面两个if，纠正特殊情况
      //也可以在上面的判断的else中嵌入下面两个if，但是这样的话逻辑会更复杂。所以单独写出来做判断，逻辑会更清晰，而且内存消耗也更少 - 只有符合条件的时候才进行判断。
      if (start < 1) {
        start = 1;
        end = continues;
      }
      if (end > totalPage) {
        end = totalPage;
        start = totalPage - continues + 1;
      }
      //不要忘记这一步！computed计算属性的函数，计算之后最后要返回一个值
      return { start, end };
    }
  }
};
</script>

<style scpoed lang="less">
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      // cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style>
