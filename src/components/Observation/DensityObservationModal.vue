<template>
  <modal width="800"
         v-model="density_observation_modal"
         title="密度观测数据查询"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">

    <el-form :inline="true" :model="densityObsForm" class="demo-form-inline" style="text-align:center;margin:0 auto">
      <el-form-item label="CTD">
        <el-select v-model="densityObsForm.name" placeholder="请选择CTD" size="small" style="width:150px">
          <el-option label="平台表层CTD" value="CTD2"></el-option>
          <el-option label="平台底层CTD" value="CTD1"></el-option>
          <el-option label="浮标表层CTD" value="CTD4"></el-option>
          <el-option label="浮标底层CTD" value="CTD3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="起止时间">
        <DatePicker type="datetimerange" v-model="densityObsForm.timeRange" placeholder="开始时间-结束时间" style="width: 280px"></DatePicker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="queryStatus"
          size="small"
          @click="queryDensityHistory">查询</el-button>
      </el-form-item>
    </el-form>
    <div id="densityObservationChart" :style="{width: '780px', height: '400px'}"></div>
  </modal>
</template>

<script>
  import drawCharts from "../Utils/drawCharts"
    export default {
      name: "DensityObservationModal",
      data(){
        return {
          density_observation_modal:false,
          densityObsForm:{
            name:"",
            timeRange:[],
          },
          chart:"",
          queryStatus:false
        }
      },
      methods: {
        openDensityObservationModal() {
          this.density_observation_modal = true;
          this.chart = this.$echarts.init(document.getElementById('densityObservationChart'))
          this.chart.clear()
        },
        queryDensityHistory(){
          this.chart.clear();
          this.queryStatus=true;
          var api=`/api/SZTDService/queryCtdHistory.action`;
          this.$axios.get(api,{
            params:{
              id:this.densityObsForm.name.substring(3),
              startTime:this.densityObsForm.timeRange[0].getTime(),
              endTime:this.densityObsForm.timeRange[1].getTime()
            }
          }).then((response)=> {
            var tableData=response.data;
            if(tableData.length!=0)
              drawCharts.drawCTDChart(tableData,this.chart);
            else
              this.$confirm('没有相关数据！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              });
          }).catch((response)=>{
            //失败回调
            this.$confirm('服务器失联！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
          }).finally((response)=>{
            this.queryStatus=false;
          })
        }
      }
    }
</script>

<style scoped>

</style>
