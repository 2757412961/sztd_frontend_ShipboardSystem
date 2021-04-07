<template>
  <modal width="1100"
         v-model="site_last24_modal"
         title="气象站最近24小时数据时间序列图"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">
    <el-row>
      <el-col :span="12">
        <div id="taAvgChart" :style="{width: '550px', height: '210px'}"></div>
      </el-col>
      <el-col :span="12">
        <div id="rhAvgChart" :style="{width: '550px', height: '210px'}"></div>
      </el-col>
    </el-row>
    <el-row :style="{marginTop: '15px'}">
      <el-col :span="12">
        <div id="wsWvc1Chart" :style="{width: '550px', height: '210px'}"></div>
      </el-col>
      <el-col :span="12">
        <div id="paAvgChart" :style="{width: '550px', height: '210px'}"></div>
      </el-col>
    </el-row>
  </modal>
</template>

<script>
  import drawCharts from "../Utils/drawCharts.js"
    export default {
        name: "SiteLast24Modal",
      data(){
          return {
            site_last24_modal:false,
            taAvgChart:null,
            rhAvgChart:null,
            wsWvc1Chart:null,
            paAvgChart:null
          }
      },
      methods:{
        openSiteLast24Modal() {
          this.site_last24_modal = true;
          this.taAvgChart = this.$echarts.init(document.getElementById('taAvgChart'));
          this.rhAvgChart = this.$echarts.init(document.getElementById('rhAvgChart'));
          this.wsWvc1Chart = this.$echarts.init(document.getElementById('wsWvc1Chart'));
          this.paAvgChart = this.$echarts.init(document.getElementById('paAvgChart'));

          this.taAvgChart.clear();
          this.rhAvgChart.clear();
          this.wsWvc1Chart.clear();
          this.paAvgChart.clear();

          //请求最近24小时数据并绘图
          this.queryLast24Data();
        },
        queryLast24Data(){
          var api = `/api/SZTDService/querySiteLast24.action`;
          this.$axios.get(api).then((response)=> {
            drawCharts.drawSiteTaAvg(response.data,this.taAvgChart);
            drawCharts.drawSiteRhAvg(response.data,this.rhAvgChart);
            drawCharts.drawSiteWsWvc1(response.data,this.wsWvc1Chart);
            drawCharts.drawSitePaAvg(response.data,this.paAvgChart);
          }).catch((response)=>{
            //失败回调
            this.$confirm('服务器失联！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
          }).finally((response)=>{

          })
        }
      }
    }
</script>

<style scoped>

</style>
