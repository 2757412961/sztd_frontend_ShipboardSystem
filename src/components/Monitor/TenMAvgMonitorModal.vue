<template>
  <modal
    width="900"
    v-model="tenMAvg_monitor_modal"
    title="10m平均流速时间序列图"
    :mask-closable="false"
    :draggable="true"
    :footer-hide="true"
    style="text-align:center;margin-top:0;line-height:2;font-size:200%;font-weight:bold;"
    class="monitor_modal">

    <el-form :inline="true" class="demo-form-inline" style="text-align:center;margin:0 auto">
      <el-form-item label="起止时间" style="margin-left:40px">
        <el-date-picker
          size="mini"
          style="width:350px"
          v-model="tenMAvgTimeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :loading="queryStatus"
          size="small"
          @click="queryTenMAvgMonitor">查询
        </el-button>
      </el-form-item>
    </el-form>

    <el-row>
      <el-col :span="24">
        <el-scrollbar>
          <div id="tenMAvgMonitorChart" style="width:900px ;height:1600px"></div>
        </el-scrollbar>
      </el-col>
    </el-row>

  </modal>
</template>

<script>
    import drawCharts from "../Utils/drawCharts";
    import qs from 'qs'

    export default {
        name: "TenMAvgMonitorModal",
        data() {
            return {
                tenMAvg_monitor_modal: false,
                tenMAvgTimeRange: [],
                ids: [],
                monitorNames: [],
                chart: "",
                queryStatus: false,

            }
        },
        methods: {
            openTenMAvgMonitorModal() {
                this.tenMAvg_monitor_modal = true;
                this.chart = this.$echarts.init(document.getElementById("tenMAvgMonitorChart"));
                this.$store.state.monitors.forEach(conf => this.ids.push(conf.adpcID));
                this.$store.state.monitors.forEach(conf => this.monitorNames.push(conf.adpcName));
                this.chart.clear();
            },
            queryTenMAvgMonitor() {
                this.chart.clear();
                this.queryStatus = true;

                var monitorIds = [];
                for (var i = 0; i < this.ids.length; i++) monitorIds.push(this.ids[i]);

                var startTime = this.tenMAvgTimeRange[0].getTime();
                var endTime = this.tenMAvgTimeRange[1].getTime();
                var api = `/api/SZTDService/queryTenMAvgMonitor.action`;
                this.$axios.get(api, {
                    params: {
                        ids: this.ids,
                        startTime: startTime,
                        endTime: endTime
                    },
                    paramsSerializer: params => {
                        return qs.stringify(params, {indices: false})
                    }
                }).then((response) => {
                    var tableData = response.data;
                    if (tableData.length != 0) {
                        drawCharts.drawTenMAvgMonitorVelocDir(tableData, this.chart, this.monitorNames);
                    } else {
                        this.$confirm('没有相关数据！', '提示', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        });
                    }
                }).catch((response) => {
                    //失败回调
                    this.$confirm('服务器失联！', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning'
                    });
                }).finally((response) => {
                    this.queryStatus = false;
                });
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

  .monitor_modal .ivu-modal-header .ivu-modal-header-inner {
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
