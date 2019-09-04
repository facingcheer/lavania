import Utils from './Utils'
import dateFormatter from './utils/dateFormatter'
import textLabelPainter from './painter/textLabelPainter'
import rafThrottle from './utils/rafThrottle'

export function genEvent(chart, type) {
  let e = {}
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
  }

  Object.entries(eventSource[type]).forEach(([name, func]) => {
      e[name] = rafThrottle(event => {
      if (!event) {
        return
      }
      func(chart, event)
      if (chart.linkedCharts.size) {
        [...chart.linkedCharts].forEach(linkedChart => {
          func(linkedChart, event, true)
        })
      }
    })
  })
  return e
}


const eventSource = {
  scalable: {
    mouseMoveEvent:(...args) => {
      _processEventUnits(['clean', 'crosshair', 'axisLabel', 'selectDot', 'toolTip'], args)
    },
    mouseLeaveEvent: (...args) => {
      _processEventUnits(['clean'], args)
    },
    mouseDownEvent: (...args) => {
      _processEventUnits(['dragStart'], args)
    },
    panStartEvent: (...args) => {
      _processEventUnits(['panStart'], args)
    },
    panMoveEvent: (...args) => {
      _processEventUnits(['panMove'], args)
    },
    panEndEvent:(...args) => {
      _processEventUnits(['panEnd'], args)
    },
    mouseUpEvent: (...args) => {
      _processEventUnits(['dragEnd'], args)
    },
    mouseWheelEvent: (...args) => {
      _processEventUnits(['mouseWheel'], args)
    },
    pinchStartEvent: (...args) => {
      _processEventUnits(['pinchStart'], args)
    },
    pinchMoveEvent: (...args) => {
      _processEventUnits(['pinchMove'], args)
    },
    pinchEndEvent: (...args) => {
      _processEventUnits(['pinchEnd'], args)
    },
  },
  unscalable: {
    mouseMoveEvent: (...args) => {
      _processEventUnits(['clean', 'crosshair', 'axisLabel', 'selectDot'], args)
    },
    mouseLeaveEvent: (...args) => {
      _processEventUnits(['clean'], args)
    }
  }
}


