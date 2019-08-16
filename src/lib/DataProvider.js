import Utils from './Utils'

export default class DataProvider {
  constructor(dataSource, chartType, chart) {
    this._dataSource = dataSource
    this._chartType = chartType
    this._chart = chart
    this._panes = null
    this._filteredData = null
    if(this._dataSource && this._dataSource.data && this._dataSource.data.length) {
      this.produce()
    }
    this._coord = null
    // this._filteredData
  }

  get panes() {
    return this._panes
  }

  get filteredData() {
    return this._filteredData
  }

  get coord() {
    return this._coord
  }

  produce() {
    if (this._chartType === 'unscalable'){
      this.genPanes()
    } else {
      this.filterData()
    }
    this.genCoord()
  }

  genPanes() {
    const { style, viewport } = this._chart
    const {data, timeIndex, timeRanges, timeRangesRatio } = this._dataSource
    let chartWidth = viewport.right - viewport.left

    const paneData = Utils.Coord.datafilterByTimeRanges(data, timeRanges, timeIndex)

    const paneCoords = timeRanges.map((range, index) => {
      // calc each panes position-x
      let left, right
      if (timeRangesRatio) {
        let prevRatio = timeRangesRatio.slice(0, index).reduce((acc, x) => {
          return acc + x
        }, 0)
        left = Math.round(style.padding.left + prevRatio * chartWidth)
        right = Math.round(left + this._dataSource.timeRangesRatio[index] * chartWidth)
      } else {
        const coordWidth = chartWidth / this._dataSource.timeRanges.length
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
        item.x = ~~Utils.Coord.linearActual2Display(item[this._dataSource.timeIndex], paneCoords[index].x)
      })
    })

    this._panes = paneCoords.map((paneCoord, index) => ({
      paneCoord,
      paneData: paneData[index]
    }))

    this._filteredData = {
      data : paneData.flat()
    }
  }

  filterData() {
    const { viewport, style } = this._chart
    const { data } = this._dataSource

    this._filteredData = Utils.Coord.dataFilterByViewport(data,
      viewport, style)
  }

  genCoord() {
    // for data with no timeRanges,
    // use offset & width of data to calc data
    const { viewport, style, dataSource } = this._chart
    const { series, timeIndex, baseValue, touchTop } = this._dataSource


    // calculate actual-x-range of data
    let xActual = [
      this._filteredData.data[0][timeIndex],
      this._filteredData.data[this._filteredData.data.length - 1][timeIndex]
    ]

    // calculate actual range of data
    let yRange = Utils.Coord.calcYRange(this._filteredData.data, series)
    // yRange的初步处理，有baseValue时对称处理，最大最小值相等时增加差异
    let yActual = Utils.Coord.adjustYRange(yRange, touchTop, style, viewport, baseValue, style.pricePrecision)

    // create coord
    this._coord = {
      x: {display: [style.padding.left, viewport.right], actual:
        xActual},
      y: {display: [viewport.bottom, style.padding.top], actual: yActual},
      viewport
    }

    this.genHorizLines()
    this.genVerticalLines()
  }

  genHorizLines() {
    const { style } = this._chart
    const { baseValue, touchTop } = this._dataSource

    let yActual = this._coord.y.actual
    let horizCount = Utils.Grid.lineCount(this._coord.y.display, style.grid.limit.y, style.grid.span.y)
    let hGridLines = Utils.Grid.calcGridLines(this._coord.y.actual, horizCount, baseValue)
    if(!touchTop){
      this._coord.y.actual = [hGridLines[0], hGridLines[hGridLines.length - 1]]
    }
    let horizLines = hGridLines.map(val => {
      return {
        actual: val,
        display: ~~Utils.Coord.linearActual2Display(val, this._coord.y) + 0.5
      }
    })
    this._coord.horizLines = horizLines
  }

  genVerticalLines() {
    const { style, viewport } = this._chart
    const { timeIndex } = this._dataSource

    const verticalLines = []
    if (this._chartType === 'unscalable') {
      this._panes.forEach(pane => {
        verticalLines.push({
          display: pane.paneCoord.x.display[0] + 0.5,
          actual: pane.paneCoord.x.actual[0]
        })
      })
      verticalLines.push({
        display: this._panes[this._panes.length - 1].paneCoord.x.display[1] + 0.5,
        actual:  this._panes[this._panes.length - 1].paneCoord.x.actual[1]
      })
    } else {
      // vertical grid line drawing for candlestick chart
      for (var l = this._filteredData.data.length - 1; l >= 0; l -= Math.round(style.grid.span.x / viewport.barWidth)) {
        if (this._filteredData.data[l].x > viewport.left &&
          this._filteredData.data[l].x <= viewport.right)
          verticalLines.push({
            display: ~~this._filteredData.data[l].x + 0.5,
            actual: this._filteredData.data[l][timeIndex]
          })
      }
    }
    this._coord.verticalLines = verticalLines
  }
}
