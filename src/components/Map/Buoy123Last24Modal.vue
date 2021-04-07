<template>
  <modal width="1100"
         v-model="buoy123_last24_modal"
         :title=title
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">
    <el-form :inline="true" :model="buoy123Last24Form" class="demo-form-inline" style="margin-left: 50px;line-height:10px;">
      <el-form-item label="海流层级">
        <el-select v-model="buoy123Last24Form.level" @change="queryBuoy123CurrentLevelLast24Data" placeholder="请选择层级" size="mini" style="width:60px">
          <el-option
            v-for="item in buoy123Last24Form.levelList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="12">
        <div id="currentFlowVChartDIV" :style="{width: '550px', height: '210px'}"></div>
      </el-col>
      <el-col :span="12">
        <div id="waveSigWHChartDIV" :style="{width: '550px', height: '210px'}"></div>
      </el-col>
    </el-row>
    <el-row :style="{marginTop: '15px'}">
      <el-col :span="12">
        <div id="waveMaxWHChartDIV" :style="{width: '550px', height: '210px'}"></div>
      </el-col>
      <el-col :span="12">
        <div id="waveMaxWHTChartDIV" :style="{width: '550px', height: '210px'}"></div>
      </el-col>
    </el-row>
  </modal>
</template>

<script>
  import drawCharts from "../Utils/drawCharts.js"
    export default {
      name: "Buoy123Last24Modal",
      data(){
        return {
          title:"",
          buoy123_last24_modal:false,
          buoy123Last24Form:{
            level:1,
            levelList:Array.apply(null, Array(20)).map(function(item, i) {return i+1}),
          },
          currentFlowVChart:null,
          waveSigWHChart:null,
          waveMaxWHChart:null,
          waveMaxWHTChart:null,
          buoyId:null,
        }
      },
      methods:{
        openBuoy123Last24Modal(id) {
          this.buoy123_last24_modal = true;
          this.buoyId=id;
          this.title=this.buoyId.toString()+"号浮标最近24小时数据时间序列图";

          this.currentFlowVChart = this.$echarts.init(document.getElementById('currentFlowVChartDIV'));
          this.waveSigWHChart = this.$echarts.init(document.getElementById('waveSigWHChartDIV'));
          this.waveMaxWHChart = this.$echarts.init(document.getElementById('waveMaxWHChartDIV'));
          this.waveMaxWHTChart = this.$echarts.init(document.getElementById('waveMaxWHTChartDIV'));
          this.currentFlowVChart.clear();
          this.waveSigWHChart.clear();
          this.waveMaxWHChart.clear();
          this.waveMaxWHTChart.clear();


          //请求最近24小时数据并绘图
          this.queryBuoy123Last24Data(id);

        },
        queryBuoy123Last24Data(id){
          var api = `/api/SZTDService/queryBuoy123Last24.action?id=${id}&level=${this.buoy123Last24Form.level}`;
          this.$axios.get(api).then((response)=> {
            if(response.data.fubList!=null){
              drawCharts.drawCurrentFlowV(response.data.fubList,this.currentFlowVChart);
            }
            if(response.data.buoywvList!=null){
              //this.drawWaveSigWH(response.data.buoywvList);
              drawCharts.drawWaveSigWHMainDire(response.data.buoywvList,this.waveSigWHChart);
              drawCharts.drawWaveMaxWH(response.data.buoywvList,this.waveMaxWHChart);
              drawCharts.drawWaveMaxWHT(response.data.buoywvList,this.waveMaxWHTChart);
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
        queryBuoy123CurrentLevelLast24Data(){
          var api = `/api/SZTDService/queryBuoy123Last24.action?id=${this.buoyId}&level=${this.buoy123Last24Form.level}`;
          this.$axios.get(api).then((response)=> {
            if(response.data.fubList!=null) {
              drawCharts.drawCurrentFlowV(response.data.fubList, this.currentFlowVChart);
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
      }
    }
</script>

<style scoped>

</style>
