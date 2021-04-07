<template>
  <modal width="310"
         v-model="current_pro_modal"
         title="海流数值预报产品"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true"
         @on-cancel="closeModal">
    <el-form :inline="true"  :model="currentProForm" class="demo-form-inline" size="mini">
      <el-form-item label="起报日期">
        <DatePicker type="date" v-model="currentProForm.stDate" placeholder="选择日期"  style="width: 200px"></DatePicker>
      </el-form-item>
      <el-form-item label="垂直层级">
        <el-select v-model="currentProForm.verticalLayer" placeholder="选择垂直层" style="width: 200px" @change="changeVerticalLayer">
          <el-option
            v-for="item in currentProForm.verticalLayerList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数值产品" style="margin-bottom: 0px">
        <el-checkbox-group v-model="currentProForm.proList">
          <el-checkbox label="流场" style="margin-right:10px;"></el-checkbox>
          <el-checkbox label="盐度" style="margin-right:10px;"></el-checkbox>
          <el-checkbox label="水位" style="margin-right: 0px;" :disabled="currentProForm.cb_dis_seaLevel"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="预报时次" style="line-height:35px">
        <el-slider v-model="currentProForm.preTime" :marks="currentProForm.marks"  @change="loadCurrentProToMap" style="width: 180px ;height: 50px;margin-left: 10px;"  :min="0" :max="24">
          <el-option
            v-for="item in currentProForm.preTimeList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-slider>
      </el-form-item>
      <el-form-item label="预报时间" style="line-height:40px">
        <div style="line-height:42px; margin-left: 35px;">{{forecastTime}}</div>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="loadStatus"
          size="mini"
          style="width:240px;margin-left: 20px;"
          @click="loadCurrentProToMap">加载</el-button>
      </el-form-item>
    </el-form>
  </modal>

</template>

<script>
    export default {
        name: "CurrentProModal",
      data(){
        return {
          current_pro_modal:false,
          loadStatus:false,
          currentProForm:{
            stDate:null,
            // preTime:'',
            preTime:[0, 24],
            marks: {
              0: '0',
              4: '4',
              8: '8',
              12: '12',
              16: '16',
              20: '20',
              24: '24',
            },
            //Array(25) 25为nc文件时次个数
            preTimeList: Array.apply(null, Array(25)).map(function(item, i) {return i}),
            verticalLayer:null,
            verticalLayerList:Array.apply(null, Array(20)).map(function(item, i) {return i+1}),
            proList:[],
            cb_dis_seaLevel:false
          },
        }
      },
      computed:{
        //联动显示“预报时间”
        // 计算属性的 getter
        forecastTime: function () {
          // `this` 指向 vm 实例
          var time="";
          if(this.currentProForm.stDate!=null) {
            time = this.util.formatDateTimeForecastTime(this.currentProForm.stDate, this.currentProForm.preTime);
          }
          return time;
        }
      },
      methods:{
        /**
         * 打开海流数值产品对话框
         */
        openCurrentProModal() {
          //TODO 组织默认日期
          var api = `/api/SZTDService/queryCurrentProNew.action`;
          this.$axios.get(api).then((response) => {
            if (response.data != "") {
              this.currentProForm.stDate = new Date(response.data);
            }
            this.current_pro_modal = true;
          }).catch((response) => {
            //失败回调
            this.$confirm('服务器失联！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
          }).finally((response) => {

          })
          // this.current_pro_modal=true;
        },
        /**
         * 修改垂直层级触发事件，水位只有表层才有
         */
        changeVerticalLayer(){
          if(this.currentProForm.verticalLayer==1){
            this.currentProForm.cb_dis_seaLevel=false;
          }
          else{
            this.currentProForm.cb_dis_seaLevel=true;
          }
        },
        /**
         * 关闭模态框清除地图上的数值产品
         */
        closeModal() {
          this.$emit('cleanMapPro');
        },
        num2Str(num){
          if(num<10){
            return "0"+num;
          }else{
            return ""+num;
          }
        },
        /**
         * 在地图上加载海流数值产品
         */
        loadCurrentProToMap(){
          //清除地图上现有的数据产品
          this.$emit('cleanMapPro');
          var stDateStr=this.currentProForm.stDate.getFullYear()+this.num2Str(this.currentProForm.stDate.getMonth()+1)+this.num2Str(this.currentProForm.stDate.getDate())+ "08";
          var url=`/proapi/sztd_data_matlab/current/`+stDateStr+`/`;
          var extent=this.$store.state.currentExtent;
          for(var i=0;i<this.currentProForm.proList.length;i++){
            if(this.currentProForm.proList[i]=="流场"){
              //流场填色图
              var windUrl2=url+"Current_UV_"+this.currentProForm.verticalLayer+"G_"+this.currentProForm.preTime+"_"+stDateStr+".png";
              this.$emit('addPic2map',windUrl2,extent);
              //流场方向图
              var windUrl1=url+"Current_UVDir_"+this.currentProForm.verticalLayer+"G_"+this.currentProForm.preTime+"_"+stDateStr+"_L6.png";
              this.$emit('addPic2map',windUrl1,extent);

            }
            if(this.currentProForm.proList[i]=="盐度"){
              //盐度
              var rainUrl=url+"Current_Salinity_"+this.currentProForm.verticalLayer+"G_"+this.currentProForm.preTime+"_"+stDateStr+".png";
              this.$emit('addPic2map',rainUrl,extent);
            }
            if(this.currentProForm.proList[i]=="水位"){
              //水位
              var rainUrl=url+"Current_Zeta_"+this.currentProForm.preTime+"_"+stDateStr+"_L6.png";
              this.$emit('addPic2map',rainUrl,extent);
            }
          }
        }
      }
    }
</script>

<style scoped>

</style>
