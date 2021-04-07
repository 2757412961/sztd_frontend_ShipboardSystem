<template>
  <modal width="550"
         v-model="predict_paper_modal"
         title="预报单查询"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">
    <Divider orientation="left" style="margin-top: 0;font-weight: bold">日常预报单</Divider>
    <el-form :inline="true" :model="dailyForm" class="demo-form-inline" size="mini">
      <el-form-item label="年">
        <el-select v-model="dailyForm.year" style="width:75px" @change="queryDailyPre(dailyForm.year,-1,-1)">
          <el-option
            v-for="item in dailyForm.yearList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="月">
        <el-select v-model="dailyForm.month" style="width:60px"  @change="queryDailyPre(dailyForm.year,dailyForm.month,-1)">
          <el-option
            v-for="item in dailyForm.monthList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日">
        <el-select v-model="dailyForm.day" style="width:60px" @change="queryDailyPre(dailyForm.year,dailyForm.month,dailyForm.day)">
          <el-option
            v-for="item in dailyForm.dayList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时">
        <el-select v-model="dailyForm.hour" style="width:60px">
          <el-option
            v-for="item in dailyForm.hourList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryDailyPrePath">查询</el-button>
      </el-form-item>
    </el-form>
    <Divider orientation="left" style="font-weight: bold">台风预报单</Divider>
    <el-form :inline="true" :model="typhForm" class="demo-form-inline" size="mini">
      <el-form-item label="年">
        <el-select v-model="typhForm.year" style="width:140px" @change="queryTyphPre(typhForm.year,-1,-1)">
          <el-option
            v-for="item in typhForm.yearList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-left:45px" label="月">
        <el-select v-model="typhForm.month" style="width:120px;" @change="queryTyphPre(typhForm.year,typhForm.month,-1)">
          <el-option
            v-for="item in typhForm.monthList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="台风编号">
        <el-select v-model="typhForm.typhId" style="width:100px" @change="queryTyphPre(typhForm.year,typhForm.month,typhForm.typhId)">
          <el-option
            v-for="item in typhForm.typhIdList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="预报时间">
        <el-select v-model="typhForm.time" style="width:120px">
          <el-option
            v-for="item in typhForm.timeList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  @click="queryTyphPrePath">查询</el-button>
      </el-form-item>
    </el-form>
    <Divider orientation="left" style="font-weight: bold">未来十天预报单</Divider>
    <el-form :inline="true" :model="tenDayForm" class="demo-form-inline" size="mini">
      <el-form-item label="年">
        <el-select v-model="tenDayForm.year" style="width:105px" @change="queryTDPre(tenDayForm.year,-1)">
          <el-option
            v-for="item in tenDayForm.yearList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="月">
        <el-select v-model="tenDayForm.month" style="width:80px" @change="queryTDPre(tenDayForm.year,tenDayForm.month)">
          <el-option
            v-for="item in tenDayForm.monthList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日">
        <el-select v-model="tenDayForm.day" style="width:80px">
          <el-option
            v-for="item in tenDayForm.dayList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryTDPrePath">查询</el-button>
      </el-form-item>
    </el-form>
    <Divider orientation="left" style="font-weight: bold">未来四周预报单</Divider>
    <el-form :inline="true" :model="fourWeekForm" class="demo-form-inline" size="mini">
      <el-form-item label="年">
        <el-select v-model="fourWeekForm.year" style="width:105px" @change="queryFWPre(fourWeekForm.year,-1)">
          <el-option
            v-for="item in fourWeekForm.yearList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="月">
        <el-select v-model="fourWeekForm.month" style="width:80px" @change="queryFWPre(fourWeekForm.year,fourWeekForm.month)">
          <el-option
            v-for="item in fourWeekForm.monthList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日">
        <el-select v-model="fourWeekForm.day" style="width:80px">
          <el-option
            v-for="item in fourWeekForm.dayList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryFWPrePath">查询</el-button>
      </el-form-item>
    </el-form>
  </modal>

</template>

