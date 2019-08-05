import Utils from './Utils'
import dateFormatter from './utils/dateFormatter'
import textLabelPainter from './painter/textLabelPainter'


const eventSource = {
  scalable: {
    mouseMoveEvent: ['basic', 'crosshair', 'axisLabel', 'selectDot' ],
    mouseLeaveEvent: ['clean'],
    mouseDownEvent: ['dragStart'],
    pressedMouseMoveEvent: ['dragMove'],
    mouseUpEvent: ['dragEnd'],
  },
  unscalable: {
    mouseMoveEvent: ['basic', 'crosshair', 'axisLabel', 'selectDot' ],
    mouseLeaveEvent: ['clean']
  }
}

const eventList = ['mouseMoveEvent', 'mouseLeaveEvent', 'mouseDownEvent', 'pressedMouseMoveEvent', 'mouseUpEvent']

export function genEvent(chart, type) {
  let e = {}
  // eslint-disable-next-line camelcase
  chart.state.events = {
    selectedItem: null,
    dragStart: {
      x: null,
      y: null,
      offset: null
    },
    pinchWidth: null,
    pinchDistance: null
  }
  eventList.forEach(name => {
    e[name] = (event) => {
      if(!event || !eventSource[type] || !eventSource[type][name]) {
        return
      }
      eventSource[type][name].forEach(eventName => {
        events[eventName] && events[eventName](chart, event)
        if (chart.linkedCharts.size){
          [...chart.linkedCharts].forEach(chart => {
            events[eventName] && events[eventName](chart, event, true)
          })
        }
      })
    }
  })
  e.pinchEvent = events.pinchEvent
  return e
}

