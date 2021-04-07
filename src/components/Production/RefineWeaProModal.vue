<template>
  <modal width="310"
         v-model="refine_wea_pro_modal"
         title="精细化大气数值预报产品"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true"
         @on-cancel="closeModal">
    <el-form :inline="true"  :model="refineWeaProForm" class="demo-form-inline" size="mini">
      <el-form-item label="起报日期">
        <DatePicker type="date" v-model="refineWeaProForm.stDate" placeholder="选择日期"  style="width: 200px"></DatePicker>
      </el-form-item>
      <el-form-item label="数值产品" style="margin-bottom: 10px">
        <el-checkbox-group v-model="refineWeaProForm.proList">
          <el-checkbox label="气压场" style="margin-right:10px;"></el-checkbox>
          <el-checkbox label="风场" style="margin-right:10px;"></el-checkbox>
          <el-checkbox label="降水" style="margin-right: 0px;"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="预报时次" style="line-height:35px">
        <el-slider v-model="refineWeaProForm.preTime" :marks="refineWeaProForm.marks" @change="loadRefineWeaProToMap" style="width: 180px ;height: 50px;margin-left: 10px;"  :min="0" :max="168">
          <el-option
            v-for="item in refineWeaProForm.preTimeList"
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
          @click="loadRefineWeaProToMap">加载</el-button>
      </el-form-item>
    </el-form>
  </modal>
</template>

<script>
    export default {
        name: "RefineWeaProModal",
      data(){
        return {
          refine_wea_pro_modal:false,
          loadStatus:false,
          refineWeaProForm:{
            stDate:null,
            // preTime:'',
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
            preTimeList: Array.apply(null, Array(169)).map(function(item, i) {return i}),
            proList:[]
          },
        }
      },
      computed:{
        //联动显示“预报时间”
        // 计算属性的 getter
        forecastTime: function () {
          // `this` 指向 vm 实例
          var time="";
          if(this.refineWeaProForm.stDate!=null) {
            time = this.util.formatDateTimeForecastTime(this.refineWeaProForm.stDate, this.refineWeaProForm.preTime);
          }
          return time;
        }
      },
      methods: {
        /**
         * 打开精细化气象数值预报模态框
         */
        openRefineWeaProModal() {
          //TODO 后台组织默认日期
          var api = `/api/SZTDService/queryAtmRefineProNew.action`;
          this.$axios.get(api).then((response) => {
            if (response.data != "") {
              this.refineWeaProForm.stDate = new Date(response.data);
            }
            this.refine_wea_pro_modal = true;
          }).catch((response) => {
            //失败回调
            this.$confirm('服务器失联！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
          }).finally((response) => {

          })
          // this.refine_wea_pro_modal=true;
        },
        /**
         * 关闭模态框，请出地图上的数值产品
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
         * 在地图上加载精细化大气数值预报产品
         */
        loadRefineWeaProToMap(){
          //清除地图上现有的数据产品
          this.$emit('cleanMapPro');
          var stDateStr=this.refineWeaProForm.stDate.getFullYear()+this.num2Str(this.refineWeaProForm.stDate.getMonth()+1)+this.num2Str(this.refineWeaProForm.stDate.getDate())+ "20";
          var url=`/proapi/sztd_data_matlab/atmRefine/`+stDateStr+`/`;;
          var extent=this.$store.state.atmRefineExtent;
          for(var i=0;i<this.refineWeaProForm.proList.length;i++){
            if(this.refineWeaProForm.proList[i]=="气压场"){
              //气压等值线图
              var pressUrl=url+"AtmRefine_10mSLP_"+this.refineWeaProForm.preTime+"_"+stDateStr+"_L6.png";
              this.$emit('addPic2map', pressUrl, extent);
            }
            if(this.refineWeaProForm.proList[i]=="风场"){
              //风力填色图
              var windUrl2=url+"AtmRefine_10mWindU10V10_"+this.refineWeaProForm.preTime+"_"+stDateStr+".png";
              this.$emit('addPic2map',windUrl2,extent);
              //风向图（风向标）
              var windUrl1=url+"AtmRefine_10mWindVane_"+this.refineWeaProForm.preTime+"_"+stDateStr+"_L6.png";
              this.$emit('addPic2map',windUrl1,extent);
            }
            if(this.refineWeaProForm.proList[i]=="降水"){
              //降水量
              var rainUrl=url+"AtmRefine_Rainnc_"+this.refineWeaProForm.preTime+"_"+stDateStr+".png";
              this.$emit('addPic2map',rainUrl,extent);
            }
          }
        }
      }
    }
</script>

<style scoped>

</style>
