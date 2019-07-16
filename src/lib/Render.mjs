import Utils from './Utils'
import Draw from './utils/Draw'

import {
  LinearIndicatorPainter,
  CandleStickIndicatorPainter
} from "./Painter";

export default class Render {
  constructor(dataSource, style, ctx) {
    // this.dataSource = dataSource
    // this.style = style
    // this.ctx = ctx
  }

  genPanes() {
    const {data, timeIndex, timeRanges, timeRangesRatio } = this.dataSource
    let chartWidth = this.style.position.right - this.style.padding.left

    const paneData = Utils.Coord.datafilterByTimeRanges(data, timeRanges, timeIndex)

    const paneCoords = timeRanges.map((range, index) => {
      // calc each panes position-x
      let left, right
      if (timeRangesRatio) {
        let prevRatio = timeRangesRatio.slice(0, index).reduce((acc, x) => {
          return acc + x
        }, 0)
        left = Math.round(this.style.padding.left + prevRatio * width)
        right = Math.round(left + this.dataSource.timeRangesRatio[index] * chartWidth)
      } else {
        const coordWidth = chartWidth / this.dataSource.timeRanges.length
        left = this.style.padding.left + coordWidth * index
        right = left + coordWidth
      }

      return {
        x: {
          display: [left, right],
          actual: [range[0], range[1]]
        }
      }
    })
    // calc display position x of each visiable point
    paneData.forEach((pane, index) => {
      pane.forEach(item => {
        item.x = ~~Utils.Coord.linearActual2Display(item[this.dataSource.timeIndex], paneCoords[index].x)
      })
    })
    this.panes = paneCoords.map((paneCoord, index) => ({
      paneCoord,
      paneData: paneData[index]
    }))
  }

