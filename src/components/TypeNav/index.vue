<template>
  <div class="type-nav">
    <div class="container">
      <!-- mouseleave：事件委派|事件委托（委托给父元素） -->
      <div @mouseleave="leaveSort" @mouseenter="enterSort">
        <h2 class="all">全部商品分类</h2>
        <!-- 三级联动 -->
        <transition name="sort">
          <div class="sort" v-show="showSort">
            <!-- click：事件委派|事件委托（委托给父元素） -->
            <div class="all-sort-list2" @click="goSearch">
              <!-- :class: 鼠标移到哪个标题，哪个标题的类名叫cur - 用js实现hover效果 -->
              <!-- 一级分类 -->
              <div
                class="item"
                v-for="(c1, index) in categoryList.slice(0, 16)"
                :key="c1.categoryId"
                :class="{ cur: currentIndex == index }"
              >
                <h3 @mouseenter="changeIndex(index)">
                  <a
                    :data-categoryName="c1.categoryName"
                    :data-category1Id="c1.categoryId"
                    >{{ c1.categoryName }}</a
                  >
                </h3>
                <!-- 用js实现hover效果 -->
                <div
                  class="item-list clearfix"
                  :style="{ display: currentIndex == index ? 'block' : 'none' }"
                >
                  <!-- 二级分类 -->
                  <div
                    class="subitem"
                    v-for="c2 in c1.categoryChild"
                    :key="c2.categoryId"
                  >
                    <dl class="fore">
                      <dt>
                        <a
                          :data-categoryName="c2.categoryName"
                          :data-category2Id="c2.categoryId"
                          >{{ c2.categoryName }}</a
                        >
                      </dt>
                      <dd>
                        <!-- 三级分类 -->
                        <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                          <a
                            :data-categoryName="c3.categoryName"
                            :data-category3Id="c3.categoryId"
                            >{{ c3.categoryName }}</a
                          >
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import throttle from 'lodash/throttle';

export default {
  name: 'TypeNav',
  //组件挂载完毕：可以向服务器发请求
  data() {
    return {
      //存储用户鼠标移到哪个一级标题
      currentIndex: -1,
      showSort: true
    };
  },
  mounted() {
    if (this.$route.path != '/home') {
      this.showSort = false;
    }
  },
  computed: {
    ...mapState({
      //右侧需要一个函数，当使用计算属性时，右侧函数会立即执行一次
      //输入一个参数state，其实即为大仓库中的数据（state）
      categoryList: (state) => state.home.categoryList
    })
  },
  methods: {
    //修改currentIndex
    // changeIndex(index) {
    //   //index：鼠标移到哪个一级标题(每一个标题都有index)
    //   this.currentIndex = index;
    // },

    //节流 - lodash的throttle函数
    changeIndex: throttle(function (index) {
      this.currentIndex = index;
    }, 50),
    leaveSort() {
      //currentIndex值改为初始值
      this.currentIndex = -1;
      //鼠标离开时隐藏列表(home除外)
      if (this.$route.path != '/home') {
        this.showSort = false;
      }
    },
    goSearch(event) {
      //触发了哪个元素（点击事件，所以相当于‘点击了哪个元素’）
      let element = event.target;
      //节点的dataset属性里有自定义属性与属性值 & 解构赋值
      let { categoryname, category1id, category2id, category3id } =
        element.dataset;
      //如果是a标签
      if (categoryname) {
        let location = { name: 'search' };
        let query = { categoryName: categoryname };
        //如果是一级a标签
        if (category1id) {
          query.category1Id = category1id;
        } else if (category2id) {
          query.category2Id = category2id;
        } else {
          query.category3Id = category3id;
        }
        //判断有无params参数（keyword）
        if (this.$route.params) {
          location.params = this.$route.params;
          //整理参数，将两个对象合并为一个 | 动态给location配置对象添加query属性
          location.query = query;
          //路由跳转
          this.$router.push(location);
        }
      }
    },
    enterSort() {
      //鼠标进入时显示列表(home除外)(这个判断可有可无)
      if (this.$route.path != '/home') {
        this.showSort = true;
      }
    }
  }
};
</script>

<style scpoed lang='less'>
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }

          // &在less中表示上一级
          // &:hover {
          //   .item-list {
          //     display: block;
          //   }
          // }
        }

        // .item:hover {
        //   background: skyblue;
        // }
        .cur {
          background: skyblue;
        }
      }
    }

    //过渡动画的样式
    .sort-enter {
      display: none;
    }
    .sort-enter-to {
      display: block;
    }
    .sort-enter-active {
      transition: all 0.5s linear;
    }
  }
}
</style>