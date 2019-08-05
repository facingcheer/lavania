import Utils from './Utils'
import Draw from './utils/Draw'
import { chartPainter } from './painter/index'


export default class Render {
  constructor(dataSource, style, ctx) {
    // dataSource = dataSource
    // style = style
    // ctx = ctx
  }

  genPanes() {
    const { dataSource, style } = this
    const {data, timeIndex, timeRanges, timeRangesRatio } = dataSource
    let chartWidth = style.position.right - style.padding.left

    const paneData = Utils.Coord.datafilterByTimeRanges(data, timeRanges, timeIndex)

    const paneCoords = timeRanges.map((range, index) => {
      // calc each panes position-x
      let left, right
      if (timeRangesRatio) {
        let prevRatio = timeRangesRatio.slice(0, index).reduce((acc, x) => {
          return acc + x
        }, 0)
        left = Math.round(style.padding.left + prevRatio * chartWidth)
        right = Math.round(left + dataSource.timeRangesRatio[index] * chartWidth)
      } else {
        const coordWidth = chartWidth / dataSource.timeRanges.length
        left = style.padding.left + coordWidth * index
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
        item.x = ~~Utils.Coord.linearActual2Display(item[dataSource.timeIndex], paneCoords[index].x)
      })
    })

    this.panes = paneCoords.map((paneCoord, index) => ({
      paneCoord,
      paneData: paneData[index]
    }))

