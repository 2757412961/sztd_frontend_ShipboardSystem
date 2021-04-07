<template>
  <el-container style="height:100%;">
    <!--导航栏-->
    <el-header height="60px" >
      <HeadNav></HeadNav>
    </el-header>
    <!--网页主体-->
    <el-container style="top:60px;bottom:0">
      <!--侧边栏-->
      <!--el-aside width="300px">
        <router-view/>    </el-aside-->
      <el-aside style="width:auto">
        <LeftNav @openModal="openModal"></LeftNav>
      </el-aside>
      <el-main style="padding:0px;margin-left:60px">
          <map-layout ref="mapLayout" @openRealTimeMonitorModalHome="openRealTimeMonitorModalHome()" @drawWindTimeSeries="drawWindTimeSeries" @drawCurrentTimeSeries="drawCurrentTimeSeries" @drawWaveTimeSeries="drawWaveTimeSeries"></map-layout>
      </el-main>
    </el-container>
    <BuoyCurrentObservationModal ref="buoyCurrentObservationModal"></BuoyCurrentObservationModal>
    <BuoyWaveObservationModal ref="buoyWaveObservationModal"></BuoyWaveObservationModal>
    <DensityObservationModal ref="densityObservationModal"></DensityObservationModal>
    <SeaLevelObservationModal ref="seaLevelObservationModal"></SeaLevelObservationModal>
    <WeatherSiteObservationModal ref="weatherSiteObservationModal"></WeatherSiteObservationModal>
    <PredictPaperModal ref="predictPaperModal"></PredictPaperModal>
    <WeatherProModal ref="weatherProModal" @addPic2map="addPic2map" @cleanMapPro="cleanMapPro"></WeatherProModal>
    <RefineWeaProModal ref="refineWeaProModal" @addPic2map="addPic2map" @cleanMapPro="cleanMapPro"></RefineWeaProModal>
    <WaveProModal ref="waveProModal" @addPic2map="addPic2map" @cleanMapPro="cleanMapPro"></WaveProModal>
    <CurrentProModal ref="currentProModal" @addPic2map="addPic2map" @cleanMapPro="cleanMapPro"></CurrentProModal>
    <WindTimeSeriesModal ref="windTimeSeriesModal"></WindTimeSeriesModal>
    <CurrentTimeSeriesModal ref="currentTimeSeriesModal"></CurrentTimeSeriesModal>
    <ReWindTimeSeriesModal ref="reWindTimeSeriesModal"></ReWindTimeSeriesModal>
    <WaveTimeSeriesModal ref="waveTimeSeriesModal"></WaveTimeSeriesModal>
    <RealTimeMonitorModal ref="realTimeMonitorModal"></RealTimeMonitorModal>
    <HistoryMonitorModal ref="historyMonitorModal"></HistoryMonitorModal>
    <ForecastAllMonitorModal ref="forecastAllMonitorModal"></ForecastAllMonitorModal>
    <TenMAvgMonitorModal ref="tenMAvgMonitorModal"></TenMAvgMonitorModal>
  </el-container>
</template>


