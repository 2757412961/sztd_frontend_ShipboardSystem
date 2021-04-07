<template>
  <div style="position: absolute;bottom:0;top:60px;right:0px;left:60px">
    <div id="tdtmap" style="">
      <div id="popup" class="ol-popup" :style={minWidth:ol_popup_min_width}>
        <div id="popup-title" class="popup-title">{{ popup_title }}</div>
        <div id="popup-content"></div>
      </div>
      <PlatformLast24Modal ref="platformLast24Modal"></PlatformLast24Modal>
      <SiteLast24Modal ref="siteLast24Modal"></SiteLast24Modal>
      <Buoy123Last24Modal ref="buoy123Last24Modal"></Buoy123Last24Modal>
      <Buoy4Last24Modal ref="buoy4Last24Modal"></Buoy4Last24Modal>
    </div>
    <div id="mouse-position" style="position: absolute;right:50px;top:10px;"></div>
    <div id="legend" style="position: absolute;right:0px;bottom:0px;">
      <li v-for="(item,index) in curLegend" :key="index">
        <img id="img_logo" :src="item" slot="icon" style="width:500px">
      </li>
    </div>
    <div id="buoy-history" style="position: absolute;right:50px;top:40px;">
      <el-button icon="el-icon-location-outline" circle @click="showRealTimeMonitorModal"></el-button>
    </div>
    <!--<div id="buoy-history" style="position: absolute;right:50px;top:40px;">-->
    <!--<el-button icon="el-icon-search" circle @click="drawBuoyGPSHistory"></el-button>-->
    <!--</div>-->
  </div>

</template>