const events = {
  basic(chart, e){
    // const chart = this
    chart.iaCtx.clearRect(0, 0, chart.originWidth, chart.originHeight)
  },
  // crosshair drawing method
  // linked means being called by other charts

  crosshair(chart, e, linked) {
    // const chart = this
    //rerender all linked charts
    // if (chart.linkedCharts.size && !linked){
    //   [...chart.linkedCharts].forEach(c => {
    //     c.state.events = e
    //     events.crosshair.call(c, e, true)
    //   })
    // }

    if (linked)
      chart.iaCtx.clearRect(0, 0, chart.originWidth, chart.originHeight)

    if (!linked &&
        (e.localY < chart.style.position.top ||
          e.localY > chart.style.position.bottom))
      return

    if (e.localX < chart.style.position.left ||
        e.localX > chart.style.position.right)
      return

    let verticalPos, horizPos


    e.selectedItem = getNearest[chart.dataSource.timeRanges ? 'unscalable' : 'scalable'](chart, e)

    if(chart.state.event) {
      chart.state.event.selectedItem = e.selectedItem
    }

    if (!e.selectedItem) return
    Utils.Draw.Stroke(chart.iaCtx, ctx => {
      ctx.lineWidth = chart.style.crosshair.lineWidth || 1
      ctx.setLineDash(chart.style.crosshair.dash)
      // verticalPos = e.localX

      var fixOffset = (ctx.lineWidth % 2 ? 0.5 : 0)
      // draw horizontal line
      if (!linked){
        e.yPos = chart.style.crosshair.snapToClose && e.selectedItem ?
                      ~~Utils.Coord.linearActual2Display(e.selectedItem[chart.dataSource.series[0].c || chart.dataSource.series[0].valIndex], chart.coord.y)
                    :
                      e.localY
        ctx.moveTo(chart.style.position.left, e.yPos + fixOffset)
        ctx.lineTo(chart.style.position.right, e.yPos + fixOffset)
      }

      // draw vertical line
      ctx.moveTo(e.selectedItem.x + fixOffset, chart.style.position.top)
      ctx.lineTo(e.selectedItem.x + fixOffset, chart.style.position.bottom)

    }, chart.style.crosshair.color)

  },
  axisLabel(chart, e, linked) {
    // const chart = this

    if(!e.selectedItem) return
    // find the horizontal label width
    let hoverTime = e.selectedItem[chart.dataSource.timeIndex]
    let hoverTimeStr = dateFormatter(hoverTime, '{MM}/{DD} {HH}:{mm}')
    textLabelPainter({
      ctx: chart.iaCtx,
      text: hoverTimeStr,
      origin: {
        x: e.selectedItem.x,
        y: chart.style.crosshair.posOffset.horizontal.y + (chart.style.axis.xAxisPos === 'bottom' ? chart.style.position.bottom : chart.style.position.top - chart.style.crosshair.labelHeight)
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

    let horizPos = chart.style.crosshair.snapToClose && e.selectedItem ?
    ~~Utils.Coord.linearActual2Display(e.selectedItem[chart.dataSource.series[0].c || chart.dataSource.series[0].valIndex], chart.coord.y) : e.localY
    let hoverValue = !linked ? Utils.Coord.linearDisplay2Actual(horizPos, chart.coord.y).toFixed(chart.pricePrecision) : 0

    textLabelPainter({
      ctx: chart.iaCtx,
      text: hoverValue,
      origin: {
        x:chart.style.crosshair.posOffset.vertical.x + (chart.style.axis.yAxisPos === 'right' ? chart.style.position.right : 0),
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
    if (!e.selectedItem || linked) return

    let radius = chart.style.crosshair.selectedPointRadius
    chart.style.crosshair.selectedPointColor.forEach((color, index) => {
      Utils.Draw.Fill(chart.iaCtx, ctx => {
        ctx.arc(e.selectedItem.x + 0.5,
                Utils.Coord.linearActual2Display(e.selectedItem[chart.dataSource.series[0].c ||chart.dataSource.series[0].valIndex], chart.coord.y) - 1.5,
                radius[index], 0, 2 * Math.PI)
      }, color)
    })
  },
  dragStart(chart, e, linked) {
    if(linked) return
    chart.state.events.dragStart.x = e.pageX
    chart.state.events.dragStart.y = e.pageY

    chart.state.events.dragStart.offset = chart.viewport.offset

    if (chart.state.events.dragStart.x < 0){
      chart.state.events.dragStart.x = 0
    }
  },
  dragMove(chart, e, linked) {
    if(linked || chart.state.events.dragStart.offset === null) return

    let offset = chart.state.events.dragStart.x - e.pageX
    let newOffset = chart.state.events.dragStart.offset + offset
    if ((offset > 0 && newOffset < chart.style.position.right - chart.style.position.left - chart.viewport.width * 5) ||
        (offset < 0 && newOffset > chart.viewport.width * -(chart.dataSource.data.length - 5))){
      chart.viewport.offset = newOffset
      chart.rerender()
    }
  },
  dragEnd(chart, e, linked) {
    if(linked) return
    chart.state.events.dragStart.offset = null
    chart.state.events.dragStart.x = null
    chart.state.events.dragStart.y = null
    chart.state.events.pinchDistance = null
    chart.state.events.pinchWidth = null
  },
  pinchEvent(pinchPoint, scale) {
    console.log(pinchPoint, scale)
  },
  clean(chart, e, linked){
    chart.iaCtx.clearRect(0, 0, chart.originWidth, chart.originHeight)
  }
}


const getNearest = {
  scalable(chart, event) {
    const filterData = chart.filterData.data.map(item => item.x)
    for (let l = filterData.length; l>=0; l--){
      if (Math.abs(event.localX - filterData[l]) <= chart.viewport.width / 2){
        return chart.dataSource.data[l + chart.filterData.leftOffset]
      }
    }
  },
  unscalable(chart, event){
     // snap to linear chart
    // let index = ~~((event.localX - chart.style.padding.left) /
    // ((chart.style.position.right - chart.style.padding.left) /
    //   chart.coords.length))
    let rangeIndex = 0

    // multiRange charts has diffrent scales in diffrent ratio parts
    if (chart.dataSource.timeRangesRatio) {
      const widthRatio = chart.dataSource.timeRangesRatio
      const width = chart.style.position.right - chart.style.position.left
      for (let i = 0; i < widthRatio.length; i++) {
        let ratio = widthRatio[i]
        let prevRatio = widthRatio.slice(0, i).reduce((acc, x) =>  acc + x, 0)
        let left = Math.round(chart.style.position.left + prevRatio * width)
        let right = Math.round(left + ratio * width)
        if (event.localX >= left && event.localX <= right) {
          rangeIndex = i
          break
        }
      }
    }


    const filterData = chart.panes.map(pane => pane.paneData)
    // console.log(filterData,rangeIndex)

    for (let l = filterData[rangeIndex].length - 1; l>=0 ; l--){
      var halfWidth = (filterData[rangeIndex][1].x - filterData[rangeIndex][0].x) / 2
      halfWidth = halfWidth < 1 ? 1 : halfWidth
      // console.log(l,filterData[rangeIndex])
      if (Math.abs(event.localX - filterData[rangeIndex][l].x) <= halfWidth){
        return filterData[rangeIndex][l]
      }
    }
  }
}





