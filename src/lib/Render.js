import Utils from './Utils'
import Draw from './utils/Draw'
import { chartPainter } from './painter/index'


export default class Render {
  constructor(chart) {
    this._chart = chart
  }

  rend() {
    this.drawGrid()
    this.drawSeries()
    this.drawAxis()
    this.drawAdditionalTips()
  }

  drawGrid() {
    const { style, ctx, dataProvider, viewport } = this._chart
    const { coord } = dataProvider

    // draw horizontal lines
    // debugger
    const hLines = style.axis.hideBorder ? coord.horizLines.slice(1,-1) : coord.horizLines
    if (coord.horizLines) {
      Draw.Stroke(ctx, ctx => {
        hLines.forEach((y, index) => {
          ctx.moveTo(style.padding.left, y.display)
          ctx.lineTo(viewport.right, y.display)
        })
      }, style.grid.color.x)
    }

    const vLines = style.axis.hideBorder ? coord.verticalLines.slice(1,-1) : coord.verticalLines
    // draw vertical lines
    if(coord.verticalLines){
      Draw.Stroke(ctx, ctx => {
        vLines.forEach((val, ind) => {
          ctx.moveTo(val.display, style.padding.top)
          ctx.lineTo(val.display, viewport.bottom)
        })
      }, style.grid.color.y)
    }
  }

  drawSeries() {
    const { type, ctx, dataProvider, viewport, dataSource } = this._chart
    const { series, valueIndex } = dataSource
    const { coord, filteredData, panes} = dataProvider

   series.map(s => {
     if (s.type === 'line' || s.type === 'mountain' || s.type === 'candlestick' || s.type === 'OHLC') {
      chartPainter[s.type](ctx, filteredData.data, coord, s, viewport)
     }
     if(s.type === 'column') {
       if(type === 'unscalable') {
        chartPainter.panesColumn(ctx, panes, coord, s,  viewport)
       }
       if(type === 'scalable') {
        chartPainter.column(ctx, filteredData.data, coord, s, viewport)
        }
     }
   })
  }