const events = {
  crosshair(chart, e, linked) {

    if (!linked &&
      (e.localY < chart.viewport.top ||
        e.localY > chart.viewport.bottom))
      return

    if (e.localX < chart.viewport.left ||
      e.localX > chart.viewport.right)
      return

    let verticalPos, horizPos

    let [selectedItem, selectedIndex] = getNearest[chart.type](chart, e.localX) || [null, null]

    if (chart.eventInfo) {
      chart.eventInfo.selectedItem = selectedItem
      chart.eventInfo.selectedIndex = selectedIndex
    }

    if (!chart.eventInfo.selectedItem) return
    const mainSeries = chart.seriesInfo.series[chart.seriesInfo.mainSeriesIndex || 0]
    Utils.Draw.Stroke(chart.iaCtx, ctx => {
      ctx.lineWidth = chart.style.crosshair.lineWidth || 1
      ctx.setLineDash(chart.style.crosshair.dash)
      // verticalPos = e.localX

      var fixOffset = (ctx.lineWidth % 2 ? 0.5 : 0)
      // draw horizontal line

      let snapPointIndex
      if (chart.style.crosshair.snapProperty && mainSeries[chart.style.crosshair.snapProperty]){
        snapPointIndex = mainSeries[chart.style.crosshair.snapProperty]
      } else {
        snapPointIndex = mainSeries['valIndex' || 'closeIndex']
      }
      // if(!snapPointIndex) return

      if (!linked) {
        chart.eventInfo.yPos = chart.style.crosshair.snapToData && snapPointIndex && chart.eventInfo.selectedItem ?
          ~~Utils.Coord.linearActual2Display(chart.eventInfo.selectedItem[snapPointIndex], chart.dataProvider.coord.y) :
          e.localY
        ctx.moveTo(chart.viewport.left, ~~chart.eventInfo.yPos + fixOffset)
        ctx.lineTo(chart.viewport.right, ~~chart.eventInfo.yPos + fixOffset)
      }

      chart.eventInfo.xPos = chart.eventInfo.selectedItem.x
      // draw vertical line
      ctx.moveTo(~~chart.eventInfo.selectedItem.x + fixOffset, chart.viewport.top)
      ctx.lineTo(~~chart.eventInfo.selectedItem.x + fixOffset, chart.viewport.bottom)

    }, chart.style.crosshair.color)

  },
  axisLabel(chart, e, linked) {
    // const chart = this

    if (!chart.eventInfo.selectedItem) return
    // find the horizontal label width
    let hoverTime = chart.eventInfo.selectedItem[chart.seriesInfo.timeIndex]

    let hoverTimeStr = dateFormatter(hoverTime, chart.style.dateFormat)
    const mainSeries = chart.seriesInfo.series[chart.seriesInfo.mainSeriesIndex || 0]

    textLabelPainter({
      ctx: chart.iaCtx,
      text: hoverTimeStr,
      origin: {
        x: chart.style.crosshair.axisLabel.posOffset.xAxisLabel.x + chart.eventInfo.selectedItem.x,
        y: chart.style.crosshair.axisLabel.posOffset.xAxisLabel.y + (chart.style.crosshair.axisLabel.xAxisLabelPos === 'bottom' ? chart.viewport.bottom : chart.viewport.top - chart.style.crosshair.axisLabel.height)
      },
      originPos: chart.style.crosshair.axisLabel.xAxisLabelPos === 'bottom' ? 'top' : 'bottom',
      bound: {
        xMax: chart.originWidth,
        yMax: chart.originHeight
      },
      style: chart.style.crosshair.axisLabel,
      font: chart.style.font
    })

    if (linked) return

    let snapPointIndex
    if (chart.style.crosshair.snapProperty && mainSeries[chart.style.crosshair.snapProperty]){
      snapPointIndex = mainSeries[chart.style.crosshair.snapProperty]
    } else {
      snapPointIndex = mainSeries['valIndex' || 'closeIndex']
    }
    if(!snapPointIndex) return

    let horizPos = chart.style.crosshair.snapToData && chart.eventInfo.selectedItem ?
      ~~Utils.Coord.linearActual2Display(chart.eventInfo.selectedItem[snapPointIndex], chart.dataProvider.coord.y) : e.localY
    let hoverValue
    if(!linked) {
      hoverValue = Utils.Math.valueFormat(Utils.Coord.linearDisplay2Actual(horizPos, chart.dataProvider.coord.y),chart.style.valueFormatter, chart.style.valuePrecision)
    } else {
      hoverValue = 0
    }

    textLabelPainter({
      ctx: chart.iaCtx,
      text: hoverValue,
      origin: {
        x: chart.style.crosshair.axisLabel.posOffset.yAxisLabel.x + (chart.style.crosshair.axisLabel.yAxisLabelPos === 'right' ? chart.viewport.right : 0),
        y: chart.style.crosshair.axisLabel.posOffset.yAxisLabel.y + horizPos
      },
      originPos: chart.style.crosshair.axisLabel.yAxisLabelPos === 'right' ? 'left' : 'right',
      bound: {
        xMax: chart.originWidth,
        yMax: chart.originHeight
      },
      style: chart.style.crosshair.axisLabel,
      font: chart.style.font
    })
  },

  selectDot(chart, e, linked) {
    // const chart = this
    if (!chart.eventInfo.selectedItem || !chart.style.crosshair.snapToData) return
    const mainSeries = chart.seriesInfo.series[chart.seriesInfo.mainSeriesIndex || 0]

    let snapPointIndex
    if (chart.style.crosshair.snapProperty && mainSeries[chart.style.crosshair.snapProperty]){
      snapPointIndex = mainSeries[chart.style.crosshair.snapProperty]
    } else {
      snapPointIndex = mainSeries['valIndex' || 'closeIndex']
    }
    if(!snapPointIndex) return

    let radius = chart.style.crosshair.selectedPoint.radius
    chart.style.crosshair.selectedPoint.color.forEach((color, index) => {
      Utils.Draw.Fill(chart.iaCtx, ctx => {
        ctx.arc(chart.eventInfo.selectedItem.x + 0.5,
          Utils.Coord.linearActual2Display(chart.eventInfo.selectedItem[snapPointIndex], chart.dataProvider.coord.y) - 1.5,
          radius[index], 0, 2 * Math.PI)
      }, color)
    })
  },
  toolTip(chart, e, linked) {
    if (!chart.eventInfo.selectedItem) return
    chart.toolTipLayer.innerHTML = ''
    let d = document.createElement('div')
    if(!chart.style.crosshair.toolTip || Object.prototype.toString.call(chart.style.crosshair.toolTip) !== '[object Function]') return
     chart.style.crosshair.toolTip(chart.eventInfo, dom=> {
      d.innerHTML = dom
      d.style.position = 'absolute'
      d.style.left = 0
      d.style.visibility = 'hidden'
      d.style.top = 0
      chart.toolTipLayer.appendChild(d)

      let { left, top } = calcBoxPositionInBounding({
        x: chart.eventInfo.xPos,
        y: chart.eventInfo.yPos
      }, {
        width: d.clientWidth,
        height: d.clientHeight
      }, {
        width: chart.toolTipLayer.clientWidth,
        height: chart.toolTipLayer.clientHeight
      })

      d.style.left = left + 'px'
      d.style.top = top + 'px'
      d.style.visibility = 'visible'
    })

    // console.log(d, d.offsetHeight, d.offsetWidth)
  },

  panStart(chart, e, linked) {
    if (linked) return
    chart.eventInfo.dragStart.offset = chart.viewport.offset
  },

  panMove(chart, e, linked) {
    if (linked) return

    let newOffset = chart.eventInfo.dragStart.offset - e.deltaX
    // console.log('move', chart.eventInfo.dragStart.offset, e.deltaX, newOffset, chart.viewport.right - chart.viewport.left - chart.viewport.barWidth * 5)

    if ((e.deltaX < 0 && newOffset < chart.viewport.right - chart.viewport.left - chart.viewport.barWidth * 5) ||
      (e.deltaX > 0 && newOffset > chart.viewport.barWidth * -(chart.dataSource.length - 5))) {
      chart.viewport.offset = newOffset
      chart.rerender()
    }
  },

  panEnd(chart, e, linked) {
    if (linked) return
    chart.eventInfo.dragStart.offset = chart.viewport.offset
  },

  pinchStart(chart, e, linked) {
    if (linked) return
    chart.eventInfo.pinchStart.offset = chart.viewport.offset
    chart.eventInfo.pinchStart.barWidth = chart.viewport.barWidth
    chart.eventInfo.pinchStart.center = e.center
    let [selectedItem, selectedIndex] = getNearest[chart.type](chart, e.center.x) || [null, null]
    chart.eventInfo.selectedItem = selectedItem
    chart.eventInfo.selectedIndex = selectedIndex
  },

  pinchMove(chart, e, linked) {
    if (linked) return
    if (!chart.eventInfo.selectedItem|| !chart.eventInfo.selectedIndex) {
      return
    }
    let zoomScale = e.scale - 1


    let offsetIndex = chart.dataSource.length - chart.eventInfo.selectedIndex - 1
    const oldBarWidth = chart.eventInfo.pinchStart.barWidth

    // const scaleDivision = 100 / chart.style.wheelZoomSpeed
    const scaleDivision = 1
    if (chart.eventInfo.pinchStart.barWidth + oldBarWidth * (zoomScale / scaleDivision) > 4 && chart.eventInfo.pinchStart.barWidth + oldBarWidth * (zoomScale / scaleDivision) < 64) {
      chart.viewport.barWidth = chart.eventInfo.pinchStart.barWidth + oldBarWidth * (zoomScale / scaleDivision)
      chart.viewport.offset = chart.eventInfo.pinchStart.offset - offsetIndex * oldBarWidth * (zoomScale / scaleDivision)
    }
    if (chart.viewport.offset > 0) {
      chart.viewport.offset = 0
    }
    chart.rerender()
  },

  pinchEnd(chart, e, linked) {
    if (linked) return
  },

  pinchEvent(pinchPoint, scale) {
  },

  clean(chart, e, linked) {
    if(chart.toolTipLayer){
      chart.toolTipLayer.innerHTML = ''
    }
    chart.iaCtx.clearRect(0, 0, chart.originWidth, chart.originHeight)
  },

  pinch(chart, e, linked) {
  },

  mouseWheel(chart, e, linked) {
    if (linked) return
    let zoomScale = Math.sign(e.deltaY) * Math.min(1, Math.abs(e.deltaY))

    let [selectedItem, selectedIndex] = getNearest[chart.type](chart, e.localX) || [null, null]
    if (!selectedIndex || !selectedItem) {
      return
    }

    let offsetIndex = chart.dataSource.length - selectedIndex - 1
    const oldViewport = chart.viewport.barWidth

    const scaleDivision = 100/ chart.style.zoomSpeed

    if (chart.viewport.barWidth + oldViewport * (zoomScale / scaleDivision) > 4 && chart.viewport.barWidth + oldViewport * (zoomScale / scaleDivision) < 64) {
      chart.viewport.barWidth += oldViewport * (zoomScale / scaleDivision)
      chart.viewport.offset -= offsetIndex * oldViewport * (zoomScale / scaleDivision)
    }
    if (chart.viewport.offset > 0) {
      chart.viewport.offset = 0
    }
    chart.rerender()
  },
}

