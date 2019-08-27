import merge from 'lodash/merge';
import Hammer from 'hammerjs';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var DEFAULTS = function DEFAULTS() {
  return {
    type: 'unscalable',
    viewport: {
      offset: 0,
      barWidth: 10
    },
    // 图表显示的视野, width表示单个数据元素占用宽度
    valuePrecision: 4,
    // 设定的数据精度,
    dateFormat: 'MM/DD HH:mm',
    dateFontSize: 12,
    font: {
      family: 'Microsoft YaHei',
      size: 14
    },
    padding: {
      top: 20,
      right: 70,
      bottom: 28,
      left: 20
    },
    // 设定4周数据轴区域的大小
    zoomSpeed: 5,
    // 设定鼠标滚轮滚动单步调整的大小
    linearLastPoint: false,
    // 绘制当前价的闪烁点
    // showHighLowLine: true,
    valueRangeBoundary: {
      show: true,
      //显示当前范围的价格边界
      dash: [10, 10]
    },
    tip: {
      highColor: '#FF4040',
      // 最高价颜色
      lowColor: '#1EB955',
      // 最低价颜色
      currPrice: {
        lineWidth: 1,
        // 当前价位线的粗细
        lineColor: 'rgba(0,0,0,0)',
        // 当前价位线的颜色
        labelBg: 'rgba(0,0,0,0)',
        // 当前价位的标签的背景色
        labelColor: 'rgba(0,0,0,0)',
        // 当前价位的标签的字体颜色
        labelHeight: 20 // 当前价位标签的高度

      }
    },
    crosshair: {
      snapToData: false,
      // 十字线是否被当前close价吸引
      color: '#979797',
      // 十字线颜色
      dash: [],
      lineWidth: 1,
      labelHeight: 20,
      // 十字线标签高度
      labelBg: 'rgba(0,0,0,0)',
      // 十字线标签背景色
      labelColor: 'rgba(0,0,0,0)',
      // 十字线标签字体色
      labelHorizPadding: 5,
      // 十字线标签空白间距
      posOffset: {
        // 十字线标签偏移
        vertical: {
          x: 0,
          y: 0,
          width: 0
        },
        // 0 means auto
        horizontal: {
          x: 0,
          y: 0,
          width: 0
        }
      },
      selectedPointRadius: [8, 5, 4],
      selectedPointColor: ['rgba(38,165,225,0.2)', '#fff', 'rgba(38,165,225,1)'] // 选中点的颜色

    },
    grid: {
      bg: '#fff',
      // 网格线的颜色
      limit: {
        y: {
          max: 8,
          min: 2
        }
      },
      // 网格线间隔调整限制
      color: {
        x: '#f0f0f0',
        y: '#f0f0f0'
      },
      // 网格线的颜色
      span: {
        x: 120,
        y: 30 //

      }
    },
    axis: {
      xAxisPos: 'bottom',
      // position of xAxis label, Possible values: 'bottom' or 'top'
      yAxisPos: 'right',
      // position of yAxis label, Possible values: 'right' or 'left'
      hideBorder: false,
      // 显示图表border
      showRate: false,
      // 显示百分比
      label: {
        xAxis: {
          offset: {
            x: 0,
            y: 0
          },
          textAlign: 'center',
          // label text align,  Possible values: refrence to CanvasRenderingContext2D.textAlign
          textBaseline: 'top' // label text baseline,  Possible values: refrence to CanvasRenderingContext2D.textBaseline

        },
        yAxis: {
          offset: {
            x: 0,
            y: 0
          },
          textAlign: 'left',
          // label text align,  Possible values: refrence to CanvasRenderingContext2D.textAlign
          textBaseline: 'middle' // label text baseline,  Possible values: refrence to CanvasRenderingContext2D.textBaseline

        }
      },
      labelColor: '#555',
      // 设定坐标轴标签的颜色
      labelFontSize: 16,
      bgColor: 'rgba(0,0,0,0)',
      // 坐标轴背景色
      lineColor: 'rgba(0,0,0,1)',
      // 坐标轴线颜色
      showScale: false,
      //是否显示刻度
      scaleLength: 10,
      // 刻度长度
      showBorder: false // 是否绘制线框

    },
    seriesStyle: {
      // 关于数据的样式
      baseValue: '#2DB0F9',
      // 分时图昨收的颜色
      candlestick: {
        // K线图的颜色
        block: {
          up: '#FF4040',
          down: '#1EB955'
        },
        // 蜡烛块的颜色
        border: {
          up: '#FF4040',
          down: '#1EB955'
        },
        // 蜡烛边框颜色
        wick: {
          up: '#FF4040',
          down: '#1EB955' // 蜡烛烛心颜色

        }
      },
      OHLC: {
        // 美国线的颜色
        up: '#FF4040',
        down: '#1EB955'
      },
      mountain: {
        // 山形线的颜色
        lineWidth: 1,
        // 价格线的粗细
        lineColor: '#2DB0F9',
        // 价格线的颜色
        gradientUp: 'rgba(45,176,249,0.15)',
        // 山形内部渐变色
        gradientDown: 'rgba(19,119,240,0.02)'
      },
      column: {
        block: {
          up: '#FF4040',
          down: '#1EB955'
        },
        // 蜡烛块的颜色
        border: {
          up: '#FF4040',
          down: '#1EB955'
        }
      }
    }
  };
};

