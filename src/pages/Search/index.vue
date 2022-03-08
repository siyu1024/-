<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread - 面包屑，带x结构的-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <li class="with-x"
                v-if="searchParams.categoryName">
              {{ searchParams.categoryName
              }}<i @click="removeCategoryName">×</i>
            </li>
            <li class="with-x"
                v-if="searchParams.keyword">
              {{ searchParams.keyword }}<i @click="removeKeyword">×</i>
            </li>
            <li class="with-x"
                v-if="searchParams.trademark">
              {{ searchParams.trademark.split(':')[1]
              }}<i @click="removeTrademark">×</i>
            </li>
            <li class="with-x"
                v-for="(prop, index) in searchParams.props"
                :key="index">
              <!-- 时间可以带参数 -->
              <!-- 这里传的index其实是v-for的index。但是因为这个顺序和props里面的数组的下标一样，所以可以混用 -->
              {{ prop.split(':')[1] }}<i @click="removeAttr(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector-->
        <!-- 自定义事件 -->
        <SearchSelector @trademarkInfo="trademarkInfo"
                        @attrInfo="attrInfo" />

        <!--details-->
        <div class="details clearfix">
          <!-- 过滤器 -->
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <!-- active通过data中的order是1或2来判断 -->
                <li :class="{ active: isComposite }"
                    @click="changeOrder('1')">
                  <a href="javascript:;">综合<span v-show="isComposite"
                          class="iconfont"
                          :class="{ 'icon-up': isAsc, 'icon-down': !isAsc }"></span></a>
                </li>
                <li :class="{ active: !isComposite }"
                    @click="changeOrder('2')">
                  <a href="javascript:;">价格<span v-show="!isComposite"
                          class="iconfont"
                          :class="{ 'icon-up': isAsc, 'icon-down': !isAsc }"></span></a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 图片部分 - 商品详情 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5"
                  v-for="good in goodsList"
                  :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <!-- 路由跳转，带产品id - params参数 -->
                    <router-link :to="`/detail/${good.id}`">
                      <!-- 图片懒加载，是引入了vue-lazyload插件之后使用v-lazy标签 -->
                      <!-- 也可以自己设置自定义插件，使用自定义标签 -->
                      <img v-lazy="good.defaultImg" />
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ good.price }}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank"
                       href="item.html"
                       title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A
                    58 火爆预约中】">
                      {{ good.title }}</a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a href="success-cart.html"
                       target="_blank"
                       class="sui-btn btn-bordered btn-danger">加入购物车</a>
                    <a href="javascript:void(0);"
                       class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页 -->
          <!-- pageNo:当前页面  pageSize:一页显示多少条数据  total:一共有多少条数据  continues:连续的分页数量 -->
          <!-- 父给子（search-pagination）传数据：props -->
          <!-- 把点击的页码数通知给父亲：子传父，自定义事件(当前是父) -->
          <Pagination :pageNo='searchParams.pageNo'
                      :pageSize='searchParams.pageSize'
                      :total='total'
                      :continues='5'
                      @getClickedNo='getClickedNo' />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from './SearchSelector/SearchSelector';
import { mapGetters, mapState } from 'vuex';
import Pagination from '../../../../../静态页+静态组件/静态组件/Pagination.vue';

