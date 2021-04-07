<template>
  <modal
    :width="this.modalSize.width"
    v-model="real_time_monitor_modal"
    :height="this.modalSize.height"
    :mask-closable="false"
    :draggable="true"
    :footer-hide="true"
    style="text-align:center;margin-top:0;line-height:2;font-size:200%;font-weight:bold;"
    class="monitor_modal">
        <p slot="header" style="line-height:30px;height:30px;color:#17233d;text-align:center;font-size: 16px">
          <Icon type="ios-information-circle"></Icon>
          <span>各站点最新时刻水深-流速曲线图</span>
          <!--el-button type="text" icon="el-icon-full-screen" style="color:#333;right : 50px;top:4px;position: absolute" @click="this.fullScreenShow"></el-button-->
        </p>
    <el-row>
      <el-col :span="24">
        <div id="allRealTimeMonitorChart" :style="{width: '1300px', height: '700px'}"></div>
      </el-col>
    </el-row>
  </Modal>
</template>

<script>
  import drawCharts from "../Utils/drawCharts"
  import qs from 'qs'

  export default {
    name: "RealTimeMonitorModal",
    data() {
      return {
        real_time_monitor_modal: false,
        chart: "",
        queryStatus: false,
        modalSize:{
          width:1270,
          height:'auto',
          isfullScreen:false
        }
      }
    },
    mounted() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      else {
        this.timer = setInterval(() => {
          this.queryRealTimeMonitor();
        // }, 5 * 1000);//轮询5分钟更新一次
        }, 5 * 60 * 1000);//轮询5分钟更新一次
      }
    },
    destroyed() {
      clearInterval(this.timer);
    },
    methods: {
      openRealTimeMonitorModal() {
        this.real_time_monitor_modal = true;
        this.chart = this.$echarts.init(document.getElementById('allRealTimeMonitorChart'));
        this.chart.clear();
        this.queryRealTimeMonitor();
      },
      queryRealTimeMonitor() {
        this.chart.clear();
        this.queryStatus = true;
        var api = `/api/SZTDService/queryRealTimeMonitorById.action`;
        var monitorIds = [];
        this.$store.state.monitors.forEach(conf => monitorIds.push(conf.adpcID));
        this.$axios.get(api, {
          params: {
            ids: monitorIds
          },
          paramsSerializer: params => {
            return qs.stringify(params, {indices: false})
          }
        }).then((response) => {
          var tableData = response.data;
          if (tableData.length != 0) {
            var monitorNames = [];
            this.$store.state.monitors.forEach(conf => monitorNames.push(conf.adpcName));
            drawCharts.drawRealTimeMonitorVelocDir(monitorNames, tableData, this.chart);
          }
          else
            this.$confirm('没有相关数据！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
        }).catch((response) => {
          //失败回调
          this.$confirm('服务器失联！', '提示', {
            confirmButtonText: '确定',
            type: 'warning'
          });
        }).finally((response) => {
          this.queryStatus = false;
        })
      }
    }
  }
</script>

<style>

  .monitor_modal .ivu-modal-header {
    border-bottom: 1px solid #e8eaec;
    padding: 6px 2px;
    line-height: 1;
  }

  .monitor_modal .ivu-modal-header .ivu-modal-header-inner{
    display: inline-block;
    width: 100%;
    height: 50%;
    line-height: 1.5;
    font-size: 18px;
    color: #17233d;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }


</style>