var Utils = {
  Safe: {
    dataCheck: function dataCheck(dataSource) {
      var data = dataSource.data;
      var series = dataSource.series;
      var maxIndex = 0;
      series.forEach(function (line) {
        for (var key in line) {
          if ((key.length === 1 || key.indexOf('index') > -1) && typeof line[key] === 'number') {
            if (line[key] > maxIndex) maxIndex = line[key];
          }
        }
      });

      if (dataSource.timeRanges) {
        for (var l = dataSource.timeRanges.length; l--;) {
          if (isNaN(dataSource.timeRanges[l][0]) || isNaN(dataSource.timeRanges[l][1])) {
            throw 'Time ranges contains NaN';
          }
        }
      }

      if (data.length === 0) throw 'Chart input data is empty';
      if (data[0].length <= maxIndex) throw 'Chart input data is length(' + data[0].length + ') is less than required data index(' + maxIndex + ')';
    }
  },
  Animation: {
    linear: function linear(dataSet1, dataSet2, valIndexes) {
      var diff = dataSet1.map(function (d1, index) {
        var data2 = dataSet2[index];
        var result = d1.slice();
        valIndexes.forEach(function (valIndex) {
          var diff = data2[valIndex] - result[valIndex];
          result[valIndex] = diff / 60;
        });
        return result;
      });
      return function () {
        dataSet1.forEach(function (d1, index) {
          valIndexes.forEach(function (valIndex) {
            d1[valIndex] += diff[index][valIndex];
          });
        });
      };
    }
  },
  Chart: {
    linkCharts: function linkCharts(charts) {
      charts.forEach(function (chart) {
        charts.forEach(function (otherChart) {
          if (chart !== otherChart) chart.linkedCharts.insert(otherChart);
        });
      });
    }
  },
  DataTypes: {
    Set: function () {
      var set = function set(d) {
        this.d = d || [];
      };

      set.prototype.insert = function (item) {
        if (this.d.indexOf(item) < 0) this.d.push(item);
      };

      set.prototype.remove = function (item) {
        var index = this.d.indexOf(item);
        if (index > -1) this.d.splice(index, 1);
      };

      set.prototype.length = function () {
        return this.d.length;
      };

      set.prototype.forEach = function (func) {
        this.d.forEach(func);
      };

      return function (lst) {
        return new set(lst);
      };
    }()
  },
  Math: {
    sum: function sum(lst) {
      var sum = 0;
      lst.forEach(function (item) {
        sum += item;
      });
      return sum;
    },
    // get Standard Deviation
    getSD: function getSD(data, avg) {
      if (avg === undefined) {
        avg = Utils.Math.sum(data) / data.length;
      }

      return Math.sqrt(Utils.Math.sum(data.map(function (item) {
        return Math.pow(item - avg, 2);
      })) / data.length);
    },
    iterOffsetN: function iterOffsetN(data, index, n, callback) {
      if (!n) {
        return;
      }

      var target = index + (Math.abs(n) - 1) * (n > 0 ? 1 : -1);
      if (target < 0) target = 0;else if (target > data.length - 1) target = data.length - 1;

      while (index !== target) {
        callback(data[index]);
        index += n > 0 ? 1 : -1;
      }

      callback(data[index]);
    },
    leftPad: function leftPad(n, width) {
      var zeros = [];

      while (width--) {
        zeros.push(0);
      }

      return zeros.join('').slice(0, zeros.length - n.toString().length) + n;
    },
    rightPad: function rightPad(n, width) {
      var nStr = n.toString().replace('-', '');
      var nStrArr = nStr.split('.');
      var precision = width - nStrArr[0].length - 1;
      return n.toFixed(precision >= 0 ? precision : 0);
    },
    distance: function distance(point1, point2) {
      return Math.sqrt(Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2));
    }
  },
  Draw: {
    Basic: function Basic(ctx, func) {
      ctx.save();
      ctx.beginPath();
      func(ctx);
    },
    Fill: function Fill(ctx, func, style) {
      Utils.Draw.Basic(ctx, func);
      ctx.fillStyle = style || 'black';
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    },
    Stroke: function Stroke(ctx, func, style) {
      Utils.Draw.Basic(ctx, func);
      ctx.strokeStyle = style || 'black';
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    },
    FillnStroke: function FillnStroke(ctx, func, fillStyle, strokeStyle) {
      Utils.Draw.Basic(ctx, func);
      ctx.fillStyle = fillStyle || 'black';
      ctx.strokeStyle = strokeStyle || 'black';
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    },
    Text: function Text(ctx, func, fillStyle, fontStyle, textBaseline) {
      ctx.save();
      if (fontStyle) ctx.font = fontStyle;
      if (textBaseline) ctx.textBaseline = textBaseline;
      ctx.fillStyle = fillStyle || 'black';
      func(ctx);
      ctx.restore();
    }
  },
  Coord: {
    getDistance: function getDistance(p1, p2) {
      var xDiff = p1.clientX - p2.clientX;
      var yDiff = p1.clientY - p2.clientY;
      return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    },
    getDateStr: function getDateStr(date, noDate, noTime) {
      if (typeof date === 'number') date = new Date(date);
      var dateStr = Utils.Math.leftPad(date.getMonth() + 1, 2) + '/' + Utils.Math.leftPad(date.getDate(), 2);
      var timeStr = Utils.Math.leftPad(date.getHours(), 2) + ':' + Utils.Math.leftPad(date.getMinutes(), 2);
      var result = (noDate ? '' : dateStr) + ' ' + (noTime ? '' : timeStr);
      return result.trim();
    },

    /**
     *
     * @param {* dataSource for chart} data
     * @param {* timeRange to split chart} ranges
     * @param {* timeIndex in dataSource} tIndex
     */
    datafilterByTimeRanges: function datafilterByTimeRanges(data, ranges, tIndex) {
      var buckets = ranges.map(function () {
        return [];
      });
      var bucketIndex = 0;

      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var time = item[tIndex];

        if (time >= ranges[bucketIndex][0] && time <= ranges[bucketIndex][1]) {
          buckets[bucketIndex].push(item);
        } else {
          if (ranges[bucketIndex + 1] && time >= ranges[bucketIndex + 1][0]) {
            bucketIndex += 1;
            i--;
          }
        }
      }

      return buckets;
    },
    dataFilterByViewport: function dataFilterByViewport(data, viewport, style) {
      var displayWidth = viewport.right - viewport.left;
      var result = [];
      var pointerX = viewport.offset;
      var leftOffset = Number.MAX_VALUE;
      var rightOffset = Number.MIN_VALUE;

      for (var l = data.length; l--;) {
        data[l].x = null;

        if (pointerX >= -30 && pointerX <= displayWidth + 30) {
          data[l].x = displayWidth - pointerX + viewport.left;
          result.unshift(data[l]);
          if (l > rightOffset) rightOffset = l;
          if (l < leftOffset) leftOffset = l;
        }

        pointerX += viewport.barWidth;
      }

      return {
        data: result,
        leftOffset: leftOffset,
        rightOffset: rightOffset,
        viewport: viewport
      };
    },
    linearPixels2Actual: function linearPixels2Actual(length, coord) {
      return length * Math.abs(coord.actual[1] - coord.actual[0]) / Math.abs(coord.display[1] - coord.display[0]);
    },
    linearActual2Display: function linearActual2Display(val, coord) {
      return (val - coord.actual[0]) * (coord.display[1] - coord.display[0]) / (coord.actual[1] - coord.actual[0]) + coord.display[0];
    },
    linearDisplay2Actual: function linearDisplay2Actual(pos, coord) {
      return (pos - coord.display[0]) * (coord.actual[1] - coord.actual[0]) / (coord.display[1] - coord.display[0]) + coord.actual[0];
    },
    seekNeatPoints: function seekNeatPoints(range, count) {
      var diff = range[1] - range[0];
      if (!diff) diff = 0.001;
      var precision = 1;

      if (diff > 1) {
        while (diff / precision > 10) {
          precision *= 10;
        }

        precision /= 10;
      } else {
        while (diff / precision < 10) {
          precision /= 10;
        }
      }

      var multiples = [1, 2, 5, 10, 20, 50];
      var points = [];
      multiples.forEach(function (multiple) {
        var interval = multiple * precision;
        if (!interval) return;
        var newRange = [];
        var x = 0;

        if (range[1] < 0) {
          while (x >= range[0]) {
            if (x <= range[1]) newRange.push(x);
            x -= interval;
          }
        } else if (range[0] > 0) {
          while (x <= range[1]) {
            if (x >= range[0]) newRange.push(x);
            x += interval;
          }
        } else {
          x -= interval;

          while (x >= range[0]) {
            newRange.push(x);
            x -= interval;
          }

          x = 0;

          while (x <= range[1]) {
            newRange.push(x);
            x += interval;
          }
        }

        points.push([newRange[0] - interval].concat(newRange, [newRange[newRange.length - 1] + interval]));
      });
      if (!points.length) return [];
      if (points[points.length - 1].length === 5) points.push([points[points.length - 1][0], points[points.length - 1][2], points[points.length - 1][4]]);

      for (var i = 0; i < points.length; i++) {
        if (points[i].length <= count + 1 + 1) {
          return points[i];
        }
      }

      return points[points.length - 1];
    },
    seekNeatPointsOld: function seekNeatPointsOld(range, count) {
      var diff = range[1] - range[0];
      if (!diff) diff = 0.001;
      var precision = 1;

      if (diff > 1) {
        while (diff / precision > 10) {
          precision *= 10;
        }

        precision /= 10;
      } else {
        while (diff / precision < 10) {
          precision /= 10;
        }
      }

      var multiples = [1, 2, 5, 10, 20, 50];
      var points = [];
      multiples.forEach(function (multiple) {
        var interval = multiple * precision;
        if (!interval) return;
        var newRange = [];
        var x = 0;

        if (range[1] < 0) {
          while (x >= range[0]) {
            if (x <= range[1]) newRange.push(x);
            x -= interval;
          }
        } else if (range[0] > 0) {
          while (x <= range[1]) {
            if (x >= range[0]) newRange.push(x);
            x += interval;
          }
        } else {
          x -= interval;

          while (x >= range[0]) {
            newRange.push(x);
            x -= interval;
          }

          x = 0;

          while (x <= range[1]) {
            newRange.push(x);
            x += interval;
          }
        }

        points.push(newRange);
      });
      if (!points.length) return [];
      if (points[points.length - 1].length === 3) points.push([points[points.length - 1][1]]);

      for (var i = 0; i < points.length - 1; i++) {
        if (points[i].length === count) {
          return points[i];
        } else if (points[i + 1].length < count) {
          return points[i + 1];
        }
      }

      return points[points.length - 1];
    },
    halfcandleWidth: function halfcandleWidth(columnWidth) {
      var half = ~~((columnWidth - 3) / 2);
      var sixtyPercent = ~~(columnWidth * 0.3);
      half = Math.min(sixtyPercent, half);
      if (half < 1) half = 1;
      return half;
    },
    calcYRange: function calcYRange(data, series) {
      var yMax = Number.MIN_VALUE;
      var yMin = Number.MAX_VALUE;
      data.forEach(function (d) {
        series.forEach(function (s) {
          var h = d[s.type === 'candlestick' || s.type === 'OHLC' ? s.h : s.valIndex];
          var l = d[s.type === 'candlestick' || s.type === 'OHLC' ? s.l : s.valIndex];
          if (h > yMax) yMax = h;
          if (l < yMin) yMin = l;
        });
      });
      return [yMin, yMax];
    },

    /**
     *
     * @param {* max & min value of visible data} yRange
     * @param {* if the max/min data nestle to to/bottom of chart} touchTop
     * @param {* style config for chart} style
     * @param {* baseValue for symmetry chart} baseValue
     */
    adjustYRange: function adjustYRange(yRange, touchTop, style, viewport, baseValue) {
      // calc the vertical padding of grid
      var _yRange = _slicedToArray(yRange, 2),
          yMin = _yRange[0],
          yMax = _yRange[1];

      if (!touchTop) {
        var verticalPadding = Utils.Coord.linearPixels2Actual(style.grid.span.y, {
          display: [viewport.bottom, viewport.top],
          actual: [yMin, yMax]
        });
        yMin -= verticalPadding;
        yMax += verticalPadding;
      }

      var yActual = [yMin, yMax]; // enlarge the actual range of vertical coord when base value line is specified

      if (baseValue !== undefined) {
        var span = Math.max(Math.abs(baseValue - yMax), Math.abs(baseValue - yMin));
        yActual = [baseValue - span, baseValue + span];
      }

      if (yActual[0] === yActual[1]) {
        var offset = yActual[0] / 100;
        yActual[0] -= offset || 1 / Math.pow(10, style.valuePrecision);
        yActual[1] += offset || 0.001; // maybe better generate by precision
      }

      return yActual;
    }
  },
  Grid: {
    lineCount: function lineCount(display, limit, span) {
      var count = ~~(Math.abs(display[0] - display[1]) / span);
      return count > limit.max ? limit.max : count < limit.min ? limit.min : count;
    },
    calcGridLines: function calcGridLines(actual, lineCount, baseValue) {
      var lines = [];

      if (baseValue === undefined) {
        // no base value line specified
        lines = Utils.Coord.seekNeatPoints(actual, lineCount);
      } else {
        // with base value line
        var hm = Utils.Coord.seekNeatPoints([actual[0], baseValue], lineCount / 2 - 1);
        lines = [].concat(_toConsumableArray(hm.slice(0, -1)), _toConsumableArray(hm.reverse().map(function (h) {
          return 2 * baseValue - h;
        })));
      }

      return lines;
    }
  }
};

function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function later() {
    previous = options.leading === false ? 0 : +new Date();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function throttled() {
    var now = +new Date();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }

    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}

var Draw = {
  Basic: function Basic(ctx, func) {
    ctx.save();
    ctx.beginPath();
    func(ctx);
  },
  Fill: function Fill(ctx, func, style) {
    Draw.Basic(ctx, func);
    ctx.fillStyle = style || 'black';
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  },
  Stroke: function Stroke(ctx, func, style) {
    Draw.Basic(ctx, func);
    ctx.strokeStyle = style || 'black';
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  },
  FillnStroke: function FillnStroke(ctx, func, fillStyle, strokeStyle) {
    Draw.Basic(ctx, func);
    ctx.fillStyle = fillStyle || 'black';
    ctx.strokeStyle = strokeStyle || 'black';
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  },
  Text: function Text(ctx, func, fillStyle, fontStyle) {
    ctx.save();

    if (fontStyle) {
      ctx.font = fontStyle;
    }

    ctx.fillStyle = fillStyle || 'black';
    func(ctx);
    ctx.restore();
  }
};

