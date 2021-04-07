<template>
  <modal width="800"
         v-model="sea_Level_Observation_modal"
         title="潮位观测数据查询"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">
    <el-form :inline="true" :model="seaLevelObsForm" class="demo-form-inline" style="text-align:center;margin:0 auto">
      <el-form-item label="潮位计">
        <el-select v-model="seaLevelObsForm.name" placeholder="请选择潮位计" size="small" style="width:150px">
          <el-option label="平台潮位计" value="Tide1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="起止时间">
        <DatePicker type="datetimerange" v-model="seaLevelObsForm.timeRange" placeholder="开始时间-结束时间" style="width: 280px"></DatePicker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="queryStatus"
          size="small"
          @click="querySeaLevelHistory">查询</el-button>
      </el-form-item>
    </el-form>
    <!--el-row style="text-align:center;margin:0 auto">
      <label style="font-size: 14px;line-height:2;">站点：</label>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link" style="line-height:2;">
          {{site}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="潮位计1">潮位计1</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <label style="font-size:14px;line-height:2;margin-left: 40px;">起止时间：</label>
      <DatePicker type="datetimerange" v-model="timeRange" placeholder="开始时间-结束时间" style="width: 300px"></DatePicker>

      <el-button
        type="primary"
        :loading="queryStatus"
        size="small"
        style="margin-left: 30px;"
        @click="querySeaLevelHistory">查询</el-button>
    </el-row-->
    <div id="seaLevelObservationChart" :style="{width: '780px', height: '400px'}"></div>
  </modal>
</template>

<script>
  import drawCharts from "../Utils/drawCharts"
    export default {
      name: "SeaLevelObservationModal",
      data(){
        return {
          sea_Level_Observation_modal:false,
          seaLevelObsForm:{
            name:"",
            timeRange:[],
          },

          chart:"",
          queryStatus:false
        }
      },
      methods: {
        openSeaLevelObservationModal() {
          this.sea_Level_Observation_modal = true;
          this.chart = this.$echarts.init(document.getElementById('seaLevelObservationChart'))
          this.chart.clear()
        },

        handleCommand(command){
          this.site=command;
        },

        querySeaLevelHistory(){
          this.chart.clear();
          this.queryStatus=true;
          var api=`/api/SZTDService/queryTideHistory.action`;
          this.$axios.get(api,{
            params:{
              id:this.seaLevelObsForm.name.substring(4),
              startTime:this.seaLevelObsForm.timeRange[0].getTime(),
              endTime:this.seaLevelObsForm.timeRange[1].getTime()
            }
          }).then((response)=> {
            var tableData=response.data;
            console.log(tableData);
            if(tableData!=[])
              drawCharts.drawTideChart(tableData,this.chart);
              // this.drawTideChart(tableData);
            else
              this.$confirm('没有相关数据！', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
              });
          }).catch((response)=>{
            //失败回调
            this.$confirm(response.data, '提示', {
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