  genLinearCoord() {
    this.render.genPanes.call(this)
    const {data, series, timeRanges, baseValue, touchTop} = this.dataSource
    const { viewport, style } = this

    let yRange= Utils.Coord.calcYRange(data, series)
    let yActual = Utils.Coord.adjustYRange(yRange, touchTop, style, baseValue)

    // create coord
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
    }
  }

  genCsCoord() {
    const { data, series } = this.dataSource
    const { viewport, style } = this
    // var series = this.dataSource.series;

    // filter data by viewport
    this.filterResult = Utils.Coord.dataFilterByViewport(data,
      viewport, style)

    // calculate actual range of data
    let yActual = Utils.Coord.calcYRange(this.filterResult.filteredData, series)
    let xActual = [
      this.filterResult.filteredData[0][this.dataSource.timeIndex],
      this.filterResult.filteredData[this.filterResult.filteredData.length - 1][this.dataSource.timeIndex]
    ];

    // calc the vertical padding of grid
    var verticalPadding = Utils.Coord.linearPixels2Actual(this.style.grid.span.y * 2, {
      display: [style.position.bottom, style.padding.top],
      actual: yActual
    })
    yActual[0] -= verticalPadding
    yActual[1] += verticalPadding

    // with base value line
    if (this.dataSource.baseValue !== undefined){
      var baseValue = this.dataSource.baseValue;
      var span = Math.max(Math.abs(baseValue - yActual[0]), Math.abs(baseValue - yActual[1]));
      yActual = [baseValue - span, baseValue + span];
    }

    // create coord
    this.coord = {
      x: {display: [this.style.padding.left, this.style.position.right], actual:
        xActual},
      y: {display: [this.style.position.bottom, this.style.padding.top], actual: yActual},
      viewport: this.viewport
    };
  }

  drawGrid() {
    // calculate horizontal lines position
    var yNum = ~~((this.coord.y.display[0] - this.coord.y.display[1]) / this.style.grid.span.y)
    if (yNum > this.style.grid.limit.y[1]) yNum = this.style.grid.limit.y[1]
    if (yNum < this.style.grid.limit.y[0]) yNum = this.style.grid.limit.y[0]
    var horizLines = []

    if (this.dataSource.baseValue === undefined) {
      // no base value line specified
      if (this.coord.y.actual[0] === this.coord.y.actual[1]) {
        var offset = this.coord.y.actual[0] / 100
        this.coord.y.actual[0] -= offset
        this.coord.y.actual[1] += offset
      }
      horizLines = Utils.Coord.seekNeatPoints(this.coord.y.actual, yNum + 1)
    } else {
      // with base value line
      var yActual = this.coord.y.actual
      var baseValue = this.dataSource.baseValue
      var span = (yActual[1] - yActual[0]) / 2
      horizLines = [yActual[0], baseValue]
      while (horizLines.length < yNum) {
        span /= 2
        for (var i = 0, limit = horizLines.length; i < limit; i++) {
          horizLines.push(horizLines[i] + span)
        }
      }
      horizLines.push(yActual[1])
    }
    horizLines = horizLines.map((val) => {
      return {
        actual: val,
        display: ~~Utils.Coord.linearActual2Display(val, this.coord.y) + 0.5
      }
    })

    // draw horizontal lines
    Draw.Stroke(this.ctx, (ctx) => {
      horizLines.forEach((y, index) => {
        ctx.moveTo(this.style.padding.left, y.display)
        ctx.lineTo(this.style.position.right, y.display)
      })
    }, this.style.grid.color.x)
    this.coord.horizLines = horizLines

    // calculate vertical lines position
    var verticalLines = []
    if (this.dataSource.timeRanges) {
      // vertical grid line drawing for linear chart
      this.dataSource.timeRanges.forEach((range, index) => {
        if (this.dataSource.timeRangesRatio) {
          var width = this.style.position.right - this.style.padding.left
          var widthRatio = this.dataSource.timeRangesRatio
          var prevRatio = widthRatio.slice(0, index).reduce((acc, x) => {
            return acc + x
          }, 0)
          var ratio = widthRatio[index]
          var left = Math.round(this.style.padding.left + prevRatio * width)
          var right = Math.round(left + ratio * width)
          // displayRange = [left, right]
          if (index === this.dataSource.timeRanges.length - 1) {
            verticalLines.push({
              display: this.style.position.right + 0.5,
              actual: range[1]
            })
          }
          verticalLines.push({
            display: left + 0.5,
            actual: range[0]
          })
        } else {
          const coordWidth = (this.style.position.right - this.style.padding.left) / this.dataSource.timeRanges.length
          verticalLines.push({
            display: ~~(this.style.padding.left + coordWidth * index) + 0.5,
            actual: range[0]
          })
          if (index === this.dataSource.timeRanges.length - 1) {
            verticalLines.push({
              display: this.style.position.right + 0.5,
              actual: range[1]
            })
          }
        }
      })

    } else {
      // vertical grid line drawing for candlestick chart
      for (var l = this.dataSource.data.length - 1; l >= 0; l -= ~~(this.style.grid.span.x / this.viewport.width)) {
        if (this.dataSource.data[l].x > this.style.padding.left &&
          this.dataSource.data[l].x < this.style.position.right)
          verticalLines.push({
            display: ~~this.dataSource.data[l].x + 0.5,
            actual: this.dataSource.data[l][this.dataSource.timeIndex]
          })
      }
    }

    // draw vertical lines
    Draw.Stroke(this.ctx, (ctx) => {
      verticalLines.forEach((val, ind) => {
        ctx.moveTo(val.display, this.style.padding.top)
        ctx.lineTo(val.display, this.style.position.bottom)
      })
    }, this.style.grid.color.y)

    this.coord.verticalLines = verticalLines
  }

  drawMainSeries() {
    // draw the first series as main series
    var mainSeries = this.dataSource.series[0]
    if (mainSeries.type === 'linear') {
      var points = []
    // points position calculation
      this.panes.forEach((pane, index) => {
        var panePoints = []
        pane.paneData.forEach((item) => {
          var x = item.x
          var y = ~~Utils.Coord.linearActual2Display(item[mainSeries.valIndex], this.coord.y)

          panePoints.push([x, y])
        })
        points.push(panePoints)
      })

      // use points position to draw line
      // loop panes then loop points in panes
      Draw.Stroke(this.ctx, (ctx) => {
        ctx.lineWidth = this.dataStyle.mountain.lineWidth

        points.forEach(panePoints => {
          panePoints.forEach((point, index) => {
            if (!index)
              ctx.moveTo(point[0], point[1])
            ctx.lineTo(point[0], point[1])
          })
        })
      }, this.dataStyle.mountain.lineColor)

      // draw gradient
      var gradient = this.ctx.createLinearGradient(0, 0, 0, this.style.position.bottom - this.style.padding.top)
      gradient.addColorStop(0, this.dataStyle.mountain.gradientUp)
      gradient.addColorStop(1, this.dataStyle.mountain.gradientDown)

      points.forEach(panePoints => {
        if (panePoints.length)
          Draw.Fill(this.ctx, (ctx) => {
            ctx.moveTo(panePoints[0][0], this.style.position.bottom)
            panePoints.forEach((point, index) => {
              ctx.lineTo(point[0], point[1])
            })

            ctx.lineTo(panePoints[panePoints.length - 1][0], this.style.position.bottom)
            ctx.closePath()

          }, gradient)
      })
    } else {
      var series = this.dataSource.series[0];
      var lines = {up: [], down: []};
      var boxes = {up: [], down: []};
      var peaks = [];

      if (series.type !== 'candlestick')
        return;

      var filteredData = this.filterResult.filteredData;
      filteredData.forEach((item, index) => {
        var h = ~~Utils.Coord.linearActual2Display(item[series.h], this.coord.y);
        var o = ~~Utils.Coord.linearActual2Display(item[series.o], this.coord.y);
        var c = ~~Utils.Coord.linearActual2Display(item[series.c], this.coord.y);
        var l = ~~Utils.Coord.linearActual2Display(item[series.l], this.coord.y);

        var direction = c === o && index > 0 ? (filteredData[index - 1][series.c] < item[series.c] ? 'up' : 'down') : (c < o ? 'up' : 'down');
        lines[direction].push([~~item.x, l, h]);

        var w = this.viewport.width - 2;
        boxes[direction].push([item.x - w / 2 + 1, o > c ? c : o, w - 2, Math.abs(o - c), o, c, ~~item.x]);

        peaks.push([~~item.x, c]);
      });

      for (var direction in lines){
        if (series.as === 'OHLC')
          Draw.Stroke(this.ctx, ctx => {
            ctx.lineWidth = ~~(this.viewport.width / 10);
            if (ctx.lineWidth > 1)
              ctx.lineWidth += ctx.lineWidth % 2 ? 0 : 1;

            lines[direction].forEach(line => {
              ctx.moveTo(line[0] + 0.5, line[1]);
              ctx.lineTo(line[0] + 0.5, line[2]);
            })
          }, this.dataStyle.OHLC[direction]);

        else if (series.as === 'mountain'){
          // no high low drawing needed
        } else
          Draw.Stroke(this.ctx, ctx => {
            lines[direction].forEach( line => {
              ctx.moveTo(line[0] + 0.5, line[1] + 0.5);
              ctx.lineTo(line[0] + 0.5, line[2] + 0.5);
            });
          }, this.dataStyle.candlestick.wick[direction]);
      }

      for (var direction in boxes){
        if (series.as === 'OHLC')
          Draw.Stroke(this.ctx, ctx => {
            boxes[direction].forEach(box => {
              ctx.lineWidth = ~~(this.viewport.width / 10);
              if (ctx.lineWidth > 1)
                ctx.lineWidth += ctx.lineWidth % 2 ? 0 : 1;

              ctx.moveTo(box[0] + 1, box[4] + 0.5);
              ctx.lineTo(box[6] + 1 + (ctx.lineWidth - 1) / 2, box[4] + 0.5);

              ctx.moveTo(box[0] + box[2], box[5] + 0.5);
              ctx.lineTo(box[6] - (ctx.lineWidth - 1) / 2, box[5] + 0.5);
            });
          }, this.dataStyle.OHLC[direction]);

        else if (series.as === 'mountain'){
          // pass
        } else
          Draw.FillnStroke(this.ctx, ctx => {
            boxes[direction].forEach(box => {
              ctx.rect(~~box[0] + 0.5, box[1] + 0.5, box[2], box[3] + 0.02); // + 0.02 is for IE fix
            });
          }, this.dataStyle.candlestick.block[direction], this.dataStyle.candlestick.border[direction]);
      }

      if (series.as == 'mountain'){
          Draw.Stroke(this.ctx, ctx => {
            ctx.lineWidth = this.dataStyle.mountain.lineWidth;
            peaks.forEach((peak, index) => {
              if (!index)
                ctx.moveTo(peak[0], peak[1]);

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
        LinearIndicatorPainter[series.type] && LinearIndicatorPainter[series.type].call(this, this.ctx, {
          ...series,
          bottom: this.style.position.bottom
        }, this.panes, this.coord)
      })
    } else {
      this.dataSource.series.forEach((series) => {
        CandleStickIndicatorPainter[series.type] && CandleStickIndicatorPainter[series.type].call(this, this.ctx, series, this.filterResult.filteredData, this.coord)
      })
    }
  }

  drawAxis() {
    // clear axis region
    Draw.Fill(this.ctx, (ctx) => {
      ctx.rect(0, 0, this.originWidth, this.style.padding.top);
      ctx.rect(0, 0, this.style.padding.left, this.originHeight);
      ctx.rect(this.style.position.right, 0, this.style.padding.right, this.originHeight);
      ctx.rect(0, this.style.position.bottom, this.originWidth, this.style.padding.bottom);
    }, this.style.axis.bgColor);

    // start position of the yAxis
    const x = this.style.axis.yAxisPos === 'right' ? this.style.position.right : 0;
    const y = this.style.axis.xAxisPos === 'bottom' ?
      this.style.position.bottom : this.style.padding.top

    var xLinePos = this.style.axis.yAxisPos === 'right' ? this.style.position.right : this.style.padding.left;
    var xLinePosOp = this.style.axis.yAxisPos === 'right' ? this.style.padding.left : this.style.position.right;

    var yOp = this.style.axis.xAxisPos === 'bottom' ?
      this.style.padding.top : this.style.position.bottom;

    // draw axis lines
    Draw.Stroke(this.ctx, (ctx) => {
      this.coord.horizLines.forEach((y) => {
        ctx.moveTo(xLinePos, y.display);
        ctx.lineTo(xLinePos + this.style.axis.pointerLength * this.style.axis.yAxisPos, y.display);
      });

      this.coord.verticalLines.forEach((x) => {
        ctx.moveTo(x.display, y);
        ctx.lineTo(x.display, y + this.style.axis.pointerLength * this.style.axis.xAxisPos);
      });

      // draw axis line
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

        this.coord.horizLines.forEach((y) => {
          ctx.moveTo(rateX, y.display);
          ctx.lineTo(rateX + this.style.axis.pointerLength * -this.style.axis.yAxisPos, y.display);
        });
      }
    }, this.style.axis.lineColor);

    // draw labels
    var rates = {
      up: [],
      down: []
    };
    Draw.Text(this.ctx, (ctx) => {
      this.coord.horizLines.forEach((y, index) => {
        var val = y.actual.toFixed(this.pricePrecision);
        var xOffset = this.style.axis.labelPos.yAxis.x;

        var yPos = y.display + this.style.axis.labelPos.yAxis.y;
        if (yPos < 10)
          yPos += 10;
        if (yPos > this.originHeight - 10)
          yPos -= 10;

        ctx.fillText(val,
          x + this.style.axis.pointerLength + xOffset,
          yPos);
      });

      if (!this.dataSource.timeRanges) {
        this.coord.verticalLines.forEach((x) => {
          ctx.fillText(Utils.Coord.getDateStr(x.actual, this.style.axis.hideCandlestickDate, this.style.axis.hideCandlestickTime),
            x.display + this.style.axis.labelPos.xAxis.x + ((this.style.axis.hideCandlestickDate || this.style.axis.hideCandlestickTime) && 15),
            y + this.style.axis.labelPos.xAxis.y * this.style.axis.xAxisPos);
        });
      } else {
        this.dataSource.timeRanges.forEach((range, index) => {
          var width = this.style.position.right - this.style.padding.left;
          var displayRange = [
            index * width / this.dataSource.timeRanges.length,
            (index + 1) * width / this.dataSource.timeRanges.length
          ];
          if (this.dataSource.timeRangesRatio) {
            var widthRatio = this.dataSource.timeRangesRatio;
            var prevRatio = widthRatio.slice(0, index).reduce( (acc, x) => {
              return acc + x
            }, 0);
            var ratio = widthRatio[index];
            var left = Math.round(this.style.padding.left + prevRatio * width)
            var right = Math.round(left + ratio * width)
            displayRange = [left, right]
          }

          ctx.fillText(Utils.Coord.getDateStr(range[0], true),
            displayRange[0] + 5,
            y + this.style.axis.labelPos.xAxis.y * this.style.axis.xAxisPos);

          var strWidth = ctx.measureText(Utils.Coord.getDateStr(range[1], true)).width;
          ctx.fillText(Utils.Coord.getDateStr(range[1], true),
            displayRange[1] - strWidth - 5,
            y + this.style.axis.labelPos.xAxis.y * this.style.axis.xAxisPos);
        })
      }


      if (this.style.axis.showRate) {
        var rateX = this.style.axis.yAxisPos > 0 ? 0 : this.style.position.right;

        this.coord.horizLines.forEach((y, index) => {
          var val = ((y.actual - this.dataSource.baseValue) / this.dataSource.baseValue);
          var xOffset = ctx.measureText(val.toFixed(2) + '%').width + this.style.axis.labelPos.yAxis.x;

          var yPos = y.display + this.style.axis.labelPos.yAxis.y;
          if (yPos < 10)
            yPos += 10;
          if (yPos > this.originHeight - 10)
            yPos -= 10;

          if (val === 0)
            ctx.fillText(val.toFixed(2) + '%',
              rateX + this.style.axis.pointerLength + xOffset * this.style.axis.yAxisPos,
              yPos);
          else {
            rates[val > 0 ? 'up' : 'down'].push([(val * 100).toFixed(2) + '%',
              rateX + this.style.axis.pointerLength + xOffset * this.style.axis.yAxisPos,
              yPos
            ])
          }
        });

      }

    }, this.style.axis.labelColor);

    for (var direction in rates) {
      Draw.Text(this.ctx, (ctx) => {
        rates[direction].forEach((item) => {
          ctx.fillText(item[0], item[1], item[2]);
        });
      }, this.dataStyle.OHLC[direction]);
    }
  }

  drawAdditionalTips() {
    if (this.dataSource.timeRanges !== undefined &&
        this.dataSource.baseValue !== undefined){
      var y = ~~Utils.Coord.linearActual2Display(this.dataSource.baseValue, this.coord.y);
      Draw.Stroke(this.ctx, ctx => {
        ctx.lineWidth = 2;
        ctx.setLineDash([5,5]);
        ctx.moveTo(this.style.padding.left, y);
        ctx.lineTo(this.style.position.right, y);
      }, this.dataStyle.baseValue);
    }

    // draw current price
    if (this.dataSource.data.length > 0){
      if (this.dataSource.series[0].type === 'candlestick' ||
          this.dataSource.series[0].type === 'linear'){

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
          ctx.rect(x,
                  y - this.style.tip.currPrice.labelHeight / 2,
                  width,
                  this.style.tip.currPrice.labelHeight);

        }, this.style.tip.currPrice.labelBg);

        Draw.Text(this.ctx, ctx => {
          ctx.fillText(value.toFixed(this.pricePrecision),
                      x + this.style.axis.pointerLength + this.style.axis.labelPos.yAxis.x,
                      y + 5);

        }, this.style.tip.currPrice.labelColor);

      }
    }

    // draw highest and lowest price
    if (this.dataSource.series[0].type === 'candlestick'){
      var max = this.filterResult.filteredData[0];
      var min = this.filterResult.filteredData[0];
      var highIndex = this.dataSource.series[0].h;
      var lowIndex = this.dataSource.series[0].l;
      if (this.dataSource.series[0].as === 'mountain'){
        highIndex = this.dataSource.series[0].c;
        lowIndex = this.dataSource.series[0].c;
      }

      this.filterResult.filteredData.forEach((item) => {
        if (item[highIndex] > max[highIndex])
          max = item
        if (item[lowIndex] < min[lowIndex])
          min = item
      });

      var maxVal = max[highIndex].toFixed(this.pricePrecision);
      var maxY = ~~Utils.Coord.linearActual2Display(max[highIndex], this.coord.y) + 0.5;
      var minVal = min[lowIndex].toFixed(this.pricePrecision);
      var minY = ~~Utils.Coord.linearActual2Display(min[lowIndex], this.coord.y) + 0.5;

      Draw.Stroke(this.ctx, ctx => {
        ctx.setLineDash([5,5]);
        ctx.moveTo(this.style.padding.left, maxY);
        ctx.lineTo(this.style.position.right, maxY);
      }, this.style.tip.highColor);

      Draw.Stroke(this.ctx, ctx => {
        ctx.setLineDash([5,5]);
        ctx.moveTo(this.style.padding.left, minY);
        ctx.lineTo(this.style.position.right, minY);
      }, this.style.tip.lowColor);

      Draw.Text(this.ctx, ctx => {
        var width = ctx.measureText(maxVal).width;
        ctx.fillText(maxVal,
                     this.style.position.right + this.style.axis.pointerLength + this.style.axis.labelPos.yAxis.x,
                     maxY + 5);
      }, this.style.tip.highColor);

      Draw.Text(this.ctx, ctx => {
        var width = ctx.measureText(minVal).width;
        ctx.fillText(minVal,
                     this.style.position.right + this.style.axis.pointerLength + this.style.axis.labelPos.yAxis.x,
                     minY + 5);
      }, this.style.tip.lowColor);

    }
  }
}
