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
        scaleLength: 10,
        // 刻度长度
        bgColor: 'rgba(0,0,0,0)',
        // 坐标轴背景色
        lineColor: 'rgba(0,0,0,1)',
        // 坐标轴线颜色
        showBorder: true // 是否绘制线框

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
        left = Math.round(this.style.padding.left + prevRatio * chartWidth);
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
    this.filterData = {
      data: paneData.flat()
    };
  }

  filterData() {
    const {
      data
    } = this.dataSource;
    const {
      viewport,
      style
    } = this;
    this.filterData = Utils.Coord.dataFilterByViewport(data, viewport, style);
  }

  genCoord() {
    // for data with no timeRanges,
    // use offset & width of data to calc data
    const {
      series,
      timeIndex,
      baseValue,
      touchTop
    } = this.dataSource;
    const {
      viewport,
      style,
      filterData,
      pricePrecision
    } = this; // calculate actual-x-range of data

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
      style
    } = this;
    const {
      baseValue,
      touchTop
    } = this.dataSource;
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
    this.coord.horizLines = horizLines;
  }

  genVerticalLines() {
    const {
      style
    } = this;
    const {
      timeRanges
    } = this.dataSource;
    var verticalLines = [];

    if (timeRanges) {
      this.panes.forEach(pane => {
        verticalLines.push({
          display: pane.paneCoord.x.display[0] + 0.5,
          actual: pane.paneCoord.x.actual[0]
        });
      });
      verticalLines.push({
        display: this.panes[this.panes.length - 1].paneCoord.x.display[1] + 0.5,
        actual: this.panes[this.panes.length - 1].paneCoord.x.actual[1]
      });
    } else {
      // vertical grid line drawing for candlestick chart
      for (var l = this.filterData.data.length - 1; l >= 0; l -= ~~(this.style.grid.span.x / this.viewport.width)) {
        if (this.filterData.data[l].x > style.padding.left && this.filterData.data[l].x <= style.position.right) verticalLines.push({
          display: ~~this.filterData.data[l].x + 0.5,
          actual: this.filterData.data[l][this.dataSource.timeIndex]
        });
      }
    }

    this.coord.verticalLines = verticalLines;
  }

  drawGrid() {
    const {
      coord,
      style
    } = this; // draw horizontal lines

    const hLines = style.axis.hideBorder ? coord.horizLines.slice(1, -1) : coord.horizLines;

    if (coord.horizLines) {
      Draw.Stroke(this.ctx, ctx => {
        hLines.forEach((y, index) => {
          ctx.moveTo(style.padding.left, y.display);
          ctx.lineTo(style.position.right, y.display);
        });
      }, style.grid.color.x);
    }

    const vLines = style.axis.hideBorder ? coord.verticalLines.slice(1, -1) : coord.verticalLines; // draw vertical lines

    if (coord.verticalLines) {
      Draw.Stroke(this.ctx, ctx => {
        vLines.forEach((val, ind) => {
          ctx.moveTo(val.display, style.padding.top);
          ctx.lineTo(val.display, style.position.bottom);
        });
      }, style.grid.color.y);
    }
  }

  drawSeries() {
    const {
      series,
      valueIndex
    } = this.dataSource;
    const {
      coord
    } = this;
    series.map(s => {
      if (s.type === 'line' || s.type === 'mountain' || s.type === 'candlestick' || s.type === 'OHLC') {
        Painter[s.type](this.ctx, this.filterData.data, coord, s);
      }

      if (s.type === 'column') {
        if (this.dataSource.timeRanges) {
          Painter.panesColumn(this.ctx, this.panes, coord, s);
        }

        if (!this.dataSource.timeRanges) {
          Painter.column(this.ctx, this.filterData.data, coord, s, this.style.position.bottom);
        }
      }
    });
  }

  drawAxis() {
    const {
      ctx,
      style,
      originHeight,
      originWidth
    } = this;
    axisClean(this);
    let yAxis = {};
    let xAxis = {}; // flag用来标识刻度的朝向

    yAxis.flag = style.axis.yAxisPos === 'right' ? 1 : -1;
    xAxis.flag = style.axis.xAxisPos === 'bottom' ? 1 : -1; // start position of the aXis

    yAxis.xStart = ~yAxis.flag ? style.position.right : 0;
    xAxis.yStart = ~xAxis.flag ? style.position.bottom : style.padding.top;
    yAxis.scaleStart = ~yAxis.flag ? style.position.right : style.padding.left; // draw axis lines

    Draw.Stroke(this.ctx, ctx => {
      this.coord.horizLines.forEach(hl => {
        ctx.moveTo(yAxis.scaleStart, hl.display);
        ctx.lineTo(yAxis.scaleStart + style.axis.scaleLength * yAxis.flag, hl.display);
      });
      this.coord.verticalLines.forEach(vl => {
        ctx.moveTo(vl.display, xAxis.yStart);
        ctx.lineTo(vl.display, xAxis.yStart + this.style.axis.scaleLength * xAxis.flag);
      }); // draw axis line

      ctx.moveTo(yAxis.scaleStart + 0.5, this.style.padding.top);
      ctx.lineTo(yAxis.scaleStart + 0.5, this.style.position.bottom);
      ctx.moveTo(style.padding.left, xAxis.yStart + 0.5);
      ctx.lineTo(style.position.right, xAxis.yStart + 0.5);

      if (style.axis.showBorder) {
        const xOp = ~yAxis.flag ? style.padding.left : style.position.right;
        ctx.moveTo(xOp + 0.5, style.padding.top + 0.5);
        ctx.lineTo(xOp + 0.5, style.position.bottom + 0.5);
        const yOp = ~xAxis.flag ? style.padding.top : style.position.bottom;
        ctx.moveTo(this.style.padding.left, yOp);
        ctx.lineTo(this.style.position.right, yOp);
      }

      if (this.style.axis.showRate) {
        var rateX = yAxis.flag > 0 ? this.style.padding.left : this.style.position.right;
        ctx.moveTo(rateX + 0.5, this.style.padding.top);
        ctx.lineTo(rateX + 0.5, this.style.position.bottom);
        this.coord.horizLines.forEach(y => {
          ctx.moveTo(rateX, y.display);
          ctx.lineTo(rateX + this.style.axis.scaleLength * -yAxis.flag, y.display);
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
        ctx.fillText(val, yAxis.xStart + this.style.axis.scaleLength + xOffset, yPos);
      });

      if (!this.dataSource.timeRanges) {
        this.coord.verticalLines.forEach(x => {
          ctx.fillText(Utils.Coord.getDateStr(x.actual, this.style.axis.hideCandlestickDate, this.style.axis.hideCandlestickTime), x.display + this.style.axis.labelPos.xAxis.x + ((this.style.axis.hideCandlestickDate || this.style.axis.hideCandlestickTime) && 15), xAxis.yStart + this.style.axis.labelPos.xAxis.y * xAxis.flag);
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

          ctx.fillText(Utils.Coord.getDateStr(range[0], true), displayRange[0] + 5, xAxis.yStart + this.style.axis.labelPos.xAxis.y * xAxis.flag);
          var strWidth = ctx.measureText(Utils.Coord.getDateStr(range[1], true)).width;
          ctx.fillText(Utils.Coord.getDateStr(range[1], true), displayRange[1] - strWidth - 5, xAxis.yStart + this.style.axis.labelPos.xAxis.y * xAxis.flag);
        });
      }

      if (this.style.axis.showRate) {
        var rateX = yAxis.flag > 0 ? 0 : this.style.position.right;
        this.coord.horizLines.forEach((y, index) => {
          var val = (y.actual - this.dataSource.baseValue) / this.dataSource.baseValue;
          var xOffset = ctx.measureText(val.toFixed(2) + '%').width + this.style.axis.labelPos.yAxis.x;
          var yPos = y.display + this.style.axis.labelPos.yAxis.y;
          if (yPos < 10) yPos += 10;
          if (yPos > this.originHeight - 10) yPos -= 10;
          if (val === 0) ctx.fillText(val.toFixed(2) + '%', rateX + this.style.axis.scaleLength + xOffset * yAxis.flag, yPos);else {
            rates[val > 0 ? 'up' : 'down'].push([(val * 100).toFixed(2) + '%', rateX + this.style.axis.scaleLength + xOffset * yAxis.flag, yPos]);
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
      if (this.dataSource.series[0].main) {
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
          ctx.fillText(value.toFixed(this.pricePrecision), x + this.style.axis.scaleLength + this.style.axis.labelPos.yAxis.x, y + 5);
        }, this.style.tip.currPrice.labelColor);
      }
    } // draw highest and lowest price


    if (this.dataSource.series[0].type === 'candlestick') {
      var max = this.filterData.data[0];
      var min = this.filterData.data[0];
      var highIndex = this.dataSource.series[0].h;
      var lowIndex = this.dataSource.series[0].l;

      if (this.dataSource.series[0].as === 'mountain') {
        highIndex = this.dataSource.series[0].c;
        lowIndex = this.dataSource.series[0].c;
      }

      this.filterData.data.forEach(item => {
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
        ctx.fillText(maxVal, this.style.position.right + this.style.axis.scaleLength + this.style.axis.labelPos.yAxis.x, maxY + 5);
      }, this.style.tip.highColor);
      Draw.Text(this.ctx, ctx => {
        var width = ctx.measureText(minVal).width;
        ctx.fillText(minVal, this.style.position.right + this.style.axis.scaleLength + this.style.axis.labelPos.yAxis.x, minY + 5);
      }, this.style.tip.lowColor);
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
    this.render.drawAxis.call(this); // this.render.drawAdditionalTips.call(this)

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
