<template>
  <modal width="1230"
         v-model="forecast_all_monitor_modal"
         title="站点预报数据流速时间序列图"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true"
         style="text-align:center;margin-top:0;line-height:2;font-size:200%;font-weight:bold;"
         class="monitor_modal">
  <!--<Modal :visible.sync="modal1"-->
         <!--width="1230"-->
         <!--v-model="forecast_all_monitor_modal"-->
         <!--:style="{top: '20px'}"-->
         <!--:mask-closable="false"-->
         <!--draggable-->
         <!--:footer-hide="true">-->
    <el-form :inline="true" :model="forecastAllMonitorForm" class="demo-form-inline"
             style="text-align:center;margin:0 auto">
      <el-form-item label="站点">
        <el-select v-model="forecastAllMonitorForm.name" placeholder="请选择站点" size="mini" style="width:120px">
          <!--<el-option label="西点" value="westMonitor"></el-option>-->
          <!--<el-option label="西南点" value="southwestMonitor"></el-option>-->
          <!--<el-option label="东南点" value="southeastMonitor"></el-option>-->
          <!--<el-option label="基槽点" value="baseMonitor"></el-option>-->
          <!--<el-option label="西北点" value="northwestMonitor"></el-option>-->
          <!--<el-option label="东北点" value="northeastMonitor"></el-option>-->
          <!--<el-option label="东点" value="eastMonitor"></el-option>-->
          <el-option
            v-for="item in this.$store.state.monitors"
            :label="item.adpcName"
            :value="item.adpcID"
            :key="item.adpcID"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="起止时间" style="margin-left:40px">
        <el-date-picker
          size="mini"
          style="width:350px"
          v-model="forecastAllMonitorForm.timeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item style="margin-left:40px">
        <el-button
          type="primary"
          :loading="queryStatus"
          size="small"
          @click="queryForecastAllMonitor">查询
        </el-button>
      </el-form-item>
    </el-form>
    <el-scrollbar>
      <el-row>
        <el-col :span="24">
          <div id="forecastAllMonitorChart" style="width:1230px ;height:730px"></div>
        </el-col>
      </el-row>
    </el-scrollbar>
  </Modal>
</template>

<script>
  import drawCharts from "../Utils/drawCharts"

  export default {
    name: "ForecastMonitorModal",
    data() {
      return {
        forecast_all_monitor_modal: false,
        forecastAllMonitorForm: {
          name: "",
          timeRange:[],
        },
        chart: "",
        queryStatus: false,
        divWidth: '1000px',
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value3: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      }
    },
    methods: {
      openForecastAllMonitorModal() {
        this.forecast_all_monitor_modal = true;
        this.chart = this.$echarts.init(document.getElementById('forecastAllMonitorChart'));
        this.chart.clear();
      },
      queryForecastAllMonitor() {
        this.chart.clear();
        this.queryStatus = true;
        var id = this.forecastAllMonitorForm.name;
        // switch (this.forecastAllMonitorForm.name) {
        //   case "westMonitor":
        //     id = 1;
        //     break;
        //   case "southwestMonitor":
        //     id = 2;
        //     break;
        //   case "southeastMonitor":
        //     id = 3;
        //     break;
        //   case "baseMonitor":
        //     id = 4;
        //     break;
        //   case "northwestMonitor":
        //     id = 5;
        //     break;
        //   case "northeastMonitor":
        //     id = 6;
        //     break;
        //   case "eastMonitor":
        //     id = 7;
        //     break;
        // }

        var startTime=this.forecastAllMonitorForm.timeRange[0].getTime();
        var endTime=this.forecastAllMonitorForm.timeRange[1].getTime();
        var api = `/api/SZTDService/queryForecastAllMonitor.action`;
        this.$axios.get(api, {
          params: {
            id: id,
            startTime:startTime,
            endTime:endTime
          }
        }).then((response) => {
          var tableData = response.data;
          if (tableData.length != 0) {

            drawCharts.drawForecastAllMonitorVelocDir(tableData, this.chart,startTime,endTime);
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