function linePainter (ctx, data, coord, seriesConf, decorators) {
  var points = [];
  data.forEach(function (item) {
    points.push({
      x: item.x,
      y: Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coord.y)
    });
  });
  Draw.Stroke(ctx, function (ctx) {
    ctx.lineWidth = seriesConf.lineWidth || 1;
    points.forEach(function (point, index) {
      if (!index) ctx.moveTo(point.x, point.y);
      ctx.lineTo(point.x, point.y);
    });
  }, seriesConf.color);

  if (decorators && decorators.length) {
    decorators.forEach(function (d) {
      if (typeof d === 'function') {
        d(points, seriesConf);
      }
    });
  }
}

var calcOHLC = function calcOHLC(data, coord, seriesConf) {
  var res = {
    up: [],
    down: []
  };
  data.forEach(function (item, index) {
    var o = ~~Utils.Coord.linearActual2Display(item[seriesConf.o], coord.y);
    var c = ~~Utils.Coord.linearActual2Display(item[seriesConf.c], coord.y);
    var h = ~~Utils.Coord.linearActual2Display(item[seriesConf.h], coord.y);
    var l = ~~Utils.Coord.linearActual2Display(item[seriesConf.l], coord.y);
    var direction = c === o && index > 0 ? data[index - 1][seriesConf.c] < item[seriesConf.c] ? 'up' : 'down' : c < o ? 'up' : 'down';
    res[direction].push({
      x: ~~item.x,
      low: l,
      high: h,
      close: c,
      open: o
    });
  });
  return res;
};

function drawWicks(ctx, candles, wickColor) {
  for (var direction in candles) {
    Draw.Stroke(ctx, function (ctx) {
      candles[direction].forEach(function (line) {
        ctx.moveTo(line.x + 0.5, line.low + 0.5);
        ctx.lineTo(line.x + 0.5, line.high + 0.5);
      });
    }, wickColor[direction]);
  }
}

function drawCandle(ctx, candles, columnWidth, blockColor, borderColor) {
  var half = Utils.Coord.halfcandleWidth(columnWidth);

  var _loop = function _loop(direction) {
    Draw.FillnStroke(ctx, function (ctx) {
      candles[direction].forEach(function (candle) {
        ctx.rect(~~(candle.x - half) + 0.5, ~~Math.min(candle.open, candle.close) + 0.5, half * 2, ~~Math.abs(candle.open - candle.close)); // + 0.02 is for IE fix
      });
    }, blockColor[direction], borderColor[direction]);
  };

  for (var direction in candles) {
    _loop(direction);
  }
}

function candlestickPainter (ctx, data, coord, seriesConf) {
  var candles = calcOHLC(data, coord, seriesConf);
  drawWicks(ctx, candles, seriesConf.style.candlestick.wick);
  drawCandle(ctx, candles, coord.viewport.barWidth, seriesConf.style.candlestick.block, seriesConf.style.candlestick.border);
}

function drawOHLC(ctx, OHLC, columnWidth, ohlcColor) {
  var half = Utils.Coord.halfcandleWidth(columnWidth);
  var lineWidth = ~~(columnWidth / 10);
  if (lineWidth > 1) lineWidth += ctx.lineWidth % 2 ? 0 : 1;

  var _loop = function _loop(direction) {
    Draw.Stroke(ctx, function (ctx) {
      ctx.lineWidth = lineWidth;
      OHLC[direction].forEach(function (ohlc) {
        ctx.moveTo(ohlc.x + 0.5, ohlc.low);
        ctx.lineTo(ohlc.x + 0.5, ohlc.high);
        ctx.moveTo(~~(ohlc.x - half) + 0.5, ohlc.open);
        ctx.lineTo(ohlc.x, ohlc.open);
        ctx.moveTo(~~(ohlc.x + half) + 0.5, ohlc.close);
        ctx.lineTo(ohlc.x, ohlc.close); // ctx.rect(~~(ochl.x - half) + 0.5 , ~~Math.min(candle.open, candle.close) + 0.5, half * 2 ,~~Math.abs(candle.open - candle.close)) // + 0.02 is for IE fix
      });
    }, ohlcColor[direction]);
  };

  for (var direction in OHLC) {
    _loop(direction);
  }
}

function ohlcPainter (ctx, data, coord, seriesConf) {
  var OHLC = calcOHLC(data, coord, seriesConf);
  console.log('OHLC', coord);
  drawOHLC(ctx, OHLC, coord.viewport.barWidth, seriesConf.style.OHLC);
}

function columnPainter (ctx, data, coord, seriesConf, viewport) {
  var columns = {
    up: [],
    down: [],
    eq: []
  };
  data.forEach(function (item, index) {
    var val = item[seriesConf.valIndex];
    var baseVal = seriesConf.baseVal !== undefined ? seriesConf.baseVal : seriesConf.baseIndex !== undefined ? item[seriesConf.baseIndex] : null;
    if (baseVal !== null) columns[val >= baseVal ? 'up' : 'down'].push(item);
    if (seriesConf.detect) columns[seriesConf.detect(item, index, data)].push(item);
  }); // a股K线下面的图换成矩形画法

  var coordY = seriesConf.linearMode ? {
    actual: [0, coord.y.actual[1]],
    display: coord.y.display
  } : coord.y;
  var half = Utils.Coord.halfcandleWidth(coord.viewport.barWidth);

  for (var direction in columns) {
    Draw.FillnStroke(ctx, function (ctx) {
      columns[direction].forEach(function (item) {
        if (seriesConf.mode === 'bidirection') {
          ctx.rect(~~(item.x - half) + 0.5, ~~Utils.Coord.linearActual2Display(seriesConf.baseVal, coordY) + 0.5, half * 2, ~~(Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coordY) - Utils.Coord.linearActual2Display(seriesConf.baseVal, coordY)) + 0.02); // + 0.02 is for IE fix
        } else {
          ctx.rect(~~(item.x - half) + 0.5, ~~coordY.display[0] + 0.5, half * 2, ~~(Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coordY) - ~~coordY.display[0]) + 0.02);
        }
      });
    }, seriesConf.style.column.block[direction], seriesConf.style.column.border[direction]);
  }
}

function panesColumnPainter (ctx, panes, coord, seriesConf, bottom) {
  var columns = {
    up: [],
    down: [],
    eq: []
  };
  panes.forEach(function (pane, paneIndex) {
    pane.paneData.forEach(function (item, bIndex) {
      var val = item[seriesConf.valIndex];
      if (!bIndex) item.isFirst = true;
      if (bIndex === pane.paneData.length - 1 && paneIndex !== panes.length - 1) item.isLast = true; // make some changes to base define

      var baseVal = seriesConf.baseVal !== undefined ? seriesConf.baseVal : seriesConf.baseIndex !== undefined ? item[seriesConf.baseIndex] : null;
      if (baseVal !== null) columns[val >= baseVal ? 'up' : 'down'].push(item);
      if (seriesConf.color.detect) columns[seriesConf.color.detect(item, bIndex, pane.paneData, paneIndex, panes)].push(item);
    });
  });

  var _loop = function _loop(direction) {
    Draw.FillnStroke(ctx, function (ctx) {
      columns[direction].forEach(function (item) {
        var half = seriesConf.lineWidth / 2 || 1;

        if (item.x + half > coord.x.display[1]) {
          item.isLast = true;
        }

        if (item.isFirst || item.isLast) {
          half = half / 2;
        }

        var posX = item.isFirst ? item.x : item.isLast ? item.x - half * 2 : item.x - half;
        var baseVal = seriesConf.baseVal !== undefined ? seriesConf.baseVal : seriesConf.baseIndex !== undefined ? item[seriesConf.baseIndex] : null;

        if (seriesConf.mode === 'bidirection') {
          ctx.rect(~~posX + 0.5, ~~Utils.Coord.linearActual2Display(baseVal, coord.y) + 0.5, half * 2, ~~Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coord.y) - ~~Utils.Coord.linearActual2Display(baseVal, coord.y) + 0.02);
        } else {
          ctx.rect(~~posX + 0.5, ~~seriesConf.bottom ? seriesConf.bottom + 0.5 : 0.5, half * 2, ~~Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coord.y) - ~~Utils.Coord.linearActual2Display(baseVal, coord.y) + 0.02);
        }
      });
    }, seriesConf.color[direction], seriesConf.color[direction]);
  };

  for (var direction in columns) {
    _loop(direction);
  }
}

function mountainPainter (ctx, data, coord, seriesConf) {
  var decorators = [];
  decorators.push(function gradientDecorator(points, seriesConf) {
    // draw gradient
    var gradient = ctx.createLinearGradient(0, 0, 0, coord.y.display[0] - coord.y.display[1]);
    gradient.addColorStop(0, seriesConf.style.mountain.gradientUp);
    gradient.addColorStop(1, seriesConf.style.mountain.gradientDown);
    Draw.Fill(ctx, function (ctx) {
      ctx.moveTo(points[0].x, coord.y.display[0]);
      points.forEach(function (point, index) {
        ctx.lineTo(point.x, point.y);
      });
      ctx.lineTo(points[points.length - 1].x, coord.y.display[0]);
      ctx.closePath();
    }, gradient);
  });
  return linePainter(ctx, data, coord, seriesConf, decorators);
}

var chartPainter = {
  line: linePainter,
  candlestick: candlestickPainter,
  OHLC: ohlcPainter,
  column: columnPainter,
  panesColumn: panesColumnPainter,
  mountain: mountainPainter
};

