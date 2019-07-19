import Utils from './Utils'
import Draw from './utils/Draw'
import Painter from './painter/index'


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
        left = Math.round(this.style.padding.left + prevRatio * chartWidth)
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

    this.filterData = {
      data : paneData.flat()
    }
  }

  filterData() {
    const { data } = this.dataSource
    const { viewport, style } = this
    this.filterData = Utils.Coord.dataFilterByViewport(data,
      viewport, style)
  }

  genCoord() {
    // for data with no timeRanges,
    // use offset & width of data to calc data
    const { series, timeIndex, baseValue, touchTop } = this.dataSource
    const { viewport, style, filterData, pricePrecision } = this

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
    const { coord, style } = this
    const { baseValue, touchTop } = this.dataSource
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
    this.coord.horizLines = horizLines
  }

  genVerticalLines() {
    const { style } = this
    const { timeRanges } = this.dataSource
    var verticalLines = []
    if (timeRanges) {
      this.panes.forEach(pane => {
        verticalLines.push({
          display: pane.paneCoord.x.display[0] + 0.5,
          actual: pane.paneCoord.x.actual[0]
        })
      })
      verticalLines.push({
        display: this.panes[this.panes.length - 1].paneCoord.x.display[1] + 0.5,
        actual: this.panes[this.panes.length - 1].paneCoord.x.actual[1]
      })
    } else {
      // vertical grid line drawing for candlestick chart
      for (var l = this.filterData.data.length - 1; l >= 0; l -= ~~(this.style.grid.span.x / this.viewport.width)) {
        if (this.filterData.data[l].x > style.padding.left &&
          this.filterData.data[l].x <= style.position.right)
          verticalLines.push({
            display: ~~this.filterData.data[l].x + 0.5,
            actual: this.filterData.data[l][this.dataSource.timeIndex]
          })
      }
    }
    this.coord.verticalLines = verticalLines
  }


  drawGrid() {
    const { coord, style } = this
    // draw horizontal lines
    const hLines = style.axis.hideBorder ? coord.horizLines.slice(1,-1) : coord.horizLines
    if (coord.horizLines) {
      Draw.Stroke(this.ctx, ctx => {
        hLines.forEach((y, index) => {
          ctx.moveTo(style.padding.left, y.display)
          ctx.lineTo(style.position.right, y.display)
        })
      }, style.grid.color.x)
    }

    const vLines = style.axis.hideBorder ? coord.verticalLines.slice(1,-1) : coord.verticalLines
    // draw vertical lines
    if(coord.verticalLines){
      Draw.Stroke(this.ctx, ctx => {
        vLines.forEach((val, ind) => {
          ctx.moveTo(val.display, style.padding.top)
          ctx.lineTo(val.display, style.position.bottom)
        })
      }, style.grid.color.y)
    }
  }

  drawSeries() {
   const { series, valueIndex } = this.dataSource
   const { coord } = this

   series.map(s => {
     if (s.type === 'line' || s.type === 'mountain' || s.type === 'candlestick' || s.type === 'OHLC') {
      Painter[s.type](this.ctx, this.filterData.data, coord, s)
     }
     if(s.type === 'column') {
       if(this.dataSource.timeRanges) {
          Painter.panesColumn(this.ctx, this.panes, coord, s)
       }
       if(!this.dataSource.timeRanges) {
          Painter.column(this.ctx, this.filterData.data, coord, s, this.style.position.bottom)
        }
     }
   })
  }

  drawAxis() {
    const {ctx, style, originHeight, originWidth } = this
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
    Draw.Stroke(this.ctx, ctx => {
      this.coord.horizLines.forEach(hl => {
        ctx.moveTo(yAxis.scaleStart, hl.display)
        ctx.lineTo(yAxis.scaleStart + style.axis.scaleLength * yAxis.flag , hl.display)
      })

      this.coord.verticalLines.forEach(vl => {
        ctx.moveTo(vl.display, xAxis.yStart)
        ctx.lineTo(vl.display, xAxis.yStart + this.style.axis.scaleLength * xAxis.flag)
      })

      // draw axis line
      ctx.moveTo(yAxis.scaleStart + 0.5, this.style.padding.top)
      ctx.lineTo(yAxis.scaleStart + 0.5, this.style.position.bottom)

      ctx.moveTo(style.padding.left, xAxis.yStart + 0.5)
      ctx.lineTo(style.position.right, xAxis.yStart + 0.5)

      if (style.axis.showBorder) {
        const xOp = ~yAxis.flag ? style.padding.left : style.position.right
        ctx.moveTo(xOp + 0.5, style.padding.top + 0.5)
        ctx.lineTo(xOp + 0.5, style.position.bottom +0.5)
        const yOp = ~xAxis.flag? style.padding.top : style.position.bottom
        ctx.moveTo(this.style.padding.left, yOp )
        ctx.lineTo(this.style.position.right, yOp )
      }

      if (this.style.axis.showRate) {
        var rateX = yAxis.flag > 0 ? this.style.padding.left : this.style.position.right

        ctx.moveTo(rateX + 0.5, this.style.padding.top)
        ctx.lineTo(rateX + 0.5, this.style.position.bottom)

        this.coord.horizLines.forEach((y) => {
          ctx.moveTo(rateX, y.display)
          ctx.lineTo(rateX + this.style.axis.scaleLength * -yAxis.flag, y.display)
        })
      }
    }, this.style.axis.lineColor)

    // draw labels
    var rates = {
      up: [],
      down: []
    }
    Draw.Text(this.ctx, (ctx) => {
      this.coord.horizLines.forEach((y, index) => {
        var val = y.actual.toFixed(this.pricePrecision)
        var xOffset = this.style.axis.labelPos.yAxis.x

        var yPos = y.display + this.style.axis.labelPos.yAxis.y
        if (yPos < 10)
          yPos += 10
        if (yPos > this.originHeight - 10)
          yPos -= 10

        ctx.fillText(val,
          yAxis.xStart + this.style.axis.scaleLength + xOffset,
          yPos)
      })

      if (!this.dataSource.timeRanges) {
        this.coord.verticalLines.forEach((x) => {
          ctx.fillText(Utils.Coord.getDateStr(x.actual, this.style.axis.hideCandlestickDate, this.style.axis.hideCandlestickTime),
            x.display + this.style.axis.labelPos.xAxis.x + ((this.style.axis.hideCandlestickDate || this.style.axis.hideCandlestickTime) && 15),
            xAxis.yStart + this.style.axis.labelPos.xAxis.y * xAxis.flag)
        })
      } else {
        this.dataSource.timeRanges.forEach((range, index) => {
          var width = this.style.position.right - this.style.padding.left
          var displayRange = [
            index * width / this.dataSource.timeRanges.length,
            (index + 1) * width / this.dataSource.timeRanges.length
          ]
          if (this.dataSource.timeRangesRatio) {
            var widthRatio = this.dataSource.timeRangesRatio
            var prevRatio = widthRatio.slice(0, index).reduce( (acc, x) => {
              return acc + x
            }, 0)
            var ratio = widthRatio[index]
            var left = Math.round(this.style.padding.left + prevRatio * width)
            var right = Math.round(left + ratio * width)
            displayRange = [left, right]
          }

          ctx.fillText(Utils.Coord.getDateStr(range[0], true),
            displayRange[0] + 5,
            xAxis.yStart + this.style.axis.labelPos.xAxis.y * xAxis.flag)

          var strWidth = ctx.measureText(Utils.Coord.getDateStr(range[1], true)).width
          ctx.fillText(Utils.Coord.getDateStr(range[1], true),
            displayRange[1] - strWidth - 5,
            xAxis.yStart + this.style.axis.labelPos.xAxis.y * xAxis.flag)
        })
      }


      if (this.style.axis.showRate) {
        var rateX = yAxis.flag > 0 ? 0 : this.style.position.right

        this.coord.horizLines.forEach((y, index) => {
          var val = ((y.actual - this.dataSource.baseValue) / this.dataSource.baseValue)
          var xOffset = ctx.measureText(val.toFixed(2) + '%').width + this.style.axis.labelPos.yAxis.x

          var yPos = y.display + this.style.axis.labelPos.yAxis.y
          if (yPos < 10)
            yPos += 10
          if (yPos > this.originHeight - 10)
            yPos -= 10

          if (val === 0)
            ctx.fillText(val.toFixed(2) + '%',
              rateX + this.style.axis.scaleLength + xOffset * yAxis.flag,
              yPos)
          else {
            rates[val > 0 ? 'up' : 'down'].push([(val * 100).toFixed(2) + '%',
              rateX + this.style.axis.scaleLength + xOffset * yAxis.flag,
              yPos
            ])
          }
        })

      }

    }, this.style.axis.labelColor)

    for (var direction in rates) {
      Draw.Text(this.ctx, (ctx) => {
        rates[direction].forEach((item) => {
          ctx.fillText(item[0], item[1], item[2])
        })
      }, this.dataStyle.OHLC[direction])
    }
  }

  drawAdditionalTips() {
    if (this.dataSource.timeRanges !== undefined &&
        this.dataSource.baseValue !== undefined){
      var y = ~~Utils.Coord.linearActual2Display(this.dataSource.baseValue, this.coord.y)
      Draw.Stroke(this.ctx, ctx => {
        ctx.lineWidth = 2
        ctx.setLineDash([5,5])
        ctx.moveTo(this.style.padding.left, y)
        ctx.lineTo(this.style.position.right, y)
      }, this.dataStyle.baseValue)
    }

    // draw current price
    if (this.dataSource.data.length > 0){
      if (this.dataSource.series[0].main){

        const x = this.style.axis.yAxisPos === 'right' ? this.style.position.right : 0
        const width = this.style.axis.yAxisPos === 'right' ? this.style.padding.right : this.style.padding.left
        const last = this.dataSource.data[this.dataSource.data.length - 1]
        const value = last[this.dataSource.series[0].c === undefined ? this.dataSource.series[0].valIndex : this.dataSource.series[0].c]
        const y = ~~Utils.Coord.linearActual2Display(value, this.coord.y)

        Draw.Stroke(this.ctx, ctx => {
          ctx.lineWidth = this.style.tip.currPrice.lineWidth

          ctx.moveTo(this.style.padding.left, y + 0.5)
          ctx.lineTo(this.style.position.right, y + 0.5)

        }, this.style.tip.currPrice.lineColor)

        Draw.Fill(this.ctx, ctx => {
          ctx.rect(x,
                  y - this.style.tip.currPrice.labelHeight / 2,
                  width,
                  this.style.tip.currPrice.labelHeight)

        }, this.style.tip.currPrice.labelBg)

        Draw.Text(this.ctx, ctx => {
          ctx.fillText(value.toFixed(this.pricePrecision),
                      x + this.style.axis.scaleLength + this.style.axis.labelPos.yAxis.x,
                      y + 5)

        }, this.style.tip.currPrice.labelColor)

      }
    }

    // draw highest and lowest price
    if (this.dataSource.series[0].type === 'candlestick'){
      var max = this.filterData.data[0]
      var min = this.filterData.data[0]
      var highIndex = this.dataSource.series[0].h
      var lowIndex = this.dataSource.series[0].l
      if (this.dataSource.series[0].as === 'mountain'){
        highIndex = this.dataSource.series[0].c
        lowIndex = this.dataSource.series[0].c
      }

      this.filterData.data.forEach((item) => {
        if (item[highIndex] > max[highIndex])
          max = item
        if (item[lowIndex] < min[lowIndex])
          min = item
      })

      var maxVal = max[highIndex].toFixed(this.pricePrecision)
      var maxY = ~~Utils.Coord.linearActual2Display(max[highIndex], this.coord.y) + 0.5
      var minVal = min[lowIndex].toFixed(this.pricePrecision)
      var minY = ~~Utils.Coord.linearActual2Display(min[lowIndex], this.coord.y) + 0.5

      Draw.Stroke(this.ctx, ctx => {
        ctx.setLineDash([5,5])
        ctx.moveTo(this.style.padding.left, maxY)
        ctx.lineTo(this.style.position.right, maxY)
      }, this.style.tip.highColor)

      Draw.Stroke(this.ctx, ctx => {
        ctx.setLineDash([5,5])
        ctx.moveTo(this.style.padding.left, minY)
        ctx.lineTo(this.style.position.right, minY)
      }, this.style.tip.lowColor)

      Draw.Text(this.ctx, ctx => {
        var width = ctx.measureText(maxVal).width
        ctx.fillText(maxVal,
                     this.style.position.right + this.style.axis.scaleLength + this.style.axis.labelPos.yAxis.x,
                     maxY + 5)
      }, this.style.tip.highColor)

      Draw.Text(this.ctx, ctx => {
        var width = ctx.measureText(minVal).width
        ctx.fillText(minVal,
                     this.style.position.right + this.style.axis.scaleLength + this.style.axis.labelPos.yAxis.x,
                     minY + 5)
      }, this.style.tip.lowColor)

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