    this.filterData = {
      data : paneData.flat()
    }
  }

  filterData() {
    const { viewport, style, dataSource } = this
    const { data } = dataSource

    this.filterData = Utils.Coord.dataFilterByViewport(data,
      viewport, style)
  }

  genCoord() {
    // for data with no timeRanges,
    // use offset & width of data to calc data
    const { viewport, style, filterData, dataSource, pricePrecision } = this
    const { series, timeIndex, baseValue, touchTop } = dataSource


    // calculate actual-x-range of data
    let xActual = [
      filterData.data[0][timeIndex],
      filterData.data[filterData.data.length - 1][timeIndex]
    ]

    // calculate actual range of data
    let yRange = Utils.Coord.calcYRange(filterData.data, series)
    // yRange的初步处理，有baseValue时对称处理，最大最小值相等时增加差异
    let yActual = Utils.Coord.adjustYRange(yRange, touchTop, style, baseValue, pricePrecision)

    // create coord
    this.coord = {
      x: {display: [style.padding.left, style.position.right], actual:
        xActual},
      y: {display: [style.position.bottom, style.padding.top], actual: yActual},
      viewport
    }


      this.render.genHorizLines.call(this)
      this.render.genVerticalLines.call(this)
  }

  genHorizLines() {
    const { coord, style, dataSource } = this
    const { baseValue, touchTop } = dataSource
    let yActual = coord.y.actual
    let horizCount = Utils.Grid.lineCount(coord.y.display, style.grid.limit.y, style.grid.span.y)
    let hGridLines = Utils.Grid.calcGridLines(coord.y.actual, horizCount, baseValue)
    if(!touchTop){
      coord.y.actual = [hGridLines[0], hGridLines[hGridLines.length - 1]]
    }
    let horizLines = hGridLines.map(val => {
      return {
        actual: val,
        display: ~~Utils.Coord.linearActual2Display(val, coord.y) + 0.5
      }
    })
    coord.horizLines = horizLines
  }

  genVerticalLines() {
    const { style, dataSource, filterData, viewport, coord, panes } = this
    const { timeRanges } = dataSource
    var verticalLines = []
    if (timeRanges) {
      panes.forEach(pane => {
        verticalLines.push({
          display: pane.paneCoord.x.display[0] + 0.5,
          actual: pane.paneCoord.x.actual[0]
        })
      })
      verticalLines.push({
        display: panes[panes.length - 1].paneCoord.x.display[1] + 0.5,
        actual: panes[panes.length - 1].paneCoord.x.actual[1]
      })
    } else {
      // vertical grid line drawing for candlestick chart
      for (var l = filterData.data.length - 1; l >= 0; l -= ~~(style.grid.span.x / viewport.width)) {
        if (filterData.data[l].x > style.padding.left &&
          filterData.data[l].x <= style.position.right)
          verticalLines.push({
            display: ~~filterData.data[l].x + 0.5,
            actual: filterData.data[l][dataSource.timeIndex]
          })
      }
    }
    coord.verticalLines = verticalLines
  }


  drawGrid() {
    const { coord, style, ctx, dataSource } = this
    // draw horizontal lines
    // debugger
    const hLines = style.axis.hideBorder ? coord.horizLines.slice(1,-1) : coord.horizLines
    if (coord.horizLines) {
      Draw.Stroke(ctx, ctx => {
        hLines.forEach((y, index) => {
          ctx.moveTo(style.padding.left, y.display)
          ctx.lineTo(style.position.right, y.display)
        })
      }, style.grid.color.x)
    }

    const vLines = style.axis.hideBorder ? coord.verticalLines.slice(1,-1) : coord.verticalLines
    // draw vertical lines
    if(coord.verticalLines){
      Draw.Stroke(ctx, ctx => {
        vLines.forEach((val, ind) => {
          ctx.moveTo(val.display, style.padding.top)
          ctx.lineTo(val.display, style.position.bottom)
        })
      }, style.grid.color.y)
    }
  }

  drawSeries() {
    const { coord, dataSource,ctx, filterData, style, panes } = this
    const { series, valueIndex } = dataSource

   series.map(s => {
     if (s.type === 'line' || s.type === 'mountain' || s.type === 'candlestick' || s.type === 'OHLC') {
      chartPainter[s.type](ctx, filterData.data, coord, s)
     }
     if(s.type === 'column') {
       if(dataSource.timeRanges) {
        chartPainter.panesColumn(ctx, panes, coord, s)
       }
       if(!dataSource.timeRanges) {
        chartPainter.column(ctx, filterData.data, coord, s, style.position.bottom)
        }
     }
   })
  }

  drawAxis() {
    const {ctx, style, coord,dataSource,dataStyle, originHeight, originWidth, pricePrecision } = this
    axisClean(this)

    let yAxis = {
    }
    let xAxis = {}

    // flag用来标识刻度的朝向
    yAxis.flag = style.axis.yAxisPos === 'right' ? 1 : -1
    xAxis.flag = style.axis.xAxisPos === 'bottom' ? 1 : -1
    // start position of the aXis
    yAxis.xStart = ~yAxis.flag ? style.position.right : 0
    xAxis.yStart = ~xAxis.flag ? style.position.bottom : style.padding.top
    yAxis.scaleStart = ~yAxis.flag ? style.position.right : style.padding.left


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
        ctx.lineTo(yAxis.scaleStart + 0.5, style.position.bottom)

        ctx.moveTo(style.padding.left, xAxis.yStart + 0.5)
        ctx.lineTo(style.position.right, xAxis.yStart + 0.5)
      }

      // draw axis line

      if (style.axis.showBorder) {
        ctx.moveTo(yAxis.scaleStart + 0.5, style.padding.top)
        ctx.lineTo(yAxis.scaleStart + 0.5, style.position.bottom)

        ctx.moveTo(style.padding.left, xAxis.yStart + 0.5)
        ctx.lineTo(style.position.right, xAxis.yStart + 0.5)

        const xOp = ~yAxis.flag ? style.padding.left : style.position.right
        ctx.moveTo(xOp + 0.5, style.padding.top + 0.5)
        ctx.lineTo(xOp + 0.5, style.position.bottom +0.5)

        const yOp = ~xAxis.flag? style.padding.top : style.position.bottom
        ctx.moveTo(style.padding.left, yOp + 0.5 )
        ctx.lineTo(style.position.right, yOp + 0.5 )
      }

      if (style.axis.showRate) {
        var rateX = yAxis.flag > 0 ? style.padding.left : style.position.right

        ctx.moveTo(rateX + 0.5, style.padding.top)
        ctx.lineTo(rateX + 0.5, style.position.bottom)

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
        const val = y.actual.toFixed(pricePrecision)
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
          var width = style.position.right - style.padding.left
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
        var rateX = yAxis.flag > 0 ? 0 : style.position.right

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
    const { dataSource, ctx, coord, style, filterData, pricePrecision, dataStyle } = this
    if (dataSource.timeRanges !== undefined &&
        dataSource.baseValue !== undefined){
      var y = ~~Utils.Coord.linearActual2Display(dataSource.baseValue, coord.y)
      Draw.Stroke(ctx, ctx => {
        ctx.lineWidth = 2
        ctx.setLineDash([5,5])
        ctx.moveTo(style.padding.left, y)
        ctx.lineTo(style.position.right, y)
      }, dataStyle.baseValue)
    }

    // draw current price
    const mainSeries = dataSource.series.find(s => s.main)

    if (dataSource.data.length > 0){
      if (mainSeries){

        const x = style.axis.yAxisPos === 'right' ? style.position.right : 0
        const width = style.axis.yAxisPos === 'right' ? style.padding.right : style.padding.left
        const last = dataSource.data[dataSource.data.length - 1]
        const value = last[mainSeries.c || mainSeries.valIndex]
        const y = ~~Utils.Coord.linearActual2Display(value, coord.y)

        Draw.Stroke(ctx, ctx => {
          ctx.lineWidth = style.tip.currPrice.lineWidth

          ctx.moveTo(style.padding.left, y + 0.5)
          ctx.lineTo(style.position.right, y + 0.5)

        }, style.tip.currPrice.lineColor)

        Draw.Fill(ctx, ctx => {
          ctx.rect(x,
                  y - style.tip.currPrice.labelHeight / 2,
                  width,
                  style.tip.currPrice.labelHeight)

        }, style.tip.currPrice.labelBg)

        Draw.Text(ctx, ctx => {
          ctx.fillText(value.toFixed(pricePrecision),
                      x + style.axis.scaleLength + style.axis.labelPos.yAxis.x,
                      y + 5)

        }, style.tip.currPrice.labelColor)
      }
    }

    // draw highest and lowest price
    if(style.lastDot.show && mainSeries && filterData && filterData.data && filterData.data.length) {
      let max = filterData.data[0]
      let min = filterData.data[0]
      if (mainSeries.type === 'candlestick' || mainSeries.type === 'OHLC'){

        var highIndex = mainSeries.h
        var lowIndex = mainSeries.l
      } else {
        highIndex = mainSeries.valIndex
        lowIndex = mainSeries.valIndex
      }

      filterData.data.forEach((item) => {
        if (item[highIndex] > max[highIndex])
          max = item
        if (item[lowIndex] < min[lowIndex])
          min = item
      })

      const maxVal = max[highIndex].toFixed(pricePrecision)
      const maxY = ~~Utils.Coord.linearActual2Display(max[highIndex], coord.y) + 0.5
      const minVal = min[lowIndex].toFixed(pricePrecision)
      const minY = ~~Utils.Coord.linearActual2Display(min[lowIndex], coord.y) + 0.5

      Draw.Stroke(ctx, ctx => {
        ctx.setLineDash([5,5])
        ctx.moveTo(style.padding.left, maxY)
        ctx.lineTo(style.position.right, maxY)
      }, style.tip.highColor)

      Draw.Stroke(ctx, ctx => {
        ctx.setLineDash([5,5])
        ctx.moveTo(style.padding.left, minY)
        ctx.lineTo(style.position.right, minY)
      }, style.tip.lowColor)

      Draw.Text(ctx, ctx => {
        const width = ctx.measureText(maxVal).width
        ctx.fillText(maxVal,
                     style.position.right + style.axis.scaleLength + style.axis.labelPos.yAxis.x,
                     maxY + 5)
      }, style.tip.highColor)

      Draw.Text(ctx, ctx => {
        const width = ctx.measureText(minVal).width
        ctx.fillText(minVal,
                     style.position.right + style.axis.scaleLength + style.axis.labelPos.yAxis.x,
                     minY + 5)
      }, style.tip.lowColor)
    }
  }
}


function axisClean(chart) {
  const {ctx, style, originHeight, originWidth } = chart
  // clear axis region
  // 用bg先刷一次 防止AXIS颜色设置成透明时 不能正确截取图表
  Draw.Fill(ctx, ctx => {
    ctx.rect(0, 0, originWidth, style.padding.top)
    ctx.rect(0, 0, style.padding.left, originHeight)
    ctx.rect(style.position.right, 0, style.padding.right, originHeight)
    ctx.rect(0, style.position.bottom, originWidth, style.padding.bottom)
  }, style.grid.bg)

  Draw.Fill(ctx, ctx => {
    ctx.rect(0, 0, originWidth, style.padding.top)
    ctx.rect(0, 0, style.padding.left, originHeight)
    ctx.rect(style.position.right, 0, style.padding.right, originHeight)
    ctx.rect(0, style.position.bottom, originWidth, style.padding.bottom)
  }, style.axis.bgColor)
}
