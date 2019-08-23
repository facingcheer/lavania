import Utils from './Utils'
import Draw from './utils/Draw'
import { chartPainter } from './painter/index'
import dateFormatter from './utils/dateFormatter'


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
    const hLines = coord.horizLines.slice(1,-1)
    // console.log(hLines)
    if (coord.horizLines) {
      Draw.Stroke(ctx, ctx => {
        hLines.forEach((y, index) => {
          let ypos = index === hLines.length - 1 ? y.display : y.display - 1
          ctx.moveTo(viewport.left, ypos)
          ctx.lineTo(viewport.right, ypos)
        })
      }, style.grid.color.x)
    }

    const vLines = coord.verticalLines
    // draw vertical lines
    if(coord.verticalLines){
      Draw.Stroke(ctx, ctx => {
        vLines.forEach((val, ind) => {
          ctx.moveTo(val.display, viewport.top)
          ctx.lineTo(val.display, viewport.bottom)
        })
      }, style.grid.color.y)
    }

    if(style.axis.showBorder) {
      Draw.Stroke(ctx, ctx => {
        ctx.moveTo(viewport.left + 0.5, viewport.top)
        ctx.lineTo(viewport.left + 0.5, viewport.bottom)

        ctx.moveTo(viewport.right - 0.5, viewport.top)
        ctx.lineTo(viewport.right - 0.5, viewport.bottom)

        ctx.moveTo(viewport.left, viewport.top + 0.5)
        ctx.lineTo(viewport.right, viewport.top + 0.5)

        ctx.moveTo(viewport.left, viewport.bottom - 0.5)
        ctx.lineTo(viewport.right, viewport.bottom - 0.5)
      }, style.axis.borderColor)
    }
  }

  drawSeries() {
    const { type, ctx, dataProvider, viewport, dataSource, seriesInfo } = this._chart
    const { series, valueIndex } = seriesInfo
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
    const {type, ctx, style, dataProvider, dataSource, seriesInfo, originHeight, originWidth, viewport } = this._chart
    const { coord } = dataProvider
    this.axisClean()

    // draw labels
    var rates = {
      up: [],
      down: []
    }

      // y-axis label
    ;['left', 'right'].forEach(direction => {
      if(style.axis.label[direction].show){
        Draw.Text(ctx, ctx => {
          coord.horizLines.forEach((y, index) => {
            const val = Utils.Math.valueFormat(y.actual, style.valueFormatter, style.valuePrecision)
            const xOffset = style.axis.label[direction].offset.x

            var yPos = y.display + style.axis.label[direction].offset.y
            if (yPos < 10)
              yPos += 10
            if (yPos > originHeight - 10)
              yPos -= 10
            ctx.font = style.axis.label[direction].fontSize + 'px ' + style.font.family
            ctx.textAlign = style.axis.label[direction].textAlign
            ctx.textBaseline = style.axis.label[direction].textBaseline
            ctx.fillText(val,
              viewport[direction] + ('right' === style.axis.label[direction].textAlign ? -1 : 1) * (style.axis.showScale ? style.axis.scaleLength : 0) + xOffset,
              yPos + style.axis.label[direction].offset.y)
          })
        }, style.axis.label[direction].color)
      }
    })

    ;['top', 'bottom'].forEach(direction => {
      if(style.axis.label[direction].show){
        if (type === 'scalable') {
          // scalable
          Draw.Text(ctx, ctx => {
            ctx.font = style.axis.label[direction].fontSize + 'px ' + style.font.family
            ctx.textAlign = style.axis.label[direction].textAlign
            ctx.textBaseline = style.axis.label[direction].textBaseline
            coord.verticalLines.forEach(x => {
              ctx.fillText(dateFormatter(x.actual, style.dateFormat),
                x.display + style.axis.label[direction].offset.x,
                viewport[direction] + ('bottom' === style.axis.label[direction].textBaseline ? -1 : 1) * (style.axis.showScale ? style.axis.scaleLength : 0) + style.axis.label[direction].offset.y)
            })
          }, style.axis.label[direction].color)
        } else {
          seriesInfo.timeRanges.forEach((range, index) => {
            var width = viewport.right - style.padding.left
            var displayRange = [
              index * width / seriesInfo.timeRanges.length,
              (index + 1) * width / seriesInfo.timeRanges.length
            ]
            if (seriesInfo.timeRangesRatio) {
              var widthRatio = seriesInfo.timeRangesRatio
              var prevRatio = widthRatio.slice(0, index).reduce( (acc, x) => {
                return acc + x
              }, 0)
              var ratio = widthRatio[index]
              var left = Math.round(style.padding.left + prevRatio * width)
              var right = Math.round(left + ratio * width)
              displayRange = [left, right]
            }
            Draw.Text(ctx, ctx => {
              ctx.font = style.axis.label[direction].fontSize + 'px ' + style.font.family
              ctx.textAlign = style.axis.label[direction].textAlign
              ctx.textBaseline = style.axis.label[direction].textBaseline
              ctx.fillText(dateFormatter(range[0], style.dateFormat),
                displayRange[0] + 5,
                viewport[direction] + ('bottom' === style.axis.label[direction].textBaseline ? -1 : 1) * (style.axis.showScale ? style.axis.scaleLength : 0) + style.axis.label[direction].offset.y)

              let lastDateStr = dateFormatter(range[1], style.dateFormat)

              var strWidth = ctx.measureText(lastDateStr).width
              ctx.fillText(lastDateStr,
                displayRange[1] - strWidth - 5,
                viewport[direction] + ('bottom' === style.axis.label[direction].textBaseline ? -1 : 1) * (style.axis.showScale ? style.axis.scaleLength : 0) + style.axis.label[direction].offset.y)
            }, style.axis.label[direction].color)
          })
        }
      }
    })

    // Draw.Text(ctx, ctx => {
    //   if (style.axis.showRate) {
    //     var rateX = yAxis.flag > 0 ? 0 : viewport.right

    //     coord.horizLines.forEach((y, index) => {
    //       var val = ((y.actual - seriesInfo.baseValue) / seriesInfo.baseValue)
    //       var xOffset = ctx.measureText(val.toFixed(2) + '%').width + style.axis.label.yAxis.offset.x

    //       var yPos = y.display + style.axis.label.yAxis.offset.y
    //       if (yPos < 10)
    //         yPos += 10
    //       if (yPos > originHeight - 10)
    //         yPos -= 10

    //       if (val === 0)
    //         ctx.fillText(val.toFixed(2) + '%',
    //           rateX + style.axis.scaleLength + xOffset * yAxis.flag,
    //           yPos)
    //       else {
    //         rates[val > 0 ? 'up' : 'down'].push([(val * 100).toFixed(2) + '%',
    //           rateX + style.axis.scaleLength + xOffset * yAxis.flag,
    //           yPos
    //         ])
    //       }
    //     })
    //   }
    // }, style.axis.labelColor)

    for (var direction in rates) {
      Draw.Text(ctx, (ctx) => {
        rates[direction].forEach((item) => {
          ctx.fillText(item[0], item[1], item[2])
        })
      }, style.seriesStyle.OHLC[direction])
    }
  }

  drawAdditionalTips() {
    const { seriesInfo, dataSource, ctx, style, dataProvider, viewport } = this._chart
    const { filteredData, coord } = dataProvider
    if (seriesInfo.timeRanges !== undefined &&
        seriesInfo.baseValue !== undefined){
      var y = ~~Utils.Coord.linearActual2Display(seriesInfo.baseValue, coord.y)
      Draw.Stroke(ctx, ctx => {
        ctx.lineWidth = 2
        ctx.setLineDash([5,5])
        ctx.moveTo(style.padding.left, y)
        ctx.lineTo(viewport.right, y)
      }, style.seriesStyle.baseValue)
    }

    // draw current price
    const mainSeries = seriesInfo.series.find(s => s.main)

    if (dataSource.length > 0){
      if (mainSeries){

        const x = style.axis.yAxisPos === 'right' ? viewport.right : 0
        const width = style.axis.yAxisPos === 'right' ? style.padding.right : style.padding.left
        const last = dataSource[dataSource.length - 1]
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
          ctx.fillText(Utils.Math.valueFormat(value, style.valueFormatter, style.valuePrecision),
                      x + style.axis.scaleLength + style.axis.label.right.offset.x,
                      y + 5)
        }, style.tip.currPrice.labelColor)
      }
    }

    // draw value range boundary
    if (style.valueRangeBoundary.show && mainSeries && filteredData && filteredData.data && filteredData.data.length) {
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

      const maxVal =  Utils.Math.valueFormat(max[highIndex], style.valueFormatter, style.valuePrecision)
      const maxY = ~~Utils.Coord.linearActual2Display(max[highIndex], coord.y) + 0.5
      const minVal = Utils.Math.valueFormat(min[lowIndex], style.valueFormatter, style.valuePrecision)
      const minY = ~~Utils.Coord.linearActual2Display(min[lowIndex], coord.y) + 0.5

      Draw.Stroke(ctx, ctx => {
        if(style.valueRangeBoundary.dash){
          ctx.setLineDash(style.valueRangeBoundary.dash)
        }
        ctx.moveTo(style.padding.left, maxY)
        ctx.lineTo(viewport.right, maxY)
      }, style.valueRangeBoundary.highColor)

      Draw.Stroke(ctx, ctx => {
        if(style.valueRangeBoundary.dash){
          ctx.setLineDash(style.valueRangeBoundary.dash)
        }
        ctx.moveTo(style.padding.left, minY)
        ctx.lineTo(viewport.right, minY)
      }, style.valueRangeBoundary.lowColor)

      ;['left', 'right'].forEach(direction => {
        if(style.axis.label[direction].show) {
          Draw.Text(ctx, ctx => {
            const width = ctx.measureText(maxVal).width
            ctx.font = style.axis.label[direction].fontSize + 'px ' + style.font.family
            ctx.textAlign = style.axis.label[direction].textAlign
            ctx.textBaseline = style.axis.label[direction].textBaseline
            ctx.fillText(maxVal,
              viewport[direction] + ('right' === style.axis.label[direction].textAlign ? -1 : 1) * (style.axis.showScale ? style.axis.scaleLength : 0) + style.axis.label[direction].offset.x,
               maxY)
          }, style.valueRangeBoundary.highColor)

          Draw.Text(ctx, ctx => {
            const width = ctx.measureText(minVal).width
            ctx.font = style.axis.label[direction].fontSize + 'px ' + style.font.family
            ctx.textAlign = style.axis.label[direction].textAlign
            ctx.textBaseline = style.axis.label[direction].textBaseline
            ctx.fillText(minVal,
              viewport[direction] + ('right' === style.axis.label[direction].textAlign ? -1 : 1) * (style.axis.showScale ? style.axis.scaleLength : 0) + style.axis.label[direction].offset.x,
              minY)
          }, style.valueRangeBoundary.lowColor)
        }
      })

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