  drawAxis() {
    const {ctx, style, dataProvider, dataSource, dataStyle, originHeight, originWidth, viewport } = this._chart
    const { coord } = dataProvider
    this.axisClean()

    let yAxis = {
    }
    let xAxis = {}

    // flag用来标识刻度的朝向
    yAxis.flag = style.axis.yAxisPos === 'right' ? 1 : -1
    xAxis.flag = style.axis.xAxisPos === 'bottom' ? 1 : -1
    // start position of the aXis
    yAxis.xStart = ~yAxis.flag ? viewport.right : 0
    xAxis.yStart = ~xAxis.flag ? viewport.bottom : style.padding.top
    yAxis.scaleStart = ~yAxis.flag ? viewport.right : style.padding.left


    // draw axis lines
    Draw.Stroke(ctx, ctx => {
      if (style.axis.showScale) {
        coord.horizLines.forEach(hl => {
          ctx.moveTo(yAxis.scaleStart, hl.display)
          ctx.lineTo(yAxis.scaleStart + style.axis.scaleLength * yAxis.flag , hl.display)
        })

        coord.verticalLines.forEach(vl => {
          ctx.moveTo(vl.display, xAxis.yStart)
          ctx.lineTo(vl.display, xAxis.yStart + style.axis.scaleLength * xAxis.flag)
        })

        ctx.moveTo(yAxis.scaleStart + 0.5, style.padding.top)
        ctx.lineTo(yAxis.scaleStart + 0.5, viewport.bottom)

        ctx.moveTo(style.padding.left, xAxis.yStart + 0.5)
        ctx.lineTo(viewport.right, xAxis.yStart + 0.5)
      }

      // draw axis line

      if (style.axis.showBorder) {
        ctx.moveTo(yAxis.scaleStart + 0.5, style.padding.top)
        ctx.lineTo(yAxis.scaleStart + 0.5, viewport.bottom)

        ctx.moveTo(style.padding.left, xAxis.yStart + 0.5)
        ctx.lineTo(viewport.right, xAxis.yStart + 0.5)

        const xOp = ~yAxis.flag ? style.padding.left : viewport.right
        ctx.moveTo(xOp + 0.5, style.padding.top + 0.5)
        ctx.lineTo(xOp + 0.5, viewport.bottom +0.5)

        const yOp = ~xAxis.flag? style.padding.top : viewport.bottom
        ctx.moveTo(style.padding.left, yOp + 0.5 )
        ctx.lineTo(viewport.right, yOp + 0.5 )
      }

      if (style.axis.showRate) {
        var rateX = yAxis.flag > 0 ? style.padding.left : viewport.right

        ctx.moveTo(rateX + 0.5, style.padding.top)
        ctx.lineTo(rateX + 0.5, viewport.bottom)

        coord.horizLines.forEach((y) => {
          ctx.moveTo(rateX, y.display)
          ctx.lineTo(rateX + style.axis.scaleLength * -yAxis.flag, y.display)
        })
      }
    }, style.axis.lineColor)

    // draw labels
    var rates = {
      up: [],
      down: []
    }
    Draw.Text(ctx, (ctx) => {
      coord.horizLines.forEach((y, index) => {
        const val = y.actual.toFixed(style.pricePrecision)
        const xOffset = style.axis.labelPos.yAxis.x

        var yPos = y.display + style.axis.labelPos.yAxis.y
        if (yPos < 10)
          yPos += 10
        if (yPos > originHeight - 10)
          yPos -= 10

        ctx.fillText(val,
          yAxis.xStart + style.axis.scaleLength + xOffset,
          yPos)
      })

      if (!dataSource.timeRanges) {
        coord.verticalLines.forEach((x) => {
          ctx.fillText(Utils.Coord.getDateStr(x.actual, style.axis.hideCandlestickDate, style.axis.hideCandlestickTime),
            x.display + style.axis.labelPos.xAxis.x + ((style.axis.hideCandlestickDate || style.axis.hideCandlestickTime) && 15),
            xAxis.yStart + style.axis.labelPos.xAxis.y * xAxis.flag)
        })
      } else {
        dataSource.timeRanges.forEach((range, index) => {
          var width = viewport.right - style.padding.left
          var displayRange = [
            index * width / dataSource.timeRanges.length,
            (index + 1) * width / dataSource.timeRanges.length
          ]
          if (dataSource.timeRangesRatio) {
            var widthRatio = dataSource.timeRangesRatio
            var prevRatio = widthRatio.slice(0, index).reduce( (acc, x) => {
              return acc + x
            }, 0)
            var ratio = widthRatio[index]
            var left = Math.round(style.padding.left + prevRatio * width)
            var right = Math.round(left + ratio * width)
            displayRange = [left, right]
          }

          ctx.fillText(Utils.Coord.getDateStr(range[0], true),
            displayRange[0] + 5,
            xAxis.yStart + style.axis.labelPos.xAxis.y * xAxis.flag)

          var strWidth = ctx.measureText(Utils.Coord.getDateStr(range[1], true)).width
          ctx.fillText(Utils.Coord.getDateStr(range[1], true),
            displayRange[1] - strWidth - 5,
            xAxis.yStart + style.axis.labelPos.xAxis.y * xAxis.flag)
        })
      }


      if (style.axis.showRate) {
        var rateX = yAxis.flag > 0 ? 0 : viewport.right

        coord.horizLines.forEach((y, index) => {
          var val = ((y.actual - dataSource.baseValue) / dataSource.baseValue)
          var xOffset = ctx.measureText(val.toFixed(2) + '%').width + style.axis.labelPos.yAxis.x

          var yPos = y.display + style.axis.labelPos.yAxis.y
          if (yPos < 10)
            yPos += 10
          if (yPos > originHeight - 10)
            yPos -= 10

          if (val === 0)
            ctx.fillText(val.toFixed(2) + '%',
              rateX + style.axis.scaleLength + xOffset * yAxis.flag,
              yPos)
          else {
            rates[val > 0 ? 'up' : 'down'].push([(val * 100).toFixed(2) + '%',
              rateX + style.axis.scaleLength + xOffset * yAxis.flag,
              yPos
            ])
          }
        })

      }

    }, style.axis.labelColor)

    for (var direction in rates) {
      Draw.Text(ctx, (ctx) => {
        rates[direction].forEach((item) => {
          ctx.fillText(item[0], item[1], item[2])
        })
      }, dataStyle.OHLC[direction])
    }
  }

