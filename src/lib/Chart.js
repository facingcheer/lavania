import Utils from './Utils'
import DEFAULTS from '../conf/default'
// import render from './render.old'
import Render from './Render.js'
import { genEvent } from './Events.js'
import throttle from './utils/throttle'
import DataProvider from './DataProvider'

import EventHandler from './EventHandler'



class Chart {
  constructor(container, dataSource, options) {
    // prevent same data for different charts
    dataSource.data = JSON.parse(JSON.stringify(dataSource.data))
    Utils.Safe.dataCheck(dataSource)
    this.dataSource = dataSource

    const { canvasEl, iaCanvasEl} = this.genCanvasLayer(container)

    this.originWidth = canvasEl.width
    this.originHeight = canvasEl.height

    this.ctx = this.genCtx(canvasEl)
    this.iaCtx = this.genCtx(iaCanvasEl)

    this.linkedCharts = new Set
    this.defaults = DEFAULTS()

    // setting chart properties
    ;['type', 'viewport', 'dataStyle', 'style'].forEach((key) => {
      this[key] = options[key] || this.defaults[key]
    })

    this.confirmType()

    this.genStyle()

    this.dataProvider = new DataProvider(this.dataSource, this.type, this)
    this.render = new Render(this)

    if(!this.repaint) {
      this.repaint = throttle(this.painter, 16)
    }

    this.rerender()
    this.events = genEvent(this, this.type)
    this.EventHandler = new EventHandler(container, this.events)
  }

  genCanvasLayer(container) {
    const canvasMain = document.createElement('canvas')
    const canvasIa = document.createElement('canvas')

    canvasMain.width = canvasIa.width = container.clientWidth
    canvasMain.height = canvasIa.height = container.clientHeight

    canvasMain.style.position = canvasIa.style.position = 'absolute'
    canvasMain.style.top = canvasIa.style.top = 0
    canvasMain.style.left = canvasIa.style.left = 0

    if (!container.style.position || container.style.position === 'static')
    container.style.viewport = 'relative'

    container.innerHTML = ''
    container.appendChild(canvasMain)
    container.appendChild(canvasIa)
    return {
      canvasEl: canvasMain,
      iaCanvasEl: canvasIa
    }
  }

  genCtx(canvasEl) {
    const dpr = window ? window.devicePixelRatio : 1
    const ctx = canvasEl.getContext('2d')
    canvasEl.style.width = (canvasEl.clientWidth || canvasEl.width) + 'px'
    canvasEl.style.height = (canvasEl.clientHeight ||canvasEl.height) + 'px'
    canvasEl.width *= dpr
    canvasEl.height *= dpr
    ctx.scale(dpr, dpr)
    return ctx
  }

  genStyle(){
    this.ctx.font = this.style.font.size + 'px ' + this.style.font.family
    this.iaCtx.font = this.ctx.font

    this.viewport = Object.assign({}, this.viewport, {
      left: this.style.padding.left,
      top: this.style.padding.top,
      right: this.originWidth - this.style.padding.right,
      bottom: this.originHeight - this.style.padding.bottom
    })

    this.dataSource.series.map(s => {
      s.style = s.style || this.dataStyle
    })
  }
  rerender(force){
    this.dataProvider && this.dataProvider.produce()
    this.repaint(force)
  }

  painter(force) {
    this.clean()

    Utils.Draw.Fill(this.ctx, (ctx) => {
      ctx.rect(0, 0, this.originWidth, this.originHeight)
    }, this.style.grid.bg)

    this.render.rend()

    // rerender all linked charts
    if (this.linkedCharts.size && !force){
      [...this.linkedCharts].forEach(chart => {
        chart.viewport.offset = this.viewport.offset
        chart.viewport.barWidth = this.viewport.barWidth
        chart.rerender(true)
      })
    }
  }

  confirmType() {
    if((this.dataSource.timeRanges && this.dataSource.timeRanges.length > 1 ) && this.type === 'scalable') {
      this.type = 'unscalable'
      throw 'multi timeRanges chart cannot be scalable'
    }
  }

  clean(e, name, force){
    this.iaCtx.clearRect(0, 0, this.originWidth, this.originHeight)

    // rerender all linked charts
    if (this.linkedCharts.size && !force){
      this.linkedCharts.forEach(chart => {
         chart.events.mouseLeaveEvent.call(chart, null, true)
      })
    }
  }

}
export default Chart