function dateFormatter(date) {
  var pattern = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'YYYY-MM-DD HH:mm:ss';

  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  var formatObj = {
    YYYY: date.getFullYear(),
    MM: date.getMonth() + 1,
    DD: date.getDate(),
    HH: date.getHours(),
    mm: date.getMinutes(),
    ss: date.getSeconds()
  };
  var patternType = Object.prototype.toString.call(pattern);

  if (patternType === '[object Function]') {
    return pattern(date);
  } else if (patternType === '[object String]') {
    return pattern.replace(/(YYYY|MM|DD|HH|mm|ss)+/g, function (match, p1) {
      var value = formatObj[p1];
      if (match.length > 0 && value < 10) value = "0".concat(value);
      return value;
    });
  } else {
    return 'YYYY-MM-DD HH:mm:ss'.replace(/(YYYY|MM|DD|HH|mm|ss)+/g, function (match, p1) {
      var value = formatObj[p1];
      if (match.length > 0 && value < 10) value = "0".concat(value);
      return value;
    });
  }
}

var Render =
/*#__PURE__*/
function () {
  function Render(chart) {
    _classCallCheck(this, Render);

    this._chart = chart;
  }

  _createClass(Render, [{
    key: "rend",
    value: function rend() {
      this.drawGrid();
      this.drawSeries();
      this.drawAxis();
      this.drawAdditionalTips();
    }
  }, {
    key: "drawGrid",
    value: function drawGrid() {
      var _this$_chart = this._chart,
          style = _this$_chart.style,
          ctx = _this$_chart.ctx,
          dataProvider = _this$_chart.dataProvider,
          viewport = _this$_chart.viewport;
      var coord = dataProvider.coord; // draw horizontal lines
      // debugger

      var hLines = style.axis.hideBorder ? coord.horizLines.slice(1, -1) : coord.horizLines;
      console.log(hLines);

      if (coord.horizLines) {
        Draw.Stroke(ctx, function (ctx) {
          hLines.forEach(function (y, index) {
            ctx.moveTo(style.padding.left, y.display);
            ctx.lineTo(viewport.right, y.display);
          });
        }, style.grid.color.x);
      }

      var vLines = style.axis.hideBorder ? coord.verticalLines.slice(1, -1) : coord.verticalLines; // draw vertical lines

      if (coord.verticalLines) {
        Draw.Stroke(ctx, function (ctx) {
          vLines.forEach(function (val, ind) {
            ctx.moveTo(val.display, style.padding.top);
            ctx.lineTo(val.display, viewport.bottom);
          });
        }, style.grid.color.y);
      }
    }
  }, {
    key: "drawSeries",
    value: function drawSeries() {
      var _this$_chart2 = this._chart,
          type = _this$_chart2.type,
          ctx = _this$_chart2.ctx,
          dataProvider = _this$_chart2.dataProvider,
          viewport = _this$_chart2.viewport,
          dataSource = _this$_chart2.dataSource,
          seriesInfo = _this$_chart2.seriesInfo;
      var series = seriesInfo.series,
          valueIndex = seriesInfo.valueIndex;
      var coord = dataProvider.coord,
          filteredData = dataProvider.filteredData,
          panes = dataProvider.panes;
      series.map(function (s) {
        if (s.type === 'line' || s.type === 'mountain' || s.type === 'candlestick' || s.type === 'OHLC') {
          chartPainter[s.type](ctx, filteredData.data, coord, s, viewport);
        }

        if (s.type === 'column') {
          if (type === 'unscalable') {
            chartPainter.panesColumn(ctx, panes, coord, s, viewport);
          }

          if (type === 'scalable') {
            chartPainter.column(ctx, filteredData.data, coord, s, viewport);
          }
        }
      });
    }
  }, {
    key: "drawAxis",
    value: function drawAxis() {
      var _this$_chart3 = this._chart,
          type = _this$_chart3.type,
          ctx = _this$_chart3.ctx,
          style = _this$_chart3.style,
          dataProvider = _this$_chart3.dataProvider,
          dataSource = _this$_chart3.dataSource,
          seriesInfo = _this$_chart3.seriesInfo,
          originHeight = _this$_chart3.originHeight,
          originWidth = _this$_chart3.originWidth,
          viewport = _this$_chart3.viewport;
      var coord = dataProvider.coord;
      this.axisClean();
      var yAxis = {};
      var xAxis = {}; // flag用来标识刻度的朝向

      yAxis.flag = style.axis.yAxisPos === 'right' ? 1 : -1;
      xAxis.flag = style.axis.xAxisPos === 'bottom' ? 1 : -1; // start position of the aXis

      yAxis.xStart = ~yAxis.flag ? viewport.right : 0;
      xAxis.yStart = ~xAxis.flag ? viewport.bottom : style.padding.top;
      yAxis.scaleStart = ~yAxis.flag ? viewport.right : style.padding.left; // draw axis lines

      Draw.Stroke(ctx, function (ctx) {
        if (style.axis.showScale) {
          coord.horizLines.forEach(function (hl) {
            ctx.moveTo(yAxis.scaleStart, hl.display);
            ctx.lineTo(yAxis.scaleStart + style.axis.scaleLength * yAxis.flag, hl.display);
          });
          coord.verticalLines.forEach(function (vl) {
            ctx.moveTo(vl.display, xAxis.yStart);
            ctx.lineTo(vl.display, xAxis.yStart + style.axis.scaleLength * xAxis.flag);
          });
          ctx.moveTo(yAxis.scaleStart + 0.5, style.padding.top);
          ctx.lineTo(yAxis.scaleStart + 0.5, viewport.bottom);
          ctx.moveTo(style.padding.left, xAxis.yStart + 0.5);
          ctx.lineTo(viewport.right, xAxis.yStart + 0.5);
        } // draw axis line


        if (style.axis.showBorder) {
          ctx.moveTo(yAxis.scaleStart + 0.5, style.padding.top);
          ctx.lineTo(yAxis.scaleStart + 0.5, viewport.bottom);
          ctx.moveTo(style.padding.left, xAxis.yStart + 0.5);
          ctx.lineTo(viewport.right, xAxis.yStart + 0.5);
          var xOp = ~yAxis.flag ? style.padding.left : viewport.right;
          ctx.moveTo(xOp + 0.5, style.padding.top + 0.5);
          ctx.lineTo(xOp + 0.5, viewport.bottom + 0.5);
          var yOp = ~xAxis.flag ? style.padding.top : viewport.bottom;
          ctx.moveTo(style.padding.left, yOp + 0.5);
          ctx.lineTo(viewport.right, yOp + 0.5);
        }

        if (style.axis.showRate) {
          var rateX = yAxis.flag > 0 ? style.padding.left : viewport.right;
          ctx.moveTo(rateX + 0.5, style.padding.top);
          ctx.lineTo(rateX + 0.5, viewport.bottom);
          coord.horizLines.forEach(function (y) {
            ctx.moveTo(rateX, y.display);
            ctx.lineTo(rateX + style.axis.scaleLength * -yAxis.flag, y.display);
          });
        }
      }, style.axis.lineColor); // draw labels

      var rates = {
        up: [],
        down: []
      };
      Draw.Text(ctx, function (ctx) {
        // y-axis label
        coord.horizLines.forEach(function (y, index) {
          var val = y.actual.toFixed(style.valuePrecision);
          var xOffset = style.axis.label.yAxis.offset.x;
          var yPos = y.display + style.axis.label.yAxis.offset.y;
          if (yPos < 10) yPos += 10;
          if (yPos > originHeight - 10) yPos -= 10;
          ctx.font = style.axis.labelFontSize + 'px ' + style.font.family;
          ctx.textAlign = style.axis.label.yAxis.textAlign;
          ctx.textBaseline = style.axis.label.yAxis.textBaseline;
          ctx.fillText(val, yAxis.xStart + style.axis.scaleLength + xOffset, yPos);
        }); // x-axis label

        if (type === 'scalable') {
          // scalable
          ctx.font = style.dateFontSize + 'px ' + style.font.family;
          ctx.textAlign = style.axis.label.xAxis.textAlign;
          ctx.textBaseline = style.axis.label.xAxis.textBaseline;
          coord.verticalLines.forEach(function (x) {
            ctx.fillText(dateFormatter(x.actual, style.dateFormat), x.display + style.axis.label.xAxis.offset.x, xAxis.yStart + style.axis.label.xAxis.offset.y * xAxis.flag);
          });
        } else {
          seriesInfo.timeRanges.forEach(function (range, index) {
            var width = viewport.right - style.padding.left;
            var displayRange = [index * width / seriesInfo.timeRanges.length, (index + 1) * width / seriesInfo.timeRanges.length];

            if (seriesInfo.timeRangesRatio) {
              var widthRatio = seriesInfo.timeRangesRatio;
              var prevRatio = widthRatio.slice(0, index).reduce(function (acc, x) {
                return acc + x;
              }, 0);
              var ratio = widthRatio[index];
              var left = Math.round(style.padding.left + prevRatio * width);
              var right = Math.round(left + ratio * width);
              displayRange = [left, right];
            }

            ctx.font = style.dateFontSize + 'px ' + style.font.family;
            ctx.fillText(dateFormatter(range[0], style.dateFormat), displayRange[0] + 5, xAxis.yStart + style.axis.label.xAxis.offset.y * xAxis.flag);
            var lastDateStr = dateFormatter(range[1], style.dateFormat);
            var strWidth = ctx.measureText(lastDateStr).width;
            ctx.fillText(lastDateStr, displayRange[1] - strWidth - 5, xAxis.yStart + style.axis.label.xAxis.offset.y * xAxis.flag);
          });
        }

        if (style.axis.showRate) {
          var rateX = yAxis.flag > 0 ? 0 : viewport.right;
          coord.horizLines.forEach(function (y, index) {
            var val = (y.actual - seriesInfo.baseValue) / seriesInfo.baseValue;
            var xOffset = ctx.measureText(val.toFixed(2) + '%').width + style.axis.label.yAxis.offset.x;
            var yPos = y.display + style.axis.label.yAxis.offset.y;
            if (yPos < 10) yPos += 10;
            if (yPos > originHeight - 10) yPos -= 10;
            if (val === 0) ctx.fillText(val.toFixed(2) + '%', rateX + style.axis.scaleLength + xOffset * yAxis.flag, yPos);else {
              rates[val > 0 ? 'up' : 'down'].push([(val * 100).toFixed(2) + '%', rateX + style.axis.scaleLength + xOffset * yAxis.flag, yPos]);
            }
          });
        }
      }, style.axis.labelColor);

      for (var direction in rates) {
        Draw.Text(ctx, function (ctx) {
          rates[direction].forEach(function (item) {
            ctx.fillText(item[0], item[1], item[2]);
          });
        }, style.seriesStyle.OHLC[direction]);
      }
    }
  }, {
    key: "drawAdditionalTips",
    value: function drawAdditionalTips() {
      var _this$_chart4 = this._chart,
          seriesInfo = _this$_chart4.seriesInfo,
          dataSource = _this$_chart4.dataSource,
          ctx = _this$_chart4.ctx,
          style = _this$_chart4.style,
          dataProvider = _this$_chart4.dataProvider,
          viewport = _this$_chart4.viewport;
      var filteredData = dataProvider.filteredData,
          coord = dataProvider.coord;

      if (seriesInfo.timeRanges !== undefined && seriesInfo.baseValue !== undefined) {
        var y = ~~Utils.Coord.linearActual2Display(seriesInfo.baseValue, coord.y);
        Draw.Stroke(ctx, function (ctx) {
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.moveTo(style.padding.left, y);
          ctx.lineTo(viewport.right, y);
        }, style.seriesStyle.baseValue);
      } // draw current price


      var mainSeries = seriesInfo.series.find(function (s) {
        return s.main;
      });

      if (dataSource.length > 0) {
        if (mainSeries) {
          var x = style.axis.yAxisPos === 'right' ? viewport.right : 0;
          var width = style.axis.yAxisPos === 'right' ? style.padding.right : style.padding.left;
          var last = dataSource[dataSource.length - 1];
          var value = last[mainSeries.c || mainSeries.valIndex];

          var _y = ~~Utils.Coord.linearActual2Display(value, coord.y);

          Draw.Stroke(ctx, function (ctx) {
            ctx.lineWidth = style.tip.currPrice.lineWidth;
            ctx.moveTo(style.padding.left, _y + 0.5);
            ctx.lineTo(viewport.right, _y + 0.5);
          }, style.tip.currPrice.lineColor);
          Draw.Fill(ctx, function (ctx) {
            ctx.rect(x, _y - style.tip.currPrice.labelHeight / 2, width, style.tip.currPrice.labelHeight);
          }, style.tip.currPrice.labelBg);
          Draw.Text(ctx, function (ctx) {
            ctx.fillText(value.toFixed(style.valuePrecision), x + style.axis.scaleLength + style.axis.label.yAxis.offset.x, _y + 5);
          }, style.tip.currPrice.labelColor);
        }
      } // draw value range boundary


      if (style.valueRangeBoundary.show && mainSeries && filteredData && filteredData.data && filteredData.data.length) {
        var max = filteredData.data[0];
        var min = filteredData.data[0];

        if (mainSeries.type === 'candlestick' || mainSeries.type === 'OHLC') {
          var highIndex = mainSeries.h;
          var lowIndex = mainSeries.l;
        } else {
          highIndex = mainSeries.valIndex;
          lowIndex = mainSeries.valIndex;
        }

        filteredData.data.forEach(function (item) {
          if (item[highIndex] > max[highIndex]) max = item;
          if (item[lowIndex] < min[lowIndex]) min = item;
        });
        var maxVal = max[highIndex].toFixed(style.valuePrecision);
        var maxY = ~~Utils.Coord.linearActual2Display(max[highIndex], coord.y) + 0.5;
        var minVal = min[lowIndex].toFixed(style.valuePrecision);
        var minY = ~~Utils.Coord.linearActual2Display(min[lowIndex], coord.y) + 0.5;
        Draw.Stroke(ctx, function (ctx) {
          if (style.valueRangeBoundary.dash) {
            ctx.setLineDash(style.valueRangeBoundary.dash);
          }

          ctx.moveTo(style.padding.left, maxY);
          ctx.lineTo(viewport.right, maxY);
        }, style.tip.highColor);
        Draw.Stroke(ctx, function (ctx) {
          if (style.valueRangeBoundary.dash) {
            ctx.setLineDash(style.valueRangeBoundary.dash);
          }

          ctx.moveTo(style.padding.left, minY);
          ctx.lineTo(viewport.right, minY);
        }, style.tip.lowColor);
        Draw.Text(ctx, function (ctx) {
          var width = ctx.measureText(maxVal).width;
          ctx.font = style.axis.labelFontSize + 'px ' + style.font.family;
          ctx.textAlign = style.axis.label.yAxis.textAlign;
          ctx.textBaseline = style.axis.label.yAxis.textBaseline;
          ctx.fillText(maxVal, (style.axis.yAxisPos === 'right' ? viewport.right : 0) + style.axis.scaleLength + style.axis.label.yAxis.offset.x, maxY);
        }, style.tip.highColor);
        Draw.Text(ctx, function (ctx) {
          var width = ctx.measureText(minVal).width;
          ctx.font = style.axis.labelFontSize + 'px ' + style.font.family;
          ctx.textAlign = style.axis.label.yAxis.textAlign;
          ctx.textBaseline = style.axis.label.yAxis.textBaseline;
          ctx.fillText(minVal, viewport.right + style.axis.scaleLength + style.axis.label.yAxis.offset.x, minY);
        }, style.tip.lowColor);
      }
    }
  }, {
    key: "axisClean",
    value: function axisClean(chart) {
      var _this$_chart5 = this._chart,
          ctx = _this$_chart5.ctx,
          style = _this$_chart5.style,
          originHeight = _this$_chart5.originHeight,
          originWidth = _this$_chart5.originWidth,
          viewport = _this$_chart5.viewport; // clear axis region
      // 用bg先刷一次 防止AXIS颜色设置成透明时 不能正确截取图表

      Draw.Fill(ctx, function (ctx) {
        ctx.rect(0, 0, originWidth, style.padding.top);
        ctx.rect(0, 0, style.padding.left, originHeight);
        ctx.rect(viewport.right, 0, style.padding.right, originHeight);
        ctx.rect(0, viewport.bottom, originWidth, style.padding.bottom);
      }, style.grid.bg);
      Draw.Fill(ctx, function (ctx) {
        ctx.rect(0, 0, originWidth, style.padding.top);
        ctx.rect(0, 0, style.padding.left, originHeight);
        ctx.rect(viewport.right, 0, style.padding.right, originHeight);
        ctx.rect(0, viewport.bottom, originWidth, style.padding.bottom);
      }, style.axis.bgColor);
    }
  }]);

  return Render;
}();

