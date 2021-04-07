<template>
  <modal width="335"
         v-model="weather_pro_modal"
         title="大气数值预报产品"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true"
         @on-cancel="closeModal">
    <el-form :inline="true"  :model="weatherProForm" class="demo-form-inline" size="mini">
      <el-form-item label="起报日期">
        <DatePicker type="date" v-model="weatherProForm.stDate" placeholder="选择日期"  style="width: 225px"></DatePicker>
      </el-form-item>
      <el-form-item label="垂直高度">
        <el-select v-model="weatherProForm.verticalLayer" placeholder="选择垂直层" style="width: 225px" @change="changeCBDisable">
          <el-option label="海平面" value="surface"></el-option>
          <el-option label="500hPa" value="500hpa"></el-option>
          <el-option label="200hPa" value="200hpa"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数值产品" style="margin-bottom: 10px">
          <el-checkbox-group v-model="weatherProForm.proList">
            <el-checkbox label="气压场" style="margin-left: 10px;" :disabled="cb_dis.press"></el-checkbox>
            <el-checkbox label="10m风场" style="margin-left: 8px;" :disabled="cb_dis.tenWind"></el-checkbox>
            <el-checkbox label="6h降水" style="margin-right: 0px;" :disabled="cb_dis.rain"></el-checkbox>
            <el-checkbox label="风场" style="margin-left: 10px;" :disabled="cb_dis.wind"></el-checkbox>
            <el-checkbox label="高度场" style="margin-left: 8px;" :disabled="cb_dis.height"></el-checkbox>
            <el-checkbox label="温度场"  style="margin-right: 0;" :disabled="cb_dis.temp"></el-checkbox>

          </el-checkbox-group>
      </el-form-item>
      <el-form-item label="预报时次" style="line-height:40px">
        <el-slider v-model="weatherProForm.preTime" :marks="weatherProForm.marks" @change="loadWeatherProToMap" style="width: 200px ;height: 50px;margin-left: 10px;"  :min="0" :max="168">
          <el-option
          v-for="item in weatherProForm.preTimeList"
          :key="item"
          :label="item"
          :value="item">
          </el-option>
        </el-slider>
      </el-form-item>
      <el-form-item label="预报时间" style="line-height:40px">
        <div style="line-height:42px; margin-left: 45px;">{{forecastTime}}</div>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="loadStatus"
          size="mini"
          style="width:270px;margin-left: 16px;"
          @click="loadWeatherProToMap">加载</el-button>
      </el-form-item>
    </el-form>
  </modal>
</template>

