//引入mock模块
import Mock from 'mockjs'

//引入json数据
//webpack默认暴露：图片，json格式
import banner from './banner.json'
import floor from './floor.json'

//mock数据: 参数1：请求地址 - 客户端要请求mock数据时，从这个地址获取数据；参数2：请求数据 - 请求成功后要返回的数据
Mock.mock("/mock/banner", { code: 200, data: banner })
Mock.mock("/mock/floor", { code: 200, data: floor })