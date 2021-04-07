<template>
  <modal width="800"
         v-model="platform_last24_modal"
         title="平台最近24小时数据时间序列图"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">
    <div id="platformLast24Chart1" :style="{width: '780px', height: '200px'}"></div>
    <div id="platformLast24Chart2" :style="{width: '780px', height: '200px'}"></div>
    <div id="platformLast24Chart3" :style="{width: '780px', height: '200px'}"></div>
  </modal>
</template>

<script>
  import drawCharts from "../Utils/drawCharts.js"
    export default {
      name: "PlatformLast24Modal",
      data(){
        return {
          platform_last24_modal:false,
          chart1:null,
          chart2:null,
          chart3:null,
        }
      },
      methods:{
        openPlatformLast24Modal() {
          this.platform_last24_modal = true;

          this.chart1 = this.$echarts.init(document.getElementById('platformLast24Chart1'));
          this.chart2 = this.$echarts.init(document.getElementById('platformLast24Chart2'));
          this.chart3 = this.$echarts.init(document.getElementById('platformLast24Chart3'));
          this.chart1.clear();
          this.chart2.clear();
          this.chart3.clear();


          //请求最近24小时数据并绘图
          this.queryLast24Data();
        },
        queryLast24Data(){
          var api = `/api/SZTDService/queryPlatformLast24.action`;
          this.$axios.get(api).then((response)=> {
              //this.chart1.setOption(option);
              drawCharts.drawCTDChart(response.data.topCtdList,this.chart1);
              drawCharts.drawCTDChart(response.data.bottomCtdList,this.chart2);
              drawCharts.drawTideChart(response.data.tideList,this.chart3);
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
