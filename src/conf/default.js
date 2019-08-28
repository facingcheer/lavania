const DEFAULTS = function(){
  return {
    type: 'unscalable',
    viewport: {offset: 0, barWidth: 10},    // 图表显示的视野, width表示单个数据元素占用宽度
    valuePrecision: 4,    // 设定的数据精度,
    valueFormatter: null,
    dateFormat: 'MM/DD HH:mm', // format pattern or function( date | UnixTime ) => string
    font: {family: 'Microsoft YaHei', size: 14},
    padding: {top: 20, right: 70, bottom: 28, left: 20},    // 设定4周数据轴区域的大小
    zoomSpeed: 5,    // 设定鼠标滚轮滚动单步调整的大小
    // linearLastPoint: false,    // 绘制当前价的闪烁点
    valueRangeBoundary: {
      show: false, //显示当前范围的价格边界
      dash: [10, 10],
      lineWidth: 1,
      highColor: '#FF4040',    // 最高价颜色
      lowColor: '#1EB955',    // 最低价颜色
    },
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
    crosshair: {
      snapToData: false,    // 十字线是否被当前close价吸引
      color: '#979797',    // 十字线颜色
      dash: [5,5],
      lineWidth: 1,
      axisLabel: {
        xAxisLabelPos: 'bottom',
        yAxisLabelPos: 'right',
        fontSize: 12,
        height: 20,    // 十字线标签高度
        bg: '#d8d8d8',    // 十字线标签背景色
        color: '#666',    // 十字线标签字体色
        horizPadding: 5,    // 十字线标签水平空白间距
        posOffset: {    // 十字线标签偏移
          yAxisLabel: {x: 0, y: 0}, // 0 means auto
          xAxisLabel: {x: 0, y: 0}
        },
      },
      selectedPoint: {
        radius: [8, 5, 4], // 选中点的半径
        color: ['rgba(38,165,225,0.2)', '#fff', 'rgba(38,165,225,1)']    // 选中点的颜色
      }
    },
    grid: {
      bg: '#fff',    // 网格线的颜色
      limit: {
        y: {
          max: 8,
          min: 2
        }
      },    // 网格线间隔调整限制
      lineColor: {x: '#f0f0f0', y: '#f0f0f0'},    // 网格线的颜色
      span: {x: 120, y: 30} //
    },
    axis: {
      showBorder: false, // 显示图表border
      borderColor: '#000',
      bgColor: 'rgba(0,0,0,0)',    // 坐标轴背景色
      // showRate: false,    // 显示百分比
      label: {
        top: {
          show: false,
          color: '#555',
          fontSize: 12,
          offset: {x: 0, y: 10},
          textAlign: 'center', // label text align,  Possible values: refrence to CanvasRenderingContext2D.textAlign
          textBaseline: 'top', // label text baseline,  Possible values: refrence to CanvasRenderingContext2D.textBaseline
        },
        right:{
          show: true,
          color: '#555',
          fontSize: 12,
          offset: {x: 10, y: 0},
          textAlign: 'left',
          textBaseline: 'middle',
        },
        bottom:{
          show: true,
          color: '#555',
          fontSize: 12,
          offset: {x: 0, y: 10},
          textAlign: 'center',
          textBaseline: 'top',
        },
        left: {
          show: false,
          color: '#555',
          fontSize: 12,
          offset: {x: 10, y: 0},
          textAlign: 'left',
          textBaseline: 'middle',
        }
      }
    },
    seriesStyle: {    // 关于数据的样式
      baseValueLine: {
        dash: [5, 5],
        lineWidth: 1,
        color: '#2DB0F9'
      },
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
      line: {    // 线
        lineWidth: 1,    // 价格线的粗细
        lineColor: '#2DB0F9',    // 价格线的颜色
      },
      column: {
        block: {up: '#FF4040', down: '#1EB955'},    // 蜡烛块的颜色
        border: {up: '#FF4040', down: '#1EB955'},
      }
    }
  }
}

export default DEFAULTS

