<template>
  <modal width="1040"
         v-model="history_monitor_modal"
         title="站点历史数据水深-流速曲线图"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true"
         style="text-align:center;margin:0 auto;line-height:1.5;font-size:150%;font-weight:bold;"
         class="monitor_modal">
    <el-form :inline="true" :model="historyMonitorForm" class="demo-form-inline"
             style="text-align:center;margin:0 auto">
      <el-form-item label="站点">
        <el-select v-model="historyMonitorForm.name" placeholder="请选择站点" size="mini" style="width:120px">
          <el-option
            v-for="item in this.$store.state.monitors"
            :label="item.adpcName"
            :value="item.adpcID"
            :key="item.adpcID"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="最近" style="margin-left:20px">
        <el-input-number v-model="historyMonitorForm.time" size="mini" controls-position="right" :min="1" :max="100"
                         style="width:90px"></el-input-number>
      </el-form-item>
      <el-form-item label="分钟">
      </el-form-item>
      <el-form-item label="时间间隔" style="margin-left:20px">
        <el-input-number v-model="historyMonitorForm.timeInterval" size="mini" controls-position="right" :min="1"
                         :max="100" style="width:90px"></el-input-number>
      </el-form-item>
      <el-form-item label="分钟">
      </el-form-item>
      <el-form-item style="margin-left:20px">
        <el-button
          type="primary"
          :loading="queryStatus"
          size="small"
          @click="queryHistoryMonitor">查询
        </el-button>
      </el-form-item>
    </el-form>

    <el-row>
      <el-col :span="24">
        <el-scrollbar ref="scrollbar">
          <div id="allHistoryMonitorChart" style="width:3000px;height:600px"></div>
        </el-scrollbar>
      </el-col>
    </el-row>

  </modal>
</template>

<script>
  import drawCharts from "../Utils/drawCharts"

  export default {
    name: "HistoryMonitorModal",
    data() {
      return {
        history_monitor_modal: false,
        historyMonitorForm: {
          name: "",
          time: "",
          timeInterval: ""
        },
        chart: "",
        queryStatus: false,
        divWidth: '1000px'
      }
    },
    methods: {
      openHistoryMonitorModal() {
        this.history_monitor_modal = true;
        this.chart = this.$echarts.init(document.getElementById('allHistoryMonitorChart'));
        this.chart.clear();
      },
      queryHistoryMonitor() {
        this.chart.clear();
        this.queryStatus = true;
        var id = this.historyMonitorForm.name
        // switch (this.historyMonitorForm.name) {
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

        var api = `/api/SZTDService/queryHistoryMonitor.action`;
        this.$axios.get(api, {
          params: {
            id: id,
            time: this.historyMonitorForm.time,
            timeInterval: this.historyMonitorForm.timeInterval,
          }
        }).then((response) => {
          var tableData = response.data;
          if (tableData.length != 0) {
            drawCharts.drawHistoryMonitorVelocDir(tableData, this.chart);
            this.$refs.scrollbar.update()
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