const getNearest = {
  scalable(chart, xpos) {
    const filteredData = chart.dataProvider.filteredData.data.map(item => item.x)
    // for (let l = filteredData.length - 1; l >= 0; l--) {
    //   if (Math.abs(xpos - filteredData[l]) <= chart.viewport.barWidth / 2) {
    //     return [chart.dataSource[l + chart.dataProvider.filteredData.leftOffset], l + chart.dataProvider.filteredData.leftOffset]
    //   }
    // }
    for (let l = filteredData.length - 1; l > 0; l--) {
      if ((xpos - filteredData[l]) * (xpos - filteredData[l - 1]) < 0) {
        if(Math.abs(xpos - filteredData[l]) < Math.abs(xpos - filteredData[l - 1])) {
          return [chart.dataSource[l + chart.dataProvider.filteredData.leftOffset], l + chart.dataProvider.filteredData.leftOffset]
        } else {
          return [chart.dataSource[l - 1 + chart.dataProvider.filteredData.leftOffset], l - 1 + chart.dataProvider.filteredData.leftOffset]
        }
      }
    }
  },

  unscalable(chart, xpos) {
    let rangeIndex = 0
    // multiRange charts has diffrent scales in diffrent ratio parts
    if (chart.seriesInfo.timeRangesRatio) {
      const widthRatio = chart.seriesInfo.timeRangesRatio
      const width = chart.viewport.right - chart.viewport.left
      for (let i = 0; i < widthRatio.length; i++) {
        let ratio = widthRatio[i]
        let prevRatio = widthRatio.slice(0, i).reduce((acc, x) => acc + x, 0)
        let left = Math.round(chart.viewport.left + prevRatio * width)
        let right = Math.round(left + ratio * width)
        if (xpos >= left && xpos <= right) {
          rangeIndex = i
          break
        }
      }
    }


    const filteredData = chart.dataProvider.panes.map(pane => pane.paneData)
    // console.log(filteredData,rangeIndex)

    for (let l = filteredData[rangeIndex].length - 1; l > 0; l--) {

      if ((xpos - filteredData[rangeIndex][l].x) * (xpos - filteredData[rangeIndex][l - 1].x) < 0) {
        if(Math.abs(xpos - filteredData[rangeIndex][l].x) < Math.abs(xpos - filteredData[rangeIndex][l - 1].x)) {
          return [filteredData[rangeIndex][l], l]
        } else {
          return [filteredData[rangeIndex][l-1], l-1]
        }
      }
    }
  }
}

function _processEventUnits(units, args) {
  units.forEach(name => events[name] && events[name](...args))
}


function calcBoxPositionInBounding(origin, box, bounding, minMargin = 20) {
  let horizPos, verticalPos
  if(origin.x + box.width + minMargin < bounding.width) {
    //can set in right
    horizPos = origin.x + minMargin
  } else {
    // set in left
    if(origin.x - box.width - minMargin < 0) {
      // alert('tooltip is too wide to set in chart')
      horizPos = bounding.width - box.width - minMargin
    } else {
      horizPos = origin.x - box.width - minMargin
    }
  }

  if(origin.y + box.height + minMargin < bounding.height) {
    //can set in bottom
    verticalPos = origin.y + minMargin
  } else {
    if(origin.y - box.height - minMargin < 0) {
      console.log('tooltip is too high to set in chart')
      verticalPos = bounding.height - box.height - minMargin
    } else {
      verticalPos = origin.y - box.height - minMargin
    }
    // set in top

  }
  return {
    left: horizPos,
    top: verticalPos
  }
}
