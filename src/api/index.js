//当前模块：对API进行统一管理
import requests from './request'
import mockRequest from './mockRequest'

//三级联动接口
//发请求 - 请求路径前面自动带上/api（baseURL）
//axios发请求返回结果promise对象
export const reqCategoryList = () => requests({ url: '/product/getBaseCategoryList', method: 'get' });

//获取banner - mock数据 (因为baseURL中有/mock，所以此处只写/banner即可)
export const reqBannerList = () => mockRequest.get('/banner')

//获取floor - mock数据 (因为baseURL中有/mock，所以此处只写/floor即可)
export const reqFloorList = () => mockRequest.get('/floor')

//获取搜索模块数据 - /api/list - post - 需要带参数（可选）
//参数至少是一个空对象，不能为空
//post方法不能在url中带参数，所以有data属性【不是，看看下面的reqAddOrUpdateShopCart，POST方法也可以】
export const reqSearchInfo = (params) => requests({ url: "/list", method: 'post', data: params })

//获取商品详情 - /api/item/{ skuId } - get - 必须带参数
export const reqGoodInfo = (skuId) => requests({ url: `/item/${skuId}`, method: 'get' })

//加入购物车 - 修改购物车数据
export const reqAddOrUpdateShopCart = (skuId, skuNum) => requests({ url: `/cart/addToCart/${skuId}/${skuNum}`, method: 'post' })

//获取购物车列表数据
export const reqCartList = () => requests({ url: '/cart/cartList', method: 'get' })

//删除购物车的商品
export const reqDeleteCart = (skuId) => requests({ url: `/cart/deleteCart/${skuId}`, method: 'delete' })

//切换商品选中状态
export const reqChangeChecked = (skuId, isChecked) => requests({ url: `/cart/checkCart/${skuId}/${isChecked}`, method: 'get' })

//获取验证码
export const reqGetCode = (phone) => requests({ url: `/user/passport/sendCode/${phone}`, method: 'get' })

//用户注册
export const reqUserRegister = (data) => requests({ url: '/user/passport/register', data, method: 'post' })

//登录
export const reqUserLogin = (data) => requests({ url: '/user/passport/login', data, method: 'post' })

//获取用户信息（需要带着token，但是服务器要求不要带参数，所以通过请求头的方式传token）
export const reqUserInfo = () => requests({ url: '/user/passport/auth/getUserInfo', method: 'get' })

//退出登录
export const reqLogout = () => requests({ url: '/user/passport/logout', method: 'get' })

//获取用户地址信息
export const reqAddressInfo = () => requests({ url: '/user/userAddress/auth/findUserAddressList', method: 'get' })

//获取交易页商品清单
export const reqOrderInfo = () => requests({ url: '/order/auth/trade', method: 'get' })

//提交订单，去支付
export const reqSubmitOrder = (tradeNo, data) => requests({ url: `/order/auth/submitOrder?tradeNo=${tradeNo}`, data, method: 'post' })

//获取订单支付（页面）信息
export const reqPaymentInfo = (orderId) => requests({ url: `/payment/weixin/createNative/${orderId}`, method: 'get' })

//获取支付（订单）状态
export const reqPaymentStatus = (orderId) => requests({ url: `/payment/weixin/queryPayStatus/${orderId}`, method: 'get' })

//获取（个人中心的）我的订单列表
export const reqMyOrderList = (page, limit) => requests({ url: `/order/auth/${page}/${limit}`, method: 'get' })