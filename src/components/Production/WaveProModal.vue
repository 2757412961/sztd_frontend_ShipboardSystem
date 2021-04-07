<template>
  <modal width="375"
         v-model="wave_pro_modal"
         title="海浪数值预报产品"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true"
         @on-cancel="closeModal">
    <el-form :inline="true"  :model="waveProForm" class="demo-form-inline" size="mini">
      <el-form-item label="起报日期">
        <DatePicker type="date" v-model="waveProForm.stDate" placeholder="选择日期" style="width: 260px"></DatePicker>
      </el-form-item>
      <el-form-item label="数值产品" style="margin-bottom: 10px">
        <el-checkbox-group v-model="waveProForm.proList">
          <el-checkbox label="有效波高" style="margin-left: 10px;" ></el-checkbox>
          <el-checkbox label="浪向" style="margin-left: 8px;"></el-checkbox>
          <el-checkbox label="周期" style="margin-right: 0;"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="预报时次">
        <el-slider v-model="waveProForm.preTime" :marks="waveProForm.marks" @change="loadWaveProToMap" style="width: 250px ;height: 50px;margin-left: 10px;"  :min="0" :max="168">
          <el-option
            v-for="item in waveProForm.preTimeList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-slider>
      </el-form-item>
      <el-form-item label="预报时间" style="line-height:40px">
        <div style="line-height:42px; margin-left: 50px;">{{forecastTime}}</div>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="loadStatus"
          size="mini"
          style="width:300px;margin-left: 20px;"
          @click="loadWaveProToMap">加载</el-button>
      </el-form-item>
    </el-form>
  </modal>
</template>

<script>
    export default {
      name: "waveProModal",
      data(){
          return{
            wave_pro_modal:false,
            loadStatus:false,
            waveProForm:{
              stDate:null,
              // preTime:null,
              preTime:[0, 168],
              marks: {
                0: '0',
                24: '24',
                48: '48',
                72: '72',
                96: '96',
                120: '120',
                144: '144',
                168: '168',
              },
              preTimeList:Array.apply(null, Array(168)).map(function(item, i) {return i}),
              proList:[],
            }
          }
      },
      computed:{
        //联动显示“预报时间”
        // 计算属性的 getter
        forecastTime: function () {
          // `this` 指向 vm 实例
          var time="";
          if(this.waveProForm.stDate!=null) {
            time = this.util.formatDateTimeForecastTime(this.waveProForm.stDate, this.waveProForm.preTime);
          }
          return time;
        }
      },
      methods:{
        openWaveProModal(){
          var api=`/api/SZTDService/queryWaveProNew.action`;
          this.$axios.get(api).then((response)=> {
            if(response.data!="") {
              //TODO 组织默认日期
              this.waveProForm.stDate = new Date(response.data);
            }
            this.wave_pro_modal=true;
          }).catch((response)=>{
            //失败回调
            this.$confirm('服务器失联！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
          }).finally((response)=>{

          })

        },
        closeModal(){
          this.$emit('cleanMapPro');
        },
        loadWaveProToMap(){
          //清除地图上现有的数据产品
          this.$emit('cleanMapPro');
          var stDateStr=this.waveProForm.stDate.getFullYear()+this.num2Str(this.waveProForm.stDate.getMonth()+1)+this.num2Str(this.waveProForm.stDate.getDate());
          var url=`/proapi/sztd_data_matlab/wave/`;
          var extent=this.$store.state.waveExtent;
          for(var i=0;i<this.waveProForm.proList.length;i++){
            if(this.waveProForm.proList[i]=="有效波高"){
              //海浪浪高等值线填色图
              var hsUrl1=url+stDateStr+"/Wave_HS_Contourf_"+this.waveProForm.preTime+"_"+stDateStr+".png";
              this.$emit('addPic2map', hsUrl1, extent);
              //海浪浪高等值线图
              var hsUrl2=url+stDateStr+"/Wave_HS_Contour_"+this.waveProForm.preTime+"_"+stDateStr+".png";
              this.$emit('addPic2map', hsUrl2, extent);
            }
            if(this.waveProForm.proList[i]=="浪向"){
               // var pressUrl=url+"DIR/"+stDateStr+"/Wave_DIR_"+this.waveProForm.preTime+"_"+stDateStr+"_L6.png";
              var pressUrl=url+stDateStr+"/Wave_DIR_"+this.waveProForm.preTime+"_"+stDateStr+".png";
              this.$emit('addPic2map', pressUrl, extent);
            }
            if(this.waveProForm.proList[i]=="周期"){
              //海浪周期等值线填色图
              var tpsUrl1=url+stDateStr+"/Wave_TPS_Contourf_"+this.waveProForm.preTime+"_"+stDateStr+".png";
              this.$emit('addPic2map', tpsUrl1, extent);
              //海浪周期等值线图
              var tpsUrl2=url+stDateStr+"/Wave_TPS_Contour_"+this.waveProForm.preTime+"_"+stDateStr+".png";
              this.$emit('addPic2map', tpsUrl2, extent);
            }
          }
        },
        num2Str(num){
          if(num<10){
            return "0"+num;
          }else{
            return ""+num;
          }
        },
      }
    }
</script>

<style scoped>

</style>