var originPosMap = {
  left: [0, 0.5],
  top: [0.5, 0],
  right: [1, 0.5],
  bottom: [0.5, 1],
  lefttop: [0, 0],
  righttop: [1, 0],
  leftbottom: [0, 1],
  rightbottom: [1, 1],
  center: [0.5, 0.5] // originPos: provide origin in the position of the label

};
function textLabelPainter(_ref) {
  var ctx = _ref.ctx,
      text = _ref.text,
      origin = _ref.origin,
      originPos = _ref.originPos,
      labelHeight = _ref.labelHeight,
      labelXPadding = _ref.labelXPadding,
      font = _ref.font,
      xMax = _ref.xMax,
      yMax = _ref.yMax,
      fontColor = _ref.fontColor,
      labelBg = _ref.labelBg;
  var labelWidth;
  Utils.Draw.Text(ctx, function (ctx) {
    labelWidth = ctx.measureText(text).width + labelXPadding * 2;
  }, null, font); // realOrigin origin can be use for CanvasRenderingContext2D.rect() {x:x,y:y}

  var realOrigin = {
    x: origin.x - originPosMap[originPos][0] * labelWidth,
    y: origin.y - originPosMap[originPos][1] * labelHeight
  };
  realOrigin.x = realOrigin.x < 0 ? 0 : realOrigin.x + labelWidth > xMax ? xMax - labelWidth : realOrigin.x;
  Utils.Draw.Fill(ctx, function (ctx) {
    ctx.rect(realOrigin.x, realOrigin.y, labelWidth, labelHeight);
  }, labelBg); // draw x label text

  var textX = realOrigin.x + labelXPadding;
  var textY = realOrigin.y + labelHeight / 2;
  Utils.Draw.Text(ctx, function (ctx) {
    ctx.fillText(text, textX, textY);
  }, fontColor, font, 'middle');
}

var rafThrottle = function rafThrottle(callback) {
  var requestId = null;
  var lastArgs;

  var later = function later(context) {
    return function () {
      requestId = null;
      callback.apply(context, lastArgs);
    };
  };

  var throttled = function throttled() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    lastArgs = args;

    if (requestId === null) {
      requestId = requestAnimationFrame(later(this));
    }
  };

  throttled.cancel = function () {
    cancelAnimationFrame(requestId);
    requestId = null;
  };

  return throttled;
};

