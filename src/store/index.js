import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
// 这里定义初始值
let state = {
  title:"深中通道海洋环境观测与预报综合显示平台",
  // name:"",
  // category:"",//管理员1普通用户0
  //免登陆
  name:"ocean",
  category:"0",//管理员1普通用户0
  serverIP:"127.0.0.1",//产品及数据发布IP
  // serverIP:"202.108.199.57",//产品及数据发布IP
  atmExtent:[98.8,7.0,137.5,32.9],
  atmRefineExtent:[112.3679,21.1480,114.8502, 23.4445],
  // waveExtent:[113.3,22.050,114.100, 22.800],
  waveExtent:[110.000,16.000,117.500, 23.000],//海浪大范围图
  currentExtent:[113.4600,22.0200,113.9600, 22.7800],
  monitors: []
};

const mutations = {
  setName(context,msg){
    state.name = msg;
  },
  setCategory(context,msg){
    state.category = msg;
  },
  setMonitorConf(context,msg){
    state.monitors = msg
  }
};

// 事件触发后的逻辑操作
// 参数为事件函数
const actions = {

};

// 返回改变后的数值
const getters = {

};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