<script>
    export default {
      name: "PredictPaperModal",
      data(){
        return {
          predict_paper_modal:false,
          dailyForm: {
            year: '',
            yearList:[],
            month: '',
            monthList:[],
            day:'',
            dayList:[],
            hour:'',
            hourList:[]
          },
          typhForm:{
            year:'',
            month:'',
            typhId:'',
            time:'',
            yearList:[],
            monthList:[],
            typhIdList:[],
            timeList:[]
          },
          tenDayForm: {
            year: '',
            yearList:[],
            month: '',
            monthList:[],
            day:'',
            dayList:[],
          },
          fourWeekForm:{
            year: '',
            yearList:[],
            month: '',
            monthList:[],
            day:'',
            dayList:[],
          }
        }
      },
      methods:{
        openPredictPaperModal(){
          this.predict_paper_modal=true;
          //TODO 初始化查询构造下拉框
          this.queryDailyPre(-1,-1,-1);
          this.queryTyphPre(-1,-1,-1)
          this.queryTDPre(-1,-1);
          this.queryFWPre(-1,-1)

        },

        queryDailyPre(year,month,day) {
          var api=`/api/SZTDService/queryDailyPre.action`;
          this.$axios.get(api,{
            params:{
              year:year,
              month:month,
              day:day
            }
          }).then((response)=> {
            if(response.data!=""){
              var data=response.data.split('?')
              if(data.length>0){
                switch(data[0]){
                  case "none":
                    this.dailyForm.yearList=data[1].split(';');
                    this.dailyForm.year=this.dailyForm.yearList[this.dailyForm.yearList.length-1];
                  case "year":
                    this.dailyForm.monthList=data[2].split(';');
                    this.dailyForm.month=this.dailyForm.monthList[this.dailyForm.monthList.length-1];
                  case "month":
                    this.dailyForm.dayList=data[3].split(';');
                    this.dailyForm.day=this.dailyForm.dayList[this.dailyForm.dayList.length-1];
                  case "day":
                    this.dailyForm.hourList=data[4].split(';');
                    this.dailyForm.hour=this.dailyForm.hourList[this.dailyForm.hourList.length-1];
                    break;
                }
              }
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
        queryTyphPre(year,month,typhId){
          var api=`/api/SZTDService/queryTYPHPre.action`;
          this.$axios.get(api,{
            params:{
              year:year,
              month:month,
              typhId:typhId
            }
          }).then((response)=> {
            if(response.data!=""){
              var data=response.data.split('?')
              if(data.length>0){
                switch(data[0]){
                  case "none":
                    this.typhForm.yearList=data[1].split(';');
                    this.typhForm.year=this.typhForm.yearList[this.typhForm.yearList.length-1];
                  case "year":
                    this.typhForm.monthList=data[2].split(';');
                    this.typhForm.month=this.typhForm.monthList[this.typhForm.monthList.length-1];
                  case "month":
                    this.typhForm.typhIdList=data[3].split(';');
                    this.typhForm.typhId=this.typhForm.typhIdList[this.typhForm.typhIdList.length-1];
                  case "typhid":
                    this.typhForm.timeList=data[4].split(';');
                    this.typhForm.time=this.typhForm.timeList[this.typhForm.timeList.length-1];
                    break;
                }
              }
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
        queryTDPre(year,month){
          var api=`/api/SZTDService/queryTDPre.action`;
          this.$axios.get(api,{
            params:{
              year:year,
              month:month
            }
          }).then((response)=> {
            if(response.data!=""){
              var data=response.data.split('?')
              if(data.length>0){
                switch(data[0]){
                  case "none":
                    this.tenDayForm.yearList=data[1].split(';');
                    this.tenDayForm.year=this.tenDayForm.yearList[this.tenDayForm.yearList.length-1];
                  case "year":
                    this.tenDayForm.monthList=data[2].split(';');
                    this.tenDayForm.month=this.tenDayForm.monthList[this.tenDayForm.monthList.length-1];
                  case "month":
                    this.tenDayForm.dayList=data[3].split(';');
                    this.tenDayForm.day=this.tenDayForm.dayList[this.tenDayForm.dayList.length-1];
                    break;
                }
              }
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
        queryFWPre(year,month){
          var api=`/api/SZTDService/queryFWPre.action`;
          this.$axios.get(api,{
            params:{
              year:year,
              month:month
            }
          }).then((response)=> {
            if(response.data!=""){
              var data=response.data.split('?')
              if(data.length>0){
                switch(data[0]){
                  case "none":
                    this.fourWeekForm.yearList=data[1].split(';');
                    this.fourWeekForm.year=this.fourWeekForm.yearList[this.fourWeekForm.yearList.length-1];
                  case "year":
                    this.fourWeekForm.monthList=data[2].split(';');
                    this.fourWeekForm.month=this.fourWeekForm.monthList[this.fourWeekForm.monthList.length-1];
                  case "month":
                    this.fourWeekForm.dayList=data[3].split(';');
                    this.fourWeekForm.day=this.fourWeekForm.dayList[this.fourWeekForm.dayList.length-1];
                    break;
                }
              }
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
        queryDailyPrePath() {
          var api=`/api/SZTDService/queryDailyPrePath.action`;
          this.$axios.get(api,{
            params:{
              year:this.dailyForm.year,
              month:this.dailyForm.month,
              day:this.dailyForm.day,
              hour:this.dailyForm.hour
            }
          }).then((response)=> {
            if(response.data!=""){
              var url= "http://"+this.$store.state.serverIP + "/SZTDData/" +response.data;
              window.open(url);
            }
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

          })
        },
        queryTyphPrePath(){
          var api=`/api/SZTDService/queryTYPHPrePath.action`;
          this.$axios.get(api,{
            params:{
              typhId:this.typhForm.typhId,
              time:this.typhForm.time
              // preId:this.typhForm.preId
            }
          }).then((response)=> {
            if(response.data!=""){
              var url= "http://"+this.$store.state.serverIP + "/SZTDData/" +response.data;
              window.open(url);
            }
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

          })
        },
        queryTDPrePath(){
          var api=`/api/SZTDService/queryTDPrePath.action`;
          this.$axios.get(api,{
            params:{
              year:this.tenDayForm.year,
              month:this.tenDayForm.month,
              day:this.tenDayForm.day
            }
          }).then((response)=> {
            if(response.data!=""){
              var url= "http://"+this.$store.state.serverIP + "/SZTDData/" +response.data;
              window.open(url);
            }
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

          })
        },
        queryFWPrePath(){
          var api=`/api/SZTDService/queryFWPrePath.action`;
          this.$axios.get(api,{
            params:{
              year:this.fourWeekForm.year,
              month:this.fourWeekForm.month,
              day:this.fourWeekForm.day
            }
          }).then((response)=> {
            if(response.data!=""){
              var url= "http://"+this.$store.state.serverIP + "/SZTDData/" +response.data;
              window.open(url);
            }
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

          })
        },
      }
    }
</script>

<style scoped>
  .demo-form-inline{
    margin-left:30px;
  }
</style>
