<template>
  <modal width="950"
         v-model="reWind_time_series_modal"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">
    <img
      id="img_logo"
      src="~assets/loading.jpg"
      style="position: absolute;left:390px;top:180px;"
      v-show="loadingStatus"
    >
    <div id="atmRefineWindTimeSeriesChart" :style="{width: '930px', height: '500px'}"></div>
  </modal>
</template>

<script>
  import echarts from 'echarts/lib/echarts';
    export default {
      name: "ReWindTimeSeriesModal",
      data(){
        return {
          reWind_time_series_modal:false,
          loadingStatus:false,
          chart:null
        }
      },
      methods:{
        openReWindTimeSeriesModal(strDate,e){
          //判断是否在数据经纬度范围内
          if(e[0]>=this.$store.state.atmRefineExtent[0] &
            e[0]<=this.$store.state.atmRefineExtent[2] &
            e[1]>=this.$store.state.atmRefineExtent[1] &
            e[1]<=this.$store.state.atmRefineExtent[3]) {
            //显示
            this.reWind_time_series_modal = true;
            this.loadingStatus=true;
            //请求nc时间序列数据并绘制图表
            this.chart = this.$echarts.init(document.getElementById('atmRefineWindTimeSeriesChart'));
            this.chart.clear();
            this.queryReWindNCdata(strDate,e);
          }

        },
        queryReWindNCdata(strDate,e){
          var api=`/api/SZTDService/queryAtmReWin10mNcData.action`;
          this.chart.clear();
          this.$axios.get(api,{
            params:{
              strDate:strDate,
              lon:e[0],
              lat:e[1]
            }
          }).then((response)=> {
            this.loadingStatus=false;
            var tableData=response.data;
            if(tableData!=[])
              this.drawReWindTSChart(tableData);
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
            this.loadingStatus=false;
          })
        },
        drawReWindTSChart(tableData){

          function windLevel(speed){
            //svg 的坐标系是右为x正方向，下为y正方向，因此为了画出标准的北向风，此处y值全为负值
            //风向标旗头指的方向是风向
            if(speed<3)
              return 'M0,0 L0,-20 L4,-20';//1级
            else if(speed<5)
              return 'M0,0 L0,-20 L8,-20';//2级
            else if(speed<7)
              return 'M0,0 L0,-20 L8,-20 M0,-16 L4,-16';//3级
            else if(speed<9)
              return 'M0,0 L0,-20 L8,-20 M0,-16 L8,-16';  //4级
            else if(speed<11)
              return 'M0,0 L0,-20 L8,-20 M0,-16 L8,-16 M0,-12 L4,-12';  //5级
            else if(speed<13)
              return 'M0,0 L0,-20 L8,-20 M0,-16 L8,-16 M0,-12 L8,-12';  //6级
            else if(speed<15)
              return 'M0,0 L0,-20 L8,-20 M0,-16 L8,-16 M0,-12 L8,-12 M0,-8 L4,-8';  //7级
            else
              return 'M0,0 L0,-20 L8,-16 L0,-12';    //8级以上
          }

          var data = echarts.util.map(tableData, function (entry) {
            return [entry.time, entry.speed, entry.dir];
          });

          var dims = {
            time: 0,
            speed: 1,
            dir: 2
          };

          function renderArrow(param, api) {
            var point = api.coord([
              api.value(dims.time),
              api.value(dims.speed)
            ]);

            return {
              type: 'path',
              shape: {
                pathData: windLevel(api.value(dims.speed)),//'M0,0 L0,-24 L-8 -24',//'M31 16l-15-15v9h-26v12h26v9z',
              },
              rotation: -api.value(dims.dir),
              position: point,
              style: api.style({
                fill: null,
                stroke: '#555',
                lineWidth: 1
              })
            };
          }

          var option = {
            title:{
              text:"未来120小时风场时间序列图",
              left: 'center',
              textStyle:{
                fontWeight:'bold',
                fontSize:16
              }
            },
            tooltip: {
              trigger: 'axis',
              formatter: function (params) {
                return [
                  '预报时次：' + params[0].value[dims.time],
                  '风速：' + params[0].value[dims.speed].toFixed(2) +'m/s',
                  '风向：' + (params[0].value[dims.dir]*180/Math.PI).toFixed(2)+ '°'
                ].join('<br>');
              }
            },
            grid: {
              left:50,
              right:30,
              top: 40,
              bottom: 50
            },
            xAxis: {
              name: '预报时次(h)',
              nameLocation: 'middle',
              nameGap: 30,
              type: 'value',
              splitLine: {
                lineStyle: {
                  color: '#ddd'
                }
              },
              nameTextStyle:{
                fontWeight:'bold',
                fontSize:14,
              }
            },
            yAxis: {
              name: '风速(m/s)',
              nameLocation: 'middle',
              nameGap: 25,
              axisLine: {
                lineStyle: {
                  color: '#666'
                }
              },
              splitLine: {
                lineStyle: {
                  color: '#ddd'
                }
              },
              nameTextStyle:{
                fontWeight:'bold',
                fontSize:14,
              }
            },
            series: [ {
              type: 'custom',
              renderItem: renderArrow,
              encode: {
                x: dims.time,
                y: dims.speed
              },
              data: data,
              z: 10
            },{
              type: 'line',
              symbol: 'none',
              encode: {
                x: dims.time,
                y: dims.speed
              },
              lineStyle: {
                normal: {
                  color: '#FF9900'
                }
              },
              data: data,
              z: 1
            }]
          };
          this.chart.setOption(option);
        }
      }
    }
</script>

<style scoped>

</style>
