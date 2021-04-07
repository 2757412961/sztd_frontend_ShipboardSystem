import echarts from 'echarts/lib/echarts';

var start = 0;
var end = 100;

export default {
  drawCTDChart(tableData, chart) {
    var densityData = [];
    var tempData = [];
    var maxDensity = 0;
    var minDensity = 10000;
    var maxTemp = 0;
    var minTemp = 100;
    var i = 0
    for (; i < tableData.length; i++) {
      densityData[i] = [tableData[i].dt, tableData[i].density];
      tempData[i] = [tableData[i].dt, tableData[i].wt];

      maxDensity = tableData[i].density > maxDensity ? tableData[i].density : maxDensity;
      minDensity = tableData[i].density < minDensity ? tableData[i].density : minDensity;
      maxTemp = tableData[i].wt > maxTemp ? tableData[i].wt : maxTemp;
      minTemp = tableData[i].wt < minTemp ? tableData[i].wt : minTemp;
    }
    var minDate = tableData[0].dt;
    var maxDate
    if (i == 0)
      maxDate = minDate;
    else
      maxDate = tableData[i - 1].dt;

    // var currentDt = new Date();
    // var preDate = new Date(currentDt.getTime() - 24*60*60*1000);
    var chartTitle = "";

    if (tableData[0].owner = "platform")
      chartTitle += "平台";
    else if (tableData[0].owner = "buoy")
      chartTitle += "浮标";

    if (tableData[0].position == "top")
      chartTitle += "表层CTD";
    else if (tableData[0].position == "bottom")
      chartTitle += "底层CTD";
    var option = {
      title: {
        text: chartTitle,//"CTD" + tableData[0].ctdid,
        left: 'center'
      },
      tooltip: {},
      legend: {
        data: ['温度', '密度'],
        orient: 'horizontal',
        top: '25',
        right: '150'
      },
      xAxis: {
        name: "时间",
        nameLocation: 'middle',
        type: 'time',
        min: minDate,
        max: maxDate,
        nameGap: '40',
        //强制设置坐标轴分割间隔。
        // 因为 splitNumber 是预估的值，实际根据策略计算出来的刻度可能无法达到想要的效果，这时候可以使用 interval 配合 min、max 强制设定刻度划分，一般不建议使用。
        // 在时间轴（type: 'time'）中需要传时间戳， 3600 * 3 * 1000 保证坐标轴分割刻度为3小时
        //interval:3600 * 3 * 1000,
        splitNumber: 12,
      },
      yAxis: [{
        name: "温度(℃)",
        nameLocation: 'end',
        left: 0,
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: 16,
        max: 32,
        nameGap: '15'
      }, {
        name: "密度(kg/m³)",
        nameLocation: 'end',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: minDensity,
        max: maxDensity,
        nameGap: '15',
      }], dataZoom: [{
        type: 'slider',
        yAxisIndex: 0,
        left: 0,
        filterMode: 'empty',
        startValue: 16,
        endValue: 32,
        realtime: false,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }

      }, {
        type: 'slider',
        yAxisIndex: 1,
        filterMode: 'empty',
        startValue: minDensity,
        endValue: maxDensity,
        realtime: false,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }, {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty'
      }],
      series: [{
        name: '温度',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        itemStyle: {
          color: "#FF6666"
        },
        data: tempData
      }, {
        name: '密度',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 1,
        itemStyle: {
          color: "#336699"
        },
        data: densityData
      }]
    };
    chart.setOption(option);
  },
  drawTideChart(tableData, chart) {
    var wlData = [];
    var maxWL = 0;
    var minWL = 10000;
    var i = 0
    for (; i < tableData.length; i++) {
      wlData[i] = [tableData[i].dt, tableData[i].wlCorrect];
      maxWL = tableData[i].wlCorrect > maxWL ? tableData[i].wlCorrect : maxWL;
      minWL = tableData[i].wlCorrect < minWL ? tableData[i].wlCorrect : minWL;
    }

    var minDate = tableData[0].dt;
    var maxDate
    if (i == 0)
      maxDate = minDate;
    else
      maxDate = tableData[i - 1].dt;
    // var currentDt = new Date();
    // var preDate = new Date(currentDt.getTime() - 24*60*60*1000);
    var option = {
      title: {
        text: "平台潮位",
        left: 'center'
      },
      tooltip: {},
      legend: {
        data: ['潮位'],
        orient: 'horizontal',
        top: '25',
        right: '150'
      },
      grid: {
        left: 75,
        right: 30,
        top: 40,
        bottom: 50
      },
      xAxis: {
        name: "时间",
        nameLocation: 'middle',
        type: 'time',
        min: minDate,
        max: maxDate,
        nameGap: '40',
        //强制设置坐标轴分割间隔。
        // 因为 splitNumber 是预估的值，实际根据策略计算出来的刻度可能无法达到想要的效果，这时候可以使用 interval 配合 min、max 强制设定刻度划分，一般不建议使用。
        // 在时间轴（type: 'time'）中需要传时间戳， 3600 * 3 * 1000 保证坐标轴分割刻度为3小时
        //interval:3600 * 3 * 1000,
        splitNumber: 12,
      },
      yAxis: {
        name: "潮位(cm)",
        nameLocation: 'end',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: Math.floor(minWL),
        max: Math.ceil(maxWL),
        nameGap: '15'
      },
      dataZoom: [{
        type: 'slider',
        yAxisIndex: 0,
        left: 0,
        filterMode: 'empty',
        startValue: Math.floor(minWL),
        endValue: Math.ceil(maxWL),
        realtime: false,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }, {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty'
      }],
      series: {
        name: '潮位',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        data: wlData,
        itemStyle: {
          color: "#99CC33"
        }
      }
    };
    chart.setOption(option);
  },
  /**
   * 气象站气温
   * @param tableData
   * @param chart
   */
  drawSiteTaAvg(tableData, chart) {
    var taAvgData = [];

    var maxTaAvg = -1000;
    var minTaAvg = 1000;

    var i = 0
    for (; i < tableData.length; i++) {
      taAvgData[i] = [tableData[i].dt, tableData[i].taAvg];
      maxTaAvg = tableData[i].taAvg > maxTaAvg ? tableData[i].taAvg : maxTaAvg;
      minTaAvg = tableData[i].taAvg < minTaAvg ? tableData[i].taAvg : minTaAvg;
    }
    var minDate = tableData[0].dt;
    var maxDate
    if (i == 0)
      maxDate = minDate;
    else
      maxDate = tableData[i - 1].dt;

    var option = {
      title: {
        text: "气象站气温",
        left: 'center'
      },
      tooltip: {},
      legend: {
        data: ['气温'],
        orient: 'horizontal',
        top: '25',
        right: '150'
      },
      grid: {
        left: 75,
        right: 30,
        top: 40,
        bottom: 50
      },
      xAxis: {
        name: "时间",
        nameLocation: 'middle',
        type: 'time',
        min: minDate,
        max: maxDate,
        nameGap: '40',
        //强制设置坐标轴分割间隔。
        // 因为 splitNumber 是预估的值，实际根据策略计算出来的刻度可能无法达到想要的效果，这时候可以使用 interval 配合 min、max 强制设定刻度划分，一般不建议使用。
        // 在时间轴（type: 'time'）中需要传时间戳， 3600 * 3 * 1000 保证坐标轴分割刻度为3小时
        //interval:3600 * 3 * 1000,
        splitNumber: 12,
      },
      yAxis: {
        name: "气温(℃)",
        nameLocation: 'end',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: Math.floor(minTaAvg),
        max: Math.ceil(maxTaAvg),
        nameGap: '15',
        // offset:'100'
      },
      dataZoom: [{
        type: 'slider',
        yAxisIndex: 0,
        left: 0,
        filterMode: 'empty',
        startValue: Math.floor(minTaAvg),
        endValue: Math.ceil(maxTaAvg),
        realtime: false,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }, {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty'
      }],
      series: {
        name: '气温',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        data: taAvgData,
        itemStyle: {
          color: "#FF0000"
        }
      }
    };
    chart.setOption(option);
  },

  /**
   * 气象站相对湿度
   * @param tableData
   * @param chart
   */
  drawSiteRhAvg(tableData, chart) {
    var rhAvgData = [];

    var maxRhAvg = -1000;
    var minRhAvg = 1000;

    var i = 0
    for (; i < tableData.length; i++) {
      rhAvgData[i] = [tableData[i].dt, tableData[i].rhAvg];
      maxRhAvg = tableData[i].rhAvg > maxRhAvg ? tableData[i].rhAvg : maxRhAvg;
      minRhAvg = tableData[i].rhAvg < minRhAvg ? tableData[i].rhAvg : minRhAvg;
    }

    var minDate = tableData[0].dt;
    var maxDate
    if (i == 0)
      maxDate = minDate;
    else
      maxDate = tableData[i - 1].dt;


    var option = {
      title: {
        text: "气象站相对湿度",
        left: 'center'
      },
      tooltip: {},
      legend: {
        data: ['相对湿度'],
        orient: 'horizontal',
        top: '25',
        right: '150'
      },
      grid: {
        left: 75,
        right: 30,
        top: 40,
        bottom: 50
      },
      xAxis: {
        name: "时间",
        nameLocation: 'middle',
        type: 'time',
        min: minDate,
        max: maxDate,
        nameGap: '40',
        //强制设置坐标轴分割间隔。
        // 因为 splitNumber 是预估的值，实际根据策略计算出来的刻度可能无法达到想要的效果，这时候可以使用 interval 配合 min、max 强制设定刻度划分，一般不建议使用。
        // 在时间轴（type: 'time'）中需要传时间戳， 3600 * 3 * 1000 保证坐标轴分割刻度为3小时
        //interval:3600 * 3 * 1000,
        splitNumber: 12,
      },
      yAxis: {
        name: "相对湿度",
        nameLocation: 'end',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: Math.floor(minRhAvg),
        max: Math.ceil(maxRhAvg),
        nameGap: '15'
      },
      dataZoom: [{
        type: 'slider',
        yAxisIndex: 0,
        left: 0,
        filterMode: 'empty',
        startValue: Math.floor(minRhAvg),
        endValue: Math.ceil(maxRhAvg),
        realtime: false,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }, {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty'
      }],
      series: {
        name: '相对湿度',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        data: rhAvgData,
        itemStyle: {
          color: "#EEC900"
        }
      }
    };
    chart.setOption(option);
  },

  /**
   * 气象站风m/s
   * @param tableData
   * @param chart
   */
  drawSiteWsWvc1(tableData, chart) {
    var wsWvc1Data = [];

    var maxWsWvc1 = -1000;
    var minWsWvc1 = 1000;

    var i = 0
    for (; i < tableData.length; i++) {
      wsWvc1Data[i] = [tableData[i].dt, tableData[i].wsWvc1];
      maxWsWvc1 = tableData[i].wsWvc1 > maxWsWvc1 ? tableData[i].wsWvc1 : maxWsWvc1;
      minWsWvc1 = tableData[i].wsWvc1 < minWsWvc1 ? tableData[i].wsWvc1 : minWsWvc1;
    }
    var minDate = tableData[0].dt;
    var maxDate
    if (i == 0)
      maxDate = minDate;
    else
      maxDate = tableData[i - 1].dt;

    var option = {
      title: {
        text: "气象站风速",
        left: 'center'
      },
      tooltip: {},
      legend: {
        data: ['风速'],
        orient: 'horizontal',
        top: '25',
        right: '150'
      },
      grid: {
        left: 75,
        right: 30,
        top: 40,
        bottom: 50
      },
      xAxis: {
        name: "时间",
        nameLocation: 'middle',
        type: 'time',
        min: minDate,
        max: maxDate,
        nameGap: '40',
        //强制设置坐标轴分割间隔。
        // 因为 splitNumber 是预估的值，实际根据策略计算出来的刻度可能无法达到想要的效果，这时候可以使用 interval 配合 min、max 强制设定刻度划分，一般不建议使用。
        // 在时间轴（type: 'time'）中需要传时间戳， 3600 * 3 * 1000 保证坐标轴分割刻度为3小时
        //interval:3600 * 3 * 1000,
        splitNumber: 12,
      },
      yAxis: {
        name: "风速m/s",
        nameLocation: 'end',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: Math.floor(minWsWvc1),
        max: Math.ceil(maxWsWvc1),
        nameGap: '15'
      },
      dataZoom: [{
        type: 'slider',
        yAxisIndex: 0,
        left: 0,
        filterMode: 'empty',
        startValue: Math.floor(minWsWvc1),
        endValue: Math.ceil(maxWsWvc1),
        realtime: false,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }, {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty'
      }],
      series: {
        name: '风速',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        data: wsWvc1Data,
        itemStyle: {
          color: "#99CC33"
        }
      }
    };
    chart.setOption(option);
  },

  /**
   * 气象站气压hPa
   * @param tableData
   * @param chart
   */
  drawSitePaAvg(tableData, chart) {
    var paAvgData = [];

    var maxPaAvg = -100000;
    var minPaAvg = 100000;

    var i = 0
    for (; i < tableData.length; i++) {
      paAvgData[i] = [tableData[i].dt, tableData[i].paAvg];
      maxPaAvg = tableData[i].paAvg > maxPaAvg ? tableData[i].paAvg : maxPaAvg;
      minPaAvg = tableData[i].paAvg < minPaAvg ? tableData[i].paAvg : minPaAvg;
    }
    var minDate = tableData[0].dt;
    var maxDate
    if (i == 0)
      maxDate = minDate;
    else
      maxDate = tableData[i - 1].dt;

    var option = {
      title: {
        text: "气象站气压",
        left: 'center'
      },
      tooltip: {},
      legend: {
        data: ['气压'],
        orient: 'horizontal',
        top: '25',
        right: '150'
      },
      xAxis: {
        name: "时间",
        nameLocation: 'middle',
        type: 'time',
        min: minDate,
        max: maxDate,
        nameGap: '40',
        //强制设置坐标轴分割间隔。
        // 因为 splitNumber 是预估的值，实际根据策略计算出来的刻度可能无法达到想要的效果，这时候可以使用 interval 配合 min、max 强制设定刻度划分，一般不建议使用。
        // 在时间轴（type: 'time'）中需要传时间戳， 3600 * 3 * 1000 保证坐标轴分割刻度为3小时
        //interval:3600 * 3 * 1000,
        splitNumber: 12,
      },
      yAxis: {
        name: "气压hPa",
        nameLocation: 'end',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: Math.floor(minPaAvg),
        max: Math.ceil(maxPaAvg),
        nameGap: '15'
      },
      dataZoom: [{
        type: 'slider',
        yAxisIndex: 0,
        left: 0,
        filterMode: 'empty',
        startValue: Math.floor(minPaAvg),
        endValue: Math.ceil(maxPaAvg),
        realtime: false,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }, {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty'
      }],
      series: {
        name: '气压',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        data: paAvgData,
        itemStyle: {
          color: "#87CEEB"
        }
      }
    };
    chart.setOption(option);
  },
  /**
   * 海浪有效波高和波向
   * @param tableData
   * @param chart
   */
  drawWaveSigWHMainDire(tableData, chart) {
    function waveLevel(speed) {
      //svg 的坐标系是右为x正方向，下为y正方向，因此为了画出标准的北向风，此处y值全为负值
      //风向标旗头指的方向是风向
      if (speed < 0.3)
        return 'M-2,0 L-2,-8 L-4,-8 L0,-12 L4,-8 L2,-8 L2,0 L-2,0';
      else if (speed < 0.6)
        return 'M-2,0 L-2,-12 L-4,-12 L0,-16 L4,-12 L2,-12 L2,0 L-2,0';
      else if (speed < 0.9)
        return 'M-2,0 L-2,-16 L-4,-16 L0,-20 L4,-16 L2,-16 L2,0 L-2,0';
      else if (speed < 1.2)
        return 'M-2,0 L-2,-20 L-4,-20 L0,-24 L4,-20 L2,-20 L2,0 L-2,0';
      else if (speed < 1.5)
        return 'M-2,0 L-2,-24 L-4,-24 L0,-28 L4,-24 L2,-24 L2,0 L-2,0';
      else
        return 'M-2,0 L-2,-28 L-4,-28 L0,-32 L4,-28 L2,-28 L2,0 L-2,0';
    }

    function renderArrow(param, api) {
      var point = api.coord([
        api.value(dims.dt),
        api.value(dims.sigwh)
      ]);

      return {
        type: 'path',
        shape: {
          pathData: waveLevel(api.value(dims.sigwh)),
        },
        rotation: (api.value(dims.maindire) - 90) * Math.PI / 180,//传入弧度制
        position: point,
        style: api.style({
          fill: '#444444',
          stroke: '#444444',
          lineWidth: 1
        })
      };
    }

    var data = echarts.util.map(tableData, function (entry) {
      return [entry.dt, entry.sigwh, entry.maindire,];
    });
    var dims = {
      dt: 0,
      sigwh: 1,
      maindire: 2
    };

    var sigWHData = [];
    var mainDireData = [];

    var maxSigWH = -1000;
    var minSigWH = 1000;

    var i = 0
    for (; i < tableData.length; i++) {
      sigWHData[i] = [tableData[i].dt, tableData[i].sigwh];
      mainDireData[i] = [tableData[i].dt, tableData[i].sigwh, tableData[i].maindire];
      maxSigWH = tableData[i].sigwh > maxSigWH ? tableData[i].sigwh : maxSigWH;
      minSigWH = tableData[i].sigwh < minSigWH ? tableData[i].sigwh : minSigWH;
    }
    var minDate = tableData[0].dt;
    var maxDate
    if (i == 0)
      maxDate = minDate;
    else
      maxDate = tableData[i - 1].dt;


    var option = {
      title: {
        text: "海浪有效波高和波向",
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          return [
            '预报时次：' + params[0].value[dims.dt],
            '波高：' + params[0].value[dims.sigwh].toFixed(2) + 'm',
            '波向：' + params[0].value[dims.maindire].toFixed(2) + '°',
          ].join('<br>');
        }
      },
      legend: {
        data: ['有效波高'],
        orient: 'horizontal',
        top: '25',
        right: '150'
      },
      grid: {
        left: 75,
        right: 30,
        top: 40,
        bottom: 50
      },
      xAxis: {
        name: "时间",
        nameLocation: 'middle',
        type: 'time',
        min: minDate,
        max: maxDate,
        nameGap: '40',
        //强制设置坐标轴分割间隔。
        // 因为 splitNumber 是预估的值，实际根据策略计算出来的刻度可能无法达到想要的效果，这时候可以使用 interval 配合 min、max 强制设定刻度划分，一般不建议使用。
        // 在时间轴（type: 'time'）中需要传时间戳， 3600 * 3 * 1000 保证坐标轴分割刻度为3小时
        //interval:3600 * 3 * 1000,
        splitNumber: 12,
      },
      yAxis: {
        name: "有效波高(m)",
        nameLocation: 'end',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: Math.floor(minSigWH),
        max: Math.ceil(maxSigWH),
        nameGap: '15',
        // offset:'100'
      },
      dataZoom: [{
        type: 'slider',
        yAxisIndex: 0,
        left: 0,
        filterMode: 'empty',
        startValue: Math.floor(minSigWH),
        endValue: Math.ceil(maxSigWH),
        realtime: false,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }, {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty'
      }],
      series: [{
        type: 'custom',
        renderItem: renderArrow,
        encode: {
          x: dims.dt,
          y: dims.sigwh
        },
        data: data,
        z: 10
      }, {
        name: '有效波高',
        type: 'line',
        symbol: 'none',
        encode: {
          x: dims.dt,
          y: dims.sigwh
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
    chart.setOption(option);
  },
  /**
   * 海浪最大波高
   * @param tableData
   * @param chart
   */
  drawWaveMaxWH(tableData, chart) {
    var maxWHData = [];

    var maxMaxWH = -1000;
    var minMaxWH = 1000;

    var i = 0
    for (; i < tableData.length; i++) {
      maxWHData[i] = [tableData[i].dt, tableData[i].maxwh];
      maxMaxWH = tableData[i].maxwh > maxMaxWH ? tableData[i].maxwh : maxMaxWH;
      minMaxWH = tableData[i].maxwh < minMaxWH ? tableData[i].maxwh : minMaxWH;
    }
    var minDate = tableData[0].dt;
    var maxDate
    if (i == 0)
      maxDate = minDate;
    else
      maxDate = tableData[i - 1].dt;

    var option = {
      title: {
        text: "海浪最大波高",
        left: 'center'
      },
      tooltip: {},
      legend: {
        data: ['最大波高'],
        orient: 'horizontal',
        top: '25',
        right: '150'
      },
      grid: {
        left: 75,
        right: 30,
        top: 40,
        bottom: 50
      },
      xAxis: {
        name: "时间",
        nameLocation: 'middle',
        type: 'time',
        min: minDate,
        max: maxDate,
        nameGap: '40',
        //强制设置坐标轴分割间隔。
        // 因为 splitNumber 是预估的值，实际根据策略计算出来的刻度可能无法达到想要的效果，这时候可以使用 interval 配合 min、max 强制设定刻度划分，一般不建议使用。
        // 在时间轴（type: 'time'）中需要传时间戳， 3600 * 3 * 1000 保证坐标轴分割刻度为3小时
        //interval:3600 * 3 * 1000,
        splitNumber: 12,
      },
      yAxis: {
        name: "最大波高(m)",
        nameLocation: 'end',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: Math.floor(minMaxWH),
        max: Math.ceil(maxMaxWH),
        nameGap: '15',
        // offset:'100'
      },
      dataZoom: [{
        type: 'slider',
        yAxisIndex: 0,
        left: 0,
        filterMode: 'empty',
        startValue: Math.floor(minMaxWH),
        endValue: Math.ceil(maxMaxWH),
        realtime: false,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }, {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty'
      }],
      series: {
        name: '最大波高',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        data: maxWHData,
        itemStyle: {
          color: "#EEC900"
        }
      }
    };
    chart.setOption(option);
  },
  /**
   * 海浪最大波高周期
   * @param tableData
   * @param chart
   */
  drawWaveMaxWHT(tableData, chart) {
    var maxWHTData = [];

    var maxMaxWHT = -1000;
    var minMaxWHT = 1000;

    var i = 0
    for (; i < tableData.length; i++) {
      maxWHTData[i] = [tableData[i].dt, tableData[i].maxwht];
      maxMaxWHT = tableData[i].maxwht > maxMaxWHT ? tableData[i].maxwht : maxMaxWHT;
      minMaxWHT = tableData[i].maxwht < minMaxWHT ? tableData[i].maxwht : minMaxWHT;
    }
    var minDate = tableData[0].dt;
    var maxDate
    if (i == 0)
      maxDate = minDate;
    else
      maxDate = tableData[i - 1].dt;

    var option = {
      title: {
        text: "海浪最大波高周期",
        left: 'center'
      },
      tooltip: {},
      legend: {
        data: ['最大波高周期'],
        orient: 'horizontal',
        top: '25',
        right: '150'
      },
      grid: {
        left: 75,
        right: 30,
        top: 40,
        bottom: 50
      },
      xAxis: {
        name: "时间",
        nameLocation: 'middle',
        type: 'time',
        min: minDate,
        max: maxDate,
        nameGap: '40',
        //强制设置坐标轴分割间隔。
        // 因为 splitNumber 是预估的值，实际根据策略计算出来的刻度可能无法达到想要的效果，这时候可以使用 interval 配合 min、max 强制设定刻度划分，一般不建议使用。
        // 在时间轴（type: 'time'）中需要传时间戳， 3600 * 3 * 1000 保证坐标轴分割刻度为3小时
        //interval:3600 * 3 * 1000,
        splitNumber: 12,
      },
      yAxis: {
        name: "最大波高周期",
        nameLocation: 'end',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: Math.floor(minMaxWHT),
        max: Math.ceil(maxMaxWHT),
        nameGap: '15',
        // offset:'100'
      },
      dataZoom: [{
        type: 'slider',
        yAxisIndex: 0,
        left: 0,
        filterMode: 'empty',
        startValue: Math.floor(minMaxWHT),
        endValue: Math.ceil(maxMaxWHT),
        realtime: false,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }, {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty'
      }],
      series: {
        name: '最大波高周期',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        data: maxWHTData,
        itemStyle: {
          color: "#87CEEB"
        }
      }
    };
    chart.setOption(option);
  },
  /**
   * 海浪有效波高+最大波高
   * @param tableData
   * @param chart
   */
  drawWaveSigWHWaveMaxWH(tableData, chart) {
    var sigWHData = [];
    var maxSigWH = -1000;
    var minSigWH = 1000;

    var maxWHData = [];
    var maxMaxWH = -1000;
    var minMaxWH = 1000;

    var i = 0
    for (; i < tableData.length; i++) {
      sigWHData[i] = [tableData[i].dt, tableData[i].sigwh];
      maxSigWH = tableData[i].sigwh > maxSigWH ? tableData[i].sigwh : maxSigWH;
      minSigWH = tableData[i].sigwh < minSigWH ? tableData[i].sigwh : minSigWH;

      maxWHData[i] = [tableData[i].dt, tableData[i].maxwh];
      maxMaxWH = tableData[i].maxwh > maxMaxWH ? tableData[i].maxwh : maxMaxWH;
      minMaxWH = tableData[i].maxwh < minMaxWH ? tableData[i].maxwh : minMaxWH;
    }
    var minDate = tableData[0].dt;
    var maxDate
    if (i == 0)
      maxDate = minDate;
    else
      maxDate = tableData[i - 1].dt;

    var option = {
      title: {
        text: "海浪有效波高和最大波高",
        left: 'center'
      },
      tooltip: {},
      legend: {
        data: ['有效波高', '最大波高'],
        orient: 'horizontal',
        top: '25',
        right: '150'
      },
      xAxis: {
        name: "时间",
        nameLocation: 'middle',
        type: 'time',
        min: minDate,
        max: maxDate,
        nameGap: '40',
      },
      yAxis: [{
        name: "有效波高(m)",
        nameLocation: 'end',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: Math.floor(minSigWH),
        max: Math.ceil(maxSigWH),
        nameGap: '15',
        // offset:'100'
      }, {
        name: "最大波高(m)",
        nameLocation: 'end',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: Math.floor(minMaxWH),
        max: Math.ceil(maxMaxWH),
        nameGap: '15',
        // offset:'100'
      }],
      dataZoom: [{
        type: 'slider',
        yAxisIndex: 0,
        left: 0,
        filterMode: 'empty',
        startValue: Math.floor(minSigWH),
        endValue: Math.ceil(maxSigWH),
        realtime: false,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }, {
        type: 'slider',
        yAxisIndex: 0,
        left: 0,
        filterMode: 'empty',
        startValue: Math.floor(minMaxWH),
        endValue: Math.ceil(maxMaxWH),
        realtime: false,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      },
        {
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'empty'
        }],
      series: [{
        name: '有效波高',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        data: sigWHData,
        itemStyle: {
          color: "#FF0000"
        }
      }, {
        name: '最大波高',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        data: maxWHData,
        itemStyle: {
          color: "#336699"
        }
      }]
    };
    chart.setOption(option);
  },
  /**
   * 海浪有效波高
   * @param tableData
   * @param chart
   */
  drawWaveSigWH(tableData, chart) {
    var data = echarts.util.map(tableData, function (entry) {
      return [entry.dt, entry.sigwh, entry.maindire,];
    });
    var dims = {
      dt: 0,
      sigwh: 1,
      maindire: 2
    };

    function waveLevel(speed) {
      //svg 的坐标系是右为x正方向，下为y正方向，因此为了画出标准的北向风，此处y值全为负值
      //风向标旗头指的方向是风向
      if (speed < 0.3)
        return 'M-2,0 L-2,-8 L-4,-8 L0,-12 L4,-8 L2,-8 L2,0 L-2,0';
      else if (speed < 0.6)
        return 'M-2,0 L-2,-12 L-4,-12 L0,-16 L4,-12 L2,-12 L2,0 L-2,0';
      else if (speed < 0.9)
        return 'M-2,0 L-2,-16 L-4,-16 L0,-20 L4,-16 L2,-16 L2,0 L-2,0';
      else if (speed < 1.2)
        return 'M-2,0 L-2,-20 L-4,-20 L0,-24 L4,-20 L2,-20 L2,0 L-2,0';
      else if (speed < 1.5)
        return 'M-2,0 L-2,-24 L-4,-24 L0,-28 L4,-24 L2,-24 L2,0 L-2,0';
      else
        return 'M-2,0 L-2,-28 L-4,-28 L0,-32 L4,-28 L2,-28 L2,0 L-2,0';
    }

    function renderArrow(param, api) {
      var point = api.coord([
        api.value(dims.dt),
        api.value(dims.sigwh)
      ]);

      return {
        type: 'path',
        shape: {
          pathData: waveLevel(api.value(dims.sigwh)),
        },
        rotation: -api.value(dims.maindire),
        position: point,
        style: api.style({
          fill: '#444444',
          stroke: '#444444',
          lineWidth: 1
        })
      };
    }


    var sigWHData = [];
    var mainDireData = [];

    var maxSigWH = -1000;
    var minSigWH = 1000;

    var i = 0
    for (; i < tableData.length; i++) {
      sigWHData[i] = [tableData[i].dt, tableData[i].sigwh];
      mainDireData[i] = [tableData[i].dt, tableData[i].sigwh, tableData[i].maindire];
      maxSigWH = tableData[i].sigwh > maxSigWH ? tableData[i].sigwh : maxSigWH;
      minSigWH = tableData[i].sigwh < minSigWH ? tableData[i].sigwh : minSigWH;
    }
    var minDate = tableData[0].dt;
    var maxDate
    if (i == 0)
      maxDate = minDate;
    else
      maxDate = tableData[i - 1].dt;


    var option = {
      title: {
        text: "海浪有效波高和浪向",
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          return [
            '时间：' + params[0].value[dims.dt],
            '波高：' + params[0].value[dims.sigwh].toFixed(2) + 'm',
            '波向：' + (params[0].value[dims.maindire] * 180 / Math.PI).toFixed(2) + '°',
          ].join('<br>');
        }
      },
      legend: {
        data: ['有效波高'],
        orient: 'horizontal',
        top: '25',
        right: '150'
      },
      xAxis: {
        name: "时间",
        nameLocation: 'middle',
        type: 'time',
        min: minDate,
        max: maxDate,
        nameGap: '40',
        //强制设置坐标轴分割间隔。
        // 因为 splitNumber 是预估的值，实际根据策略计算出来的刻度可能无法达到想要的效果，这时候可以使用 interval 配合 min、max 强制设定刻度划分，一般不建议使用。
        // 在时间轴（type: 'time'）中需要传时间戳， 3600 * 3 * 1000 保证坐标轴分割刻度为3小时
        //interval:3600 * 3 * 1000,
        splitNumber: 12,
      },
      yAxis: {
        name: "有效波高(m)",
        nameLocation: 'end',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: Math.floor(minSigWH),
        max: Math.ceil(maxSigWH),
        nameGap: '15',
        // offset:'100'
      },
      dataZoom: [{
        type: 'slider',
        yAxisIndex: 0,
        left: 0,
        filterMode: 'empty',
        startValue: Math.floor(minSigWH),
        endValue: Math.ceil(maxSigWH),
        realtime: false,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }, {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty'
      }],
      series: [{
        type: 'custom',
        renderItem: renderArrow,
        encode: {
          x: dims.dt,
          y: dims.sigwh
        },
        data: data,
        z: 10
      }, {
        name: '有效波高',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        data: data,
        encode: {
          x: dims.dt,
          y: dims.sigwh
        },
        itemStyle: {
          color: "#FF0000"
        },
        z: 1,
      },]
    };
    chart.setOption(option);
  },

  /**
   * 海流流速和流向
   * @param tableData
   * @param chart
   */
  drawCurrentFlowV(tableData, chart) {
    var flowVData = [];

    var maxFlowV = -10000;
    var minFlowV = 10000;

    var i = 0
    for (; i < tableData.length; i++) {
      flowVData[i] = [tableData[i].dt, tableData[i].flowv];
      maxFlowV = tableData[i].flowv > maxFlowV ? tableData[i].flowv : maxFlowV;
      minFlowV = tableData[i].flowv < minFlowV ? tableData[i].flowv : minFlowV;
    }
    var minDate = tableData[0].dt;
    var maxDate
    if (i == 0)
      maxDate = minDate;
    else
      maxDate = tableData[i - 1].dt;

    var option = {
      title: {
        text: "海流流速",
        left: 'center'
      },
      tooltip: {},
      legend: {
        data: ['流速'],
        orient: 'horizontal',
        top: '25',
        right: '150'
      },
      grid: {
        left: 75,
        right: 30,
        top: 40,
        bottom: 50
      },
      xAxis: {
        name: "时间",
        nameLocation: 'middle',
        type: 'time',
        min: minDate,
        max: maxDate,
        nameGap: '40',
        //强制设置坐标轴分割间隔。
        // 因为 splitNumber 是预估的值，实际根据策略计算出来的刻度可能无法达到想要的效果，这时候可以使用 interval 配合 min、max 强制设定刻度划分，一般不建议使用。
        // 在时间轴（type: 'time'）中需要传时间戳， 3600 * 3 * 1000 保证坐标轴分割刻度为3小时
        //interval:3600 * 3 * 1000,
        splitNumber: 12,
      },
      yAxis: {
        name: "流速(m/s)",
        nameLocation: 'end',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: Math.floor(minFlowV),
        max: Math.ceil(maxFlowV),
        nameGap: '15',
        // offset:'100'
      },
      dataZoom: [{
        type: 'slider',
        yAxisIndex: 0,
        left: 0,
        filterMode: 'empty',
        startValue: Math.floor(minFlowV),
        endValue: Math.ceil(maxFlowV),
        realtime: false,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }, {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'empty'
      }],
      series: {
        name: '流速',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        yAxisIndex: 0,
        data: flowVData,
        itemStyle: {
          color: "#FF0000"
        }
      }
    };
    chart.setOption(option);
  },

  /**
   * 实时监测站点水深、流速和流向
   * @param tableData
   * @param chart
   */
  drawRealTimeMonitorVelocDir(monitorNames, tableData, chart) {
    function waveLevel(speed) {
      //svg 的坐标系是右为x正方向，下为y正方向，因此为了画出标准的北向风，此处y值全为负值
      //风向标旗头指的方向是风向
      return 'M-1,0 L-1,-12 L-3,-12 L0,-16 L3,-12 L1,-12 L1,0 L-1,0';
    }

    function renderArrow(param, api) {
      var point = api.coord([
        api.value(dims.veloc),
        api.value(dims.lev)
      ]);

      return {
        type: 'path',
        shape: {
          pathData: waveLevel(api.value(dims.veloc)),
        },
        rotation: Math.atan2(api.value(dims.u), api.value(dims.v)),//传入弧度制,默认值是 0。表示旋转的弧度值。正值表示逆时针旋转。
        position: point,
        style: api.style({
          fill: '#00BFFF',
          stroke: '#00BFFF',
          lineWidth: 0.05
        })
      };
    }

    function formatDateTime(theDate) {
      var _hour = theDate.getHours();
      var _minute = theDate.getMinutes();
      var _second = theDate.getSeconds();
      var _year = theDate.getFullYear();
      var _month = theDate.getMonth();
      var _date = theDate.getDate();
      if (_hour < 10) {
        _hour = "0" + _hour;
      }
      if (_minute < 10) {
        _minute = "0" + _minute;
      }
      if (_second < 10) {
        _second = "0" + _second;
      }
      _month = _month + 1;
      if (_month < 10) {
        _month = "0" + _month;
      }
      if (_date < 10) {
        _date = "0" + _date;
      }
      return _year + "-" + _month + "-" + _date + " " + _hour + ":" + _minute + ":" + _second;
    }

    // 正式开始处理Info
    var tableDataInfoList = [];
    var count = tableData.adcpinfoNewList.length;
    for (var i = 0; i < count; i++) {
      if (tableData.adcpinfoNewList[i] != null) {
        tableDataInfoList[i] = tableData.adcpinfoNewList[i];
      } else {
        tableDataInfoList[i] = "";
      }
    }

    // 正式开始处理Lev
    var tableDataLevList = [];
    var lev10mAvgList = [];
    for (var i = 0; i < count; i++) {
      lev10mAvgList[i] = {veloc: "--", dir: "--"}; // 10m平均
      if (tableData.adcplevNewListAll[i] != null) {
        tableDataLevList[i] = tableData.adcplevNewListAll[i];
        // 预处理，筛选出10m平均（lev0），复制10mAvg
        if (tableDataLevList[i].length > 0 && tableDataLevList[i][0].lev == 0) {
          var lev0 = tableDataLevList[i][0];
          lev10mAvgList[i].veloc = (lev0.veloc / 1000).toFixed(3);
          lev10mAvgList[i].dir = (0 - (Math.atan2(lev0.u, lev0.v) * 180 / Math.PI).toFixed(2));
          tableDataLevList[i] = tableDataLevList[i].slice(1);
        }
      } else {
        tableDataLevList[i] = "";
        tableDataInfoList[i].dt = "";
        tableDataInfoList[i].p = "";
        tableDataInfoList[i].r = "";
      }
    }


    var tableDataAll = new Array();  //先声明一维
    for (var i = 0; i < count; i++) {
      tableDataAll[i] = new Array();   //声明二维，每一个一维数组里面的一个元素都是一个数组
      for (var j = 0; j < tableDataLevList[i].length; j++) {
        tableDataAll[i][j] = [tableDataLevList[i][j].veloc / 1000, tableDataLevList[i][j].lev, tableDataLevList[i][j].u, tableDataLevList[i][j].v];
      }
    }


    var position = monitorNames;
    // position[0] = "西点";
    // position[1] = "西南点";
    // position[2] = "东南点";
    // position[3] = "基槽点";

    var dims = {
      lev: 0,
      veloc: 1,
      u: 2,
      v: 3
    };

    var dataArrow = [];
    for (var i = 0; i < count; i++) {
      dataArrow[i] = echarts.util.map(tableDataLevList[i], function (entry) {
        return [entry.lev, entry.veloc / 1000, entry.u, entry.v];
      });
    }

    var width = Math.max(230, 1200 / count - 70);
    var height = 55;
    var x = [];
    x[0] = 80;
    var xInterval = width + 70;
    for (var i = 1; i < count; i++) {
      x[i] = x[i - 1] + xInterval;
    }

    // var titleTempText = [];
    // for (var i = 0; i < count; i++) {
    //   if (tableDataInfoList[i].length != 0) {
    //     titleTempText[i] = position[i] + '（P:' + tableDataInfoList[i].p + ' R:' + tableDataInfoList[i].r + '）';
    //   }
    //   else {
    //     titleTempText[i] = position[i] + '（P:  Null   R: Null）';
    //   }
    // }

    var titleTempSubtext = [];
    for (var i = 0; i < count; i++) {
      if (tableDataInfoList[i].length != 0) {
        titleTempSubtext[i] = "十米平均 (流速: " + lev10mAvgList[i].veloc + " m/s, 流向: " + lev10mAvgList[i].dir + " °)";
        titleTempSubtext[i] += "\n" + formatDateTime(new Date(tableDataInfoList[i].dt));
      } else {
        titleTempSubtext[i] = "";
      }
    }

    var title = [];
    for (var i = 0; i < count; i++) {
      var titleTemp = {
        text: position[i],
        textStyle: {
          fontSize: 14,
          color: '#17233d',
          fontWeight: 'bold'
        },
        subtext: titleTempSubtext[i],
        subtextStyle: {
          fontSize: 12,
          color: '#333',
          fontWeight: 'normal'
        },
        textAlign: 'left',
        x: x[i],
      };
      title.push(titleTemp);
    }

    var xAxis = [];
    for (var i = 0; i < count; i++) {
      var xAxisTemp = {
        gridIndex: i,
        name: "流速(m/s)",
        nameLocation: 'middle',
        nameGap: '30',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: 0,
        max: 2,
        interval: 0.4,
      };
      xAxis.push(xAxisTemp);
    }

    var yAxis = [];
    for (var i = 0; i < count; i++) {
      var yAxisTemp = {
        gridIndex: i,
        name: "水深(m)",
        nameLocation: 'middle',
        nameGap: '25',
        type: 'value',
        min: 0,
        max: 50,
        splitNumber: 5,
        inverse: true,
      };
      yAxis.push(yAxisTemp);
    }

    var series = [];
    for (var i = 0; i < count; i++) {
      var seriesTemp1 = {
        type: 'custom',
        renderItem: renderArrow,
        encode: {
          x: dims.veloc,
          y: dims.lev
        },
        data: dataArrow[i],
        z: 10,
        xAxisIndex: i,
        yAxisIndex: i,
      };
      series.push(seriesTemp1);
    }
    for (var i = 0; i < count; i++) {
      var seriesTemp2 = {
        xAxisIndex: i,
        yAxisIndex: i,
        name: '0',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        data: tableDataAll[i],
        itemStyle: {
          color: '#191970',
        },
        lineStyle: {
          width: 4,
        },
        symbolSize: 6,
        markLine: {
          silent: true,
          symbolSize: 0,
          label: {
            show: false
          },
          lineStyle: {
            width: 1,
            type: 'dotted'
          },
          data: [{
            xAxis: 0.4
          }, {
            xAxis: 0.8
          }],
          animation: false
        },
        markArea: {
          silent: true,
          data: [[{
            xAxis: 0
          }, {
            xAxis: 0.4,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [{
                  offset: 0, color: 'rgba(255,255,255,0.19)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(172,255,181,0.56)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          }], [{
            xAxis: 0.4
          }, {
            xAxis: 0.8,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [{
                  offset: 0, color: 'rgba(255,255,255,0.19)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(251,233,178,0.56)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          }]]
        },
      };
      series.push(seriesTemp2);
    }


    // x:坐标轴左边与边框的距离
    // y:坐标轴顶端与边框的距离
    // x2:坐标轴右边与边框的距离
    // y2:坐标轴底端与边框的距离
    var option = {
        title: title,
        tooltip: {
          formatter: function (params) {
            if (params.componentSubType == "custom") {
              return [
                '水深：' + params.value[0] + 'm',
                '流速：' + params.value[1].toFixed(3) + 'm/s',
                '流向：' + (0 - (Math.atan2(params.value[2], params.value[3]) * 180 / Math.PI).toFixed(2)) + '°',//Math.atan2(api.value(dims.u), api.value(dims.v)),弧度转角度
              ].join('<br>');
            } else {
              return [
                '水深：' + params.value[1] + 'm',
                '流速：' + params.value[0].toFixed(3) + 'm/s',
                '流向：' + (0 - (Math.atan2(params.value[2], params.value[3]) * 180 / Math.PI).toFixed(2)) + '°',//Math.atan2(api.value(dims.u), api.value(dims.v)),弧度转角度
              ].join('<br>');
            }

          }
        },
        grid: [
          {x: x[0], y: height, width: width},
          {x: x[1], y: height, width: width},
          {x: x[2], y: height, width: width},
          {x: x[3], y: height, width: width},
          {x: x[4], y: height, width: width},
          {x: x[5], y: height, width: width},
          {x: x[6], y: height, width: width},
        ],
        xAxis: xAxis,
        yAxis: yAxis,
        series: series,
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: Array.from(Array(monitorNames.length), (v, k) => k), //如果是 Array 表示控制多个轴。这里控制所有y轴
            filterMode: 'empty',
            handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '95%',
            start: 0,
            end: end,
            x: 0,
            orient: "vertical",
          },
        ],
      }
    ;
    chart.setOption(option);

    chart.on('dataZoom', function (event) {
      if (event.batch) {
        start = event.batch[0].start;
        end = event.batch[0].end;
      } else {
        start = event.start;
        end = event.end;
      }
    });

  },

  /**
   * 历史监测站点水深、流速和流向
   * @param tableData
   * @param chart
   */
  drawHistoryMonitorVelocDir(tableData, chart) {


    var num = tableData.length;

    var tableDataAll = new Array();  //先声明一维
    for (var i = 0; i < num; i++) {
      tableDataAll[i] = new Array();   //声明二维，每一个一维数组里面的一个元素都是一个数组
      for (var j = 0; j < tableData[i].length; j++) {
        tableDataAll[i][j] = [tableData[i][j].veloc / 1000, tableData[i][j].lev, tableData[i][j].u, tableData[i][j].v, tableData[i][j].dt];
      }
    }

    function waveLevel(speed) {
      //svg 的坐标系是右为x正方向，下为y正方向，因此为了画出标准的北向风，此处y值全为负值
      //风向标旗头指的方向是风向
      return 'M-1,0 L-1,-12 L-3,-12 L0,-16 L3,-12 L1,-12 L1,0 L-1,0';
    }

    var dims = {
      lev: 0,
      veloc: 1,
      u: 2,
      v: 3
    };

    function renderArrow(param, api) {
      var point = api.coord([
        api.value(dims.veloc),
        api.value(dims.lev)
      ]);

      return {
        type: 'path',
        shape: {
          pathData: waveLevel(api.value(dims.veloc)),
        },
        rotation: Math.atan2(api.value(dims.u), api.value(dims.v)),//传入弧度制,默认值是 0。表示旋转的弧度值。正值表示逆时针旋转。
        position: point,
        style: api.style({
          fill: '#00BFFF',
          stroke: '#00BFFF',
          lineWidth: 0.05
        })
      };
    }

    function formatDateTime(theDate) {
      var _hour = theDate.getHours();
      var _minute = theDate.getMinutes();
      var _second = theDate.getSeconds();
      var _year = theDate.getFullYear();
      var _month = theDate.getMonth();
      var _date = theDate.getDate();
      if (_hour < 10) {
        _hour = "0" + _hour;
      }
      if (_minute < 10) {
        _minute = "0" + _minute;
      }
      if (_second < 10) {
        _second = "0" + _second;
      }
      _month = _month + 1;
      if (_month < 10) {
        _month = "0" + _month;
      }
      if (_date < 10) {
        _date = "0" + _date;
      }
      return _year + "-" + _month + "-" + _date + " " + _hour + ":" + _minute + ":" + _second;
    }

    var dataArrow = [];
    for (var i = 0; i < num; i++) {
      dataArrow[i] = echarts.util.map(tableData[i], function (entry) {
        return [entry.lev, entry.veloc / 1000, entry.u, entry.v, entry.dt];
      });
    }


    var x = [];
    x[0] = 90;
    for (var i = 1; i < num; i++) {
      x[i] = x[i - 1] + 240;
    }

    var xAxis = [];
    for (var i = 0; i < num; i++) {
      var xAxisTemp = {
        gridIndex: i,
        name: "流速(m/s)",
        nameLocation: 'middle',
        nameGap: '30',
        type: 'value',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        min: 0,
        max: 2,
        interval: 0.4,
      };
      xAxis.push(xAxisTemp);
    }

    var yAxis = [];
    for (var i = 0; i < num; i++) {
      var yAxisTemp = {
        gridIndex: i,
        name: "水深(m)",
        nameLocation: 'middle',
        nameGap: '25',
        type: 'value',
        min: 0,
        max: 50,
        splitNumber: 5,
        inverse: true,
        //show:false,
      };
      yAxis.push(yAxisTemp);
    }

    var series = [];
    for (var i = 0; i < num; i++) {
      var seriesTemp1 = {
        type: 'custom',
        renderItem: renderArrow,
        encode: {
          x: dims.veloc,
          y: dims.lev
        },
        data: dataArrow[i],
        z: 10,
        xAxisIndex: i,
        yAxisIndex: i,
      };
      series.push(seriesTemp1);
    }
    for (var i = 0; i < num; i++) {
      var seriesTemp2 = {
        xAxisIndex: i,
        yAxisIndex: i,
        name: '0',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        data: tableDataAll[i],
        itemStyle: {
          color: '#191970',
        },
        lineStyle: {
          width: 4,
        },
        symbolSize: 6,
        markLine: {
          silent: true,
          symbolSize: 0,
          label: {
            show: false
          },
          lineStyle: {
            width: 1,
            type: 'dotted'
          },
          data: [{
            xAxis: 0.4
          }, {
            xAxis: 0.8
          }],
          animation: false
        },
        markArea: {
          silent: true,
          data: [[{
            xAxis: 0
          }, {
            xAxis: 0.4,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [{
                  offset: 0, color: 'rgba(255,255,255,0.19)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(172,255,181,0.56)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          }], [{
            xAxis: 0.4
          }, {
            xAxis: 0.8,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [{
                  offset: 0, color: 'rgba(255,255,255,0.19)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(251,233,178,0.56)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          }]]
        },
      };
      series.push(seriesTemp2);
    }

    var grid = [];
    for (var i = 0; i < num; i++) {
      var gridTemp = {
        x: x[i], y: 20, width: 180,
      }
      grid.push(gridTemp);
    }

    var titleTempText = [];
    for (var i = 0; i < num; i++) {
      titleTempText[i] = formatDateTime(new Date(tableData[i][1].dt));
    }

    var title = [];
    for (var i = 0; i < num; i++) {
      var titleTemp = {
        text: titleTempText[i],
        textStyle: {
          fontSize: 12,
          color: '#333',
          fontWeight: 'normal'
        },
        textAlign: 'left',
        x: x[i] + 20,
        y: 0,
      };
      title.push(titleTemp);
    }

    var yAxisIndex = [];
    for (var i = 0; i < num; i++) {
      yAxisIndex.push(i);
    }

    var option = {
        title: title,
        tooltip: {
          formatter: function (params) {
            if (params.componentSubType == "custom") {
              return [
                '水深：' + params.value[0] + 'm',
                '流速：' + params.value[1].toFixed(3) + 'm/s',
                '流向：' + (0 - (Math.atan2(params.value[2], params.value[3]) * 180 / Math.PI).toFixed(2)) + '°',//Math.atan2(api.value(dims.u), api.value(dims.v)),弧度转角度
                '时刻：' + formatDateTime(new Date(params.value[4]))
              ].join('<br>');
            } else {
              return [
                '水深：' + params.value[1] + 'm',
                '流速：' + params.value[0].toFixed(3) + 'm/s',
                '流向：' + (0 - (Math.atan2(params.value[2], params.value[3]) * 180 / Math.PI).toFixed(2)) + '°',//Math.atan2(api.value(dims.u), api.value(dims.v)),弧度转角度
                '时刻：' + formatDateTime(new Date(params.value[4]))
              ].join('<br>');
            }

          }
        },
        grid: grid,
        xAxis: xAxis,
        yAxis: yAxis,
        series: series,

      }
    ;
    chart.setOption(option);
    chart.resize({
      width: x[x.length - 1] + 240
    })
  },

  /**
   * 预报监测站点水深、流速和流向
   * @param tableData
   * @param chart
   */
  drawForecastAllMonitorVelocDir(tableData, chart, minDate, maxDate) {
    var num = tableData.length;

    var tableDataAll = new Array();  //先声明一维
    for (var i = 0; i < num; i++) {
      tableDataAll[i] = new Array();   //声明二维，每一个一维数组里面的一个元素都是一个数组
      for (var j = 0; j < tableData[i].length; j++) {
        tableDataAll[i][j] = [tableData[i][j].dt, tableData[i][j].veloc / 1000, tableData[i][j].u, tableData[i][j].v, tableData[i][j].lev];
      }
    }

    function waveLevel(speed) {
      //svg 的坐标系是右为x正方向，下为y正方向，因此为了画出标准的北向风，此处y值全为负值
      //风向标旗头指的方向是风向
      return 'M-1,0 L-1,-12 L-3,-12 L0,-16 L3,-12 L1,-12 L1,0 L-1,0';
    }

    var dims = {
      lev: 0,
      veloc: 1,
      u: 2,
      v: 3
    };

    function renderArrow(param, api) {
      var point = api.coord([
        api.value(dims.veloc),
        api.value(dims.lev)
      ]);

      return {
        type: 'path',
        shape: {
          pathData: waveLevel(api.value(dims.veloc)),
        },
        rotation: Math.atan2(api.value(dims.u), api.value(dims.v)),//传入弧度制,默认值是 0。表示旋转的弧度值。正值表示逆时针旋转。
        position: point,
        style: api.style({
          fill: '#00BFFF',
          stroke: '#00BFFF',
          lineWidth: 0.05
        })
      };
    }

    function formatDateTime(theDate) {
      var _hour = theDate.getHours();
      var _minute = theDate.getMinutes();
      var _second = theDate.getSeconds();
      var _year = theDate.getFullYear();
      var _month = theDate.getMonth();
      var _date = theDate.getDate();
      if (_hour < 10) {
        _hour = "0" + _hour;
      }
      if (_minute < 10) {
        _minute = "0" + _minute;
      }
      if (_second < 10) {
        _second = "0" + _second;
      }
      _month = _month + 1;
      if (_month < 10) {
        _month = "0" + _month;
      }
      if (_date < 10) {
        _date = "0" + _date;
      }
      return _year + "-" + _month + "-" + _date + " " + _hour + ":" + _minute + ":" + _second;
    }

    var dataArrow = [];
    for (var i = 0; i < num; i++) {
      dataArrow[i] = echarts.util.map(tableData[i], function (entry) {
        return [entry.veloc / 1000, entry.dt, entry.u, entry.v, entry.lev,];
      });
    }


    var x = [];
    var y = [];
    x[0] = 100;
    y[0] = 15;

    x[1] = 650;
    y[1] = 15;

    x[2] = 100;
    y[2] = 195;

    x[3] = 650;
    y[3] = 195;

    x[4] = 100;
    y[4] = 375;

    x[5] = 650;
    y[5] = 375;

    x[6] = 100;
    y[6] = 555;

    x[7] = 650;
    y[7] = 555;


    var xAxis = [];
    for (var i = 0; i < num; i++) {
      var xAxisTemp = {
        gridIndex: i,
        name: "时间",
        nameLocation: 'middle',
        nameGap: '35',
        type: 'time',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        // min: minDate,//tableData[0].dt
        // max: maxDate,
        splitNumber: 12,
      };
      xAxis.push(xAxisTemp);
    }

    var yAxis = [];
    for (var i = 0; i < num; i++) {
      var yAxisTemp = {
        gridIndex: i,
        name: "流速(m/s)",
        nameLocation: 'middle',
        nameGap: '30',
        type: 'value',
        min: 0,
        max: 2,
        interval: 0.4,
        //show:false,
      };
      yAxis.push(yAxisTemp);
    }

    var series = [];
    for (var i = 0; i < num; i++) {
      var seriesTemp1 = {
        type: 'custom',
        renderItem: renderArrow,
        encode: {
          x: dims.veloc,
          y: dims.lev
        },
        data: dataArrow[i],
        z: 10,
        xAxisIndex: i,
        yAxisIndex: i,
      };
      series.push(seriesTemp1);
    }
    for (var i = 0; i < num; i++) {
      var seriesTemp2 = {
        xAxisIndex: i,
        yAxisIndex: i,
        name: '0',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        data: tableDataAll[i],
        itemStyle: {
          color: '#191970',
        },
        lineStyle: {
          width: 4,
        },
        symbolSize: 6,
        markLine: {
          silent: true,
          symbolSize: 0,
          label: {
            show: false
          },
          lineStyle: {
            width: 1,
            type: 'dotted'
          },
          data: [{
            yAxis: 0.4
          }, {
            yAxis: 0.8
          }],
          animation: false
        },
        markArea: {
          silent: true,
          data: [[{
            yAxis: 0
          }, {
            yAxis: 0.4,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 1,
                x2: 0,
                y2: 0,
                colorStops: [{
                  offset: 0, color: 'rgba(255,255,255,0.19)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(172,255,181,0.56)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          }], [{
            yAxis: 0.4
          }, {
            yAxis: 0.8,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 1,
                x2: 0,
                y2: 0,
                colorStops: [{
                  offset: 0, color: 'rgba(255,255,255,0.19)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(251,233,178,0.56)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          }]]
        },
      };
      series.push(seriesTemp2);
    }

    var grid = [];
    for (var i = 0; i < num; i++) {
      var gridTemp = {
        x: x[i], y: y[i], width: 500, height: 120
      }
      grid.push(gridTemp);
    }

    var titleTempText = [];
    for (var i = 0; i < num; i++) {
      //titleTempText[i] = formatDateTime(new Date(tableData[i][1].dt));
      titleTempText[i] = tableData[i][1].lev;
    }

    var title = [];
    for (var i = 0; i < num; i++) {
      var titleTemp = {
        text: 'H:-' + titleTempText[i] + 'm',
        textStyle: {
          fontSize: 12,
          color: '#333',
          fontWeight: 'normal'
        },
        textAlign: 'left',
        x: x[i] + 450,
        y: y[i] - 20,
      };
      title.push(titleTemp);
    }

    var yAxisIndex = [];
    for (var i = 0; i < num; i++) {
      yAxisIndex.push(i);
    }

    var option = {
        title: title,
        tooltip: {
          formatter: function (params) {
            if (params.componentSubType == "custom") {
              return [
                '水深：' + params.value[4] + 'm',
                '流速：' + params.value[0].toFixed(3) + 'm/s',
                '流向：' + (0 - (Math.atan2(params.value[2], params.value[3]) * 180 / Math.PI).toFixed(2)) + '°',//Math.atan2(api.value(dims.u), api.value(dims.v)),弧度转角度
                '时刻：' + formatDateTime(new Date(params.value[1]))
              ].join('<br>');
            } else {
              return [
                '水深：' + params.value[4] + 'm',
                '流速：' + params.value[1].toFixed(3) + 'm/s',
                '流向：' + (0 - (Math.atan2(params.value[2], params.value[3]) * 180 / Math.PI).toFixed(2)) + '°',//Math.atan2(api.value(dims.u), api.value(dims.v)),弧度转角度
                '时刻：' + formatDateTime(new Date(params.value[0]))
              ].join('<br>');
            }

          }
        },
        grid: grid,
        xAxis: xAxis,
        yAxis: yAxis,
        series: series,
        dataZoom: [
          {
            type: 'slider',
            yAxisIndex: yAxisIndex, //如果是 Array 表示控制多个轴。这里控制所有y轴
            filterMode: 'empty',
            handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '105%',
            x: 10
          },
        ]
      }
    ;
    chart.setOption(option);
  },


  /**
   * 预报监测站点10m平均流速和流向
   * @param tableData
   * @param chart
   */
  drawTenMAvgMonitorVelocDir(tableData, chart, monitorNames) {
    var num = tableData.length;

    function waveLevel(speed) {
      //svg 的坐标系是右为x正方向，下为y正方向，因此为了画出标准的北向风，此处y值全为负值
      //风向标旗头指的方向是风向
      return 'M-1,0 L-1,-12 L-3,-12 L0,-16 L3,-12 L1,-12 L1,0 L-1,0';
    }

    function renderArrow(param, api) {
      var point = api.coord([
        api.value(dims.veloc),
        api.value(dims.lev)
      ]);

      return {
        type: 'path',
        shape: {
          pathData: waveLevel(api.value(dims.veloc)),
        },
        rotation: Math.atan2(api.value(dims.u), api.value(dims.v)),//传入弧度制,默认值是 0。表示旋转的弧度值。正值表示逆时针旋转。
        position: point,
        style: api.style({
          fill: '#00BFFF',
          stroke: '#00BFFF',
          lineWidth: 0.05
        })
      };
    }

    function formatDateTime(theDate) {
      var _hour = theDate.getHours();
      var _minute = theDate.getMinutes();
      var _second = theDate.getSeconds();
      var _year = theDate.getFullYear();
      var _month = theDate.getMonth();
      var _date = theDate.getDate();
      if (_hour < 10) {
        _hour = "0" + _hour;
      }
      if (_minute < 10) {
        _minute = "0" + _minute;
      }
      if (_second < 10) {
        _second = "0" + _second;
      }
      _month = _month + 1;
      if (_month < 10) {
        _month = "0" + _month;
      }
      if (_date < 10) {
        _date = "0" + _date;
      }
      return _year + "-" + _month + "-" + _date + " " + _hour + ":" + _minute + ":" + _second;
    }

    var tableDataAll = new Array();  //先声明一维
    for (var i = 0; i < num; i++) {
      tableDataAll[i] = new Array();   //声明二维，每一个一维数组里面的一个元素都是一个数组
      for (var j = 0; j < tableData[i].length; j++) {
        tableDataAll[i][j] = [tableData[i][j].dt, tableData[i][j].veloc / 1000, tableData[i][j].u, tableData[i][j].v, tableData[i][j].lev];
      }
    }

    var dims = {
      lev: 0,
      veloc: 1,
      u: 2,
      v: 3
    };

    var dataArrow = [];
    for (var i = 0; i < num; i++) {
      dataArrow[i] = echarts.util.map(tableData[i], function (entry) {
        return [entry.veloc / 1000, entry.dt, entry.u, entry.v, entry.lev,];
      });
    }


    var x = [100];
    var y = [20];
    var width = 725;
    var height = 160;
    for (var i = 1; i < num; i++) {
      x[i] = x[i - 1];
      y[i] = y[i - 1] + 250;
    }


    var xAxis = [];
    for (var i = 0; i < num; i++) {
      var xAxisTemp = {
        gridIndex: i,
        name: "时间",
        nameLocation: 'middle',
        nameGap: '35',
        type: 'time',
        axisLine: {
          onZero: false
        },
        splitLine: {
          show: false
        },
        // min: minDate,//tableData[0].dt
        // max: maxDate,
        splitNumber: 12,
      };
      xAxis.push(xAxisTemp);
    }

    var yAxis = [];
    for (var i = 0; i < num; i++) {
      var yAxisTemp = {
        gridIndex: i,
        name: "流速(m/s)",
        nameLocation: 'middle',
        nameGap: '30',
        type: 'value',
        min: 0,
        max: 2,
        interval: 0.4,
        //show:false,
      };
      yAxis.push(yAxisTemp);
    }

    var series = [];
    for (var i = 0; i < num; i++) {
      var seriesTemp1 = {
        type: 'custom',
        renderItem: renderArrow,
        encode: {
          x: dims.veloc,
          y: dims.lev
        },
        data: dataArrow[i],
        z: 10,
        xAxisIndex: i,
        yAxisIndex: i,
      };
      series.push(seriesTemp1);
    }
    for (var i = 0; i < num; i++) {
      var seriesTemp2 = {
        xAxisIndex: i,
        yAxisIndex: i,
        name: '0',
        type: 'line',
        symbol: 'circle',
        smooth: true,
        data: tableDataAll[i],
        itemStyle: {
          color: '#191970',
        },
        lineStyle: {
          width: 4,
        },
        symbolSize: 6,
        markLine: {
          silent: true,
          symbolSize: 0,
          label: {
            show: false
          },
          lineStyle: {
            width: 1,
            type: 'dotted'
          },
          data: [{
            yAxis: 0.4
          }, {
            yAxis: 0.8
          }],
          animation: false
        },
        markArea: {
          silent: true,
          data: [[{
            yAxis: 0
          }, {
            yAxis: 0.4,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 1,
                x2: 0,
                y2: 0,
                colorStops: [{
                  offset: 0, color: 'rgba(255,255,255,0.19)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(172,255,181,0.56)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          }], [{
            yAxis: 0.4
          }, {
            yAxis: 0.8,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 1,
                x2: 0,
                y2: 0,
                colorStops: [{
                  offset: 0, color: 'rgba(255,255,255,0.19)' // 0% 处的颜色
                }, {
                  offset: 1, color: 'rgba(251,233,178,0.56)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          }]]
        },
      };
      series.push(seriesTemp2);
    }

    var grid = [];
    for (var i = 0; i < num; i++) {
      var gridTemp = {
        x: x[i], y: y[i], width: width, height: height
      };
      grid.push(gridTemp);
    }

    var title = [];
    for (var i = 0; i < num; i++) {
      var titleTemp = {
        text: '站点: ' + monitorNames[i] + '',
        textStyle: {
          fontSize: 12,
          color: '#333',
          fontWeight: 'normal'
        },
        textAlign: 'left',
        x: x[i],
        y: y[i] - 25,
      };
      title.push(titleTemp);
    }

    var yAxisIndex = [];
    for (var i = 0; i < num; i++) {
      yAxisIndex.push(i);
    }

    var option = {
        title: title,
        tooltip: {
          formatter: function (params) {
            if (params.componentSubType == "custom") {
              return [
                '水深：' + params.value[4] + 'm',
                '流速：' + params.value[0].toFixed(3) + 'm/s',
                '流向：' + (0 - (Math.atan2(params.value[2], params.value[3]) * 180 / Math.PI).toFixed(2)) + '°',//Math.atan2(api.value(dims.u), api.value(dims.v)),弧度转角度
                '时刻：' + formatDateTime(new Date(params.value[1]))
              ].join('<br>');
            } else {
              return [
                '水深：' + params.value[4] + 'm',
                '流速：' + params.value[1].toFixed(3) + 'm/s',
                '流向：' + (0 - (Math.atan2(params.value[2], params.value[3]) * 180 / Math.PI).toFixed(2)) + '°',//Math.atan2(api.value(dims.u), api.value(dims.v)),弧度转角度
                '时刻：' + formatDateTime(new Date(params.value[0]))
              ].join('<br>');
            }

          }
        },
        grid: grid,
        xAxis: xAxis,
        yAxis: yAxis,
        series: series,
        dataZoom: [
          {
            type: 'slider',
            yAxisIndex: yAxisIndex, //如果是 Array 表示控制多个轴。这里控制所有y轴
            filterMode: 'empty',
            handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '105%',
            x: 10
          },
        ]
      }
    ;
    chart.setOption(option);
  },


}