export default {
  name: 'Search',
  data() {
    return {
      //带给服务器的参数
      searchParams: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
        categoryName: '',
        keyword: '',
        //初始状态：综合-降序
        order: '1:desc',
        pageNo: 1,
        pageSize: 10,
        props: [],
        trademark: ''
      }
    };
  },
  components: {
    SearchSelector
  },
  beforeMount() {
    // this.searchParams.category1Id = this.$route.query.category1Id;
    // this.searchParams.category2Id = this.$route.query.category2Id;
    // this.searchParams.category3Id = this.$route.query.category3Id;
    // this.searchParams.keyword = this.$route.params.keyword;

    //ES6语法，合并对象:
    //发请求之前，整理参数
    Object.assign(this.searchParams, this.$route.query, this.$route.params);
  },
  mounted() {
    this.getData();
  },
  computed: {
    ...mapGetters(['goodsList']),
    isComposite() {
      return this.searchParams.order.indexOf('1') !== -1;
    },
    isAsc() {
      return this.searchParams.order.indexOf('asc') !== -1;
    },
    ...mapState({
      total: (state) => state.search.searchInfo.total
    })
  },
  methods: {
    //请求封装为函数，需要的时候调用

    //为什么调用getData的话页面会刷新（重新渲染？） - 我的理解
    //1.通过vuex发送请求，2.获取数据保存到store，3.store中的数据用mapGetters或mapState加载到这个文件中
    //4.上面的两个map都是computed，一旦computed或data的数据改变，页面会自动更新，5.所以页面会刷新（渲染）
    getData() {
      //因为params会变，所以用data，动态获取+传数据
      //不用给getData传参数，可以直接加载下面的函数中
      this.$store.dispatch('getSearchInfo', this.searchParams);
    },
    removeCategoryName() {
      //如果字段是undefined，不会带给服务器。但是''会带给服务器。所以undefined性能更好
      this.searchParams.categoryName = undefined;
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
      this.getData();
      //进行路由跳转，修改url - 编程式路由跳转

      //如何区分上面的getData和下面的push？（我的理解）
      //1.上面的getData是向服务器传递参数+发送请求，然后获取一些需要用到的数据。但只是拿到了数据而已，还没用
      //2.而下面的路由跳转，则是如何使用这个数据？？？？？？？？？？？？？？？？？？？？？
      //【虽然但是，通过navtype，从home调到search的时候并没有发请求，直接路由跳转了好像？？？？？】
      //【上面的这个疑问可以回答：从home跳转到search之后，search组件中通过watch监听路由的变化，如果路由变了，就重新发请求】
      //3.所以另一个结论：发请求和路由的先后顺序无所谓。（是因为异步操作吗？）
      if (this.$route.params) {
        this.$router.push({ name: 'search', params: this.$route.params });
      }
    },
    removeKeyword() {
      this.searchParams.keyword = undefined;
      this.getData();
      //通知兄弟组件Header清除关键字
      this.$bus.$emit('clear');
      //进行路由跳转，修改url - 编程式路由跳转
      if (this.$route.query) {
        this.$router.push({ name: 'search', query: this.$route.query });
      }
    },
    trademarkInfo(trademark) {
      //整理参数，有要求的样式
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`;
      this.getData();
    },
    removeTrademark() {
      this.searchParams.trademark = undefined;
      this.getData();
    },
    attrInfo(attr, attrValue) {
      //在子组件触发了事件，父组件通过参数的形式获取数据（点击了哪个属性）
      //按照要求，整理参数
      let prop = `${attr.attrId}:${attrValue}:${attr.attrName}`;
      //如果if的{}里只有一行代码，可以省略{}
      //数组去重 - 用indexOf 【面试常问，工作常用】
      if (this.searchParams.props.indexOf(prop) == -1) {
        this.searchParams.props.push(prop);
      }
      this.getData();
    },
    removeAttr(index) {
      //从数组中删除一个属性
      this.searchParams.props.splice(index, 1);
      this.getData();
    },
    changeOrder(num) {
      let currentNum = this.searchParams.order.split(':')[0];
      let currentSort = this.searchParams.order.split(':')[1];
      //如果点击的和原来的是一样的（原来是综合，点击了综合）
      let newOrder = '';
      if (num == currentNum) {
        newOrder = `${num}:${currentSort == 'desc' ? 'asc' : 'desc'}`;
      } else {
        //点击的和原来的不一样（原来是综合，点击的是价格）
        //`${num}:'desc'`：如果这么写的话，有bug。最终的值不是"2:desc",而是"2:'desc'"
        newOrder = `${num}:${'desc'}`;
      }
      //重置参数，发请求
      this.searchParams.order = newOrder;
      this.getData();
    },
    //自定义事件的回调函数 - 获取当前第几页
    getClickedNo(clickedNo) {
      //根据点击的页码重新整理参数，发请求
      this.searchParams.pageNo = clickedNo;
      this.getData();
    }
  },
  watch: {
    //监听路由的变化（也就是路由（url）参数的变化。如果变了，就重新发请求
    $route(newValue, oldValue) {
      //再次发请求之前，再次整理参数
      this.searchParams.category1Id = undefined;
      this.searchParams.category2Id = undefined;
      this.searchParams.category3Id = undefined;
      Object.assign(this.searchParams, this.$route.params, this.$route.query);
      this.getData();
    }
  }
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>