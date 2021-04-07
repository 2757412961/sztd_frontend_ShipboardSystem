<template>
  <modal width="800"
         v-model="buoy_current_observation_modal"
         title="浮标海流观测数据查询"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">

    <el-form :inline="true" :model="buoyCurrentObsForm" class="demo-form-inline" style="text-align:center;margin:0 auto">
      <el-form-item label="浮标">
        <el-select v-model="buoyCurrentObsForm.name" placeholder="请选择浮标" size="small" style="width:100px">
          <el-option label="1" value="Buoy1"></el-option>
          <el-option label="2" value="Buoy2"></el-option>
          <el-option label="3" value="Buoy3"></el-option>
          <el-option label="4" value="Buoy4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="层级">
        <el-select v-model="buoyCurrentObsForm.level" placeholder="请选择层级" size="small" style="width:80px">
        <el-option
        v-for="item in buoyCurrentObsForm.levelList"
        :key="item"
        :label="item"
        :value="item">
        </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="起止时间">
        <DatePicker type="datetimerange" v-model="buoyCurrentObsForm.timeRange" placeholder="开始时间-结束时间" style="width: 280px"></DatePicker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="queryStatus"
          size="small"
          @click="queryBuoyCurrentHistory">查询</el-button>
      </el-form-item>
    </el-form>
    <div id="buoyCurrentObservationChart" :style="{width: '780px', height: '400px'}"></div>
  </modal>
</template>

<script>
  import drawCharts from "../Utils/drawCharts"
    export default {
      name: "BuoyCurrentObservationModal",
      data(){
        return {
          buoy_current_observation_modal:false,
          buoyCurrentObsForm:{
            name:"",
            level:"",
            timeRange:[],
            levelList:Array.apply(null, Array(20)).map(function(item, i) {return i+1}),
          },
          chart:"",
          queryStatus:false
        }
      },
      methods: {
        openBuoyCurrentObservationModal() {
          this.buoy_current_observation_modal = true;
          this.chart = this.$echarts.init(document.getElementById('buoyCurrentObservationChart'))
          this.chart.clear()
        },
        queryBuoyCurrentHistory(){
          this.chart.clear();
          this.queryStatus=true;
          var api=`/api/SZTDService/queryFubHistory.action`;
          this.$axios.get(api,{
            params:{
              id:this.buoyCurrentObsForm.name.substring(4),
              level:this.buoyCurrentObsForm.level,
              startTime:this.buoyCurrentObsForm.timeRange[0].getTime(),
              endTime:this.buoyCurrentObsForm.timeRange[1].getTime()
            }
          }).then((response)=> {
            var tableData=response.data;
            if(tableData.length!=0)
              drawCharts.drawCurrentFlowV(tableData,this.chart);
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
