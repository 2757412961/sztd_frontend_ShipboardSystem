<template>
  <modal width="1200"
         v-model="buoy4_last24_modal"
         title="4号浮标最近24小时数据时间序列图"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">
    <el-form :inline="true" :model="buoy4Last24Form" class="demo-form-inline" style="margin-left: 40px;">
      <el-form-item label="海流层级">
        <el-select v-model="buoy4Last24Form.level" @change="queryBuoy4CurrentLevelLast24Data" placeholder="请选择层级" size="mini" style="width:60px">
          <el-option
            v-for="item in buoy4Last24Form.levelList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="12">
        <div id="buoy4Last24Chart1" :style="{width: '550px', height: '210px'}"></div>
      </el-col>
      <el-col :span="12">
        <div id="buoy4Last24Chart2" :style="{width: '550px', height: '210px'}"></div>
      </el-col>
    </el-row>
    <el-row :style="{marginTop: '15px'}">
      <el-col :span="12">
        <div id="buoy4Last24Chart5" :style="{width: '550px', height: '210px'}"></div>
      </el-col>
      <el-col :span="12">
        <div id="buoy4Last24Chart6" :style="{width: '550px', height: '210px'}"></div>
      </el-col>
    </el-row>
    <el-row :style="{marginTop: '15px'}">
      <el-col :span="12">
        <div id="buoy4Last24Chart3" :style="{width: '550px', height: '210px'}"></div>
      </el-col>
      <el-col :span="12">
        <div id="buoy4Last24Chart4" :style="{width: '550px', height: '210px'}"></div>
      </el-col>
    </el-row>
  </modal>
</template>

<script>
  import drawCharts from "../Utils/drawCharts.js"
    export default {
      name: "Buoy4Last24Modal",
      data(){
        return {
          buoy4_last24_modal:false,
          buoy4Last24Form:{
            level:1,
            levelList:Array.apply(null, Array(20)).map(function(item, i) {return i+1}),
          },
          chart1:null,
          chart2:null,
          chart5:null,
          chart6:null,
          chart3:null,
          chart4:null,

        }
      },
      methods:{
        openBuoy4Last24Modal(id) {
          this.buoy4_last24_modal = true;

          this.chart1 = this.$echarts.init(document.getElementById('buoy4Last24Chart1'));
          this.chart2 = this.$echarts.init(document.getElementById('buoy4Last24Chart2'));
          this.chart5 = this.$echarts.init(document.getElementById('buoy4Last24Chart5'));
          this.chart6 = this.$echarts.init(document.getElementById('buoy4Last24Chart6'));
          this.chart3 = this.$echarts.init(document.getElementById('buoy4Last24Chart3'));
          this.chart4 = this.$echarts.init(document.getElementById('buoy4Last24Chart4'));
          this.chart1.clear();
          this.chart2.clear();
          this.chart5.clear();
          this.chart6.clear();
          this.chart3.clear();
          this.chart4.clear();


          //请求最近24小时数据并绘图
          this.queryBuoy4Last24Data(id);
        },
        queryBuoy4Last24Data(id){
          var api = `/api/SZTDService/queryBuoy4Last24.action?id=${id}&level=${this.buoy4Last24Form.level}`;
          this.$axios.get(api).then((response)=> {
            if(response.data.fubList!=null){
              drawCharts.drawCurrentFlowV(response.data.fubList, this.chart1);
            }
            if(response.data.buoywvList!=null){
              drawCharts.drawWaveSigWHMainDire(response.data.buoywvList, this.chart2);
              drawCharts.drawWaveMaxWH(response.data.buoywvList, this.chart5);
              drawCharts.drawWaveMaxWHT(response.data.buoywvList, this.chart6);
            }
            if(response.data.topCtdList!=null){
              drawCharts.drawCTDChart(response.data.topCtdList, this.chart3);
            }
            if(response.data.bottomCtdList!=null){
              drawCharts.drawCTDChart(response.data.bottomCtdList,this.chart4);
            }
          }).catch((response)=>{
            //失败回调
            this.$confirm('服务器失联！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
          }).finally((response)=>{

          })
        },
        queryBuoy4CurrentLevelLast24Data(){
          var api = `/api/SZTDService/queryBuoy4Last24.action?id=${4}&level=${this.buoy4Last24Form.level}`;
          this.$axios.get(api).then((response)=> {
            drawCharts.drawCurrentFlowV(response.data.fubList,this.chart1);
          }).catch((response)=>{
            //失败回调
            this.$confirm('服务器失联！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
          }).finally((response)=>{

          })
        },
      }
    }
</script>

<style scoped>

</style>
