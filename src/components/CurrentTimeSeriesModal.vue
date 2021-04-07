<template>
  <modal width="950"
         v-model="current_time_series_modal"
         :mask-closable="false"
         :draggable="true"
         :footer-hide="true">
    <div id="currentTimeSeriesChart" :style="{width: '930px', height: '500px'}"></div>
  </modal>
</template>

<script>
  import echarts from 'echarts/lib/echarts';
    export default {
        name: "CurrentTimeSeriesModal",
      data(){
          return {
            current_time_series_modal:false,
            chart:null,
            loadingStatus:true
          }
      },
      methods:{
        openCurrentTimeSeriesModal(siglay,strDate,e){
          //判断是否在数据经纬度范围内
          if(e[0]>=this.$store.state.currentExtent[0] &
            e[0]<=this.$store.state.currentExtent[2] &
            e[1]>=this.$store.state.currentExtent[1] &
            e[1]<=this.$store.state.currentExtent[3]) {
            //显示
            this.current_time_series_modal = true;
            this.loadingStatus=true;
            //请求nc时间序列数据并绘制图表
            this.chart = this.$echarts.init(document.getElementById('currentTimeSeriesChart'));
            this.chart.clear();

            this.queryCurrentNCdata(siglay,strDate,e);
          }
        },
        queryCurrentNCdata(siglay,strDate,e){
          var api=`/api/SZTDService/queryCurrentNcData.action`;
          this.$axios.get(api,{
            params:{
              strDate:strDate,
              siglay:siglay,
              lon:e[0],
              lat:e[1]
            }
          }).then((response)=> {
            this.loadingStatus=false;
            var tableData=response.data;
            if(tableData!=[]){
              this.drawCurrentTSChart(tableData);
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
        drawCurrentTSChart(tableData){
          function currentLevel(speed){
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

          var data = echarts.util.map(tableData, function (entry) {
            return [entry.time,entry.speed, entry.dir,entry.zeta];
          });

          var dims = {
            time: 0,
            speed: 1,
            dir: 2,
            zeta:3
          };
          function renderArrow(param, api) {
            var point = api.coord([
              api.value(dims.time),
              api.value(dims.zeta)
            ]);

            return {
              type: 'path',
              shape: {
                pathData: currentLevel(api.value(dims.speed)),
              },
              rotation: -api.value(dims.dir),
              position: point,
              style: api.style({
                fill: '#444444',
                stroke: '#444444',
                lineWidth: 1
              })
            };
          }

          var option = {
            title:{
              text:"未来24小时流场时间序列图",
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
                  '流速：' + params[0].value[dims.speed].toFixed(2) +'m/s',
                  '流向：' + (params[0].value[dims.dir]*180/Math.PI).toFixed(2)+ '°',
                  '水位：' + params[0].value[dims.zeta].toFixed(2) + 'm'
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
              name: '水位(m)',
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
                y: dims.zeta
              },
              data: data,
              z: 10
            },{
              type: 'line',
              symbol: 'none',
              encode: {
                x: dims.time,
                y: dims.zeta
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
        }
      }
    }
</script>

<style scoped>

</style>
