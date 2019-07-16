const Utils = {
  Safe: {
    dataCheck(dataSource) {
      var data = dataSource.data;
      var series = dataSource.series;
      var maxIndex = 0;
      series.forEach(line => {
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
    linear(dataSet1, dataSet2, valIndexes) {
      var diff = dataSet1.map((d1, index) => {
        var data2 = dataSet2[index];
        var result = d1.slice();
        valIndexes.forEach(valIndex => {
          var diff = data2[valIndex] - result[valIndex];
          result[valIndex] = diff / 60;
        });
        return result;
      });
      return function () {
        dataSet1.forEach((d1, index) => {
          valIndexes.forEach(function (valIndex) {
            d1[valIndex] += diff[index][valIndex];
          });
        });
      };
    }

  },
  Chart: {
    linkCharts(charts) {
      charts.forEach(function (chart) {
        charts.forEach(function (otherChart) {
          if (chart !== otherChart) chart.linkedCharts.insert(otherChart);
        });
      });
    }

  },
  DataTypes: {
    Set: function () {
      var set = function (d) {
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
    sum(lst) {
      var sum = 0;
      lst.forEach(function (item) {
        sum += item;
      });
      return sum;
    },

    // get Standard Deviation
    getSD(data, avg) {
      if (avg === undefined) {
        avg = Utils.Math.sum(data) / data.length;
      }

      return Math.sqrt(Utils.Math.sum(data.map(function (item) {
        return Math.pow(item - avg, 2);
      })) / data.length);
    },

    iterOffsetN(data, index, n, callback) {
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

    leftPad(n, width) {
      var zeros = [];

      while (width--) {
        zeros.push(0);
      }

      return zeros.join('').slice(0, zeros.length - n.toString().length) + n;
    },

    rightPad(n, width) {
      var nStr = n.toString().replace('-', '');
      var nStrArr = nStr.split('.');
      var precision = width - nStrArr[0].length - 1;
      return n.toFixed(precision >= 0 ? precision : 0);
    },

    distance(point1, point2) {
      return Math.sqrt(Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2));
    }

  },
  Draw: {
    Basic(ctx, func) {
      ctx.save();
      ctx.beginPath();
      func(ctx);
    },

    Fill(ctx, func, style) {
      Utils.Draw.Basic(ctx, func);
      ctx.fillStyle = style || 'black';
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    },

    Stroke(ctx, func, style) {
      Utils.Draw.Basic(ctx, func);
      ctx.strokeStyle = style || 'black';
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    },

    FillnStroke(ctx, func, fillStyle, strokeStyle) {
      Utils.Draw.Basic(ctx, func);
      ctx.fillStyle = fillStyle || 'black';
      ctx.strokeStyle = strokeStyle || 'black';
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    },

    Text(ctx, func, fillStyle, fontStyle) {
      ctx.save();
      if (fontStyle) ctx.font = fontStyle;
      ctx.fillStyle = fillStyle || 'black';
      func(ctx);
      ctx.restore();
    }

  },
  Coord: {
    getDateStr(date, noDate, noTime) {
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
    datafilterByTimeRanges(data, ranges, tIndex) {
      const buckets = ranges.map(() => []);
      let bucketIndex = 0;

      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        let time = item[tIndex];

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

    dataFilterByViewport(data, viewport, style) {
      var displayWidth = style.position.right - style.padding.left;
      var result = [];
      var pointerX = viewport.offset;
      var leftOffset = Number.MAX_VALUE;
      var rightOffset = Number.MIN_VALUE;

      for (var l = data.length; l--;) {
        data[l].x = null;

        if (pointerX >= -30 && pointerX <= displayWidth + 30) {
          data[l].x = displayWidth - pointerX + style.padding.left;
          result.unshift(data[l]);
          if (l > rightOffset) rightOffset = l;
          if (l < leftOffset) leftOffset = l;
        }

        pointerX += viewport.width;
      }

      return {
        filteredData: result,
        leftOffset: leftOffset,
        rightOffset: rightOffset
      };
    },

    linearPixels2Actual(length, coord) {
      return length * Math.abs(coord.actual[1] - coord.actual[0]) / Math.abs(coord.display[1] - coord.display[0]);
    },

    linearActual2Display(val, coord) {
      return (val - coord.actual[0]) * (coord.display[1] - coord.display[0]) / (coord.actual[1] - coord.actual[0]) + coord.display[0];
    },

    linearDisplay2Actual(pos, coord) {
      return (pos - coord.display[0]) * (coord.actual[1] - coord.actual[0]) / (coord.display[1] - coord.display[0]) + coord.actual[0];
    },

    seekNeatPoints(range, count) {
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

    calcYRange(data, series) {
      var yMax = Number.MIN_VALUE;
      var yMin = Number.MAX_VALUE;
      data.forEach(d => {
        series.forEach(s => {
          var h = d[s.type === 'candlestick' ? s.h : s.valIndex];
          var l = d[s.type === 'candlestick' ? s.l : s.valIndex];
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
    adjustYRange(yRange, touchTop, style, baseValue) {
      // calc the vertical padding of grid
      let [yMin, yMax] = yRange;

      if (!touchTop) {
        const verticalPadding = Utils.Coord.linearPixels2Actual(style.grid.span.y, {
          display: [style.position.bottom, style.padding.top],
          actual: [yMin, yMax]
        });
        yMin -= verticalPadding;
        yMax += verticalPadding;
      }

      let yActual = [yMin, yMax]; // enlarge the actual range of vertical coord when base value line is specified

      if (baseValue !== undefined) {
        const span = Math.max(Math.abs(baseValue - yMax), Math.abs(baseValue - yMin));
        yActual = [baseValue - span, baseValue + span];
      }

      return yActual;
    }

  }
};

const DEFAULTS = function () {
  return {
    viewport: {
      offset: 0,
      width: 10
    },
    // 图表显示的视野, width表示单个数据元素占用宽度
    pricePrecision: 5,
    // 设定的数据精度
    style: {
      font: {
        family: 'Microsoft YaHei',
        size: 14
      },
      padding: {
        top: 1,
        right: 70,
        bottom: 28,
        left: 1
      },
      // 设定4周数据轴区域的大小
      wheelZoomStep: 1,
      // 设定鼠标滚轮滚动单步调整的大小
      linearLastPoint: false,
      // 绘制当前价的闪烁点
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
        snapToClose: false,
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
          y: [2, 8]
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
        // position of xAxis label, can be 'bottom' or 'top'
        yAxisPos: 'right',
        // position of yAxis label, can be 'right' or 'left'
        hideCandlestickDate: false,
        // 隐藏蜡烛图的日期
        hideCandlestickTime: false,
        // 隐藏蜡烛图的小时分钟
        showRate: false,
        // 显示百分比
        labelPos: {
          // 坐标轴标签的位置偏移
          xAxis: {
            x: -35,
            y: 20
          },
          yAxis: {
            x: 5,
            y: 4
          }
        },
        labelColor: '#555',
        // 设定坐标轴标签的颜色
        pointerLength: 0,
        // 刻度长度
        bgColor: 'rgba(0,0,0,0)',
        // 坐标轴背景色
        lineColor: 'rgba(0,0,0,0)',
        // 坐标轴线颜色
        drawFrame: false // 是否绘制线框

      }
    },
    dataStyle: {
      // 关于数据的样式
      baseValue: '#2DB0F9',
      // 分时图昨收的颜色
      candlestick: {
        // K线图的颜色
        block: {
          up: '#f8f8f8',
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
      }
    }
  };
};

const Draw = {
  Basic(ctx, func) {
    ctx.save();
    ctx.beginPath();
    func(ctx);
  },

  Fill(ctx, func, style) {
    Draw.Basic(ctx, func);
    ctx.fillStyle = style || 'black';
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  },

  Stroke(ctx, func, style) {
    Draw.Basic(ctx, func);
    ctx.strokeStyle = style || 'black';
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  },

  FillnStroke(ctx, func, fillStyle, strokeStyle) {
    Draw.Basic(ctx, func);
    ctx.fillStyle = fillStyle || 'black';
    ctx.strokeStyle = strokeStyle || 'black';
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  },

  Text(ctx, func, fillStyle, fontStyle) {
    ctx.save();

    if (fontStyle) {
      ctx.font = fontStyle;
    }

    ctx.fillStyle = fillStyle || 'black';
    func(ctx);
    ctx.restore();
  }

};

const LinearIndicatorPainter = {
  line(ctx, seriesConf, panes, coord) {
    Draw.Stroke(ctx, ctx => {
      ctx.lineWidth = seriesConf.lineWidth || 1;
      panes.forEach((pane, index) => {
        pane.paneData.forEach((item, bIndex) => {
          if (!bIndex) ctx.moveTo(Utils.Coord.linearActual2Display(item[seriesConf.t], pane.paneView.x), Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coord.y));
          ctx.lineTo(Utils.Coord.linearActual2Display(item[seriesConf.t], pane.paneView.x), Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coord.y));
        });
      });
    }, seriesConf.color);
  },

  column(ctx, seriesConf, panes, coord) {
    var columns = {
      up: [],
      down: [],
      eq: []
    };
    panes.forEach((pane, paneIndex) => {
      pane.paneData.forEach((item, bIndex) => {
        var val = item[seriesConf.valIndex]; // make some changes to base define

        var baseVal = seriesConf.baseVal !== undefined ? seriesConf.baseVal : seriesConf.baseIndex !== undefined ? item[seriesConf.baseIndex] : null;
        if (baseVal !== null) columns[val >= baseVal ? 'up' : 'down'].push(item);
        if (seriesConf.color.detect) columns[seriesConf.color.detect(item, bIndex, pane.paneData, paneIndex, panes)].push(item);
      });
    });

    for (var direction in columns) {
      Draw.Stroke(ctx, ctx => {
        ctx.lineWidth = seriesConf.lineWidth || 1;
        columns[direction].forEach(item => {
          var baseVal = seriesConf.baseVal !== undefined ? seriesConf.baseVal : seriesConf.baseIndex !== undefined ? item[seriesConf.baseIndex] : null;

          if (seriesConf.mode === 'bidirection') {
            ctx.moveTo(~~item.x + 0.5, Utils.Coord.linearActual2Display(baseVal, coord.y));
            ctx.lineTo(~~item.x + 0.5, Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coord.y));
          } else {
            ctx.moveTo(~~item.x + 0.5, seriesConf.bottom || 0);
            ctx.lineTo(~~item.x + 0.5, Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coord.y));
          }
        });
      }, seriesConf.color[direction]);
    }
  }

};
const CandleStickIndicatorPainter = {
  line(ctx, seriesConf, filteredData, coord) {
    Draw.Stroke(ctx, ctx => {
      ctx.lineWidth = seriesConf.line_width || 1;
      var started = false;
      filteredData.forEach((item, index) => {
        var val = item[seriesConf.valIndex];
        if (val === null) return;

        if (!started) {
          ctx.moveTo(item.x, Utils.Coord.linearActual2Display(val, coord.y));
          started = true;
        }

        ctx.lineTo(item.x, Utils.Coord.linearActual2Display(val, coord.y));
      });
    }, seriesConf.color);
  },

  column(ctx, seriesConf, filteredData, coord) {
    var columns = {
      up: [],
      down: [],
      eq: []
    };
    filteredData.forEach((item, index) => {
      var val = item[seriesConf.valIndex];
      var baseVal = seriesConf.baseVal !== undefined ? seriesConf.baseVal : seriesConf.baseIndex !== undefined ? item[seriesConf.baseIndex] : null;
      if (baseVal !== null) columns[val >= baseVal ? 'up' : 'down'].push(item);
      if (seriesConf.color.detect) columns[seriesConf.color.detect(item, index, filteredData)].push(item);
    }); // a股K线下面的图换成矩形画法

    var coordY = seriesConf.linearMode ? {
      actual: [0, coord.y.actual[1]],
      display: coord.y.display
    } : coord.y;

    for (var direction in columns) {
      Draw.FillnStroke(ctx, ctx => {
        columns[direction].forEach(item => {
          if (seriesConf.mode === 'bidirection') {
            ctx.rect(~~(item.x - (seriesConf.viewport.width - 4) / 2) + 0.5, ~~Utils.Coord.linearActual2Display(seriesConf.baseVal, coordY) + 0.5, seriesConf.viewport.width - 4, ~~(Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coordY) - Utils.Coord.linearActual2Display(seriesConf.baseVal, coordY)) + 0.02); // + 0.02 is for IE fix
          } else {
            ctx.rect(~~(item.x - (seriesConf.viewport.width - 4) / 2) + 0.5, ~~seriesConf.position.bottom + 0.5, seriesConf.viewport.width - 4, ~~(Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coordY) - seriesConf.position.bottom) + 0.02); // + 0.02 is for IE fix
          }
        });
      }, seriesConf.color[direction], seriesConf.border ? seriesConf.border[direction] : seriesConf.color[direction]);
    }
  }

};

class Render {
  constructor(dataSource, style, ctx) {// this.dataSource = dataSource
    // this.style = style
    // this.ctx = ctx
  }

  genPanes() {
    const {
      data,
      timeIndex,
      timeRanges,
      timeRangesRatio
    } = this.dataSource;
    let chartWidth = this.style.position.right - this.style.padding.left;
    const paneData = Utils.Coord.datafilterByTimeRanges(data, timeRanges, timeIndex);
    const paneCoords = timeRanges.map((range, index) => {
      // calc each panes position-x
      let left, right;

      if (timeRangesRatio) {
        let prevRatio = timeRangesRatio.slice(0, index).reduce((acc, x) => {
          return acc + x;
        }, 0);
        left = Math.round(this.style.padding.left + prevRatio * width);
        right = Math.round(left + this.dataSource.timeRangesRatio[index] * chartWidth);
      } else {
        const coordWidth = chartWidth / this.dataSource.timeRanges.length;
        left = this.style.padding.left + coordWidth * index;
        right = left + coordWidth;
      }

      return {
        x: {
          display: [left, right],
          actual: [range[0], range[1]]
        }
      };
    }); // calc display position x of each visiable point

    paneData.forEach((pane, index) => {
      pane.forEach(item => {
        item.x = ~~Utils.Coord.linearActual2Display(item[this.dataSource.timeIndex], paneCoords[index].x);
      });
    });
    this.panes = paneCoords.map((paneCoord, index) => ({
      paneCoord,
      paneData: paneData[index]
    }));
  }

  genLinearCoord() {
    this.render.genPanes.call(this);
    const {
      data,
      series,
      timeRanges,
      baseValue,
      touchTop
    } = this.dataSource;
    const {
      viewport,
      style
    } = this;
    let yRange = Utils.Coord.calcYRange(data, series);
    let yActual = Utils.Coord.adjustYRange(yRange, touchTop, style, baseValue); // create coord

    this.coord = {
      x: {
        display: [style.padding.left, style.position.right],
        actual: [timeRanges[0][0], timeRanges[timeRanges.length - 1][1]]
      },
      y: {
        display: [style.position.bottom, style.padding.top],
        actual: yActual
      },
      viewport
    };
  }

  genCsCoord() {
    const {
      data,
      series
    } = this.dataSource;
    const {
      viewport,
      style
    } = this; // var series = this.dataSource.series;
    // filter data by viewport

    this.filterResult = Utils.Coord.dataFilterByViewport(data, viewport, style); // calculate actual range of data

    let yActual = Utils.Coord.calcYRange(this.filterResult.filteredData, series);
    let xActual = [this.filterResult.filteredData[0][this.dataSource.timeIndex], this.filterResult.filteredData[this.filterResult.filteredData.length - 1][this.dataSource.timeIndex]]; // calc the vertical padding of grid

    var verticalPadding = Utils.Coord.linearPixels2Actual(this.style.grid.span.y * 2, {
      display: [style.position.bottom, style.padding.top],
      actual: yActual
    });
    yActual[0] -= verticalPadding;
    yActual[1] += verticalPadding; // with base value line

    if (this.dataSource.baseValue !== undefined) {
      var baseValue = this.dataSource.baseValue;
      var span = Math.max(Math.abs(baseValue - yActual[0]), Math.abs(baseValue - yActual[1]));
      yActual = [baseValue - span, baseValue + span];
    } // create coord


    this.coord = {
      x: {
        display: [this.style.padding.left, this.style.position.right],
        actual: xActual
      },
      y: {
        display: [this.style.position.bottom, this.style.padding.top],
        actual: yActual
      },
      viewport: this.viewport
    };
  }

  drawGrid() {
    // calculate horizontal lines position
    var yNum = ~~((this.coord.y.display[0] - this.coord.y.display[1]) / this.style.grid.span.y);
    if (yNum > this.style.grid.limit.y[1]) yNum = this.style.grid.limit.y[1];
    if (yNum < this.style.grid.limit.y[0]) yNum = this.style.grid.limit.y[0];
    var horizLines = [];

    if (this.dataSource.baseValue === undefined) {
      // no base value line specified
      if (this.coord.y.actual[0] === this.coord.y.actual[1]) {
        var offset = this.coord.y.actual[0] / 100;
        this.coord.y.actual[0] -= offset;
        this.coord.y.actual[1] += offset;
      }

      horizLines = Utils.Coord.seekNeatPoints(this.coord.y.actual, yNum + 1);
    } else {
      // with base value line
      var yActual = this.coord.y.actual;
      var baseValue = this.dataSource.baseValue;
      var span = (yActual[1] - yActual[0]) / 2;
      horizLines = [yActual[0], baseValue];

      while (horizLines.length < yNum) {
        span /= 2;

        for (var i = 0, limit = horizLines.length; i < limit; i++) {
          horizLines.push(horizLines[i] + span);
        }
      }

      horizLines.push(yActual[1]);
    }

    horizLines = horizLines.map(val => {
      return {
        actual: val,
        display: ~~Utils.Coord.linearActual2Display(val, this.coord.y) + 0.5
      };
    }); // draw horizontal lines

    Draw.Stroke(this.ctx, ctx => {
      horizLines.forEach((y, index) => {
        ctx.moveTo(this.style.padding.left, y.display);
        ctx.lineTo(this.style.position.right, y.display);
      });
    }, this.style.grid.color.x);
    this.coord.horizLines = horizLines; // calculate vertical lines position

    var verticalLines = [];

    if (this.dataSource.timeRanges) {
      // vertical grid line drawing for linear chart
      this.dataSource.timeRanges.forEach((range, index) => {
        if (this.dataSource.timeRangesRatio) {
          var width = this.style.position.right - this.style.padding.left;
          var widthRatio = this.dataSource.timeRangesRatio;
          var prevRatio = widthRatio.slice(0, index).reduce((acc, x) => {
            return acc + x;
          }, 0);
          var ratio = widthRatio[index];
          var left = Math.round(this.style.padding.left + prevRatio * width);

          if (index === this.dataSource.timeRanges.length - 1) {
            verticalLines.push({
              display: this.style.position.right + 0.5,
              actual: range[1]
            });
          }

          verticalLines.push({
            display: left + 0.5,
            actual: range[0]
          });
        } else {
          const coordWidth = (this.style.position.right - this.style.padding.left) / this.dataSource.timeRanges.length;
          verticalLines.push({
            display: ~~(this.style.padding.left + coordWidth * index) + 0.5,
            actual: range[0]
          });

          if (index === this.dataSource.timeRanges.length - 1) {
            verticalLines.push({
              display: this.style.position.right + 0.5,
              actual: range[1]
            });
          }
        }
      });
    } else {
      // vertical grid line drawing for candlestick chart
      for (var l = this.dataSource.data.length - 1; l >= 0; l -= ~~(this.style.grid.span.x / this.viewport.width)) {
        if (this.dataSource.data[l].x > this.style.padding.left && this.dataSource.data[l].x < this.style.position.right) verticalLines.push({
          display: ~~this.dataSource.data[l].x + 0.5,
          actual: this.dataSource.data[l][this.dataSource.timeIndex]
        });
      }
    } // draw vertical lines


    Draw.Stroke(this.ctx, ctx => {
      verticalLines.forEach((val, ind) => {
        ctx.moveTo(val.display, this.style.padding.top);
        ctx.lineTo(val.display, this.style.position.bottom);
      });
    }, this.style.grid.color.y);
    this.coord.verticalLines = verticalLines;
  }

  drawMainSeries() {
    // draw the first series as main series
    var mainSeries = this.dataSource.series[0];

    if (mainSeries.type === 'linear') {
      var points = []; // points position calculation

      this.panes.forEach((pane, index) => {
        var panePoints = [];
        pane.paneData.forEach(item => {
          var x = item.x;
          var y = ~~Utils.Coord.linearActual2Display(item[mainSeries.valIndex], this.coord.y);
          panePoints.push([x, y]);
        });
        points.push(panePoints);
      }); // use points position to draw line
      // loop panes then loop points in panes

      Draw.Stroke(this.ctx, ctx => {
        ctx.lineWidth = this.dataStyle.mountain.lineWidth;
        points.forEach(panePoints => {
          panePoints.forEach((point, index) => {
            if (!index) ctx.moveTo(point[0], point[1]);
            ctx.lineTo(point[0], point[1]);
          });
        });
      }, this.dataStyle.mountain.lineColor); // draw gradient

      var gradient = this.ctx.createLinearGradient(0, 0, 0, this.style.position.bottom - this.style.padding.top);
      gradient.addColorStop(0, this.dataStyle.mountain.gradientUp);
      gradient.addColorStop(1, this.dataStyle.mountain.gradientDown);
      points.forEach(panePoints => {
        if (panePoints.length) Draw.Fill(this.ctx, ctx => {
          ctx.moveTo(panePoints[0][0], this.style.position.bottom);
          panePoints.forEach((point, index) => {
            ctx.lineTo(point[0], point[1]);
          });
          ctx.lineTo(panePoints[panePoints.length - 1][0], this.style.position.bottom);
          ctx.closePath();
        }, gradient);
      });
    } else {
      var series = this.dataSource.series[0];
      var lines = {
        up: [],
        down: []
      };
      var boxes = {
        up: [],
        down: []
      };
      var peaks = [];
      if (series.type !== 'candlestick') return;
      var filteredData = this.filterResult.filteredData;
      filteredData.forEach((item, index) => {
        var h = ~~Utils.Coord.linearActual2Display(item[series.h], this.coord.y);
        var o = ~~Utils.Coord.linearActual2Display(item[series.o], this.coord.y);
        var c = ~~Utils.Coord.linearActual2Display(item[series.c], this.coord.y);
        var l = ~~Utils.Coord.linearActual2Display(item[series.l], this.coord.y);
        var direction = c === o && index > 0 ? filteredData[index - 1][series.c] < item[series.c] ? 'up' : 'down' : c < o ? 'up' : 'down';
        lines[direction].push([~~item.x, l, h]);
        var w = this.viewport.width - 2;
        boxes[direction].push([item.x - w / 2 + 1, o > c ? c : o, w - 2, Math.abs(o - c), o, c, ~~item.x]);
        peaks.push([~~item.x, c]);
      });

      for (var direction in lines) {
        if (series.as === 'OHLC') Draw.Stroke(this.ctx, ctx => {
          ctx.lineWidth = ~~(this.viewport.width / 10);
          if (ctx.lineWidth > 1) ctx.lineWidth += ctx.lineWidth % 2 ? 0 : 1;
          lines[direction].forEach(line => {
            ctx.moveTo(line[0] + 0.5, line[1]);
            ctx.lineTo(line[0] + 0.5, line[2]);
          });
        }, this.dataStyle.OHLC[direction]);else if (series.as === 'mountain') ; else Draw.Stroke(this.ctx, ctx => {
          lines[direction].forEach(line => {
            ctx.moveTo(line[0] + 0.5, line[1] + 0.5);
            ctx.lineTo(line[0] + 0.5, line[2] + 0.5);
          });
        }, this.dataStyle.candlestick.wick[direction]);
      }

      for (var direction in boxes) {
        if (series.as === 'OHLC') Draw.Stroke(this.ctx, ctx => {
          boxes[direction].forEach(box => {
            ctx.lineWidth = ~~(this.viewport.width / 10);
            if (ctx.lineWidth > 1) ctx.lineWidth += ctx.lineWidth % 2 ? 0 : 1;
            ctx.moveTo(box[0] + 1, box[4] + 0.5);
            ctx.lineTo(box[6] + 1 + (ctx.lineWidth - 1) / 2, box[4] + 0.5);
            ctx.moveTo(box[0] + box[2], box[5] + 0.5);
            ctx.lineTo(box[6] - (ctx.lineWidth - 1) / 2, box[5] + 0.5);
          });
        }, this.dataStyle.OHLC[direction]);else if (series.as === 'mountain') ; else Draw.FillnStroke(this.ctx, ctx => {
          boxes[direction].forEach(box => {
            ctx.rect(~~box[0] + 0.5, box[1] + 0.5, box[2], box[3] + 0.02); // + 0.02 is for IE fix
          });
        }, this.dataStyle.candlestick.block[direction], this.dataStyle.candlestick.border[direction]);
      }

      if (series.as == 'mountain') {
        Draw.Stroke(this.ctx, ctx => {
          ctx.lineWidth = this.dataStyle.mountain.lineWidth;
          peaks.forEach((peak, index) => {
            if (!index) ctx.moveTo(peak[0], peak[1]);
            ctx.lineTo(peak[0], peak[1]);
          });
        }, this.dataStyle.mountain.lineColor);
        var gradient = this.ctx.createLinearGradient(0, 0, 0, this.style.position.bottom - this.style.padding.top);
        gradient.addColorStop(0, this.dataStyle.mountain.gradientUp);
        gradient.addColorStop(1, this.dataStyle.mountain.gradientDown);
        Draw.Fill(this.ctx, ctx => {
          ctx.moveTo(peaks[0][0], this.style.position.bottom);
          peaks.forEach((peak, index) => {
            ctx.lineTo(peak[0], peak[1]);
          });
          ctx.lineTo(peaks[peaks.length - 1][0], this.style.position.bottom);
          ctx.closePath();
        }, gradient);
      }
    }
  }

  drawSubSeries() {
    if (this.dataSource.timeRanges) {
      this.dataSource.series.forEach(series => {
        LinearIndicatorPainter[series.type] && LinearIndicatorPainter[series.type].call(this, this.ctx, { ...series,
          bottom: this.style.position.bottom
        }, this.panes, this.coord);
      });
    } else {
      this.dataSource.series.forEach(series => {
        CandleStickIndicatorPainter[series.type] && CandleStickIndicatorPainter[series.type].call(this, this.ctx, series, this.filterResult.filteredData, this.coord);
      });
    }
  }

  drawAxis() {
    // clear axis region
    Draw.Fill(this.ctx, ctx => {
      ctx.rect(0, 0, this.originWidth, this.style.padding.top);
      ctx.rect(0, 0, this.style.padding.left, this.originHeight);
      ctx.rect(this.style.position.right, 0, this.style.padding.right, this.originHeight);
      ctx.rect(0, this.style.position.bottom, this.originWidth, this.style.padding.bottom);
    }, this.style.axis.bgColor); // start position of the yAxis

    const x = this.style.axis.yAxisPos === 'right' ? this.style.position.right : 0;
    const y = this.style.axis.xAxisPos === 'bottom' ? this.style.position.bottom : this.style.padding.top;
    var xLinePos = this.style.axis.yAxisPos === 'right' ? this.style.position.right : this.style.padding.left;
    var xLinePosOp = this.style.axis.yAxisPos === 'right' ? this.style.padding.left : this.style.position.right;
    var yOp = this.style.axis.xAxisPos === 'bottom' ? this.style.padding.top : this.style.position.bottom; // draw axis lines

    Draw.Stroke(this.ctx, ctx => {
      this.coord.horizLines.forEach(y => {
        ctx.moveTo(xLinePos, y.display);
        ctx.lineTo(xLinePos + this.style.axis.pointerLength * this.style.axis.yAxisPos, y.display);
      });
      this.coord.verticalLines.forEach(x => {
        ctx.moveTo(x.display, y);
        ctx.lineTo(x.display, y + this.style.axis.pointerLength * this.style.axis.xAxisPos);
      }); // draw axis line

      ctx.moveTo(xLinePos + 0.5, this.style.padding.top);
      ctx.lineTo(xLinePos + 0.5, this.style.position.bottom);
      ctx.moveTo(this.style.padding.left, y + 0.5);
      ctx.lineTo(this.style.position.right, y + 0.5);

      if (this.style.axis.drawFrame) {
        ctx.moveTo(xLinePosOp + 0.5, this.style.padding.top);
        ctx.lineTo(xLinePosOp + 0.5, this.style.position.bottom);
        ctx.moveTo(this.style.padding.left, yOp + 0.5);
        ctx.lineTo(this.style.position.right, yOp + 0.5);
      }

      if (this.style.axis.showRate) {
        var rateX = this.style.axis.yAxisPos > 0 ? this.style.padding.left : this.style.position.right;
        ctx.moveTo(rateX + 0.5, this.style.padding.top);
        ctx.lineTo(rateX + 0.5, this.style.position.bottom);
        this.coord.horizLines.forEach(y => {
          ctx.moveTo(rateX, y.display);
          ctx.lineTo(rateX + this.style.axis.pointerLength * -this.style.axis.yAxisPos, y.display);
        });
      }
    }, this.style.axis.lineColor); // draw labels

    var rates = {
      up: [],
      down: []
    };
    Draw.Text(this.ctx, ctx => {
      this.coord.horizLines.forEach((y, index) => {
        var val = y.actual.toFixed(this.pricePrecision);
        var xOffset = this.style.axis.labelPos.yAxis.x;
        var yPos = y.display + this.style.axis.labelPos.yAxis.y;
        if (yPos < 10) yPos += 10;
        if (yPos > this.originHeight - 10) yPos -= 10;
        ctx.fillText(val, x + this.style.axis.pointerLength + xOffset, yPos);
      });

      if (!this.dataSource.timeRanges) {
        this.coord.verticalLines.forEach(x => {
          ctx.fillText(Utils.Coord.getDateStr(x.actual, this.style.axis.hideCandlestickDate, this.style.axis.hideCandlestickTime), x.display + this.style.axis.labelPos.xAxis.x + ((this.style.axis.hideCandlestickDate || this.style.axis.hideCandlestickTime) && 15), y + this.style.axis.labelPos.xAxis.y * this.style.axis.xAxisPos);
        });
      } else {
        this.dataSource.timeRanges.forEach((range, index) => {
          var width = this.style.position.right - this.style.padding.left;
          var displayRange = [index * width / this.dataSource.timeRanges.length, (index + 1) * width / this.dataSource.timeRanges.length];

          if (this.dataSource.timeRangesRatio) {
            var widthRatio = this.dataSource.timeRangesRatio;
            var prevRatio = widthRatio.slice(0, index).reduce((acc, x) => {
              return acc + x;
            }, 0);
            var ratio = widthRatio[index];
            var left = Math.round(this.style.padding.left + prevRatio * width);
            var right = Math.round(left + ratio * width);
            displayRange = [left, right];
          }

          ctx.fillText(Utils.Coord.getDateStr(range[0], true), displayRange[0] + 5, y + this.style.axis.labelPos.xAxis.y * this.style.axis.xAxisPos);
          var strWidth = ctx.measureText(Utils.Coord.getDateStr(range[1], true)).width;
          ctx.fillText(Utils.Coord.getDateStr(range[1], true), displayRange[1] - strWidth - 5, y + this.style.axis.labelPos.xAxis.y * this.style.axis.xAxisPos);
        });
      }

      if (this.style.axis.showRate) {
        var rateX = this.style.axis.yAxisPos > 0 ? 0 : this.style.position.right;
        this.coord.horizLines.forEach((y, index) => {
          var val = (y.actual - this.dataSource.baseValue) / this.dataSource.baseValue;
          var xOffset = ctx.measureText(val.toFixed(2) + '%').width + this.style.axis.labelPos.yAxis.x;
          var yPos = y.display + this.style.axis.labelPos.yAxis.y;
          if (yPos < 10) yPos += 10;
          if (yPos > this.originHeight - 10) yPos -= 10;
          if (val === 0) ctx.fillText(val.toFixed(2) + '%', rateX + this.style.axis.pointerLength + xOffset * this.style.axis.yAxisPos, yPos);else {
            rates[val > 0 ? 'up' : 'down'].push([(val * 100).toFixed(2) + '%', rateX + this.style.axis.pointerLength + xOffset * this.style.axis.yAxisPos, yPos]);
          }
        });
      }
    }, this.style.axis.labelColor);

    for (var direction in rates) {
      Draw.Text(this.ctx, ctx => {
        rates[direction].forEach(item => {
          ctx.fillText(item[0], item[1], item[2]);
        });
      }, this.dataStyle.OHLC[direction]);
    }
  }

  drawAdditionalTips() {
    if (this.dataSource.timeRanges !== undefined && this.dataSource.baseValue !== undefined) {
      var y = ~~Utils.Coord.linearActual2Display(this.dataSource.baseValue, this.coord.y);
      Draw.Stroke(this.ctx, ctx => {
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.moveTo(this.style.padding.left, y);
        ctx.lineTo(this.style.position.right, y);
      }, this.dataStyle.baseValue);
    } // draw current price


    if (this.dataSource.data.length > 0) {
      if (this.dataSource.series[0].type === 'candlestick' || this.dataSource.series[0].type === 'linear') {
        const x = this.style.axis.yAxisPos === 'right' ? this.style.position.right : 0;
        const width = this.style.axis.yAxisPos === 'right' ? this.style.padding.right : this.style.padding.left;
        const last = this.dataSource.data[this.dataSource.data.length - 1];
        const value = last[this.dataSource.series[0].c === undefined ? this.dataSource.series[0].valIndex : this.dataSource.series[0].c];
        const y = ~~Utils.Coord.linearActual2Display(value, this.coord.y);
        Draw.Stroke(this.ctx, ctx => {
          ctx.lineWidth = this.style.tip.currPrice.lineWidth;
          ctx.moveTo(this.style.padding.left, y + 0.5);
          ctx.lineTo(this.style.position.right, y + 0.5);
        }, this.style.tip.currPrice.lineColor);
        Draw.Fill(this.ctx, ctx => {
          ctx.rect(x, y - this.style.tip.currPrice.labelHeight / 2, width, this.style.tip.currPrice.labelHeight);
        }, this.style.tip.currPrice.labelBg);
        Draw.Text(this.ctx, ctx => {
          ctx.fillText(value.toFixed(this.pricePrecision), x + this.style.axis.pointerLength + this.style.axis.labelPos.yAxis.x, y + 5);
        }, this.style.tip.currPrice.labelColor);
      }
    } // draw highest and lowest price


    if (this.dataSource.series[0].type === 'candlestick') {
      var max = this.filterResult.filteredData[0];
      var min = this.filterResult.filteredData[0];
      var highIndex = this.dataSource.series[0].h;
      var lowIndex = this.dataSource.series[0].l;

      if (this.dataSource.series[0].as === 'mountain') {
        highIndex = this.dataSource.series[0].c;
        lowIndex = this.dataSource.series[0].c;
      }

      this.filterResult.filteredData.forEach(item => {
        if (item[highIndex] > max[highIndex]) max = item;
        if (item[lowIndex] < min[lowIndex]) min = item;
      });
      var maxVal = max[highIndex].toFixed(this.pricePrecision);
      var maxY = ~~Utils.Coord.linearActual2Display(max[highIndex], this.coord.y) + 0.5;
      var minVal = min[lowIndex].toFixed(this.pricePrecision);
      var minY = ~~Utils.Coord.linearActual2Display(min[lowIndex], this.coord.y) + 0.5;
      Draw.Stroke(this.ctx, ctx => {
        ctx.setLineDash([5, 5]);
        ctx.moveTo(this.style.padding.left, maxY);
        ctx.lineTo(this.style.position.right, maxY);
      }, this.style.tip.highColor);
      Draw.Stroke(this.ctx, ctx => {
        ctx.setLineDash([5, 5]);
        ctx.moveTo(this.style.padding.left, minY);
        ctx.lineTo(this.style.position.right, minY);
      }, this.style.tip.lowColor);
      Draw.Text(this.ctx, ctx => {
        var width = ctx.measureText(maxVal).width;
        ctx.fillText(maxVal, this.style.position.right + this.style.axis.pointerLength + this.style.axis.labelPos.yAxis.x, maxY + 5);
      }, this.style.tip.highColor);
      Draw.Text(this.ctx, ctx => {
        var width = ctx.measureText(minVal).width;
        ctx.fillText(minVal, this.style.position.right + this.style.axis.pointerLength + this.style.axis.labelPos.yAxis.x, minY + 5);
      }, this.style.tip.lowColor);
    }
  }

}

class Chart {
  constructor(container, pattern, noRender) {
    // prevent same data for different charts
    pattern.dataSource.data = JSON.parse(JSON.stringify(pattern.dataSource.data));
    Utils.Safe.dataCheck(pattern.dataSource);
    const {
      canvasEl,
      iaCanvasEl,
      midCanvasEl
    } = this.genCanvasLayer(container);
    this.originWidth = canvasEl.width;
    this.originHeight = canvasEl.height;
    this.ctx = this.genCtx(canvasEl);
    this.iaCtx = this.genCtx(iaCanvasEl);
    this.midCtx = this.genCtx(midCanvasEl);
    this.state = {
      ready: 0,
      ctxClock: 0,
      iaCtxClock: 0,
      midCtxInterval: 0
    };
    this.linkedCharts = Utils.DataTypes.Set();
    this.defaults = DEFAULTS() // setting chart properties
    // let dict = ['viewport', 'pricePrecision', 'style', 'dataStyle', 'dataSource']
    ;
    ['viewport', 'pricePrecision', 'dataStyle', 'style', 'dataSource'].forEach(key => {
      this[key] = pattern[key] || this.defaults[key];
    });
    this.render = new Render();
    console.log(this.render);
    this.genStyle(); // this.events = this.genDefaultEvents()
    // this.bindEvents()

    if (!noRender) this.rerender();
  }

  genCanvasLayer(container) {
    const canvasMain = document.createElement('canvas');
    const canvasIa = document.createElement('canvas');
    const canvasMid = document.createElement('canvas');
    canvasMain.width = canvasIa.width = canvasMid.width = container.clientWidth;
    canvasMain.height = canvasIa.height = canvasMid.height = container.clientHeight;
    canvasMain.style.position = canvasIa.style.position = canvasMid.style.position = 'absolute';
    canvasMain.style.top = canvasIa.style.top = canvasMid.style.top = 0;
    canvasMain.style.left = canvasIa.style.left = canvasMid.style.left = 0;
    if (!container.style.position || container.style.position === 'static') container.style.position = 'relative';
    container.innerHTML = '';
    container.appendChild(canvasMain);
    container.appendChild(canvasMid);
    container.appendChild(canvasIa);
    return {
      canvasEl: canvasMain,
      iaCanvasEl: canvasIa,
      midCanvasEl: canvasMid
    };
  }

  genCtx(canvasEl) {
    const dpr = window ? window.devicePixelRatio : 1;
    const ctx = canvasEl.getContext('2d');
    canvasEl.style.width = canvasEl.width + 'px';
    canvasEl.style.height = canvasEl.height + 'px';
    canvasEl.width *= dpr;
    canvasEl.height *= dpr;
    ctx.scale(dpr, dpr);
    return ctx;
  }

  genStyle() {
    this.ctx.font = this.style.font.size + 'px ' + this.style.font.family;
    this.iaCtx.font = this.ctx.font; // this.style.padding.rightPos = this.originWidth - this.style.padding.right
    // this.style.position.bottom = this.originHeight - this.style.padding.bottom

    this.style.position = {
      left: this.style.padding.left,
      top: this.style.padding.top,
      right: this.originWidth - this.style.padding.right,
      bottom: this.originHeight - this.style.padding.bottom
    };
  }

  rerender(force) {
    if (!force && +new Date() - this.state.ctxClock <= 30) return; // var self = this;

    this.state.ctxClock = +new Date();
    this.state.ready = 0;
    this.clean();
    Utils.Draw.Fill(this.ctx, ctx => {
      ctx.rect(0, 0, this.originWidth, this.originHeight);
    }, this.style.grid.bg);

    if (this.dataSource.timeRanges) {
      this.render.genLinearCoord.call(this);
      this.render.drawGrid.call(this);
      this.render.drawMainSeries.call(this);
      this.render.drawSubSeries.call(this);
      this.render.drawAxis.call(this);
      this.render.drawAdditionalTips.call(this);
    } else {
      this.render.genCsCoord.call(this);
      this.render.drawGrid.call(this);
      this.render.drawMainSeries.call(this);
      this.render.drawSubSeries.call(this);
      this.render.drawAxis.call(this);
      this.render.drawAdditionalTips.call(this);
    }

    this.state.ready = 1; // rerender all linked charts

    if (this.linkedCharts.length()) {
      this.linkedCharts.forEach(chart => {
        chart.viewport = this.viewport;
        chart.rerender();
      });
    }
  }

  clean(e, name, force) {
    this.iaCtx.clearRect(0, 0, this.originWidth, this.originHeight); // rerender all linked charts

    if (this.linkedCharts.length() && !force) {
      this.linkedCharts.forEach(chart => {
        chart.events.mouseout.clean.call(chart, null, 'clean', true);
      });
    }
  }

} // console.log(1, render)
// Object.assign(Chart.prototype, render)


console.log(Chart.prototype);

export { Chart };