function genEvent(chart, type) {
  var e = {}; // eslint-disable-next-line camelcase

  chart.eventInfo = {
    selectedItem: null,
    selectedIndex: null,
    yPos: null,
    xPos: null,
    dragStart: {
      offset: null
    },
    pinchStart: {
      offset: null,
      center: null
    }
  };
  Object.entries(eventSource[type]).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        name = _ref2[0],
        func = _ref2[1];

    e[name] = rafThrottle(function (event) {
      if (!event) {
        return;
      }

      func(chart, event);

      if (chart.linkedCharts.size) {
        _toConsumableArray(chart.linkedCharts).forEach(function (linkedChart) {
          func(linkedChart, event, true);
        });
      }
    });
  });
  return e;
}
var eventSource = {
  scalable: {
    mouseMoveEvent: function mouseMoveEvent() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _processEventUnits(['clean', 'crosshair', 'axisLabel', 'selectDot'], args);
    },
    mouseLeaveEvent: function mouseLeaveEvent() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      _processEventUnits(['clean'], args);
    },
    mouseDownEvent: function mouseDownEvent() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      _processEventUnits(['dragStart'], args);
    },
    panStartEvent: function panStartEvent() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      _processEventUnits(['panStart'], args);
    },
    panMoveEvent: function panMoveEvent() {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      _processEventUnits(['panMove'], args);
    },
    panEndEvent: function panEndEvent() {
      for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      _processEventUnits(['panEnd'], args);
    },
    mouseUpEvent: function mouseUpEvent() {
      for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }

      _processEventUnits(['dragEnd'], args);
    },
    mouseWheelEvent: function mouseWheelEvent() {
      for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }

      _processEventUnits(['mouseWheel'], args);
    },
    pinchStartEvent: function pinchStartEvent() {
      for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
      }

      _processEventUnits(['pinchStart'], args);
    },
    pinchMoveEvent: function pinchMoveEvent() {
      for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        args[_key10] = arguments[_key10];
      }

      _processEventUnits(['pinchMove'], args);
    },
    pinchEndEvent: function pinchEndEvent() {
      for (var _len11 = arguments.length, args = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
        args[_key11] = arguments[_key11];
      }

      _processEventUnits(['pinchEnd'], args);
    }
  },
  unscalable: {
    mouseMoveEvent: function mouseMoveEvent() {
      for (var _len12 = arguments.length, args = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
        args[_key12] = arguments[_key12];
      }

      _processEventUnits(['clean', 'crosshair', 'axisLabel', 'selectDot'], args);
    },
    mouseLeaveEvent: function mouseLeaveEvent() {
      for (var _len13 = arguments.length, args = new Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
        args[_key13] = arguments[_key13];
      }

      _processEventUnits(['clean'], args);
    }
  }
};
var events = {
  crosshair: function crosshair(chart, e, linked) {
    if (!linked && (e.localY < chart.viewport.top || e.localY > chart.viewport.bottom)) return;
    if (e.localX < chart.viewport.left || e.localX > chart.viewport.right) return;

    var _ref3 = getNearest[chart.type](chart, e.localX) || [null, null],
        _ref4 = _slicedToArray(_ref3, 2),
        selectedItem = _ref4[0],
        selectedIndex = _ref4[1];

    if (chart.eventInfo) {
      chart.eventInfo.selectedItem = selectedItem;
      chart.eventInfo.selectedIndex = selectedIndex;
    }

    if (!chart.eventInfo.selectedItem) return;
    Utils.Draw.Stroke(chart.iaCtx, function (ctx) {
      ctx.lineWidth = chart.style.crosshair.lineWidth || 1;
      ctx.setLineDash(chart.style.crosshair.dash); // verticalPos = e.localX

      var fixOffset = ctx.lineWidth % 2 ? 0.5 : 0; // draw horizontal line

      if (!linked) {
        chart.eventInfo.yPos = chart.style.crosshair.snapToData && chart.eventInfo.selectedItem ? ~~Utils.Coord.linearActual2Display(chart.eventInfo.selectedItem[chart.seriesInfo.series[0].c || chart.seriesInfo.series[0].valIndex], chart.dataProvider.coord.y) : e.localY;
        ctx.moveTo(chart.viewport.left, ~~chart.eventInfo.yPos + fixOffset);
        ctx.lineTo(chart.viewport.right, ~~chart.eventInfo.yPos + fixOffset);
      }

      chart.eventInfo.xPos = chart.eventInfo.selectedItem.x; // draw vertical line

      ctx.moveTo(~~chart.eventInfo.selectedItem.x + fixOffset, chart.viewport.top);
      ctx.lineTo(~~chart.eventInfo.selectedItem.x + fixOffset, chart.viewport.bottom);
    }, chart.style.crosshair.color);
  },
  axisLabel: function axisLabel(chart, e, linked) {
    // const chart = this
    if (!chart.eventInfo.selectedItem) return; // find the horizontal label width

    var hoverTime = chart.eventInfo.selectedItem[chart.seriesInfo.timeIndex];
    var hoverTimeStr = dateFormatter(hoverTime, chart.style.dateFormat);
    textLabelPainter({
      ctx: chart.iaCtx,
      text: hoverTimeStr,
      origin: {
        x: chart.eventInfo.selectedItem.x,
        y: chart.style.crosshair.posOffset.horizontal.y + (chart.style.axis.xAxisPos === 'bottom' ? chart.viewport.bottom : chart.viewport.top - chart.style.crosshair.labelHeight)
      },
      originPos: 'top',
      labelHeight: 20,
      labelXPadding: 5,
      font: null,
      xMax: chart.originWidth,
      yMax: chart.originHeight,
      fontColor: '#666',
      labelBg: '#efefef'
    });
    if (linked) return;
    var horizPos = chart.style.crosshair.snapToData && chart.eventInfo.selectedItem ? ~~Utils.Coord.linearActual2Display(chart.eventInfo.selectedItem[chart.seriesInfo.series[0].c || chart.seriesInfo.series[0].valIndex], chart.dataProvider.coord.y) : e.localY;
    var hoverValue = !linked ? Utils.Coord.linearDisplay2Actual(horizPos, chart.dataProvider.coord.y).toFixed(chart.style.valuePrecision) : 0;
    textLabelPainter({
      ctx: chart.iaCtx,
      text: hoverValue,
      origin: {
        x: chart.style.crosshair.posOffset.vertical.x + (chart.style.axis.yAxisPos === 'right' ? chart.viewport.right : 0),
        y: horizPos
      },
      originPos: 'left',
      labelHeight: 20,
      labelXPadding: 10,
      font: null,
      xMax: chart.originWidth,
      yMax: chart.originHeight,
      fontColor: '#666',
      labelBg: '#efefef'
    });
  },
  selectDot: function selectDot(chart, e, linked) {
    // const chart = this
    if (!chart.eventInfo.selectedItem || linked) return;
    var radius = chart.style.crosshair.selectedPointRadius;
    chart.style.crosshair.selectedPointColor.forEach(function (color, index) {
      Utils.Draw.Fill(chart.iaCtx, function (ctx) {
        ctx.arc(chart.eventInfo.selectedItem.x + 0.5, Utils.Coord.linearActual2Display(chart.eventInfo.selectedItem[chart.seriesInfo.series[0].c || chart.seriesInfo.series[0].valIndex], chart.dataProvider.coord.y) - 1.5, radius[index], 0, 2 * Math.PI);
      }, color);
    });
  },
  panStart: function panStart(chart, e, linked) {
    if (linked) return;
    chart.eventInfo.dragStart.offset = chart.viewport.offset;
  },
  panMove: function panMove(chart, e, linked) {
    if (linked) return;
    var newOffset = chart.eventInfo.dragStart.offset - e.deltaX; // console.log('move', chart.eventInfo.dragStart.offset, e.deltaX, newOffset, chart.viewport.right - chart.viewport.left - chart.viewport.barWidth * 5)

    if (e.deltaX < 0 && newOffset < chart.viewport.right - chart.viewport.left - chart.viewport.barWidth * 5 || e.deltaX > 0 && newOffset > chart.viewport.barWidth * -(chart.dataSource.length - 5)) {
      chart.viewport.offset = newOffset;
      chart.rerender();
    }
  },
  panEnd: function panEnd(chart, e, linked) {
    if (linked) return;
    chart.eventInfo.dragStart.offset = chart.viewport.offset;
  },
  pinchStart: function pinchStart(chart, e, linked) {
    if (linked) return;
    console.log(e, linked);
    chart.eventInfo.pinchStart.offset = chart.viewport.offset;
    chart.eventInfo.pinchStart.barWidth = chart.viewport.barWidth;
    chart.eventInfo.pinchStart.center = e.center;

    var _ref5 = getNearest[chart.seriesInfo.timeRanges ? 'unscalable' : 'scalable'](chart, e.center.x) || [null, null],
        _ref6 = _slicedToArray(_ref5, 2),
        selectedItem = _ref6[0],
        selectedIndex = _ref6[1];

    chart.eventInfo.selectedItem = selectedItem;
    chart.eventInfo.selectedIndex = selectedIndex;
  },
  pinchMove: function pinchMove(chart, e, linked) {
    if (linked) return;

    if (!chart.eventInfo.selectedItem || !chart.eventInfo.selectedIndex) {
      console.log('no select');
      return;
    }

    console.log(linked, chart.eventInfo.selectedIndex, e.scale);
    var zoomScale = e.scale - 1;
    var offsetIndex = chart.dataSource.length - chart.eventInfo.selectedIndex - 1;
    var oldBarWidth = chart.eventInfo.pinchStart.barWidth; // const scaleDivision = 100 / chart.style.wheelZoomSpeed

    var scaleDivision = 1;

    if (chart.eventInfo.pinchStart.barWidth + oldBarWidth * (zoomScale / scaleDivision) > 4 && chart.eventInfo.pinchStart.barWidth + oldBarWidth * (zoomScale / scaleDivision) < 64) {
      chart.viewport.barWidth = chart.eventInfo.pinchStart.barWidth + oldBarWidth * (zoomScale / scaleDivision);
      chart.viewport.offset = chart.eventInfo.pinchStart.offset - offsetIndex * oldBarWidth * (zoomScale / scaleDivision);
    }

    if (chart.viewport.offset > 0) {
      chart.viewport.offset = 0;
    }

    chart.rerender();
  },
  pinchEnd: function pinchEnd(chart, e, linked) {
    if (linked) return;
    console.log(e, linked);
  },
  pinchEvent: function pinchEvent(pinchPoint, scale) {
    console.log(pinchPoint, scale);
  },
  clean: function clean(chart, e, linked) {
    chart.iaCtx.clearRect(0, 0, chart.originWidth, chart.originHeight);
  },
  pinch: function pinch(chart, e, linked) {
    console.log(e);
  },
  mouseWheel: function mouseWheel(chart, e, linked) {
    if (linked) return;
    var zoomScale = Math.sign(e.deltaY) * Math.min(1, Math.abs(e.deltaY));

    var _ref7 = getNearest[chart.seriesInfo.timeRanges ? 'unscalable' : 'scalable'](chart, e.localX) || [null, null],
        _ref8 = _slicedToArray(_ref7, 2),
        selectedItem = _ref8[0],
        selectedIndex = _ref8[1];

    if (!selectedIndex || !selectedItem) {
      console.log('no select');
      return;
    }

    var offsetIndex = chart.dataSource.length - selectedIndex - 1;
    var oldViewport = chart.viewport.barWidth;
    var scaleDivision = 100 / chart.style.zoomSpeed;

    if (chart.viewport.barWidth + oldViewport * (zoomScale / scaleDivision) > 4 && chart.viewport.barWidth + oldViewport * (zoomScale / scaleDivision) < 64) {
      chart.viewport.barWidth += oldViewport * (zoomScale / scaleDivision);
      chart.viewport.offset -= offsetIndex * oldViewport * (zoomScale / scaleDivision);
    }

    if (chart.viewport.offset > 0) {
      chart.viewport.offset = 0;
    }

    chart.rerender();
  }
};
var getNearest = {
  scalable: function scalable(chart, xpos) {
    var filteredData = chart.dataProvider.filteredData.data.map(function (item) {
      return item.x;
    });

    for (var l = filteredData.length; l >= 0; l--) {
      if (Math.abs(xpos - filteredData[l]) <= chart.viewport.barWidth / 2) {
        return [chart.dataSource[l + chart.dataProvider.filteredData.leftOffset], l + chart.dataProvider.filteredData.leftOffset];
      }
    } // console.log(event.localX, filteredData, chart.viewport.barWidth)

  },
  unscalable: function unscalable(chart, xpos) {
    var rangeIndex = 0; // multiRange charts has diffrent scales in diffrent ratio parts

    if (chart.seriesInfo.timeRangesRatio) {
      var widthRatio = chart.seriesInfo.timeRangesRatio;
      var width = chart.viewport.right - chart.viewport.left;

      for (var i = 0; i < widthRatio.length; i++) {
        var ratio = widthRatio[i];
        var prevRatio = widthRatio.slice(0, i).reduce(function (acc, x) {
          return acc + x;
        }, 0);
        var left = Math.round(chart.viewport.left + prevRatio * width);
        var right = Math.round(left + ratio * width);

        if (xpos >= left && xpos <= right) {
          rangeIndex = i;
          break;
        }
      }
    }

    var filteredData = chart.dataProvider.panes.map(function (pane) {
      return pane.paneData;
    }); // console.log(filteredData,rangeIndex)

    for (var l = filteredData[rangeIndex].length - 1; l >= 0; l--) {
      var halfWidth = (filteredData[rangeIndex][1].x - filteredData[rangeIndex][0].x) / 2;
      halfWidth = halfWidth < 1 ? 1 : halfWidth; // console.log(l,filteredData[rangeIndex])

      if (Math.abs(xpos - filteredData[rangeIndex][l].x) <= halfWidth) {
        return [filteredData[rangeIndex][l], l];
      }
    }
  }
};

