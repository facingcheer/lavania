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
    getDistance(p1, p2) {
      var xDiff = p1.clientX - p2.clientX;
      var yDiff = p1.clientY - p2.clientY;
      return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    },

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
        data: result,
        leftOffset: leftOffset,
        rightOffset: rightOffset,
        viewport
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
      let diff = range[1] - range[0];
      if (!diff) diff = 0.001;
      let precision = 1;

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

        points.push([newRange[0] - interval, ...newRange, newRange[newRange.length - 1] + interval]);
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

    seekNeatPointsOld(range, count) {
      let diff = range[1] - range[0];
      if (!diff) diff = 0.001;
      let precision = 1;

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

    halfcandleWidth(columnWidth) {
      let half = ~~((columnWidth - 3) / 2);
      let sixtyPercent = ~~(columnWidth * 0.3);
      half = Math.min(sixtyPercent, half);
      if (half < 1) half = 1;
      return half;
    },

    calcYRange(data, series) {
      var yMax = Number.MIN_VALUE;
      var yMin = Number.MAX_VALUE;
      data.forEach(d => {
        series.forEach(s => {
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
    adjustYRange(yRange, touchTop, style, baseValue, pricePrecision) {
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

      if (yActual[0] === yActual[1]) {
        let offset = yActual[0] / 100;
        yActual[0] -= offset || 1 / Math.pow(10, pricePrecision);
        yActual[1] += offset || 0.001; // maybe better generate by precision
      }

      return yActual;
    }

  },
  Grid: {
    lineCount(display, limit, span) {
      let count = ~~(Math.abs(display[0] - display[1]) / span);
      return count > limit.max ? limit.max : count < limit.min ? limit.min : count;
    },

    calcGridLines(actual, lineCount, baseValue) {
      let lines = [];

      if (baseValue === undefined) {
        // no base value line specified
        lines = Utils.Coord.seekNeatPoints(actual, lineCount);
      } else {
        // with base value line
        let hm = Utils.Coord.seekNeatPoints([actual[0], baseValue], lineCount / 2 - 1);
        lines = [...hm.slice(0, -1), ...hm.reverse().map(h => 2 * baseValue - h)];
      }

      return lines;
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
      lastDot: {
        show: true
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
        // position of xAxis label, can be 'bottom' or 'top'
        yAxisPos: 'right',
        // position of yAxis label, can be 'right' or 'left'
        hideCandlestickDate: false,
        // 隐藏蜡烛图的日期
        hideCandlestickTime: false,
        // 隐藏蜡烛图的小时分钟
        hideBorder: false,
        // 显示图表border
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
        bgColor: 'rgba(0,0,0,0)',
        // 坐标轴背景色
        lineColor: 'rgba(0,0,0,1)',
        // 坐标轴线颜色
        showScale: false,
        //是否显示刻度
        scaleLength: 10,
        // 刻度长度
        showBorder: false // 是否绘制线框

      }
    },
    dataStyle: {
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

function linePainter (ctx, data, coord, seriesConf, decorators) {
  const points = [];
  data.forEach(item => {
    points.push({
      x: item.x,
      y: Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coord.y)
    });
  });
  Draw.Stroke(ctx, ctx => {
    ctx.lineWidth = seriesConf.lineWidth || 1;
    points.forEach((point, index) => {
      if (!index) ctx.moveTo(point.x, point.y);
      ctx.lineTo(point.x, point.y);
    });
  }, seriesConf.color);

  if (decorators && decorators.length) {
    decorators.forEach(d => {
      if (typeof d === 'function') {
        d(points, seriesConf);
      }
    });
  }
}

const calcOHLC = (data, coord, seriesConf) => {
  const res = {
    up: [],
    down: []
  };
  data.forEach((item, index) => {
    const o = ~~Utils.Coord.linearActual2Display(item[seriesConf.o], coord.y);
    const c = ~~Utils.Coord.linearActual2Display(item[seriesConf.c], coord.y);
    const h = ~~Utils.Coord.linearActual2Display(item[seriesConf.h], coord.y);
    const l = ~~Utils.Coord.linearActual2Display(item[seriesConf.l], coord.y);
    const direction = c === o && index > 0 ? data[index - 1][seriesConf.c] < item[seriesConf.c] ? 'up' : 'down' : c < o ? 'up' : 'down';
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
    Draw.Stroke(ctx, ctx => {
      candles[direction].forEach(line => {
        ctx.moveTo(line.x + 0.5, line.low + 0.5);
        ctx.lineTo(line.x + 0.5, line.high + 0.5);
      });
    }, wickColor[direction]);
  }
}

function drawCandle(ctx, candles, columnWidth, blockColor, borderColor) {
  let half = Utils.Coord.halfcandleWidth(columnWidth);

  for (let direction in candles) {
    Draw.FillnStroke(ctx, ctx => {
      candles[direction].forEach(candle => {
        ctx.rect(~~(candle.x - half) + 0.5, ~~Math.min(candle.open, candle.close) + 0.5, half * 2, ~~Math.abs(candle.open - candle.close)); // + 0.02 is for IE fix
      });
    }, blockColor[direction], borderColor[direction]);
  }
}

function candlestickPainter (ctx, data, coord, seriesConf) {
  const candles = calcOHLC(data, coord, seriesConf);
  drawWicks(ctx, candles, seriesConf.style.candlestick.wick);
  drawCandle(ctx, candles, coord.viewport.width, seriesConf.style.candlestick.block, seriesConf.style.candlestick.border);
}

function drawOHLC(ctx, OHLC, columnWidth, ohlcColor) {
  let half = Utils.Coord.halfcandleWidth(columnWidth);
  let lineWidth = ~~(columnWidth / 10);
  if (lineWidth > 1) lineWidth += ctx.lineWidth % 2 ? 0 : 1;

  for (let direction in OHLC) {
    Draw.Stroke(ctx, ctx => {
      ctx.lineWidth = lineWidth;
      OHLC[direction].forEach(ohlc => {
        ctx.moveTo(ohlc.x + 0.5, ohlc.low);
        ctx.lineTo(ohlc.x + 0.5, ohlc.high);
        ctx.moveTo(~~(ohlc.x - half) + 0.5, ohlc.open);
        ctx.lineTo(ohlc.x, ohlc.open);
        ctx.moveTo(~~(ohlc.x + half) + 0.5, ohlc.close);
        ctx.lineTo(ohlc.x, ohlc.close); // ctx.rect(~~(ochl.x - half) + 0.5 , ~~Math.min(candle.open, candle.close) + 0.5, half * 2 ,~~Math.abs(candle.open - candle.close)) // + 0.02 is for IE fix
      });
    }, ohlcColor[direction]);
  }
}

function ohlcPainter (ctx, data, coord, seriesConf) {
  const OHLC = calcOHLC(data, coord, seriesConf);
  console.log('OHLC', coord);
  drawOHLC(ctx, OHLC, coord.viewport.width, seriesConf.style.OHLC);
}

function columnPainter (ctx, data, coord, seriesConf, bottom) {
  let columns = {
    up: [],
    down: [],
    eq: []
  };
  data.forEach((item, index) => {
    var val = item[seriesConf.valIndex];
    var baseVal = seriesConf.baseVal !== undefined ? seriesConf.baseVal : seriesConf.baseIndex !== undefined ? item[seriesConf.baseIndex] : null;
    if (baseVal !== null) columns[val >= baseVal ? 'up' : 'down'].push(item);
    if (seriesConf.detect) columns[seriesConf.detect(item, index, data)].push(item);
  }); // a股K线下面的图换成矩形画法

  var coordY = seriesConf.linearMode ? {
    actual: [0, coord.y.actual[1]],
    display: coord.y.display
  } : coord.y;
  const half = Utils.Coord.halfcandleWidth(coord.viewport.width);

  for (var direction in columns) {
    Draw.FillnStroke(ctx, ctx => {
      columns[direction].forEach(item => {
        if (seriesConf.mode === 'bidirection') {
          ctx.rect(~~(item.x - half) + 0.5, ~~Utils.Coord.linearActual2Display(seriesConf.baseVal, coordY) + 0.5, half * 2, ~~(Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coordY) - Utils.Coord.linearActual2Display(seriesConf.baseVal, coordY)) + 0.02); // + 0.02 is for IE fix
        } else {
          ctx.rect(~~(item.x - half) + 0.5, ~~coordY.display[0] + 0.5, half * 2, ~~(Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coordY) - ~~coordY.display[0]) + 0.02); // + 0.02 is for IE fix
          // ctx.rect(~~(item.x - (coord.viewport.width - 4) / 2) + 0.5,
          // ~~coord.y.display[1] + 0.5,
          // coord.viewport.width - 4,
          // ~~(Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coordY) -
          // ~~coord.y.display[1]) + 0.02) // + 0.02 is for IE fix
        }
      });
    }, seriesConf.style.column.block[direction], seriesConf.style.column.border[direction]);
  }
}

function panesColumnPainter (ctx, panes, coord, seriesConf, bottom) {
  const columns = {
    up: [],
    down: [],
    eq: []
  };
  panes.forEach((pane, paneIndex) => {
    pane.paneData.forEach((item, bIndex) => {
      let val = item[seriesConf.valIndex];
      if (!bIndex) item.isFirst = true;
      if (bIndex === pane.paneData.length - 1 && paneIndex !== panes.length - 1) item.isLast = true; // make some changes to base define

      var baseVal = seriesConf.baseVal !== undefined ? seriesConf.baseVal : seriesConf.baseIndex !== undefined ? item[seriesConf.baseIndex] : null;
      if (baseVal !== null) columns[val >= baseVal ? 'up' : 'down'].push(item);
      if (seriesConf.color.detect) columns[seriesConf.color.detect(item, bIndex, pane.paneData, paneIndex, panes)].push(item);
    });
  });

  for (let direction in columns) {
    Draw.FillnStroke(ctx, ctx => {
      columns[direction].forEach(item => {
        let half = seriesConf.lineWidth / 2 || 1;

        if (item.x + half > coord.x.display[1]) {
          item.isLast = true;
        }

        if (item.isFirst || item.isLast) {
          half = half / 2;
        }

        let posX = item.isFirst ? item.x : item.isLast ? item.x - half * 2 : item.x - half;
        let baseVal = seriesConf.baseVal !== undefined ? seriesConf.baseVal : seriesConf.baseIndex !== undefined ? item[seriesConf.baseIndex] : null;

        if (seriesConf.mode === 'bidirection') {
          ctx.rect(~~posX + 0.5, ~~Utils.Coord.linearActual2Display(baseVal, coord.y) + 0.5, half * 2, ~~Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coord.y) - ~~Utils.Coord.linearActual2Display(baseVal, coord.y) + 0.02);
        } else {
          ctx.rect(~~posX + 0.5, ~~seriesConf.bottom ? seriesConf.bottom + 0.5 : 0.5, half * 2, ~~Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coord.y) - ~~Utils.Coord.linearActual2Display(baseVal, coord.y) + 0.02);
        }
      });
    }, seriesConf.color[direction], seriesConf.color[direction]);
  }
}

function mountainPainter (ctx, data, coord, seriesConf) {
  const decorators = [];
  decorators.push(function gradientDecorator(points, seriesConf) {
    // draw gradient
    var gradient = ctx.createLinearGradient(0, 0, 0, coord.y.display[0] - coord.y.display[1]);
    gradient.addColorStop(0, seriesConf.style.mountain.gradientUp);
    gradient.addColorStop(1, seriesConf.style.mountain.gradientDown);
    Draw.Fill(ctx, ctx => {
      ctx.moveTo(points[0].x, coord.y.display[0]);
      points.forEach((point, index) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.lineTo(points[points.length - 1].x, coord.y.display[0]);
      ctx.closePath();
    }, gradient);
  });
  return linePainter(ctx, data, coord, seriesConf, decorators);
}

var Painter = {
  line: linePainter,
  candlestick: candlestickPainter,
  OHLC: ohlcPainter,
  column: columnPainter,
  panesColumn: panesColumnPainter,
  mountain: mountainPainter
};

class Render {
  constructor(dataSource, style, ctx) {// dataSource = dataSource
    // style = style
    // ctx = ctx
  }

  genPanes() {
    const {
      dataSource,
      style
    } = this;
    const {
      data,
      timeIndex,
      timeRanges,
      timeRangesRatio
    } = dataSource;
    let chartWidth = style.position.right - style.padding.left;
    const paneData = Utils.Coord.datafilterByTimeRanges(data, timeRanges, timeIndex);
    const paneCoords = timeRanges.map((range, index) => {
      // calc each panes position-x
      let left, right;

      if (timeRangesRatio) {
        let prevRatio = timeRangesRatio.slice(0, index).reduce((acc, x) => {
          return acc + x;
        }, 0);
        left = Math.round(style.padding.left + prevRatio * chartWidth);
        right = Math.round(left + dataSource.timeRangesRatio[index] * chartWidth);
      } else {
        const coordWidth = chartWidth / dataSource.timeRanges.length;
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

    paneData.forEach((pane, index) => {
      pane.forEach(item => {
        item.x = ~~Utils.Coord.linearActual2Display(item[dataSource.timeIndex], paneCoords[index].x);
      });
    });
    this.panes = paneCoords.map((paneCoord, index) => ({
      paneCoord,
      paneData: paneData[index]
    }));
    this.filterData = {
      data: paneData.flat()
    };
  }

  filterData() {
    const {
      viewport,
      style,
      dataSource
    } = this;
    const {
      data
    } = dataSource;
    this.filterData = Utils.Coord.dataFilterByViewport(data, viewport, style);
  }

  genCoord() {
    // for data with no timeRanges,
    // use offset & width of data to calc data
    const {
      viewport,
      style,
      filterData,
      dataSource,
      pricePrecision
    } = this;
    const {
      series,
      timeIndex,
      baseValue,
      touchTop
    } = dataSource; // calculate actual-x-range of data

    let xActual = [filterData.data[0][timeIndex], filterData.data[filterData.data.length - 1][timeIndex]]; // calculate actual range of data

    let yRange = Utils.Coord.calcYRange(filterData.data, series); // yRange的初步处理，有baseValue时对称处理，最大最小值相等时增加差异

    let yActual = Utils.Coord.adjustYRange(yRange, touchTop, style, baseValue, pricePrecision); // create coord

    this.coord = {
      x: {
        display: [style.padding.left, style.position.right],
        actual: xActual
      },
      y: {
        display: [style.position.bottom, style.padding.top],
        actual: yActual
      },
      viewport
    };
    this.render.genHorizLines.call(this);
    this.render.genVerticalLines.call(this);
  }

  genHorizLines() {
    const {
      coord,
      style,
      dataSource
    } = this;
    const {
      baseValue,
      touchTop
    } = dataSource;
    let yActual = coord.y.actual;
    let horizCount = Utils.Grid.lineCount(coord.y.display, style.grid.limit.y, style.grid.span.y);
    let hGridLines = Utils.Grid.calcGridLines(coord.y.actual, horizCount, baseValue);

    if (!touchTop) {
      coord.y.actual = [hGridLines[0], hGridLines[hGridLines.length - 1]];
    }

    let horizLines = hGridLines.map(val => {
      return {
        actual: val,
        display: ~~Utils.Coord.linearActual2Display(val, coord.y) + 0.5
      };
    });
    coord.horizLines = horizLines;
  }

  genVerticalLines() {
    const {
      style,
      dataSource,
      filterData,
      viewport,
      coord,
      panes
    } = this;
    const {
      timeRanges
    } = dataSource;
    var verticalLines = [];

    if (timeRanges) {
      panes.forEach(pane => {
        verticalLines.push({
          display: pane.paneCoord.x.display[0] + 0.5,
          actual: pane.paneCoord.x.actual[0]
        });
      });
      verticalLines.push({
        display: panes[panes.length - 1].paneCoord.x.display[1] + 0.5,
        actual: panes[panes.length - 1].paneCoord.x.actual[1]
      });
    } else {
      // vertical grid line drawing for candlestick chart
      for (var l = filterData.data.length - 1; l >= 0; l -= ~~(style.grid.span.x / viewport.width)) {
        if (filterData.data[l].x > style.padding.left && filterData.data[l].x <= style.position.right) verticalLines.push({
          display: ~~filterData.data[l].x + 0.5,
          actual: filterData.data[l][dataSource.timeIndex]
        });
      }
    }

    coord.verticalLines = verticalLines;
  }

  drawGrid() {
    const {
      coord,
      style,
      ctx,
      dataSource
    } = this; // draw horizontal lines
    // debugger

    const hLines = style.axis.hideBorder ? coord.horizLines.slice(1, -1) : coord.horizLines;

    if (coord.horizLines) {
      Draw.Stroke(ctx, ctx => {
        hLines.forEach((y, index) => {
          ctx.moveTo(style.padding.left, y.display);
          ctx.lineTo(style.position.right, y.display);
        });
      }, style.grid.color.x);
    }

    const vLines = style.axis.hideBorder ? coord.verticalLines.slice(1, -1) : coord.verticalLines; // draw vertical lines

    if (coord.verticalLines) {
      Draw.Stroke(ctx, ctx => {
        vLines.forEach((val, ind) => {
          ctx.moveTo(val.display, style.padding.top);
          ctx.lineTo(val.display, style.position.bottom);
        });
      }, style.grid.color.y);
    }
  }

  drawSeries() {
    const {
      coord,
      dataSource,
      ctx,
      filterData,
      style,
      panes
    } = this;
    const {
      series,
      valueIndex
    } = dataSource;
    series.map(s => {
      if (s.type === 'line' || s.type === 'mountain' || s.type === 'candlestick' || s.type === 'OHLC') {
        Painter[s.type](ctx, filterData.data, coord, s);
      }

      if (s.type === 'column') {
        if (dataSource.timeRanges) {
          Painter.panesColumn(ctx, panes, coord, s);
        }

        if (!dataSource.timeRanges) {
          Painter.column(ctx, filterData.data, coord, s, style.position.bottom);
        }
      }
    });
  }

  drawAxis() {
    const {
      ctx,
      style,
      coord,
      dataSource,
      dataStyle,
      originHeight,
      originWidth,
      pricePrecision
    } = this;
    axisClean(this);
    let yAxis = {};
    let xAxis = {}; // flag用来标识刻度的朝向

    yAxis.flag = style.axis.yAxisPos === 'right' ? 1 : -1;
    xAxis.flag = style.axis.xAxisPos === 'bottom' ? 1 : -1; // start position of the aXis

    yAxis.xStart = ~yAxis.flag ? style.position.right : 0;
    xAxis.yStart = ~xAxis.flag ? style.position.bottom : style.padding.top;
    yAxis.scaleStart = ~yAxis.flag ? style.position.right : style.padding.left; // draw axis lines

    Draw.Stroke(ctx, ctx => {
      if (style.axis.showScale) {
        coord.horizLines.forEach(hl => {
          ctx.moveTo(yAxis.scaleStart, hl.display);
          ctx.lineTo(yAxis.scaleStart + style.axis.scaleLength * yAxis.flag, hl.display);
        });
        coord.verticalLines.forEach(vl => {
          ctx.moveTo(vl.display, xAxis.yStart);
          ctx.lineTo(vl.display, xAxis.yStart + style.axis.scaleLength * xAxis.flag);
        });
        ctx.moveTo(yAxis.scaleStart + 0.5, style.padding.top);
        ctx.lineTo(yAxis.scaleStart + 0.5, style.position.bottom);
        ctx.moveTo(style.padding.left, xAxis.yStart + 0.5);
        ctx.lineTo(style.position.right, xAxis.yStart + 0.5);
      } // draw axis line


      if (style.axis.showBorder) {
        ctx.moveTo(yAxis.scaleStart + 0.5, style.padding.top);
        ctx.lineTo(yAxis.scaleStart + 0.5, style.position.bottom);
        ctx.moveTo(style.padding.left, xAxis.yStart + 0.5);
        ctx.lineTo(style.position.right, xAxis.yStart + 0.5);
        const xOp = ~yAxis.flag ? style.padding.left : style.position.right;
        ctx.moveTo(xOp + 0.5, style.padding.top + 0.5);
        ctx.lineTo(xOp + 0.5, style.position.bottom + 0.5);
        const yOp = ~xAxis.flag ? style.padding.top : style.position.bottom;
        ctx.moveTo(style.padding.left, yOp + 0.5);
        ctx.lineTo(style.position.right, yOp + 0.5);
      }

      if (style.axis.showRate) {
        var rateX = yAxis.flag > 0 ? style.padding.left : style.position.right;
        ctx.moveTo(rateX + 0.5, style.padding.top);
        ctx.lineTo(rateX + 0.5, style.position.bottom);
        coord.horizLines.forEach(y => {
          ctx.moveTo(rateX, y.display);
          ctx.lineTo(rateX + style.axis.scaleLength * -yAxis.flag, y.display);
        });
      }
    }, style.axis.lineColor); // draw labels

    var rates = {
      up: [],
      down: []
    };
    Draw.Text(ctx, ctx => {
      coord.horizLines.forEach((y, index) => {
        const val = y.actual.toFixed(pricePrecision);
        const xOffset = style.axis.labelPos.yAxis.x;
        var yPos = y.display + style.axis.labelPos.yAxis.y;
        if (yPos < 10) yPos += 10;
        if (yPos > originHeight - 10) yPos -= 10;
        ctx.fillText(val, yAxis.xStart + style.axis.scaleLength + xOffset, yPos);
      });

      if (!dataSource.timeRanges) {
        coord.verticalLines.forEach(x => {
          ctx.fillText(Utils.Coord.getDateStr(x.actual, style.axis.hideCandlestickDate, style.axis.hideCandlestickTime), x.display + style.axis.labelPos.xAxis.x + ((style.axis.hideCandlestickDate || style.axis.hideCandlestickTime) && 15), xAxis.yStart + style.axis.labelPos.xAxis.y * xAxis.flag);
        });
      } else {
        dataSource.timeRanges.forEach((range, index) => {
          var width = style.position.right - style.padding.left;
          var displayRange = [index * width / dataSource.timeRanges.length, (index + 1) * width / dataSource.timeRanges.length];

          if (dataSource.timeRangesRatio) {
            var widthRatio = dataSource.timeRangesRatio;
            var prevRatio = widthRatio.slice(0, index).reduce((acc, x) => {
              return acc + x;
            }, 0);
            var ratio = widthRatio[index];
            var left = Math.round(style.padding.left + prevRatio * width);
            var right = Math.round(left + ratio * width);
            displayRange = [left, right];
          }

          ctx.fillText(Utils.Coord.getDateStr(range[0], true), displayRange[0] + 5, xAxis.yStart + style.axis.labelPos.xAxis.y * xAxis.flag);
          var strWidth = ctx.measureText(Utils.Coord.getDateStr(range[1], true)).width;
          ctx.fillText(Utils.Coord.getDateStr(range[1], true), displayRange[1] - strWidth - 5, xAxis.yStart + style.axis.labelPos.xAxis.y * xAxis.flag);
        });
      }

      if (style.axis.showRate) {
        var rateX = yAxis.flag > 0 ? 0 : style.position.right;
        coord.horizLines.forEach((y, index) => {
          var val = (y.actual - dataSource.baseValue) / dataSource.baseValue;
          var xOffset = ctx.measureText(val.toFixed(2) + '%').width + style.axis.labelPos.yAxis.x;
          var yPos = y.display + style.axis.labelPos.yAxis.y;
          if (yPos < 10) yPos += 10;
          if (yPos > originHeight - 10) yPos -= 10;
          if (val === 0) ctx.fillText(val.toFixed(2) + '%', rateX + style.axis.scaleLength + xOffset * yAxis.flag, yPos);else {
            rates[val > 0 ? 'up' : 'down'].push([(val * 100).toFixed(2) + '%', rateX + style.axis.scaleLength + xOffset * yAxis.flag, yPos]);
          }
        });
      }
    }, style.axis.labelColor);

    for (var direction in rates) {
      Draw.Text(ctx, ctx => {
        rates[direction].forEach(item => {
          ctx.fillText(item[0], item[1], item[2]);
        });
      }, dataStyle.OHLC[direction]);
    }
  }

  drawAdditionalTips() {
    const {
      dataSource,
      ctx,
      coord,
      style,
      filterData,
      pricePrecision,
      dataStyle
    } = this;

    if (dataSource.timeRanges !== undefined && dataSource.baseValue !== undefined) {
      var y = ~~Utils.Coord.linearActual2Display(dataSource.baseValue, coord.y);
      Draw.Stroke(ctx, ctx => {
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.moveTo(style.padding.left, y);
        ctx.lineTo(style.position.right, y);
      }, dataStyle.baseValue);
    } // draw current price


    const mainSeries = dataSource.series.find(s => s.main);

    if (dataSource.data.length > 0) {
      if (mainSeries) {
        const x = style.axis.yAxisPos === 'right' ? style.position.right : 0;
        const width = style.axis.yAxisPos === 'right' ? style.padding.right : style.padding.left;
        const last = dataSource.data[dataSource.data.length - 1];
        const value = last[mainSeries.c || mainSeries.valIndex];
        const y = ~~Utils.Coord.linearActual2Display(value, coord.y);
        Draw.Stroke(ctx, ctx => {
          ctx.lineWidth = style.tip.currPrice.lineWidth;
          ctx.moveTo(style.padding.left, y + 0.5);
          ctx.lineTo(style.position.right, y + 0.5);
        }, style.tip.currPrice.lineColor);
        Draw.Fill(ctx, ctx => {
          ctx.rect(x, y - style.tip.currPrice.labelHeight / 2, width, style.tip.currPrice.labelHeight);
        }, style.tip.currPrice.labelBg);
        Draw.Text(ctx, ctx => {
          ctx.fillText(value.toFixed(pricePrecision), x + style.axis.scaleLength + style.axis.labelPos.yAxis.x, y + 5);
        }, style.tip.currPrice.labelColor);
      }
    } // draw highest and lowest price


    if (style.lastDot.show && mainSeries && filterData && filterData.data && filterData.data.length) {
      let max = filterData.data[0];
      let min = filterData.data[0];

      if (mainSeries.type === 'candlestick' || mainSeries.type === 'OHLC') {
        var highIndex = mainSeries.h;
        var lowIndex = mainSeries.l;
      } else {
        highIndex = mainSeries.valIndex;
        lowIndex = mainSeries.valIndex;
      }

      filterData.data.forEach(item => {
        if (item[highIndex] > max[highIndex]) max = item;
        if (item[lowIndex] < min[lowIndex]) min = item;
      });
      const maxVal = max[highIndex].toFixed(pricePrecision);
      const maxY = ~~Utils.Coord.linearActual2Display(max[highIndex], coord.y) + 0.5;
      const minVal = min[lowIndex].toFixed(pricePrecision);
      const minY = ~~Utils.Coord.linearActual2Display(min[lowIndex], coord.y) + 0.5;
      Draw.Stroke(ctx, ctx => {
        ctx.setLineDash([5, 5]);
        ctx.moveTo(style.padding.left, maxY);
        ctx.lineTo(style.position.right, maxY);
      }, style.tip.highColor);
      Draw.Stroke(ctx, ctx => {
        ctx.setLineDash([5, 5]);
        ctx.moveTo(style.padding.left, minY);
        ctx.lineTo(style.position.right, minY);
      }, style.tip.lowColor);
      Draw.Text(ctx, ctx => {
        const width = ctx.measureText(maxVal).width;
        ctx.fillText(maxVal, style.position.right + style.axis.scaleLength + style.axis.labelPos.yAxis.x, maxY + 5);
      }, style.tip.highColor);
      Draw.Text(ctx, ctx => {
        const width = ctx.measureText(minVal).width;
        ctx.fillText(minVal, style.position.right + style.axis.scaleLength + style.axis.labelPos.yAxis.x, minY + 5);
      }, style.tip.lowColor);
    }
  }

}

function axisClean(chart) {
  const {
    ctx,
    style,
    originHeight,
    originWidth
  } = chart; // clear axis region
  // 用bg先刷一次 防止AXIS颜色设置成透明时 不能正确截取图表

  Draw.Fill(ctx, ctx => {
    ctx.rect(0, 0, originWidth, style.padding.top);
    ctx.rect(0, 0, style.padding.left, originHeight);
    ctx.rect(style.position.right, 0, style.padding.right, originHeight);
    ctx.rect(0, style.position.bottom, originWidth, style.padding.bottom);
  }, style.grid.bg);
  Draw.Fill(ctx, ctx => {
    ctx.rect(0, 0, originWidth, style.padding.top);
    ctx.rect(0, 0, style.padding.left, originHeight);
    ctx.rect(style.position.right, 0, style.padding.right, originHeight);
    ctx.rect(0, style.position.bottom, originWidth, style.padding.bottom);
  }, style.axis.bgColor);
}

function genEvent(type) {
  return {
    mouseMoveEvent(event) {}

  };
}

function checkTouchEvents() {
  if ('ontouchstart' in window) {
    return true;
  }
  /* eslint-disabled-next-line */


  return Boolean(window.DocumentTouch && document instanceof window.DocumentTouch);
}

const touch = !!navigator.maxTouchPoints || !!navigator.msMaxTouchPoints || checkTouchEvents();
const mobileTouch = 'onorientationchange' in window && touch; // actually we shouldn't check that values
// we even don't need to know what browser/UA/etc is (in almost all cases, except special ones)
// so, in MouseEventHandler/PaneWidget we should check what event happened (touch or mouse)
// not check current UA to detect "mobile" device

const android = /Android/i.test(navigator.userAgent);
const iOS = /iPhone|iPad|iPod|AppleWebKit.+Mobile/i.test(navigator.userAgent);
function isTouchEvent(event) {
  return Boolean(event.touches);
}

function ensureDefined(value) {
  if (value === undefined) {
    throw new Error('Value is undefined');
  }

  return value;
}
function ensureNotNull(value) {
  if (value === null) {
    throw new Error('Value is null');
  }

  return value;
}
function ensure(value) {
  return ensureNotNull(ensureDefined(value));
}

/* eslint-disable camelcase */
class MouseEventHandler {
  constructor(target, handler, preventDefault, verticalTouchScroll) {
    this._clickCount = 0;
    this._clickTimeoutId = null;
    this._lastTouchPosition = {
      x: 0,
      y: 0
    };
    this._mouseMoveStartPosition = null;
    this._moveExceededManhattanDistance = false;
    this._cancelClick = false;
    this._unsubscribeOutsideEvents = null;
    this._unsubscribeMousemove = null;
    this._unsubscribeRoot = null;
    this._startPinchMiddlePoint = null;
    this._startPinchDistance = 0;
    this._pinchPrevented = false;
    this._mousePressed = false;
    this._target = target;
    this._handler = handler;
    this._originalPreventDefault = preventDefault;
    this._preventDefault = verticalTouchScroll ? false : preventDefault;
    this._verticalTouchScroll = verticalTouchScroll;

    this._init();
  }

  _init() {
    this._target.addEventListener('mouseenter', this._mouseEnterHandler.bind(this));

    const _temp_doc = this._target.ownerDocument;

    const outsideHandlerTemp = event => {
      if (!this._handler.mouseDownOutsideEvent) {
        return;
      }

      if (event.target && this._target.contains(event.target)) {
        return;
      }

      this._handler.mouseDownOutsideEvent();
    };

    this._unsubscribeOutsideEvents = () => {
      _temp_doc.removeEventListener('mousedown', outsideHandlerTemp);

      _temp_doc.removeEventListener('touchstart', outsideHandlerTemp);
    };

    _temp_doc.addEventListener('mousedown', outsideHandlerTemp);

    _temp_doc.addEventListener('touchstart', outsideHandlerTemp);

    this._target.addEventListener('mouseleave', this._mouseLeaveHandler.bind(this));

    this._target.addEventListener('touchstart', this._mouseDownHandler.bind(this));

    if (!mobileTouch) {
      this._target.addEventListener('mousedown', this._mouseDownHandler.bind(this));
    }

    this._initPinch();
  }

  _initPinch() {
    if (this._handler.pinchStartEvent === undefined && this._handler.pinchEvent === undefined && this._handler.pinchEndEvent === undefined) {
      return;
    }

    this._target.addEventListener('touchstart', event => {
      this._checkPinchState(event.touches);
    });

    this._target.addEventListener('touchmove', event => {
      if (event.touches.length !== 2 || this._startPinchMiddlePoint === null) {
        return;
      }

      if (this._handler.pinchEvent !== undefined) {
        var currentDistance = getDistance(event.touches[0], event.touches[1]);
        var scale = currentDistance / this._startPinchDistance;

        this._handler.pinchEvent(this._startPinchMiddlePoint, scale);
      }
    }, {
      passive: false
    });

    this._target.addEventListener('touchend', event => {
      this._checkPinchState(event.touches);
    });
  }

  _makeCompatEvent(event) {
    // TouchEvent has no clientX/Y coordinates:
    // We have to use the last Touch instead
    let eventLike;

    if ('touches' in event && event.touches.length) {
      eventLike = event.touches[0];
    } else if ('changedTouches' in event && event.changedTouches.length) {
      eventLike = event.changedTouches[0];
    } else {
      eventLike = event;
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

      preventDefault() {
        if (event.cancelable) {
          event.preventDefault();
        }
      }

    };
  }

  _mouseEnterHandler(enterEvent) {
    this._unsubscribeMousemove && this._unsubscribeMousemove();

    this._unsubscribeMousemove = () => {
      this._target.removeEventListener('mousemove', this._mouseMoveHandler.bind(this));
    };

    this._target.addEventListener('mousemove', this._mouseMoveHandler.bind(this));

    mobileTouch && this._mouseMoveHandler(enterEvent);

    const compatEvent = this._makeCompatEvent(enterEvent);

    this._processEvent(compatEvent, this._handler.mouseEnterEvent);

    this._preventDefaultIfNeeded(enterEvent);
  }

  _mouseMoveHandler(moveEvent) {
    if (this._mousePressed && !mobileTouch) return;

    const compatEvent = this._makeCompatEvent(moveEvent);

    this._processEvent(compatEvent, this._handler.mouseMoveEvent);

    this._preventDefaultIfNeeded(moveEvent);
  }

  _mouseLeaveHandler(event) {
    if (this._unsubscribeMousemove) {
      this._unsubscribeMousemove();
    }

    const compatEvent = this._makeCompatEvent(event);

    this._processEvent(compatEvent, this._handler.mouseLeaveEvent);

    this._preventDefaultIfNeeded(event);
  }

  _mouseUpHandler(mouseUpEvent) {
    if ('button' in mouseUpEvent && mouseUpEvent.button !== 0
    /* Left */
    ) return;

    const compatEvent = this._makeCompatEvent(mouseUpEvent);

    this._mouseMoveStartPosition = null;
    this._mousePressed = false;

    if (this._unsubscribeRoot) {
      this._unsubscribeRoot();

      this._unsubscribeRoot = null;
    }

    if (mobileTouch || 'touches' in mouseUpEvent) {
      this._mouseLeaveHandler(mouseUpEvent);
    }

    this._processEvent(compatEvent, this._handler.mouseUpEvent);

    ++this._clickCount;

    if (this._clickTimeoutId && this._clickCount > 1) {
      this._processEvent(compatEvent, this._handler.mouseDoubleClickEvent);

      this._resetClickTimeout();
    } else {
      if (!this._cancelClick) {
        this._processEvent(compatEvent, this._handler.mouseClickEvent);
      }
    }

    this._preventDefaultIfNeeded(mouseUpEvent);

    if (mobileTouch) {
      this._mouseLeaveHandler(mouseUpEvent);
    }
  }

  _processEvent(event, eventFunc) {
    if (!eventFunc) {
      return;
    }

    eventFunc.call(this._handler, event);
  }

  _preventDefaultIfNeeded(event) {
    if (this._preventDefault && event.cancelable) {
      event.preventDefault();
    }
  }

  _mouseDownHandler(downEvent) {
    if ('button' in downEvent && downEvent.button !== 0
    /* Left */
    ) {
        return;
      }

    var compatEvent = this._makeCompatEvent(downEvent);

    this._cancelClick = false;
    this._moveExceededManhattanDistance = false;

    if (mobileTouch) {
      this._lastTouchPosition.x = compatEvent.pageX;
      this._lastTouchPosition.y = compatEvent.pageY;

      this._mouseEnterHandler(downEvent);
    }

    this._mouseMoveStartPosition = {
      x: compatEvent.pageX,
      y: compatEvent.pageY
    };

    if (this._unsubscribeRoot) {
      this._unsubscribeRoot();

      this._unsubscribeRoot = null;
    }

    {
      const mouseMoveDownHandler = this._mouseMoveWithDownHandler.bind(this);

      const mouseMoveUpHandler = this._mouseUpHandler.bind(this);

      const _root = this._target.ownerDocument.documentElement;

      this._unsubscribeRoot = () => {
        _root.removeEventListener('touchmove', mouseMoveDownHandler);

        _root.removeEventListener('touchend', mouseMoveUpHandler);

        _root.removeEventListener('mousemove', mouseMoveDownHandler);

        _root.removeEventListener('mouseup', mouseMoveUpHandler);
      };

      _root.addEventListener('touchmove', mouseMoveDownHandler, {
        passive: false
      });

      _root.addEventListener('touchend', mouseMoveUpHandler);

      if (!mobileTouch) {
        _root.addEventListener('mousemove', mouseMoveDownHandler);

        _root.addEventListener('mouseup', mouseMoveUpHandler);
      }
    }
    this._mousePressed = true;

    this._processEvent(compatEvent, this._handler.mouseDownEvent);

    if (!this._clickTimeoutId) {
      this._clickCount = 0;
      this._clickTimeoutId = setTimeout(this._resetClickTimeout.bind(this), 500
      /* ResetClick */
      );
    }

    this._preventDefaultIfNeeded(downEvent);

    if (this._preventDefault) {
      try {
        window.focus();
      } catch (er) {// empty block
      }
    }
  }

  _mouseMoveWithDownHandler(moveEvent) {
    if ('button' in moveEvent && moveEvent.button !== MouseEventButton.Left) {
      return;
    }

    if (this._startPinchMiddlePoint !== null) {
      return;
    }

    const isTouch = isTouchEvent(moveEvent);

    if (this._preventDragProcess && isTouch) {
      return;
    } // prevent pinch if move event comes faster than the second touch


    this._pinchPrevented = true;

    const compatEvent = this._makeCompatEvent(moveEvent);

    const startMouseMovePos = ensure(this._mouseMoveStartPosition);
    const xOffset = Math.abs(startMouseMovePos.x - compatEvent.pageX);
    const yOffset = Math.abs(startMouseMovePos.y - compatEvent.pageY);
    const moveExceededManhattanDistance = xOffset + yOffset > 5;

    if (!moveExceededManhattanDistance && isTouch) {
      return;
    }

    if (moveExceededManhattanDistance && !this._moveExceededManhattanDistance && isTouch) {
      // vertical drag is more important than horizontal drag
      // because we scroll the page vertically often than horizontally
      const correctedXOffset = xOffset * 0.5; // a drag can be only if touch page scroll isn't allowed

      const isVertDrag = yOffset >= correctedXOffset && !this._options.treatVertTouchDragAsPageScroll;
      const isHorzDrag = correctedXOffset > yOffset && !this._options.treatHorzTouchDragAsPageScroll; // if drag event happened then we should revert preventDefault state to original one
      // and try to process the drag event
      // else we shouldn't prevent default of the event and ignore processing the drag event

      if (!isVertDrag && !isHorzDrag) {
        this._preventDragProcess = true;
      }
    }

    if (moveExceededManhattanDistance) {
      this._moveExceededManhattanDistance = true; // if manhattan distance is more that 5 - we should cancel click event

      this._cancelClick = true;

      if (isTouch) {
        this._clearLongTapTimeout();
      }
    }

    if (!this._preventDragProcess) {
      this._processEvent(compatEvent, this._handler.pressedMouseMoveEvent); // we should prevent default in case of touch only
      // to prevent scroll of the page


      if (isTouch) {
        preventDefault(moveEvent);
      }
    }
  }

  _checkPinchState(touches) {
    if (touches.length === 1) {
      this._pinchPrevented = false;
    }

    if (touches.length !== 2 || this._pinchPrevented) {
      this._stopPinch();
    } else {
      this._startPinch(touches);
    }
  }

  _startPinch(touches) {
    var box = getBoundingClientRect(this._target);
    this._startPinchMiddlePoint = {
      x: (touches[0].clientX - box.left + (touches[1].clientX - box.left)) / 2,
      y: (touches[0].clientY - box.top + (touches[1].clientY - box.top)) / 2
    };
    this._startPinchDistance = Utils.Coord.getDistance(touches[0], touches[1]);

    if (this._handler.pinchStartEvent !== undefined) {
      this._handler.pinchStartEvent();
    }
  }

  _stopPinch() {
    if (this._startPinchMiddlePoint === null) {
      return;
    }

    this._startPinchMiddlePoint = null;

    if (this._handler.pinchEndEvent !== undefined) {
      this._handler.pinchEndEvent();
    }
  }

  _resetClickTimeout() {
    if (this._clickTimeoutId !== null) {
      clearTimeout(this._clickTimeoutId);
    }

    this._clickCount = 0;
    this._clickTimeoutId = null;
  }

  destroy() {
    if (this._unsubscribeOutsideEvents !== null) {
      this._unsubscribeOutsideEvents();

      this._unsubscribeOutsideEvents = null;
    }

    if (this._unsubscribeMousemove !== null) {
      this._unsubscribeMousemove();

      this._unsubscribeMousemove = null;
    }

    if (this._unsubscribeRoot !== null) {
      this._unsubscribeRoot();

      this._unsubscribeRoot = null;
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
    this.genStyle();
    this.events = genEvent(); // this.bindEvents()

    this._mouseEventHandler = new MouseEventHandler(iaCanvasEl, this.events, true, false);
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
    this.iaCtx.font = this.ctx.font;
    this.style.position = {
      left: this.style.padding.left,
      top: this.style.padding.top,
      right: this.originWidth - this.style.padding.right,
      bottom: this.originHeight - this.style.padding.bottom
    };
    this.dataSource.series.map(s => {
      s.style = s.style || this.dataStyle;
    });
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
      this.render.genPanes.call(this);
    } else {
      this.render.filterData.call(this);
    }

    this.render.genCoord.call(this);
    this.render.drawGrid.call(this);
    this.render.drawSeries.call(this);
    this.render.drawAxis.call(this);
    this.render.drawAdditionalTips.call(this);
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
