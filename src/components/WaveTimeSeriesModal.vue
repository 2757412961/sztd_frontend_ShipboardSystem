<template>
  <modal width="950"
         v-model="wave_time_series_modal"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">
    <div id="waveTimeSeriesChart" :style="{width: '930px', height: '500px'}"></div>
  </modal>
</template>

<script>
  import echarts from 'echarts/lib/echarts';
    export default {
        name: "WaveTimeSeriesModal",
      data(){
          return {
            wave_time_series_modal:false,
            chart:null,
            loadingStatus:true
          }
      },
      methods:{
        openWaveTimeSeriesModal(key,strDate,e){
          //判断是否在数据经纬度范围内
          if(e[0]>=this.$store.state.waveExtent[0] &
            e[0]<=this.$store.state.waveExtent[2] &
            e[1]>=this.$store.state.waveExtent[1] &
            e[1]<=this.$store.state.waveExtent[3]) {
            //显示
            this.wave_time_series_modal = true;
            this.loadingStatus=true;
            //请求nc时间序列数据并绘制图表
            this.chart = this.$echarts.init(document.getElementById('waveTimeSeriesChart'));
            this.chart.clear();

            var api=`/api/SZTDService/`;
            switch (key){
              case "HSDIR":
                //queryWaveHSNcData
                api+=`queryWaveHSDIRNcData.action`;
                this.queryWaveHSDIRNCdata(api,strDate,e);
                break;
              case "TPS":
                api+=`queryWaveTPSNcData.action`;
                this.queryWaveTPSNCdata(api,strDate,e);
                break;
            }

          }
        },
        queryWaveHSDIRNCdata(api,strDate,e){
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
            if(tableData!=[]){
              this.drawWaveHSDIRTSChart(tableData);
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
            this.loadingStatus=false;
          })

        },
        queryWaveTPSNCdata(api,strDate,e){
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
            if(tableData!=[]){
              this.drawWaveTPSTSChart(tableData);
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
            this.loadingStatus=false;
          })

        },
        drawWaveHSDIRTSChart(tableData) {
          function waveLevel(speed){
            //svg 的坐标系是右为x正方向，下为y正方向，因此为了画出标准的北向风，此处y值全为负值
            //风向标旗头指的方向是风向
            if(speed<0.3)
              return 'M-2,0 L-2,-8 L-4,-8 L0,-12 L4,-8 L2,-8 L2,0 L-2,0';
            else if(speed<0.6)
              return 'M-2,0 L-2,-12 L-4,-12 L0,-16 L4,-12 L2,-12 L2,0 L-2,0';
            else if(speed<0.9)
              return 'M-2,0 L-2,-16 L-4,-16 L0,-20 L4,-16 L2,-16 L2,0 L-2,0';
            else if(speed<1.2)
              return 'M-2,0 L-2,-20 L-4,-20 L0,-24 L4,-20 L2,-20 L2,0 L-2,0';
            else if(speed<1.5)
              return 'M-2,0 L-2,-24 L-4,-24 L0,-28 L4,-24 L2,-24 L2,0 L-2,0';
            else
              return 'M-2,0 L-2,-28 L-4,-28 L0,-32 L4,-28 L2,-28 L2,0 L-2,0';
          }

          function renderArrow(param, api) {
            var point = api.coord([
              api.value(dims.time),
              api.value(dims.HS)
            ]);

            return {
              type: 'path',
              shape: {
                pathData: waveLevel(api.value(dims.HS)),
              },
              rotation:(api.value(dims.DIR)-90)*Math.PI/180,//传入弧度制
              position: point,
              style: api.style({
                fill: '#444444',
                stroke: '#444444',
                lineWidth: 1
              })
            };
          }

          var data = echarts.util.map(tableData, function (entry) {
            return [entry.time,entry.HS,entry.DIR,];
          });
          var dims = {
            time: 0,
            HS: 1,
            DIR:2
          };
          var option = {
            title:{
              text:"未来24小时浪高时间序列图",
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
                  '浪高：' + params[0].value[dims.HS].toFixed(2)+'m',
                  '浪向：' + (params[0].value[dims.DIR]).toFixed(2)+ '°',
                ].join('<br>');
              }
            },
            grid: {
              left:75,
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
              name: '浪高(m)',
              nameLocation:'middle',
              nameGap: 40,
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
            series: [{
              type: 'custom',
              renderItem: renderArrow,
              encode: {
                x: dims.time,
                y: dims.HS
              },
              data: data,
              z: 10
            },{
              type: 'line',
              symbol: 'none',
              encode: {
                x: dims.time,
                y: dims.HS
              },
              lineStyle: {
                normal: {
                  color: '#339933'
                }
              },
              data: data,
              z: 1
            }]
          };
          this.chart.setOption(option);
        },
        drawWaveTPSTSChart(tableData) {
          var data = echarts.util.map(tableData, function (entry) {
            return [entry.time,entry.TPS];
          });
          var dims = {
            time: 0,
            TPS: 1,
          };
          var option = {
            title:{
              text:"未来24小时海浪周期时间序列图",
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
                  '周期：' + params[0].value[dims.TPS].toFixed(2),
                ].join('<br>');
              }
            },
            grid: {
              left:75,
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
              name: '周期',
              nameLocation:'middle',
              nameGap: 40,
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
            series: [{
              type: 'line',
              symbol: 'none',
              encode: {
                x: dims.time,
                y: dims.TPS,
              },
              lineStyle: {
                normal: {
                  color: '#339933'
                }
              },
              data: data,
              z: 1
            }]
          };
          this.chart.setOption(option);
        },

      }

    }
</script>

<style scoped>

</style>