function _processEventUnits(units, args) {
  units.forEach(function (name) {
    return events[name] && events[name].apply(events, _toConsumableArray(args));
  });
}

var DataProvider =
/*#__PURE__*/
function () {
  function DataProvider(dataSource, chartType, chart) {
    _classCallCheck(this, DataProvider);

    this._dataSource = dataSource;
    this._seriesInfo = chart.seriesInfo;
    this._chartType = chartType;
    this._chart = chart;
    this._panes = null;
    this._filteredData = null;
    this._coord = null;

    if (this._dataSource && this._dataSource.length) {
      this.produce();
    } // this._filteredData

  }

  _createClass(DataProvider, [{
    key: "produce",
    value: function produce() {
      if (this._chartType === 'unscalable') {
        this.genPanes();
      } else {
        this.filterData();
      }

      this.genCoord();
    }
  }, {
    key: "genPanes",
    value: function genPanes() {
      var _this$_chart = this._chart,
          style = _this$_chart.style,
          viewport = _this$_chart.viewport;
      var _this$_seriesInfo = this._seriesInfo,
          timeIndex = _this$_seriesInfo.timeIndex,
          timeRanges = _this$_seriesInfo.timeRanges,
          timeRangesRatio = _this$_seriesInfo.timeRangesRatio;
      var chartWidth = viewport.right - viewport.left;
      var paneData = Utils.Coord.datafilterByTimeRanges(this._dataSource, timeRanges, timeIndex);
      var paneCoords = timeRanges.map(function (range, index) {
        // calc each panes position-x
        var left, right;

        if (timeRangesRatio) {
          var prevRatio = timeRangesRatio.slice(0, index).reduce(function (acc, x) {
            return acc + x;
          }, 0);
          left = Math.round(style.padding.left + prevRatio * chartWidth);
          right = Math.round(left + timeRangesRatio[index] * chartWidth);
        } else {
          var coordWidth = chartWidth / timeRanges.length;
          left = style.padding.left + coordWidth * index;
          right = left + coordWidth;
        }

        return {
          x: {
            display: [left, right],
            actual: [range[0], range[1]]
          }
        };
      }); // calc display position x of each visiable point

      paneData.forEach(function (pane, index) {
        pane.forEach(function (item) {
          item.x = ~~Utils.Coord.linearActual2Display(item[timeIndex], paneCoords[index].x);
        });
      });
      this._panes = paneCoords.map(function (paneCoord, index) {
        return {
          paneCoord: paneCoord,
          paneData: paneData[index]
        };
      });
      this._filteredData = {
        data: paneData.flat()
      };
    }
  }, {
    key: "filterData",
    value: function filterData() {
      var _this$_chart2 = this._chart,
          viewport = _this$_chart2.viewport,
          style = _this$_chart2.style; // const { data } = this._dataSource

      this._filteredData = Utils.Coord.dataFilterByViewport(this._dataSource, viewport, style);
    }
  }, {
    key: "genCoord",
    value: function genCoord() {
      // for data with no timeRanges,
      // use offset & width of data to calc data
      var _this$_chart3 = this._chart,
          viewport = _this$_chart3.viewport,
          style = _this$_chart3.style;
      var _this$_seriesInfo2 = this._seriesInfo,
          series = _this$_seriesInfo2.series,
          timeIndex = _this$_seriesInfo2.timeIndex,
          baseValue = _this$_seriesInfo2.baseValue,
          touchTop = _this$_seriesInfo2.touchTop; // calculate actual-x-range of data

      var xActual = [this._filteredData.data[0][timeIndex], this._filteredData.data[this._filteredData.data.length - 1][timeIndex]]; // calculate actual range of data

      var yRange = Utils.Coord.calcYRange(this._filteredData.data, series); // yRange的初步处理，有baseValue时对称处理，最大最小值相等时增加差异

      var yActual = Utils.Coord.adjustYRange(yRange, touchTop, style, viewport, baseValue, style.valuePrecision); // create coord

      this._coord = {
        x: {
          display: [style.padding.left, viewport.right],
          actual: xActual
        },
        y: {
          display: [viewport.bottom, style.padding.top],
          actual: yActual
        },
        viewport: viewport
      };
      this.genHorizLines();
      this.genVerticalLines();
    }
  }, {
    key: "genHorizLines",
    value: function genHorizLines() {
      var _this = this;

      var style = this._chart.style;
      var _this$_seriesInfo3 = this._seriesInfo,
          baseValue = _this$_seriesInfo3.baseValue,
          touchTop = _this$_seriesInfo3.touchTop;
      var yActual = this._coord.y.actual;
      var horizCount = Utils.Grid.lineCount(this._coord.y.display, style.grid.limit.y, style.grid.span.y);
      var hGridLines = Utils.Grid.calcGridLines(this._coord.y.actual, horizCount, baseValue);

      if (!touchTop) {
        this._coord.y.actual = [hGridLines[0], hGridLines[hGridLines.length - 1]];
      }

      var horizLines = hGridLines.map(function (val) {
        return {
          actual: val,
          display: ~~Utils.Coord.linearActual2Display(val, _this._coord.y) + 0.5
        };
      });
      this._coord.horizLines = horizLines;
    }
  }, {
    key: "genVerticalLines",
    value: function genVerticalLines() {
      var _this$_chart4 = this._chart,
          style = _this$_chart4.style,
          viewport = _this$_chart4.viewport;
      var timeIndex = this._seriesInfo.timeIndex;
      var verticalLines = [];

      if (this._chartType === 'unscalable') {
        this._panes.forEach(function (pane) {
          verticalLines.push({
            display: pane.paneCoord.x.display[0] + 0.5,
            actual: pane.paneCoord.x.actual[0]
          });
        });

        verticalLines.push({
          display: this._panes[this._panes.length - 1].paneCoord.x.display[1] + 0.5,
          actual: this._panes[this._panes.length - 1].paneCoord.x.actual[1]
        });
      } else {
        // vertical grid line drawing for candlestick chart
        for (var l = this._filteredData.data.length - 1; l >= 0; l -= Math.round(style.grid.span.x / viewport.barWidth)) {
          if (this._filteredData.data[l].x > viewport.left && this._filteredData.data[l].x <= viewport.right) verticalLines.push({
            display: ~~this._filteredData.data[l].x + 0.5,
            actual: this._filteredData.data[l][timeIndex]
          });
        }
      }

      this._coord.verticalLines = verticalLines;
    }
  }, {
    key: "panes",
    get: function get() {
      return this._panes;
    }
  }, {
    key: "filteredData",
    get: function get() {
      return this._filteredData;
    }
  }, {
    key: "coord",
    get: function get() {
      return this._coord;
    }
  }]);

  return DataProvider;
}();

