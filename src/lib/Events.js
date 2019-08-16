import Utils from './Utils'
import dateFormatter from './utils/dateFormatter'
import textLabelPainter from './painter/textLabelPainter'
import rafThrottle from './utils/rafThrottle'

export function genEvent(chart, type) {
  let e = {}
  // eslint-disable-next-line camelcase
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
      _processEventUnits(['clean', 'crosshair', 'axisLabel', 'selectDot'], args)
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

    Utils.Draw.Stroke(chart.iaCtx, ctx => {
      ctx.lineWidth = chart.style.crosshair.lineWidth || 1
      ctx.setLineDash(chart.style.crosshair.dash)
      // verticalPos = e.localX

      var fixOffset = (ctx.lineWidth % 2 ? 0.5 : 0)
      // draw horizontal line
      if (!linked) {
        chart.eventInfo.yPos = chart.style.crosshair.snapToClose && chart.eventInfo.selectedItem ?
          ~~Utils.Coord.linearActual2Display(chart.eventInfo.selectedItem[chart.dataSource.series[0].c || chart.dataSource.series[0].valIndex], chart.dataProvider.coord.y) :
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
    let hoverTime = chart.eventInfo.selectedItem[chart.dataSource.timeIndex]
    let hoverTimeStr = dateFormatter(hoverTime, '{MM}/{DD} {HH}:{mm}')
    textLabelPainter({
      ctx: chart.iaCtx,
      text: hoverTimeStr,
      origin: {
        x: chart.eventInfo.selectedItem.x,
        y: chart.style.crosshair.posOffset.horizontal.y + (chart.style.axis.xAxisPos === 'bottom' ? chart.viewport.bottom : chart.viewport.top - chart.style.crosshair.labelHeight)
      },
      originPos: 'top',
      labelHeight: 20,
      labelXPadding: 5,
      font: null,
      xMax: chart.originWidth,
      yMax: chart.originHeight,
      fontColor: '#666',
      labelBg: '#efefef'
    })

    if (linked) return

    let horizPos = chart.style.crosshair.snapToClose && chart.eventInfo.selectedItem ?
      ~~Utils.Coord.linearActual2Display(chart.eventInfo.selectedItem[chart.dataSource.series[0].c || chart.dataSource.series[0].valIndex], chart.dataProvider.coord.y) : e.localY
    let hoverValue = !linked ? Utils.Coord.linearDisplay2Actual(horizPos, chart.dataProvider.coord.y).toFixed(chart.style.pricePrecision) : 0

    textLabelPainter({
      ctx: chart.iaCtx,
      text: hoverValue,
      origin: {
        x: chart.style.crosshair.posOffset.vertical.x + (chart.style.axis.yAxisPos === 'right' ? chart.viewport.right : 0),
        y: horizPos
      },
      originPos: 'left',
      labelHeight: 20,
      labelXPadding: 10,
      font: null,
      xMax: chart.originWidth,
      yMax: chart.originHeight,
      fontColor: '#666',
      labelBg: '#efefef'
    })
  },

  selectDot(chart, e, linked) {
    // const chart = this
    if (!chart.eventInfo.selectedItem || linked) return

    let radius = chart.style.crosshair.selectedPointRadius
    chart.style.crosshair.selectedPointColor.forEach((color, index) => {
      Utils.Draw.Fill(chart.iaCtx, ctx => {
        ctx.arc(chart.eventInfo.selectedItem.x + 0.5,
          Utils.Coord.linearActual2Display(chart.eventInfo.selectedItem[chart.dataSource.series[0].c || chart.dataSource.series[0].valIndex], chart.dataProvider.coord.y) - 1.5,
          radius[index], 0, 2 * Math.PI)
      }, color)
    })
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
      (e.deltaX > 0 && newOffset > chart.viewport.barWidth * -(chart.dataSource.data.length - 5))) {
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
    console.log(e, linked)
    chart.eventInfo.pinchStart.offset = chart.viewport.offset
    chart.eventInfo.pinchStart.barWidth = chart.viewport.barWidth
    chart.eventInfo.pinchStart.center = e.center
    let [selectedItem, selectedIndex] = getNearest[chart.dataSource.timeRanges ? 'unscalable' : 'scalable'](chart, e.center.x) || [null, null]
    chart.eventInfo.selectedItem = selectedItem
    chart.eventInfo.selectedIndex = selectedIndex
  },

  pinchMove(chart, e, linked) {
    if (linked) return
    if (!chart.eventInfo.selectedItem|| !chart.eventInfo.selectedIndex) {
      console.log('no select')
      return
    }
    console.log(linked, chart.eventInfo.selectedIndex, e.scale)
    let zoomScale = e.scale - 1


    let offsetIndex = chart.dataSource.data.length - chart.eventInfo.selectedIndex - 1
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
    console.log(e, linked)
  },

  pinchEvent(pinchPoint, scale) {
    console.log(pinchPoint, scale)
  },

  clean(chart, e, linked) {
    chart.iaCtx.clearRect(0, 0, chart.originWidth, chart.originHeight)
  },

  pinch(chart, e, linked) {
    console.log(e)
  },

  mouseWheel(chart, e, linked) {
    if (linked) return
    let zoomScale = Math.sign(e.deltaY) * Math.min(1, Math.abs(e.deltaY))

    let [selectedItem, selectedIndex] = getNearest[chart.dataSource.timeRanges ? 'unscalable' : 'scalable'](chart, e.localX) || [null, null]
    if (!selectedIndex || !selectedItem) {
      console.log('no select')
      return
    }

    let offsetIndex = chart.dataSource.data.length - selectedIndex - 1
    const oldViewport = chart.viewport.barWidth

    const scaleDivision = 100/ chart.style.wheelZoomSpeed

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
    for (let l = filteredData.length; l >= 0; l--) {
      if (Math.abs(xpos - filteredData[l]) <= chart.viewport.barWidth / 2) {
        return [chart.dataSource.data[l + chart.dataProvider.filteredData.leftOffset], l + chart.dataProvider.filteredData.leftOffset]
      }
    }
    // console.log(event.localX, filteredData, chart.viewport.barWidth)
  },

  unscalable(chart, xpos) {
    let rangeIndex = 0
    // multiRange charts has diffrent scales in diffrent ratio parts
    if (chart.dataSource.timeRangesRatio) {
      const widthRatio = chart.dataSource.timeRangesRatio
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

    for (let l = filteredData[rangeIndex].length - 1; l >= 0; l--) {
      var halfWidth = (filteredData[rangeIndex][1].x - filteredData[rangeIndex][0].x) / 2
      halfWidth = halfWidth < 1 ? 1 : halfWidth
      // console.log(l,filteredData[rangeIndex])
      if (Math.abs(xpos - filteredData[rangeIndex][l].x) <= halfWidth) {
        return [filteredData[rangeIndex][l], l]
      }
    }
  }
}

function _processEventUnits(units, args) {
  units.forEach(name => events[name] && events[name](...args))
}