  drawAdditionalTips() {
    const { dataSource, ctx, style, dataProvider, dataStyle, viewport } = this._chart
    const { filteredData, coord } = dataProvider
    if (dataSource.timeRanges !== undefined &&
        dataSource.baseValue !== undefined){
      var y = ~~Utils.Coord.linearActual2Display(dataSource.baseValue, coord.y)
      Draw.Stroke(ctx, ctx => {
        ctx.lineWidth = 2
        ctx.setLineDash([5,5])
        ctx.moveTo(style.padding.left, y)
        ctx.lineTo(viewport.right, y)
      }, dataStyle.baseValue)
    }

    // draw current price
    const mainSeries = dataSource.series.find(s => s.main)

    if (dataSource.data.length > 0){
      if (mainSeries){

        const x = style.axis.yAxisPos === 'right' ? viewport.right : 0
        const width = style.axis.yAxisPos === 'right' ? style.padding.right : style.padding.left
        const last = dataSource.data[dataSource.data.length - 1]
        const value = last[mainSeries.c || mainSeries.valIndex]
        const y = ~~Utils.Coord.linearActual2Display(value, coord.y)

        Draw.Stroke(ctx, ctx => {
          ctx.lineWidth = style.tip.currPrice.lineWidth

          ctx.moveTo(style.padding.left, y + 0.5)
          ctx.lineTo(viewport.right, y + 0.5)

        }, style.tip.currPrice.lineColor)

        Draw.Fill(ctx, ctx => {
          ctx.rect(x,
                  y - style.tip.currPrice.labelHeight / 2,
                  width,
                  style.tip.currPrice.labelHeight)

        }, style.tip.currPrice.labelBg)

        Draw.Text(ctx, ctx => {
          ctx.fillText(value.toFixed(style.pricePrecision),
                      x + style.axis.scaleLength + style.axis.labelPos.yAxis.x,
                      y + 5)

        }, style.tip.currPrice.labelColor)
      }
    }

    // draw highest and lowest price
    if (style.lastDot.show && mainSeries && filteredData && filteredData.data && filteredData.data.length) {
      let max = filteredData.data[0]
      let min = filteredData.data[0]
      if (mainSeries.type === 'candlestick' || mainSeries.type === 'OHLC'){

        var highIndex = mainSeries.h
        var lowIndex = mainSeries.l
      } else {
        highIndex = mainSeries.valIndex
        lowIndex = mainSeries.valIndex
      }

      filteredData.data.forEach((item) => {
        if (item[highIndex] > max[highIndex])
          max = item
        if (item[lowIndex] < min[lowIndex])
          min = item
      })

      const maxVal = max[highIndex].toFixed(style.pricePrecision)
      const maxY = ~~Utils.Coord.linearActual2Display(max[highIndex], coord.y) + 0.5
      const minVal = min[lowIndex].toFixed(style.pricePrecision)
      const minY = ~~Utils.Coord.linearActual2Display(min[lowIndex], coord.y) + 0.5

      Draw.Stroke(ctx, ctx => {
        ctx.setLineDash([5,5])
        ctx.moveTo(style.padding.left, maxY)
        ctx.lineTo(viewport.right, maxY)
      }, style.tip.highColor)

      Draw.Stroke(ctx, ctx => {
        ctx.setLineDash([5,5])
        ctx.moveTo(style.padding.left, minY)
        ctx.lineTo(viewport.right, minY)
      }, style.tip.lowColor)

      Draw.Text(ctx, ctx => {
        const width = ctx.measureText(maxVal).width
        ctx.fillText(maxVal,
                     viewport.right + style.axis.scaleLength + style.axis.labelPos.yAxis.x,
                     maxY + 5)
      }, style.tip.highColor)

      Draw.Text(ctx, ctx => {
        const width = ctx.measureText(minVal).width
        ctx.fillText(minVal,
                     viewport.right + style.axis.scaleLength + style.axis.labelPos.yAxis.x,
                     minY + 5)
      }, style.tip.lowColor)
    }
  }
  axisClean(chart) {
    const {ctx, style, originHeight, originWidth, viewport } = this._chart
    // clear axis region
    // 用bg先刷一次 防止AXIS颜色设置成透明时 不能正确截取图表
    Draw.Fill(ctx, ctx => {
      ctx.rect(0, 0, originWidth, style.padding.top)
      ctx.rect(0, 0, style.padding.left, originHeight)
      ctx.rect(viewport.right, 0, style.padding.right, originHeight)
      ctx.rect(0, viewport.bottom, originWidth, style.padding.bottom)
    }, style.grid.bg)

    Draw.Fill(ctx, ctx => {
      ctx.rect(0, 0, originWidth, style.padding.top)
      ctx.rect(0, 0, style.padding.left, originHeight)
      ctx.rect(viewport.right, 0, style.padding.right, originHeight)
      ctx.rect(0, viewport.bottom, originWidth, style.padding.bottom)
    }, style.axis.bgColor)
  }
}