var EventHandler =
/*#__PURE__*/
function () {
  function EventHandler(target, events) {
    var preventDefault = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    _classCallCheck(this, EventHandler);

    this._target = target;
    this._events = events;
    this._preventDefault = preventDefault;
    this._hammer = new Hammer(target);

    this._init();
  }

  _createClass(EventHandler, [{
    key: "_init",
    value: function _init() {
      this._hammer.get('pinch').set({
        enable: true
      });

      this._hammer.on('pinchstart', this.makeEventHander('pinchStartEvent', true), {
        passive: false
      });

      this._hammer.on('pinchmove', this.makeEventHander('pinchMoveEvent', true), {
        passive: false
      });

      this._hammer.on('pinchend', this.makeEventHander('pinchEndEvent', true), {
        passive: false
      });

      this._hammer.on('panstart', this.makeEventHander('panStartEvent', true));

      this._hammer.on('panmove', this.makeEventHander('panMoveEvent', true));

      this._hammer.on('panend', this.makeEventHander('panEndEvent', true));

      this._target.addEventListener('mousemove', this.makeEventHander('mouseMoveEvent'));

      this._target.addEventListener('mouseleave', this.makeEventHander('mouseLeaveEvent'));

      this._target.addEventListener('wheel', this.makeEventHander('mouseWheelEvent'), {
        passive: false
      });
    }
  }, {
    key: "makeEventHander",
    value: function makeEventHander(eventName) {
      var isHammer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return function (e) {
        if (event.cancelable) {
          event.preventDefault();
        }

        var compatEvent = isHammer ? e : this._makeCompatEvent(e);

        this._processEvent(compatEvent, this._events[eventName]);

        this._preventDefaultIfNeeded(e);
      }.bind(this);
    }
  }, {
    key: "_preventDefaultIfNeeded",
    value: function _preventDefaultIfNeeded(event) {
      if (this._preventDefault && event.cancelable) {
        event.preventDefault();
      }
    }
  }, {
    key: "_makeCompatEvent",
    value: function _makeCompatEvent(event) {
      var eventLike;

      if ('touches' in event && event.touches.length) {
        eventLike = event.touches[0];
      } else if ('changedTouches' in event && event.changedTouches.length) {
        eventLike = event.changedTouches[0];
      } else {
        eventLike = event;
      }

      var deltaX = event.deltaX / 100;
      var deltaY = -(event.deltaY / 100);

      switch (event.deltaMode) {
        case event.DOM_DELTA_PAGE:
          // one screen at time scroll mode
          eventLike.deltaX = deltaX * 120;
          eventLike.deltaY *= deltaY * 120;
          break;

        case event.DOM_DELTA_LINE:
          // one line at time scroll mode
          eventLiked.deltaX = deltaX * 32;
          eventLike.deltaY = deltaY * 32;
          break;
      }

      var box = this._target.getBoundingClientRect() || {
        left: 0,
        top: 0
      };
      return {
        clientX: eventLike.clientX,
        clientY: eventLike.clientY,
        pageX: eventLike.pageX,
        pageY: eventLike.pageY,
        deltaX: eventLike.deltaX || null,
        deltaY: eventLike.deltaY || null,
        screenX: eventLike.screenX,
        screenY: eventLike.screenY,
        localX: eventLike.clientX - box.left,
        localY: eventLike.clientY - box.top,
        ctrlKey: event.ctrlKey,
        altKey: event.altKey,
        shiftKey: event.shiftKey,
        metaKey: event.metaKey,
        target: eventLike.target,
        view: event.view,
        preventDefault: function preventDefault() {
          if (event.cancelable) {
            event.preventDefault();
          }
        }
      };
    }
  }, {
    key: "_processEvent",
    value: function _processEvent(event, eventFunc) {
      if (!eventFunc) {
        return;
      }

      eventFunc.call(this._events, event);
    }
  }]);

  return EventHandler;
}();

var genContext = Symbol();
var genCanvasLayer = Symbol();
var painter = Symbol();

var Chart =
/*#__PURE__*/
function () {
  function Chart(container, dataSource, options) {
    _classCallCheck(this, Chart);

    // prevent same data for different charts
    this.dataSource = JSON.parse(JSON.stringify(dataSource)); // Utils.Safe.dataCheck(dataSource)
    //  = dataSource

    var _this$genCanvasLayer = this[genCanvasLayer](container),
        canvasEl = _this$genCanvasLayer.canvasEl,
        iaCanvasEl = _this$genCanvasLayer.iaCanvasEl;

    this.originWidth = canvasEl.width;
    this.originHeight = canvasEl.height;
    this.ctx = this[genContext](canvasEl);
    this.iaCtx = this[genContext](iaCanvasEl);
    this.linkedCharts = new Set();
    var defaults = DEFAULTS();
    this.style = merge(defaults, options);
    this.seriesInfo = options.seriesInfo;
    this.confirmType();
    this.genStyle();
    this.dataProvider = new DataProvider(this.dataSource, this.type, this);
    this.render = new Render(this);

    if (!this.rerender) {
      this.rerender = throttle(this[painter], 16);
    }

    this.rerender();
    this.events = genEvent(this, this.type);
    this.EventHandler = new EventHandler(container, this.events);
  }

  _createClass(Chart, [{
    key: "updateOption",
    value: function updateOption(newOpt) {
      this.style = merge(this.style, newOpt);
      this.confirmType();
      this.genStyle();
      this.dataProvider && this.dataProvider.produce();
      this.rerender();
    }
  }, {
    key: genCanvasLayer,
    value: function value(container) {
      var canvasMain = document.createElement('canvas');
      var canvasIa = document.createElement('canvas');
      canvasMain.width = canvasIa.width = container.clientWidth;
      canvasMain.height = canvasIa.height = container.clientHeight;
      canvasMain.style.position = canvasIa.style.position = 'absolute';
      canvasMain.style.top = canvasIa.style.top = 0;
      canvasMain.style.left = canvasIa.style.left = 0;
      if (!container.style.position || container.style.position === 'static') container.style.viewport = 'relative';
      container.innerHTML = '';
      container.appendChild(canvasMain);
      container.appendChild(canvasIa);
      return {
        canvasEl: canvasMain,
        iaCanvasEl: canvasIa
      };
    }
  }, {
    key: genContext,
    value: function value(canvasEl) {
      var dpr = window ? window.devicePixelRatio : 1;
      var ctx = canvasEl.getContext('2d');
      canvasEl.style.width = (canvasEl.clientWidth || canvasEl.width) + 'px';
      canvasEl.style.height = (canvasEl.clientHeight || canvasEl.height) + 'px';
      canvasEl.width *= dpr;
      canvasEl.height *= dpr;
      ctx.scale(dpr, dpr);
      return ctx;
    }
  }, {
    key: "genStyle",
    value: function genStyle() {
      var _this = this;

      this.ctx.font = this.style.font.size + 'px ' + this.style.font.family;
      this.iaCtx.font = this.ctx.font;
      this.viewport = Object.assign({}, this.style.viewport, {
        left: this.style.padding.left,
        top: this.style.padding.top,
        right: this.originWidth - this.style.padding.right,
        bottom: this.originHeight - this.style.padding.bottom
      });
      this.seriesInfo.series.map(function (s) {
        s.style = s.style || _this.style.seriesStyle;
      });
    }
  }, {
    key: painter,
    value: function value(linked, force) {
      var _this2 = this;

      this.dataProvider && this.dataProvider.produce();
      this.clean();
      Utils.Draw.Fill(this.ctx, function (ctx) {
        ctx.rect(0, 0, _this2.originWidth, _this2.originHeight);
      }, this.style.grid.bg);
      this.render.rend(); // rerender all linked charts

      if (this.linkedCharts.size && !linked) {
        _toConsumableArray(this.linkedCharts).forEach(function (chart) {
          chart.viewport.offset = _this2.viewport.offset;
          chart.viewport.barWidth = _this2.viewport.barWidth;
          chart.rerender(true);
        });
      }
    }
  }, {
    key: "confirmType",
    value: function confirmType() {
      this.type = this.style.type;

      if (this.seriesInfo.timeRanges && this.seriesInfo.timeRanges.length > 1 && this.style.type === 'scalable') {
        this.type = 'unscalable';
        throw 'multi timeRanges chart cannot be scalable';
      }
    }
  }, {
    key: "clean",
    value: function clean(e, name, force) {
      this.iaCtx.clearRect(0, 0, this.originWidth, this.originHeight); // rerender all linked charts

      if (this.linkedCharts.size && !force) {
        this.linkedCharts.forEach(function (chart) {
          chart.events.mouseLeaveEvent.call(chart, null, true);
        });
      }
    }
  }]);

  return Chart;
}();

function linkCharts() {
  for (var _len = arguments.length, charts = new Array(_len), _key = 0; _key < _len; _key++) {
    charts[_key] = arguments[_key];
  }

  charts.forEach(function (chart) {
    charts.forEach(function (otherChart) {
      if (chart !== otherChart) chart.linkedCharts && chart.linkedCharts.add(otherChart);
    });
  });
}

export { Chart, linkCharts };