<script>
    export default {
      name: "weatherProModal",
      data(){
        return {
          weather_pro_modal:false,
          loadStatus:false,
          cb_dis:{
            press:true,
            tenWind:true,
            rain:true,
            height:true,
            temp:true,
            wind:true
          },
          weatherProForm:{
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
            verticalLayer:'',
            proList:[],
          },

        }
      },
      computed:{
        //联动显示“预报时间”
        // 计算属性的 getter
        forecastTime: function () {
          // `this` 指向 vm 实例
          var time="";
          if(this.weatherProForm.stDate!=null) {
            time = this.util.formatDateTimeForecastTime(this.weatherProForm.stDate, this.weatherProForm.preTime);
          }
          return time;
        }
      },
      methods:{
        openWeatherProModal(){
          var api=`/api/SZTDService/queryAtmProNew.action`;
          this.$axios.get(api).then((response)=> {
            if(response.data!="") {
              //TODO 组织默认日期
              this.weatherProForm.stDate = new Date(response.data);
            }
            this.weather_pro_modal=true;
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

        changeCBDisable(){
          this.cb_dis.press=true;
          this.cb_dis.tenWind=true;
          this.cb_dis.rain=true;
          this.cb_dis.height=true;
          this.cb_dis.temp=true;
          this.cb_dis.wind=true;
          switch(this.weatherProForm.verticalLayer){
            case 'surface':
              this.cb_dis.press=false;
              this.cb_dis.tenWind=false;
              this.cb_dis.rain=false;
              break;
            case '200hpa':
              this.cb_dis.wind=false;
              break;
            case '500hpa':
              this.cb_dis.height=false;
              this.cb_dis.temp=false;
              this.cb_dis.wind=false;
              break;
          }
        },
        num2Str(num){
          if(num<10){
            return "0"+num;
          }else{
            return ""+num;
          }
        },
        loadWeatherProToMap(){
          //清除地图上现有的数据产品
          this.$emit('cleanMapPro');
          //起报时间字符串，20为起报时间的北京时;
          var stDateStr=this.weatherProForm.stDate.getFullYear()+this.num2Str(this.weatherProForm.stDate.getMonth()+1)+this.num2Str(this.weatherProForm.stDate.getDate())+ "20";
          var url=`/proapi/sztd_data_matlab/atm/`+stDateStr+`/`;//"http://"+this.$store.state.serverIP+"/sztdMatlab/";
          var extent=this.$store.state.atmExtent;
          switch(this.weatherProForm.verticalLayer){
            case "surface":
              for(var i=0;i<this.weatherProForm.proList.length;i++){
                if(this.weatherProForm.proList[i]=="气压场"){
                  //气压等值线图
                  var pressUrl=url+"Atm_10mSLP_"+this.weatherProForm.preTime+"_"+stDateStr+"_L6.png";
                  this.$emit('addPic2map', pressUrl, extent);
                }
                if(this.weatherProForm.proList[i]=="10m风场"){
                  //风向图（风向标）
                  var windUrl1=url+"Atm_10mWindVane_"+this.weatherProForm.preTime+"_"+stDateStr+"_L6.png";
                  this.$emit('addPic2map',windUrl1,extent);
                  //风力填色图
                  var windUrl2=url+"Atm_10mWindU10V10_"+this.weatherProForm.preTime+"_"+stDateStr+".png";
                  this.$emit('addPic2map',windUrl2,extent);
                }
                if(this.weatherProForm.proList[i]=="6h降水"){
                  //近六小时累积降水图
                  var rainUrl=url+"Atm_RaincRainnc_"+this.weatherProForm.preTime+"_"+stDateStr+".png";
                  this.$emit('addPic2map',rainUrl,extent);
                }
              }
              break;
            case "500hpa":
              for(var i=0;i<this.weatherProForm.proList.length;i++){
                if(this.weatherProForm.proList[i]=="风场"){
                  var windUrl1=url+"Atm_500hPaWindUUVV_"+this.weatherProForm.preTime+"_"+stDateStr+"_L6.png";
                  this.$emit('addPic2map',windUrl1,extent);
                  var windUrl2=url+"Atm_500hPaWindVane_"+this.weatherProForm.preTime+"_"+stDateStr+"_L6.png";
                  this.$emit('addPic2map',windUrl2,extent);
                }
                if(this.weatherProForm.proList[i]=="高度场"){
                  var GHTUrl=url+"Atm_500hPaGHT_"+this.weatherProForm.preTime+"_"+stDateStr+"_L6.png";
                  this.$emit('addPic2map',GHTUrl,extent);
                }
                if(this.weatherProForm.proList[i]=="温度场"){
                  var tempUrl=url+"Atm_500hPaTT_"+this.weatherProForm.preTime+"_"+stDateStr+"_L6.png";
                  this.$emit('addPic2map',tempUrl,extent);
                }
              }
              break;
            case "200hpa":
              for(var i=0;i<this.weatherProForm.proList.length;i++){
                if(this.weatherProForm.proList[i]=="风场"){
                  var windUrl=url+"Atm_200hPaWindUUVV_"+this.weatherProForm.preTime+"_"+stDateStr+".png";
                  this.$emit('addPic2map',windUrl,extent);
                }
              }
              break;

          }

        }
      }
    }
</script>

<style scoped>

</style>
