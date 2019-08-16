const DEFAULTS = function(){
  return {
    type: 'unscalable',
    viewport: {offset: 0, barWidth: 10},    // 图表显示的视野, width表示单个数据元素占用宽度
    style: {
      pricePrecision: 3,    // 设定的数据精度,
      dateFormatPattern: 'MM/DD HH:mm',
      font: {family: 'Microsoft YaHei', size: 14},
      padding: {top: 1, right: 70, bottom: 28, left: 1},    // 设定4周数据轴区域的大小
      wheelZoomSpeed: 5,    // 设定鼠标滚轮滚动单步调整的大小
      linearLastPoint: false,    // 绘制当前价的闪烁点
      tip: {
        highColor: '#FF4040',    // 最高价颜色
        lowColor: '#1EB955',    // 最低价颜色
        currPrice: {
          lineWidth: 1,    // 当前价位线的粗细
          lineColor: 'rgba(0,0,0,0)',    // 当前价位线的颜色
          labelBg: 'rgba(0,0,0,0)',    // 当前价位的标签的背景色
          labelColor: 'rgba(0,0,0,0)',    // 当前价位的标签的字体颜色
          labelHeight: 20    // 当前价位标签的高度
        },
      },
      lastDot:{
        show: true
      },
      crosshair: {
        snapToClose: false,    // 十字线是否被当前close价吸引
        color: '#979797',    // 十字线颜色
        dash: [],
        lineWidth: 1,
        labelHeight: 20,    // 十字线标签高度
        labelBg: 'rgba(0,0,0,0)',    // 十字线标签背景色
        labelColor: 'rgba(0,0,0,0)',    // 十字线标签字体色
        labelHorizPadding: 5,    // 十字线标签空白间距
        posOffset: {    // 十字线标签偏移
          vertical: {x: 0, y: 0, width: 0}, // 0 means auto
          horizontal: {x: 0, y: 0, width: 0}
        },
        selectedPointRadius: [8, 5, 4],
        selectedPointColor: ['rgba(38,165,225,0.2)', '#fff', 'rgba(38,165,225,1)']    // 选中点的颜色
      },
      grid: {
        bg: '#fff',    // 网格线的颜色
        limit: {
          y: {
            max: 8,
            min: 2
          }
        },    // 网格线间隔调整限制
        color: {x: '#f0f0f0', y: '#f0f0f0'},    // 网格线的颜色
        span: {x: 120, y: 30} //
      },
      axis: {
        xAxisPos: 'bottom', // position of xAxis label, can be 'bottom' or 'top'
        yAxisPos: 'right', // position of yAxis label, can be 'right' or 'left'
        hideCandlestickDate: false,    // 隐藏蜡烛图的日期
        hideCandlestickTime: false,    // 隐藏蜡烛图的小时分钟
        hideBorder: false, // 显示图表border
        showRate: false,    // 显示百分比
        labelPos: {    // 坐标轴标签的位置偏移
          xAxis: {x: -35, y: 20},
          yAxis: {x: 5, y: 4}
        },
        labelColor: '#555',    // 设定坐标轴标签的颜色
        bgColor: 'rgba(0,0,0,0)',    // 坐标轴背景色
        lineColor: 'rgba(0,0,0,1)',    // 坐标轴线颜色
        showScale: false,   //是否显示刻度
        scaleLength: 10,    // 刻度长度
        showBorder: false    // 是否绘制线框
      }
    },
    dataStyle: {    // 关于数据的样式
      baseValue: '#2DB0F9',    // 分时图昨收的颜色
      candlestick: {    // K线图的颜色
        block: {up: '#FF4040', down: '#1EB955'},    // 蜡烛块的颜色
        border: {up: '#FF4040', down: '#1EB955'},    // 蜡烛边框颜色
        wick: {up: '#FF4040', down: '#1EB955'}    // 蜡烛烛心颜色
      },
      OHLC: {    // 美国线的颜色
        up: '#FF4040', down: '#1EB955'
      },
      mountain: {    // 山形线的颜色
        lineWidth: 1,    // 价格线的粗细
        lineColor: '#2DB0F9',    // 价格线的颜色
        gradientUp: 'rgba(45,176,249,0.15)',    // 山形内部渐变色
        gradientDown: 'rgba(19,119,240,0.02)'
      },
      column: {
        block: {up: '#FF4040', down: '#1EB955'},    // 蜡烛块的颜色
        border: {up: '#FF4040', down: '#1EB955'},
      }
    }
  }
}

export default DEFAULTS