<script>
    import MapLayout from "./MapLayout";
    import HeadNav from "./HeadNav";
    import LeftNav from "./LeftNav";
    import PredictPaperModal from "../components/PredictPaperModal";
    import WeatherProModal from "../components/Production/WeatherProModal";
    import WaveProModal from "../components/Production/WaveProModal";
    import WindTimeSeriesModal from "../components/WindTimeSeriesModal";
    import BuoyCurrentObservationModal from "../components/Observation/BuoyCurrentObservationModal";
    import BuoyWaveObservationModal from "../components/Observation/BuoyWaveObservationModal";
    import DensityObservationModal from "../components/Observation/DensityObservationModal";
    import SeaLevelObservationModal from "../components/Observation/SeaLevelObservationModal";
    import WeatherSiteObservationModal from "../components/Observation/WeatherSiteObservationModal";
    import RefineWeaProModal from "../components/Production/RefineWeaProModal";
    import CurrentProModal from "../components/Production/CurrentProModal";
    import CurrentTimeSeriesModal from "../components/CurrentTimeSeriesModal";
    import ReWindTimeSeriesModal from "../components/ReWindTimeSeriesModal";
    import WaveTimeSeriesModal from "../components/WaveTimeSeriesModal";
    import RealTimeMonitorModal from "../components/Monitor/RealTimeMonitorModal";
    import HistoryMonitorModal from "../components/Monitor/HistoryMonitorModal";
    import ForecastAllMonitorModal from "../components/Monitor/ForecastAllMonitorModal";
    import TenMAvgMonitorModal from "../components/Monitor/TenMAvgMonitorModal";
    export default {
      name: "home",
      components: {
        ReWindTimeSeriesModal,
        CurrentTimeSeriesModal,
        CurrentProModal,
        RefineWeaProModal,
        WeatherSiteObservationModal,
        BuoyCurrentObservationModal,
        BuoyWaveObservationModal,
        SeaLevelObservationModal,
        DensityObservationModal,
        WindTimeSeriesModal,
        WaveTimeSeriesModal,
        WaveProModal,
        WeatherProModal,
        PredictPaperModal,
        RealTimeMonitorModal,
        HistoryMonitorModal,
        ForecastAllMonitorModal,
        TenMAvgMonitorModal,
        LeftNav,
        HeadNav,
        MapLayout,
        HeadNav},
      created:function(){
        if(this.$store.state.name==""){
          this.$router.push({
            name: 'login'
          })
        }
      },
      watch: {
        // 可以通过watch监听vuex中的text，数据变动时能够执行对应的函数
        '$store.state.name':function(newer, older) { // 可以获取新值与老值两个参数
          if(newer==""){
            this.$router.push({
              name: 'login'
            })
          }
        },
        deep: true // 开启深度监听
      },
      methods:{
        openModal(key){
          switch(key){
            case "buoyCurrentObservation":
              this.$refs.buoyCurrentObservationModal.openBuoyCurrentObservationModal();
              break;
            case "buoyWaveObservation":
              this.$refs.buoyWaveObservationModal.openBuoyWaveObservationModal();
              break;
            case "densityObservation":
              this.$refs.densityObservationModal.openDensityObservationModal();
              break;
            case "seaLevelObservation":
              this.$refs.seaLevelObservationModal.openSeaLevelObservationModal();
              break;
            case "weatherSiteObservation":
              this.$refs.weatherSiteObservationModal.openWeatherSiteObservationModal();
              break;
            case "predictPaper":
              this.$refs.predictPaperModal.openPredictPaperModal();
              break;
            case "weatherProduction":
              this.$refs.weatherProModal.openWeatherProModal();
              break;
            case "refineWeatherProduction":
              this.$refs.refineWeaProModal.openRefineWeaProModal();
              break;
            case "waveProduction":
              this.$refs.waveProModal.openWaveProModal();
              break;
            case "currentProduction":
              this.$refs.currentProModal.openCurrentProModal();
              break;
            case "realTimeMonitor":
              this.$refs.realTimeMonitorModal.openRealTimeMonitorModal();
              break;
            case "historyMonitor":
              this.$refs.historyMonitorModal.openHistoryMonitorModal();
              break;
            case "forecastAllMonitor":
              this.$refs.forecastAllMonitorModal.openForecastAllMonitorModal();
              break;
            case "tenMAvgMonitor":
              this.$refs.tenMAvgMonitorModal.openTenMAvgMonitorModal();
              break;
          }
        },
        async openRealTimeMonitorModalHome(){
          await this.refreshMonitorConf();
          this.$refs.realTimeMonitorModal.openRealTimeMonitorModal();
        },
        drawWindTimeSeries(key,strDate,lonlat){
          switch(key){
            case "10mWindTimeSeries":
              this.$refs.windTimeSeriesModal.openWindTimeSeriesModal("10m",strDate,lonlat);
              break;
            case "500hpaWindTimeSeries":
              this.$refs.windTimeSeriesModal.openWindTimeSeriesModal("500hpa",strDate,lonlat);
              break;
            case "200hpaWindTimeSeries":
              this.$refs.windTimeSeriesModal.openWindTimeSeriesModal("200hpa",strDate,lonlat);
              break;
            case "refine10mWindTimeSeries":
              this.$refs.reWindTimeSeriesModal.openReWindTimeSeriesModal(strDate,lonlat);
              break;

          }
        },
        drawCurrentTimeSeries(siglay,strDate,lonlat){
          this.$refs.currentTimeSeriesModal.openCurrentTimeSeriesModal(siglay,strDate,lonlat);
        },
        drawWaveTimeSeries(key,strDate,lonlat){
          switch(key){
            case "HSDIRWaveTimeSeries":
              this.$refs.waveTimeSeriesModal.openWaveTimeSeriesModal("HSDIR",strDate,lonlat);
              break;
            case "TPSWaveTimeSeries":
              this.$refs.waveTimeSeriesModal.openWaveTimeSeriesModal("TPS",strDate,lonlat);
              break;
          }
        },
        addPic2map(url,extent){
          this.$refs.mapLayout.addPictureToMap(url,extent)
        },
        cleanMapPro(){
          this.$refs.mapLayout.cleanMapPro();
        },
        async refreshMonitorConf() {
          const api = `/api/SZTDService/queryMonitorConf.action`;
          await this.$axios.get(api).then((response) => {
            this.$store.commit("setMonitorConf", response.data);
          }).catch((response) => {
            //失败回调
            this.$confirm('更新配置失败！', '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            });
          });
        }
      }
    }
</script>

<style scoped>
  .el-header{
    border-bottom:solid 1px #e6e6e6
  }
  .el-menu-vertical-demo {
    float:left;
    position:absolute;
    z-index:999;
    top:60px;
    bottom:0;
    text-align:left;

  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 150px;
  }


</style>