<script>
    import Map from 'ol/Map'
    import View from 'ol/View'
    import XYZ from "ol/source/XYZ";
    import TileLayer from "ol/layer/Tile";
    import {Vector} from 'ol/source';
    import VectorLayer from 'ol/layer/Vector';
    import Overlay from 'ol/Overlay';
    import Feature from 'ol/Feature';
    import LineString from 'ol/geom/LineString';
    import Polygon from 'ol/geom/Polygon';
    import Point from 'ol/geom/Point';
    import Style from 'ol/style/Style';
    import Icon from 'ol/style/Icon';
    import Stroke from 'ol/style/Stroke';
    import Circle from 'ol/style/Circle';
    import Fill from 'ol/style/Fill';
    import 'ol/ol.css'
    import {fromLonLat} from 'ol/proj';
    import {transformExtent} from 'ol/proj';
    import {toLonLat} from 'ol/proj.js';
    import {toStringHDMS} from 'ol/coordinate';
    import Projection from "ol/proj/Projection";
    import Select from 'ol/interaction/Select';
    import {singleClick} from 'ol/events/condition';
    import PlatformLast24Modal from "../components/Map/PlatformLast24Modal";
    import Static from 'ol/source/ImageStatic.js';
    import ImageLayer from 'ol/layer/Image.js';
    import MousePosition from 'ol/control/MousePosition.js';
    import {createStringXY} from 'ol/coordinate.js';
    import {defaults as defaultControls} from 'ol/control.js';
    import ZoomSlider from 'ol/control/ZoomSlider';
    import SiteLast24Modal from "../components/Map/SiteLast24Modal";
    import Buoy123Last24Modal from "../components/Map/Buoy123Last24Modal";
    import Buoy4Last24Modal from "../components/Map/Buoy4Last24Modal";
    import {Circle as CircleStyle} from 'ol/style.js';
    import VectorSource from 'ol/source/Vector.js';

    export default {
        name: "map-layout",
        components: {SiteLast24Modal, PlatformLast24Modal, Buoy123Last24Modal, Buoy4Last24Modal},
        data() {
            return {
                //地图要素
                map: null,//地图
                bridge_layer: null,//深中通道桥、隧道图层
                island_layer: null,//深中通道桥图层
                route_layer: null,//航线图层
                platform_layer: null,//平台图层
                buoy_layer: null,//浮标图层
                buoy_history_layer: null,//浮标历史轨迹图层
                site_layer: null,//气象站图层
                productionLyrs: [],//数值预报产品图层

                siteId: null,//siteId
                buoyId: null,//buoyId

                //popup三兄弟
                container: "",
                content: "",
                overlay: "",
                popup_title: "",
                ol_popup_min_width: "300px",

                lastPointerFeature: null,//记录上一次光标指向的feature
                proHit: false,//记录弹框状态
                //openlayer图片的src使用方法！！
                platformIconUrl: require('../assets/platform.png'),
                buoyIconUrl: require('../assets/buoy.png'),
                siteIconUrl: require('../assets/site.png'),

                //图例
                curLegend: [],//当前图例
                legends: {
                    'tenMWind': require("../assets/legend/10mWind.jpg"),
                    'twoHpaWind': require("../assets/legend/200hpaWind.jpg"),
                    'wave': require("../assets/legend/wave.jpg"),
                    'rain': require("../assets/legend/rain.jpg"),
                    'current': require("../assets/legend/current.jpg"),
                    'salinity': require("../assets/legend/salinity.jpg"),
                    'waveTPS': require("../assets/legend/waveTPS.jpg"),
                },
                //记录当前地图缩放层级
                oldZoom: 0,

                //wave图
                waveAll: [],
            }
        },
        methods: {
            /**
             * 向地图上添加深中通道桥和隧道、西岛、东岛
             */
            addBridge() {
                //绘制深中通道大桥
                var szLonLat = [];
                szLonLat[0] = fromLonLat([113.617607247222222, 22.553349375000000]);
                szLonLat[1] = fromLonLat([113.621381936111111, 22.553686277777778]);
                szLonLat[2] = fromLonLat([113.630785091666667, 22.555963402777778]);
                szLonLat[3] = fromLonLat([113.639237250000000, 22.558064225000000]);
                szLonLat[4] = fromLonLat([113.639860219444444, 22.558185897222222]);
                szLonLat[5] = fromLonLat([113.641059516666667, 22.558317461111111]);
                szLonLat[6] = fromLonLat([113.644051022222222, 22.558645858333333]);
                szLonLat[7] = fromLonLat([113.648362280555556, 22.558495047222222]);
                szLonLat[8] = fromLonLat([113.652575975000000, 22.557707902777778]);
                szLonLat[9] = fromLonLat([113.656342336111111, 22.556424552777778]);
                szLonLat[10] = fromLonLat([113.658953383333333, 22.555220902777778]);
                szLonLat[11] = fromLonLat([113.666916813888889, 22.550869480555556]);
                szLonLat[12] = fromLonLat([113.673872455555556, 22.547929822222222]);
                szLonLat[13] = fromLonLat([113.679034961111111, 22.546424344444444]);
                szLonLat[14] = fromLonLat([113.684378661111111, 22.545606952777778]);
                szLonLat[15] = fromLonLat([113.689836972222222, 22.545497488888889]);
                szLonLat[16] = fromLonLat([113.695160827777778, 22.546090463888889]);
                szLonLat[17] = fromLonLat([113.707048500000000, 22.549453802777778]);
                szLonLat[18] = fromLonLat([113.710668647222222, 22.550602944444444]);
                szLonLat[19] = fromLonLat([113.714645511111111, 22.551865200000000]);
                szLonLat[20] = fromLonLat([113.722014197222222, 22.554203697222222]);
                szLonLat[21] = fromLonLat([113.731214550000000, 22.557122908333333]);
                szLonLat[22] = fromLonLat([113.737655030555555, 22.559166036111111]);
                szLonLat[23] = fromLonLat([113.746803997222222, 22.562460405555556]);
                szLonLat[24] = fromLonLat([113.752584372222222, 22.565412577777778]);
                szLonLat[25] = fromLonLat([113.754855163888889, 22.566786613888889]);
                szLonLat[26] = fromLonLat([113.760337002777778, 22.570190294444444]);
                szLonLat[27] = fromLonLat([113.767700591666667, 22.574795177777778]);
                szLonLat[28] = fromLonLat([113.769010450000000, 22.575608808333333]);
                szLonLat[29] = fromLonLat([113.772605130555556, 22.577840277777778]);
                szLonLat[30] = fromLonLat([113.775408238888889, 22.579580255555556]);
                szLonLat[31] = fromLonLat([113.778886705555556, 22.581739313888889]);
                szLonLat[32] = fromLonLat([113.783110580555556, 22.584360861111111]);
                szLonLat[33] = fromLonLat([113.785322666666667, 22.585733705555556]);
                szLonLat[34] = fromLonLat([113.786651638888889, 22.586558447222222]);
                szLonLat[35] = fromLonLat([113.788292586111111, 22.587576775000000]);
                szLonLat[36] = fromLonLat([113.792123533333333, 22.589954036111111]);
                szLonLat[37] = fromLonLat([113.796754108333333, 22.592827255555556]);
                szLonLat[38] = fromLonLat([113.800180286111111, 22.594953000000000]);
                szLonLat[39] = fromLonLat([113.803068883333333, 22.596745097222222]);
                szLonLat[40] = fromLonLat([113.803830750000000, 22.5971652666666676]);
                szLonLat[41] = fromLonLat([113.807559516666667, 22.599218972222222]);
                szLonLat[42] = fromLonLat([113.805957177777778, 22.598335983333333]);


                var szStyle = new Style({
                    stroke: new Stroke({
                        width: 3,
                        color: [147, 112, 219, 1]
                    })
                })

                var sz = new Feature({
                    geometry: new LineString(szLonLat),
                    name: "NotSelect1",
                });
                sz.setStyle(szStyle);
                this.bridge_layer.getSource().addFeature(sz);

            },
            /**
             * 向地图上添加西岛、东岛、缺失岛
             */
            addIsland() {
                //绘制西岛
                var westIslandLonLat = [];
                westIslandLonLat[0] = fromLonLat([113.767700591666667, 22.574795177777778]);
                westIslandLonLat[1] = fromLonLat([113.763723466666667, 22.575778344444444]);
                westIslandLonLat[2] = fromLonLat([113.760337002777778, 22.570190294444444]);
                westIslandLonLat[3] = fromLonLat([113.767160680555556, 22.571006544444444]);
                westIslandLonLat[4] = fromLonLat([113.767700591666667, 22.574795177777778]);

                var westIslandStyle = new Style({
                    fill: new Fill({
                        color: [185, 255, 185, 0.6]
                    })
                })

                var westIsland = new Feature({
                    geometry: new Polygon([westIslandLonLat]),
                    name: "NotSelect2",
                });
                westIsland.setStyle(westIslandStyle);
                this.island_layer.getSource().addFeature(westIsland);

                //绘制底图缺损岛
                var mapMoreLonLat = [];
                // mapMoreLonLat[0] = fromLonLat([113.6663, 22.6286]);
                mapMoreLonLat[0] = fromLonLat([113.6657, 22.6204]);//起始点
                mapMoreLonLat[1] = fromLonLat([113.6665, 22.6160]);
                mapMoreLonLat[2] = fromLonLat([113.6673, 22.6120]);
                mapMoreLonLat[3] = fromLonLat([113.6681, 22.6080]);
                mapMoreLonLat[4] = fromLonLat([113.6688, 22.6040]);
                mapMoreLonLat[5] = fromLonLat([113.6700, 22.6019]);//左侧突起
                mapMoreLonLat[6] = fromLonLat([113.6861, 22.5775]);//左下端
                mapMoreLonLat[7] = fromLonLat([113.6885, 22.5750]);
                mapMoreLonLat[8] = fromLonLat([113.6890, 22.5750]);
                mapMoreLonLat[9] = fromLonLat([113.6895, 22.5760]);
                mapMoreLonLat[10] = fromLonLat([113.6900, 22.5794]);//右下端
                mapMoreLonLat[11] = fromLonLat([113.6841, 22.6240]);//终止点
                mapMoreLonLat[12] = fromLonLat([113.6657, 22.6204]);//起始点

                var mapMoreStyle = new Style({
                    fill: new Fill({
                        color: [220, 220, 240, 1]
                    })
                })

                var mapMore = new Feature({
                    geometry: new Polygon([mapMoreLonLat]),
                    name: "NotSelect3",
                });
                mapMore.setStyle(mapMoreStyle);
                this.island_layer.getSource().addFeature(mapMore);
            },
            /**
             * 向地图上添加航线
             */
            addRoute() {
                //绘制龙穴航线
                var route1LonLat = [];
                route1LonLat[0] = fromLonLat([113.650000, 22.707963]);
                route1LonLat[1] = fromLonLat([113.653354, 22.702990]);
                route1LonLat[2] = fromLonLat([113.660892, 22.691099]);
                route1LonLat[3] = fromLonLat([113.668282, 22.681892]);
                route1LonLat[4] = fromLonLat([113.682640, 22.661777]);
                route1LonLat[5] = fromLonLat([113.698119, 22.629776]);
                route1LonLat[6] = fromLonLat([113.700157, 22.624256]);
                route1LonLat[7] = fromLonLat([113.771308, 22.589562]);
                route1LonLat[8] = fromLonLat([113.795306, 22.592781]);
                route1LonLat[9] = fromLonLat([113.808037, 22.599829]);


                var route1Style = new Style({
                    stroke: new Stroke({
                        width: 3,
                        color: [255, 140, 0, 1],
                        lineDash: [1, 2, 3, 4, 5, 6, 7, 8],
                    }),
                })

                var route1 = new Feature({
                    geometry: new LineString(route1LonLat),
                    name: "NotSelect4",
                });
                route1.setStyle(route1Style);
                this.route_layer.getSource().addFeature(route1);

                //绘制福运航线
                var route2LonLat = [];
                // route2LonLat[0] = fromLonLat([113.775814, 22.56208611]);
                // route2LonLat[1] = fromLonLat([113.752617, 22.4850833]);
                // route2LonLat[2] = fromLonLat([113.795783, 22.3372833]);
                // route2LonLat[3] = fromLonLat([113.7892, 22.1768]);

                route2LonLat[0] = fromLonLat([113.7748, 22.5786]);
                route2LonLat[1] = fromLonLat([113.7422, 22.4904]);
                route2LonLat[2] = fromLonLat([113.8145, 22.3345]);
                route2LonLat[3] = fromLonLat([113.7892, 22.1768]);

                var route2Style = new Style({
                    stroke: new Stroke({
                        width: 3,
                        color: [255, 140, 0, 1],
                        lineDash: [1, 2, 3, 4, 5, 6, 7, 8],
                    }),
                })

                var route2 = new Feature({
                    geometry: new LineString(route2LonLat),
                    name: "NotSelect5",
                });
                route2.setStyle(route2Style);
                this.route_layer.getSource().addFeature(route2);
            },
            /**
             * 向地图上添加浮标
             */
            addBuoy() {
                this.buoy_layer.getSource().clear();

                /** 浮标初始化*/
                this.getBuoy(1);
                this.getBuoy(2);
                this.getBuoy(3);
                this.getBuoy(4);
            },

            /**
             * 向地图上添加气象平台
             */
            addPlatform() {
                this.platform_layer.getSource().clear();
                var platform = new Feature({
                    geometry: new Point(fromLonLat([113 + 45 * 1 / 60 + 47.20497 * 1 / 3600, 22 + 34 * 1 / 60 + 35.73474 * 1 / 3600])),
                    name: "Platform",
                });
                var style = new Style({
                    image: new Icon({
                        src: this.platformIconUrl,
                        scale: 0.2
                    })
                });
                platform.setStyle(style);
                this.platform_layer.getSource().addFeature(platform);
            },

            /**
             * 向地图上添加气象站
             */
            addSite() {
                this.site_layer.getSource().clear();

                /** 浮标初始化*/
                this.getSite(1);
                this.getSite(2);
                this.getSite(3);

                // var site = new Feature({
                //   geometry: new Point(fromLonLat([113.8, 22.1735])),
                //   name: "Site",
                // });
                // var style = new Style({
                //   image: new Icon({
                //     src: this.siteIconUrl,
                //     scale: 0.2
                //   })
                // });
                // site.setStyle(style);
                // this.site_layer.getSource().addFeature(site);
            },

            /**
             * 地图初始化
             */
            mapInit() {
                this.showRealTimeMonitorModal();
                /** 地图图层初始化*/
                    //"http://"+this.$store.state.serverIP+"/tianditu/tdt/{z}/{y}/{x}.jpg"
                    //"http://"+this.$store.state.serverIP+"/FeatureWithLabelGZA/{z}/{x}/{y}.jpg"
                var map_source = new XYZ({
                        url: "http://" + this.$store.state.serverIP + "/sztd_map/tdt_lxt/{z}/{x}/{y}.jpg"    //FeatureWithLabelGZA
                    });
                var map_layer = new TileLayer({
                    source: map_source
                });
                var map_label_source = new XYZ({
                    url: "http://" + this.$store.state.serverIP + "/sztd_map/tdt_lxt_label/{z}/{y}/{x}.png"    //FeatureWithLabelGZA
                });
                var map_label_layer = new TileLayer({
                    source: map_label_source
                });

                /** 桥图层初始化*/
                var bridge_source = new Vector({
                    features: null
                });
                this.bridge_layer = new VectorLayer({
                    name: "bridge_layer",
                    chName: "桥图层",
                    source: bridge_source
                });

                /** 岛图层初始化*/
                var island_source = new Vector({
                    features: null
                });
                this.island_layer = new VectorLayer({
                    name: "island_layer",
                    chName: "桥图层",
                    source: island_source
                });

                /** 航线图层初始化*/
                var route_source = new Vector({
                    features: null
                });
                this.route_layer = new VectorLayer({
                    name: "route_layer",
                    chName: "航线图层",
                    source: route_source
                });

                /** 平台图层初始化*/
                var platform_source = new Vector({
                    features: null
                });
                this.platform_layer = new VectorLayer({
                    name: "platform_layer",
                    chName: "平台图层",
                    source: platform_source
                });

                /** 气象站图层初始化*/
                var site_source = new Vector({
                    features: null
                });
                this.site_layer = new VectorLayer({
                    name: "site_layer",
                    chName: "平台图层",
                    source: site_source
                });

                /**浮标图层初始化*/
                var buoy_source = new Vector({
                    features: null
                });
                this.buoy_layer = new VectorLayer({
                    name: "buoy_layer",
                    chName: "浮标图层",
                    source: buoy_source
                });

                /**浮标历史轨迹图层初始化*/
                var buoy_history_source = new Vector({
                    features: null
                });
                this.buoy_history_layer = new VectorLayer({
                    name: "buoy_history_layer",
                    chName: "浮标图层",
                    source: buoy_history_source
                });

                /** 视图初始化*/
                var view = new View({
                    center: fromLonLat([113.8, 22.45]),
                    zoom: 10,
                    minZoom: 5,
                    maxZoom: 13,
                });
                this.oldZoom = 10;

                //mousePosition初始化
                var mousePositionControl = new MousePosition({
                    coordinateFormat: createStringXY(4),
                    projection: 'EPSG:4326',
                    // comment the following two lines to have the mouse position
                    // be placed within the map.
                    className: 'custom-mouse-position',
                    target: document.getElementById('mouse-position'),
                    undefinedHTML: '&nbsp;'
                });

                /** Map初始化*/
                this.map = new Map({
                    target: "tdtmap",
                    //顺序越前面，图层越下面
                    layers: [map_layer, map_label_layer, this.island_layer, this.bridge_layer, this.route_layer, this.buoy_history_layer, this.platform_layer, this.buoy_layer, this.site_layer,],
                    view: view,
                    controls: defaultControls().extend([mousePositionControl]),
                });

                /**
                 * Elements that make up the popup.
                 */
                this.container = document.getElementById('popup');
                this.content = document.getElementById('popup-content');
                this.overlay = new Overlay({
                    element: this.container,
                    autoPan: true,
                    autoPanAnimation: {
                        duration: 250
                    },
                    offset: [10, -20],
                });
                this.map.addOverlay(this.overlay);

                //鼠标移动事件绑定
                this.map.on('pointermove', this.mouseMove);
                //鼠标点击地图响应事件绑定
                // 点击事件没有用，都跳过
                // this.map.on('singleclick', this.singleClickOnMap);
                //地图范围变化事件绑定
                this.map.on('moveend', this.zoomEvent);

                //鼠标点击feature事件绑定
                var selectClick = new Select({
                    condition: singleClick,
                    multi: true,
                });
                // 点击事件没有用，都跳过
                // this.map.addInteraction(selectClick);
                // selectClick.on("select", this.singleClick);
            },

            /**
             * 点击feature响应事件(只有在选中Feature时才会触发）
             * @param e
             */
            singleClick(e) {
                var features = e.target.getFeatures().getArray();
                if (features[0].get('name').search(/Platform/) != -1) {
                    //显示平台最近24小时数的时间序列数据
                    this.$refs.platformLast24Modal.openPlatformLast24Modal()
                } else if (features[0].get('name').search(/Site/) != -1) {
                    //显示平台最近24小时数的时间序列数据
                    this.$refs.siteLast24Modal.openSiteLast24Modal()
                } else if (features[0].get('name').search(/Buoy1/) != -1) {
                    //显示浮标123最近24小时数的时间序列数据
                    this.$refs.buoy123Last24Modal.openBuoy123Last24Modal(1)
                } else if (features[0].get('name').search(/Buoy2/) != -1) {
                    //显示浮标123最近24小时数的时间序列数据
                    this.$refs.buoy123Last24Modal.openBuoy123Last24Modal(2)
                } else if (features[0].get('name').search(/Buoy3/) != -1) {
                    //显示浮标123最近24小时数的时间序列数据
                    this.$refs.buoy123Last24Modal.openBuoy123Last24Modal(3)
                } else if (features[0].get('name').search(/Buoy4/) != -1) {
                    //显示浮标4最近24小时数的时间序列数据
                    this.$refs.buoy4Last24Modal.openBuoy4Last24Modal(4)
                }
            },

            /**
             * 地图区域鼠标移动事件
             * @param e
             */
            mouseMove(e) {
                var pixel = e.pixel;//获取地图上坐标
                var hit = this.map.hasFeatureAtPixel(pixel);//判断是否存在feature
                this.map.getTargetElement().style.cursor = hit ? 'pointer' : '';//变换鼠标指针的状态
                //如果触到feature
                if (hit) {
                    //获取当前的feature
                    var features = this.map.getFeaturesAtPixel(pixel);
                    if (features[0].get('name').search(/Not/) == -1 &&
                        features[0] != this.lastpointerFeature) {

                        //移动前后是不同feature，将原来的feature图标大小回归正常
                        if (this.lastpointerFeature != null) {
                            var style = this.lastpointerFeature.getStyle();
                            style.getImage().setScale(0.2);
                            this.lastpointerFeature.setStyle(style);
                            this.overlay.setPosition(undefined);
                            this.proHit = false;//更改弹窗状态
                        }

                        this.lastpointerFeature = features[0];//记录本次feature
                        //图标放大
                        var style = this.lastpointerFeature.getStyle();
                        style.getImage().setScale(0.25);
                        this.lastpointerFeature.setStyle(style);

                        if (features[0].get('name').search(/Platform/) != -1) {
                            this.platformPopShow(features[0]);
                        } else if (features[0].get('name').search(/Site1/) != -1) {
                            this.siteId = 1;
                            this.sitePopShow(features[0]);
                        } else if (features[0].get('name').search(/Site2/) != -1) {
                            this.siteId = 2;
                            this.sitePopShow(features[0]);
                        } else if (features[0].get('name').search(/Site3/) != -1) {
                            this.siteId = 3;
                            this.sitePopShow(features[0]);
                        } else if (features[0].get('name').search(/Buoy1/) != -1) {
                            this.buoyId = 1;
                            this.buoy123PopShow(features[0]);
                        } else if (features[0].get('name').search(/Buoy2/) != -1) {
                            this.buoyId = 2;
                            this.buoy123PopShow(features[0]);
                        } else if (features[0].get('name').search(/Buoy3/) != -1) {
                            this.buoyId = 3;
                            this.buoy123PopShow(features[0]);
                        } else if (features[0].get('name').search(/Buoy4/) != -1) {
                            this.buoyId = 4;
                            this.buoy4PopShow(features[0]);
                        }
                    }

                } else {
                    if (this.lastpointerFeature != null) {
                        var style = this.lastpointerFeature.getStyle();
                        style.getImage().setScale(0.2);
                        this.lastpointerFeature.setStyle(style);
                    }
                    this.overlay.setPosition(undefined);
                    this.proHit = false;//更改弹窗状态
                    this.lastpointerFeature = null;//记录本次feature
                }

            },
            /**
             * 显示site气象站最新数据弹出框
             * @param feature
             */
            sitePopShow(feature) {
                this.ol_popup_min_width = "210px";
                var api = `/api/SZTDService/querySiteNew.action`;
                this.$axios.get(api).then((response) => {
                    //response.data是数据库中的一条记录，可以直接访问这条记录的字段 ctdData.id
                    var siteNew = response.data;
                    //构建Popup_title文字内容
                    if (this.siteId == 1) {
                        this.popup_title = "桂山牛头岛气象站";
                    } else if (this.siteId == 2) {
                        this.popup_title = "西人工岛气象站";
                    } else if (this.siteId == 3) {
                        this.popup_title = "龙穴船厂气象站";
                    }

                    if (siteNew != null) {
                        //组织弹出框内容
                        var html = "";
                        this.content.innerHTML = html;
                        this.overlay.setPosition(feature.getGeometry().getCoordinates());
                    }

                }).catch((response) => {
                    //失败回调
                    this.$confirm('服务器失联！', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning'
                    });
                }).finally((response) => {

                })
            },
            /**
             * 显示platform平台弹出框
             * @param feature
             */
            platformPopShow(feature) {
                this.ol_popup_min_width = "210px";
                var api = `/api/SZTDService/queryPlatformNew.action`;
                this.$axios.get(api).then((response) => {
                    //构建Popup_title文字内容
                    this.popup_title = "西人工岛观测站";
                    //response.data是数据库中的一条记录，可以直接访问这条记录的字段 ctdData.id
                    var platformNew = response.data;
                    if (platformNew != null) {
                        //组织弹出框内容
                        var html = "";
                        // //表层CTD
                        // html +=
                        //     "<table>" +
                        //     "<tr><th>" + "表层CTD" + "</th></tr>" +
                        //     "<tr><td>时间：</td><td>" + this.util.formatDateTime(new Date(platformNew.topCtdNew.dt)) + "</td></tr>" +
                        //     "<tr><td>深度：</td><td>" + platformNew.topCtdNew.wp + "</td></tr>" +
                        //     "<tr><td>温度：</td><td>" + platformNew.topCtdNew.wt + "</td></tr>" +
                        //     "<tr><td>盐度：</td><td>" + platformNew.topCtdNew.sl + "</td></tr>" +
                        //     "<tr><td>密度：</td><td>" + platformNew.topCtdNew.density + "</td></tr>" +
                        //     "</table>";
                        // //底层CTD
                        // html +=
                        //     "<table>" +
                        //     "<tr><th>" + "底层CTD" + "</th></tr>" +
                        //     "<tr><td>时间：</td><td>" + this.util.formatDateTime(new Date(platformNew.bottomCtdNew.dt)) + "</td></tr>" +
                        //     "<tr><td>深度：</td><td>" + platformNew.bottomCtdNew.wp + "</td></tr>" +
                        //     "<tr><td>温度：</td><td>" + platformNew.bottomCtdNew.wt + "</td></tr>" +
                        //     "<tr><td>盐度：</td><td>" + platformNew.bottomCtdNew.sl + "</td></tr>" +
                        //     "<tr><td>密度：</td><td>" + platformNew.bottomCtdNew.density + "</td></tr>" +
                        //     "</table>";
                        // //潮位计
                        // html +=
                        //     "<table>" +
                        //     "<tr><th>" + "潮位计" + "</th></tr>" +
                        //     "<tr><td>时间：</td><td>" + this.util.formatDateTime(new Date(platformNew.tideNew.dt)) + "</td></tr>" +
                        //     "<tr><td>水压：</td><td>" + platformNew.tideNew.pr + "</td></tr>" +
                        //     "<tr><td>潮位：</td><td>" + (platformNew.tideNew.wlCorrect) + "</td></tr>" +
                        //     "</table>";
                        this.content.innerHTML = html;
                        this.overlay.setPosition(feature.getGeometry().getCoordinates());
                    }
                }).catch((response) => {
                    //失败回调
                    this.$confirm('服务器失联！', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning'
                    });
                }).finally((response) => {

                })
            },
            /**
             * 显示buoy123弹出框
             * @param feature
             */
            buoy123PopShow(feature) {
                this.ol_popup_min_width = "340px";
                var api = `/api/SZTDService/queryBuoy123New.action?id=${this.buoyId}`;
                this.$axios.get(api).then((response) => {
                    //构建Popup_title文字内容
                    this.popup_title = this.buoyId + "号浮标";
                    //response.data是数据库中的一条记录，可以直接访问这条记录的字段 ctdData.id
                    var buoy123New = response.data;
                    if (buoy123New != null) {
                        //组织弹出框内容
                        var html = "";
                        // if (buoy123New.buoywvnew != null) {
                        //     //浮标123：海浪
                        //     html +=
                        //         "<table>" +
                        //         "<tr><th>" + "海浪" + "</th></tr>" +
                        //         "<tr><td>时间：</td><td>" + this.util.formatDateTime(new Date(buoy123New.buoywvnew.dt)) + "</td></tr>" +
                        //         "<tr><td>1/10波高：</td><td>" + buoy123New.buoywvnew.tenwh + "</td><td>1/10波高周期：</td><td>" + buoy123New.buoywvnew.tenwht + "</td></tr>" +
                        //         "<tr><td>平均波高：</td><td>" + buoy123New.buoywvnew.averwh + "</td><td>平均波高周期：</td><td>" + buoy123New.buoywvnew.averwht + "</td></tr>" +
                        //         "<tr><td>最大波高：</td><td>" + buoy123New.buoywvnew.maxwh + "</td><td>最大波高周期：</td><td>" + buoy123New.buoywvnew.maxwht + "</td></tr>" +
                        //         "<tr><td>有效波高：</td><td>" + buoy123New.buoywvnew.sigwh + "</td><td>有效波高周期：</td><td>" + buoy123New.buoywvnew.sigwht + "</td></tr>" +
                        //         "<tr><td>主波向：</td><td>" + buoy123New.buoywvnew.maindire + "</td><td>波数：</td><td>" + buoy123New.buoywvnew.wavenum + "</td></tr>" +
                        //         "<tr><td>锚灯A状态：</td><td>" + buoy123New.buoywvnew.lighta + "</td><td>水警状态：</td><td>" + buoy123New.buoywvnew.waterpo + "</td></tr>" +
                        //         "</table>";
                        // }
                        // if (buoy123New.buoygpsnew != null && buoy123New.fubnew != null) {
                        //     //浮标123：海流
                        //     html +=
                        //         "<table>" +
                        //         "<tr><th>" + "海流" + "</th></tr>" +
                        //         "<tr><td>时间：</td><td>" + this.util.formatDateTime(new Date(buoy123New.buoygpsnew.dt)) + "</td></tr>" +
                        //         "<tr><td>水温：</td><td>" + buoy123New.buoygpsnew.watertem + "</td></tr>" +
                        //         "<tr><td>第四层流速：</td><td>" + buoy123New.fubnew.flowv + "</td><td>第四层流向：</td><td>" + buoy123New.fubnew.flowdire + "</td></tr>" +
                        //         "<tr><td>锚灯A：</td><td>" + buoy123New.buoygpsnew.lighta + "</td><td>锚灯B：</td><td>" + buoy123New.buoygpsnew.lightb + "</td></tr>" +
                        //         "<tr><td>AIS：</td><td>" + buoy123New.buoygpsnew.ais + "</td><td>水警：</td><td>" + buoy123New.buoygpsnew.waterpo + "</td></tr>" +
                        //         "<tr><td>海流计压力：</td><td>" + buoy123New.buoygpsnew.currpre + "</td></tr>" +
                        //         "</table>";
                        // }
                        this.content.innerHTML = html;
                        this.overlay.setPosition(feature.getGeometry().getCoordinates());
                    }
                }).catch((response) => {
                    //失败回调
                    this.$confirm('服务器失联！', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning'
                    });
                }).finally((response) => {

                })
            },
            /**
             * 显示buoy4弹出框
             * @param feature
             */
            buoy4PopShow(feature) {
                this.ol_popup_min_width = "340px";
                var api = `/api/SZTDService/queryBuoy4New.action?id=${this.buoyId}`;
                this.$axios.get(api).then((response) => {
                    //构建Popup_title文字内容
                    this.popup_title = this.buoyId + "号浮标";
                    //response.data是数据库中的一条记录，可以直接访问这条记录的字段 ctdData.id
                    var buoy4New = response.data;
                    if (buoy4New != null) {
                        //组织弹出框内容
                        var html = "";
                        // if (buoy4New.buoywvnew != null) {
                        //     //浮标4：海浪
                        //     html +=
                        //         "<table>" +
                        //         "<tr><th>" + "海浪" + "</th></tr>" +
                        //         "<tr><td>时间：</td><td>" + this.util.formatDateTime(new Date(buoy4New.buoywvnew.dt)) + "</td></tr>" +
                        //         "<tr><td>1/10波高：</td><td>" + buoy4New.buoywvnew.tenwh + "</td><td>1/10波高周期：</td><td>" + buoy4New.buoywvnew.tenwht + "</td></tr>" +
                        //         "<tr><td>平均波高：</td><td>" + buoy4New.buoywvnew.averwh + "</td><td>平均波高周期：</td><td>" + buoy4New.buoywvnew.averwht + "</td></tr>" +
                        //         "<tr><td>最大波高：</td><td>" + buoy4New.buoywvnew.maxwh + "</td><td>最大波高周期：</td><td>" + buoy4New.buoywvnew.maxwht + "</td></tr>" +
                        //         "<tr><td>有效波高：</td><td>" + buoy4New.buoywvnew.sigwh + "</td><td>有效波高周期：</td><td>" + buoy4New.buoywvnew.sigwht + "</td></tr>" +
                        //         "<tr><td>主波向：</td><td>" + buoy4New.buoywvnew.maindire + "</td><td>波数：</td><td>" + buoy4New.buoywvnew.wavenum + "</td></tr>" +
                        //         "<tr><td>锚灯A状态：</td><td>" + buoy4New.buoywvnew.lighta + "</td><td>水警状态：</td><td>" + buoy4New.buoywvnew.waterpo + "</td></tr>" +
                        //         "</table>";
                        // }
                        // if (buoy4New.buoygpsnew != null && buoy4New.fubnew != null) {
                        //     //浮标123：海流
                        //     html +=
                        //         "<table>" +
                        //         "<tr><th>" + "海流" + "</th></tr>" +
                        //         "<tr><td>时间：</td><td>" + this.util.formatDateTime(new Date(buoy4New.buoygpsnew.dt)) + "</td></tr>" +
                        //         "<tr><td>水温：</td><td>" + buoy4New.buoygpsnew.watertem + "</td></tr>" +
                        //         "<tr><td>第四层流速：</td><td>" + buoy4New.fubnew.flowv + "</td><td>第四层流向：</td><td>" + buoy4New.fubnew.flowdire + "</td></tr>" +
                        //         "<tr><td>锚灯A：</td><td>" + buoy4New.buoygpsnew.lighta + "</td><td>锚灯B：</td><td>" + buoy4New.buoygpsnew.lightb + "</td></tr>" +
                        //         "<tr><td>AIS：</td><td>" + buoy4New.buoygpsnew.ais + "</td><td>水警：</td><td>" + buoy4New.buoygpsnew.waterpo + "</td></tr>" +
                        //         "<tr><td>海流计压力：</td><td>" + buoy4New.buoygpsnew.currpre + "</td></tr>" +
                        //         "</table>";
                        // }
                        // if (buoy4New.topCtdNew != null) {
                        //     //表层CTD
                        //     html +=
                        //         "<table>" +
                        //         "<tr><th>" + "表层CTD" + "</th></tr>" +
                        //         "<tr><td>时间：</td><td>" + this.util.formatDateTime(new Date(buoy4New.topCtdNew.dt)) + "</td></tr>" +
                        //         "<tr><td>深度：</td><td>" + buoy4New.topCtdNew.wp + "</td><td>温度：</td><td>" + buoy4New.topCtdNew.wt + "</td></tr>" +
                        //         "<tr><td>盐度：</td><td>" + buoy4New.topCtdNew.sl + "</td><td>密度：</td><td>" + buoy4New.topCtdNew.density + "</td></tr>" +
                        //         "</table>";
                        // }
                        // if (buoy4New.bottomCtdNew != null) {
                        //     //底层CTD
                        //     html +=
                        //         "<table>" +
                        //         "<tr><th>" + "底层CTD" + "</th></tr>" +
                        //         "<tr><td>时间：</td><td>" + this.util.formatDateTime(new Date(buoy4New.bottomCtdNew.dt)) + "</td></tr>" +
                        //         "<tr><td>深度：</td><td>" + buoy4New.bottomCtdNew.wp + "</td><td>温度：</td><td>" + buoy4New.bottomCtdNew.wt + "</td></tr>" +
                        //         "<tr><td>盐度：</td><td>" + buoy4New.bottomCtdNew.sl + "</td><td>密度：</td><td>" + buoy4New.bottomCtdNew.density + "</td></tr>" +
                        //         "</table>";
                        // }
                        this.content.innerHTML = html;
                        this.overlay.setPosition(feature.getGeometry().getCoordinates());
                    }
                }).catch((response) => {
                    //失败回调
                    this.$confirm('服务器失联！', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning'
                    });
                }).finally((response) => {

                })
            },
            /**
             * 获取气象站的位置
             * @param
             */
            getSite(id) {
                var siteLongt;
                var siteLat;

                if (id == 1) {//桂山牛头岛气象站
                    siteLongt = 113.8;
                    siteLat = 22.1735;
                } else if (id == 2) {//西人工岛气象站
                    siteLongt = 113.76614504835997;
                    siteLat = 22.572448118606196;
                } else if (id == 3) {//龙穴船厂气象站
                    siteLongt = 113.64944420306698;
                    siteLat = 22.70713102721437;
                }

                var site = new Feature({
                    geometry: new Point(fromLonLat([siteLongt, siteLat])),
                    name: "Site" + id,
                });

                var style = new Style({
                    image: new Icon({
                        src: this.siteIconUrl,
                        scale: 0.2
                    })
                });


                site.setId("Site" + id);
                site.setStyle(style);
                this.site_layer.getSource().addFeature(site);
            },
            /**
             * 获取浮标的位置
             * @param
             */
            getBuoy(id) {
                var buoyLongt;
                var buoyLat;

                if (id == 1) {
                    buoyLongt = 113 + 45 * 1 / 60 + 9.42 * 1 / 3600;
                    buoyLat = 22 + 29 * 1 / 60 + 6.3 * 1 / 3600;
                } else if (id == 2) {
                    buoyLongt = 113 + 46 * 1 / 60 + 32.93 * 1 / 3600;
                    buoyLat = 22 + 33 * 1 / 60 + 43.51 * 1 / 3600;
                } else if (id == 3) {
                    buoyLongt = 113 + 47 * 1 / 60 + 44.82 * 1 / 3600;
                    buoyLat = 22 + 20 * 1 / 60 + 14.22 * 1 / 3600;
                } else if (id == 4) {
                    buoyLongt = 113 + 47 * 1 / 60 + 21.12 * 1 / 3600;
                    buoyLat = 22 + 10 * 1 / 60 + 36.48 * 1 / 3600;
                }

                var buoy = new Feature({
                    geometry: new Point(fromLonLat([buoyLongt, buoyLat])),
                    name: "Buoy" + id,
                });

                var style = new Style({
                    image: new Icon({
                        src: this.buoyIconUrl,
                        scale: 0.2
                    })
                });

                buoy.setId("Buoy" + id);
                buoy.setStyle(style);
                this.buoy_layer.getSource().addFeature(buoy);
            },

            /**
             * 获取浮标最新的位置
             * @param
             */
            getBuoyGPSNew(id) {
                var api = `/api/SZTDService/queryBuoyGPSNew.action?id=${id}`;
                this.$axios.get(api).then((response) => {
                    //response.data是数据库中的一条记录，可以直接访问这条记录的字段 ctdData.id
                    var buoyGPSNew = response.data;
                    if (buoyGPSNew != null) {
                        var buoyLongt;
                        var buoyLat;
                        // if(buoyGPSNew.longt==null||buoyGPSNew.lat==null)
                        // {
                        //   if(buoyGPSNew.fid==1)
                        //   {
                        //     buoyLongt= 113 + 45 * 1 / 60 + 9.42 * 1 / 3600;
                        //     buoyLat=22 + 29 * 1 / 60 + 6.3 * 1 / 3600;
                        //   }
                        //   else if(buoyGPSNew.fid==2)
                        //   {
                        //     buoyLongt= 113 + 46 * 1 / 60 + 32.93 * 1 / 3600;
                        //     buoyLat=22 + 33 * 1 / 60 + 43.51 * 1 / 3600;
                        //   }
                        //   else if(buoyGPSNew.fid==3)
                        //   {
                        //     buoyLongt= 113 + 47 * 1 / 60 + 44.82 * 1 / 3600;
                        //     buoyLat=22 + 20 * 1 / 60 + 14.22 * 1 / 3600;
                        //   }
                        //   else if(buoyGPSNew.fid==4)
                        //   {
                        //     buoyLongt= 113 + 47 * 1 / 60 + 21.12 * 1 / 3600;
                        //     buoyLat=22 + 10 * 1 / 60 + 36.48 * 1 / 3600;
                        //   }
                        // }
                        // else
                        // {
                        //   buoyLongt=buoyGPSNew.longt;
                        //   buoyLat=buoyGPSNew.lat;
                        // }

                        if (buoyGPSNew.fid == 1) {
                            buoyLongt = 113 + 45 * 1 / 60 + 9.42 * 1 / 3600;
                            buoyLat = 22 + 29 * 1 / 60 + 6.3 * 1 / 3600;
                        } else if (buoyGPSNew.fid == 2) {
                            buoyLongt = 113 + 46 * 1 / 60 + 32.93 * 1 / 3600;
                            buoyLat = 22 + 33 * 1 / 60 + 43.51 * 1 / 3600;
                        } else if (buoyGPSNew.fid == 3) {
                            buoyLongt = 113 + 47 * 1 / 60 + 44.82 * 1 / 3600;
                            buoyLat = 22 + 20 * 1 / 60 + 14.22 * 1 / 3600;
                        } else if (buoyGPSNew.fid == 4) {
                            buoyLongt = 113 + 47 * 1 / 60 + 21.12 * 1 / 3600;
                            buoyLat = 22 + 10 * 1 / 60 + 36.48 * 1 / 3600;
                        }

                        var buoy = new Feature({
                            //geometry: new Point(fromLonLat([113 + 45 * 1 / 60 + 9.42 * 1 / 3600, 22 + 29 * 1 / 60 + 6.3 * 1 / 3600])),
                            geometry: new Point(fromLonLat([buoyLongt, buoyLat])),
                            name: "Buoy" + buoyGPSNew.fid,
                        });

                        var style = new Style({
                            image: new Icon({
                                src: this.buoyIconUrl,
                                scale: 0.2
                            })
                        });

                        buoy.setStyle(style);
                        this.buoy_layer.getSource().addFeature(buoy);
                    }
                }).catch((response) => {
                    //失败回调
                    this.$confirm('服务器失联！', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning'
                    });
                }).finally((response) => {

                })
            },
            /**
             * 绘制浮标历史位置轨迹
             * @param
             */
            drawBuoyGPSHistory() {
                var api = `/api/SZTDService/queryBuoyGPSHistory.action?id=1`;
                this.$axios.get(api).then((response) => {
                    //response.data是数据库中的一条记录，可以直接访问这条记录的字段 ctdData.id
                    var buoyGPSHistory = response.data;
                    if (buoyGPSHistory != null) {
                        var style = new Style({
                            stroke: new Stroke({
                                width: 3,
                                color: [255, 0, 0, 1]
                            })
                        })

                        var historyData = [];
                        var i = 0
                        for (; i < buoyGPSHistory.length; i++) {
                            historyData[i] = fromLonLat([buoyGPSHistory[i].longt, buoyGPSHistory[i].lat]);
                        }
                        // var coo1 =fromLonLat([113.69, 22.36])
                        // var coo2 =fromLonLat([113.89, 22.46])
                        //var coordinate =[fromLonLat([113.69, 22.36]),fromLonLat([113.89, 22.46])]
                        //[fromLonLat(test[0]),fromLonLat(test[1])]
                        var lineFeature = new Feature({
                            geometry: new LineString(historyData)
                        })

                        lineFeature.setStyle(style);
                        this.buoy_history_layer.getSource().addFeature(lineFeature);

                        var routeCoords = lineFeature.getCoordinates();
                        var routeLength = routeCoords.length;

                        var routeFeature = new Feature({
                            type: 'route',
                            geometry: lineFeature
                        });

                        var geoMarker = new Feature({
                            type: 'geoMarker',
                            geometry: new Point(routeCoords[0])
                        });

                        var styles = {
                            'route': new Style({
                                stroke: new Stroke({
                                    width: 6, color: [237, 212, 0, 0.8]
                                })
                            }),
                            'geoMarker': new Style({
                                image: new CircleStyle({
                                    radius: 7,
                                    fill: new Fill({color: 'black'}),
                                    stroke: new Stroke({
                                        color: 'white', width: 2
                                    })
                                })
                            })
                        };

                        var animating = true;
                        var speed, now;
                        var speedInput = 10;


                        var vectorLayer = new VectorLayer({
                            source: new VectorSource({
                                features: [routeFeature, geoMarker]
                            }),
                            style: function (feature) {
                                // hide geoMarker if animation is active
                                if (animating && feature.get('type') === 'geoMarker') {
                                    return null;
                                }
                                return styles[feature.get('type')];
                            }
                        });


                        this.map.addLayer(vectorLayer);

                        var vectorContext = event.vectorContext;
                        var frameState = event.frameState;

                        if (animating) {
                            var elapsedTime = frameState.time - now;
                            // here the trick to increase speed is to jump some indexes
                            // on lineString coordinates
                            var index = Math.round(speed * elapsedTime / 1000);


                            var currentPoint = new Point(routeCoords[index]);
                            var feature = new Feature(currentPoint);
                            vectorContext.drawFeature(feature, styles.geoMarker);
                        }
                        // tell OpenLayers to continue the postcompose animation
                        this.map.render();
                    }
                    ;

                }).catch((response) => {
                    //失败回调
                    this.$confirm('服务器失联！', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning'
                    });
                }).finally((response) => {

                })
            },

            showRealTimeMonitorModal() {
                this.$emit('openRealTimeMonitorModalHome');
            },

            /*****************************************************数值产品地图操作*****************************************************/
            /**
             * 地图区域鼠标点击事件
             * @param e
             */
            singleClickOnMap(e) {
                //如果点击处有feature则返回
                var pixel = e.pixel;//获取地图上坐标
                var lonlat = toLonLat(this.map.getCoordinateFromPixel(e.pixel));
                var hit = this.map.hasFeatureAtPixel(pixel);//判断是否存在feature
                if (hit) {
                    return;
                }

                //判断是否有数值产品图层
                if (this.productionLyrs.length != 0) {
                    for (var i = 0; i < this.productionLyrs.length; i++) {
                        var arr = this.productionLyrs[i].get('name').split("/");
                        //是否有气象数据十米风场图层
                        if (this.productionLyrs[i].get('name').search(/Atm_10mWindU10V10/) != -1) {
                            this.$emit('drawWindTimeSeries', "10mWindTimeSeries", arr[4], lonlat);
                            break;
                        }
                        //是否有气象数据500hpa风场图层
                        if (this.productionLyrs[i].get('name').search(/Atm_500hPaWindUUVV/) != -1) {
                            this.$emit('drawWindTimeSeries', "500hpaWindTimeSeries", arr[4], lonlat);
                            break;
                        }
                        //是否有气象数据200hPa风场图层
                        if (this.productionLyrs[i].get('name').search(/Atm_200hPaWindUUVV/) != -1) {
                            this.$emit('drawWindTimeSeries', "200hpaWindTimeSeries", arr[4], lonlat);
                            break;
                        }
                        //是否有精细化气象数据十米风场图层
                        if (this.productionLyrs[i].get('name').search(/AtmRefine_10mWindU10V10/) != -1) {
                            this.$emit('drawWindTimeSeries', "refine10mWindTimeSeries", arr[4], lonlat);
                            break;
                        }
                        //是否有海流数据图层
                        if (this.productionLyrs[i].get('name').search(/Current_UV/) != -1) {
                            var siglay = Number(arr[5].split("_")[2].substr(0, arr[5].split("_")[2].length - 1));
                            this.$emit('drawCurrentTimeSeries', siglay, arr[4], lonlat);
                            break;
                        }
                        //是否有海浪浪高数据图层
                        if (this.productionLyrs[i].get('name').search(/Wave_HS/) != -1) {
                            this.$emit('drawWaveTimeSeries', "HSDIRWaveTimeSeries", arr[4], lonlat);
                            break;
                        }
                        //是否有海浪浪向数据图层
                        if (this.productionLyrs[i].get('name').search(/Wave_DIR/) != -1) {
                            this.$emit('drawWaveTimeSeries', "HSDIRWaveTimeSeries", arr[4], lonlat);
                            break;
                        }
                        //是否有海浪周期数据图层
                        if (this.productionLyrs[i].get('name').search(/Wave_TPS/) != -1) {
                            this.$emit('drawWaveTimeSeries', "TPSWaveTimeSeries", arr[4], lonlat);
                            break;
                        }

                    }

                }
            },


            /**
             * 向地图上添加数值产品
             * @param url
             * @param extent
             */
            addPictureToMap(url, extent) {

                var imgExtent = transformExtent(extent, 'EPSG:4326', 'EPSG:3857');
                var projection = new Projection({
                    code: 'EPSG:3857',
                    units: 'degrees',
                    extent: imgExtent
                });
                var layer = new ImageLayer({
                    name: url,
                    source: new Static({
                        url: url,
                        crossOrigin: '',
                        projection: projection,
                        imageExtent: imgExtent
                    })
                })
                this.map.addLayer(layer)
                this.productionLyrs.push(layer);
                //缩放到当前地图范围
                // this.map.getView().fit(imgExtent,this.map.getSize());

                //TODO 图例部分
                if (url.search(/Atm_10mWindU10V10/) != -1) {
                    this.curLegend.push(this.legends.tenMWind);
                } else if (url.search(/Atm_200hPaWindUUVV/) != -1) {
                    this.curLegend.push(this.legends.twoHpaWind);
                } else if (url.search(/Atm_RaincRainnc/) != -1) {
                    this.curLegend.push(this.legends.rain)
                } else if (url.search(/Wave_HS_Contourf/) != -1) {
                    this.curLegend.push(this.legends.wave);
                } else if (url.search(/AtmRefine_10mWindU10V10/) != -1) {
                    this.curLegend.push(this.legends.tenMWind);
                } else if (url.search(/AtmRefine_Rainnc/) != -1) {
                    this.curLegend.push(this.legends.rain);
                } else if (url.search(/Current_UV_/) != -1) {
                    this.curLegend.push(this.legends.current);
                } else if (url.search(/Current_Salinity/) != -1) {
                    this.curLegend.push(this.legends.salinity);
                } else if (url.search(/Wave_TPS_Contourf/) != -1) {
                    this.curLegend.push(this.legends.waveTPS);
                }
            },


            /**
             * 清除底图上当前的数值产品
             */
            cleanMapPro() {
                //遍历this.productionLyrs，并将所有图层从地图上移除
                for (var i = 0; i < this.productionLyrs.length; i++) {
                    this.map.removeLayer(this.productionLyrs[i]);
                }
                this.productionLyrs.splice(0, this.productionLyrs.length);
                this.curLegend.splice(0, this.curLegend.length);
            },

            /**
             * 判断地图是否缩放，
             * 若缩放，则判断是否有数据产品图层
             * 如果有，则更新数据产品层级
             * @param e
             */
            zoomEvent(e) {
                //判断地图是否缩放,无缩放则返回
                var zoom = this.map.getView().getZoom();  //获取当前地图的缩放级别
                if (this.oldZoom == zoom)
                    return;
                //若缩放，记录当前缩放层级
                this.oldZoom = zoom;

                //判断是否有数据产品图层，若无则返回
                if (this.productionLyrs.length == 0)
                    return;

                //若有数据产品图层，则更新数据产品层级
                this.refreshProduction(zoom)
            },

            /**
             * 更新当前数据产品层级
             * @param zoom
             */
            refreshProduction(zoom) {
                console.log(zoom);
                for (var i = 0; i < this.productionLyrs.length; i++) {
                    if (this.productionLyrs[i].get('name').includes("_L")) {
                        //获取当前图层的范围、url、投影
                        var imgExtent = this.productionLyrs[i].getSource().getImageExtent();
                        var url = this.productionLyrs[i].getSource().getUrl();
                        var projection = this.productionLyrs[i].getSource().getProjection();

                        //根据缩放层级修改修改url
                        var newUrl = "";
                        if (zoom <= 6) {
                            if (url.includes("_L6")) {
                                newUrl = url.replace("_L6", "_L5");
                            }
                        } else {
                            if (url.includes("_L5")) {
                                newUrl = url.replace("_L5", "_L6");
                            }
                        }
                        if (newUrl != "") {
                            //重新加载数据产品
                            var source = new Static({
                                url: newUrl,
                                crossOrigin: '',
                                projection: projection,
                                imageExtent: imgExtent
                            });
                            this.productionLyrs[i].setSource(source);
                        }
                    }
                }
            }
        },

        mounted: function () {
            this.mapInit();
            this.addBridge();
            this.addIsland();
            this.addRoute();
            this.addPlatform();
            this.addBuoy();
            this.addSite();
        }
    }
</script>

<style scoped>
  #tdtmap {
    height: 100%
  }

  ol-viewport {
    /*完全透明*/
    background-color: rgba(0, 0, 0, 0);
    /*完全不透明*/
    /*background-color: rgba(0, 0, 0, 1);*/
  }

  .ol-popup {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.85);
    -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
    filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
    /*min-width: 340px*/
    /*width:fit-content;*/
    /*min-width: 210px*/
    /*opacity: 0.5; !*透明度 *!*/
  }

  .ol-popup:after, .ol-popup:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }

  .ol-popup:after {
    border-top-color: white;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
  }

  .ol-popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
  }

  .popup-title {
    font-weight: bold;
    border-bottom: 1px solid #cccccc;
    /*padding: 5px 8px;*/
  }

  .popup-content {
    padding: 5px 8px;
  }

  .ol-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
  }

  .ol-popup-closer:after {
    content: "✖";
  }

</style>
