import Utils from './Utils'
import DEFAULTS from '../conf/default'
// import render from './render.old'
import Render from './Render.mjs'

class Chart {
  constructor(container, pattern ,noRender) {
    // prevent same data for different charts
    pattern.dataSource.data = JSON.parse(JSON.stringify(pattern.dataSource.data))
    Utils.Safe.dataCheck(pattern.dataSource)
    const { canvasEl, iaCanvasEl, midCanvasEl} = this.genCanvasLayer(container)

    this.originWidth = canvasEl.width
    this.originHeight = canvasEl.height

    this.ctx = this.genCtx(canvasEl)
    this.iaCtx = this.genCtx(iaCanvasEl)
    this.midCtx = this.genCtx(midCanvasEl)

    this.state = {
      ready: 0,
      ctxClock: 0,
      iaCtxClock: 0,
      midCtxInterval: 0
    }
    this.linkedCharts = Utils.DataTypes.Set()
    this.defaults = DEFAULTS()

    // setting chart properties
    // let dict = ['viewport', 'pricePrecision', 'style', 'dataStyle', 'dataSource']
    ;['viewport', 'pricePrecision', 'dataStyle', 'style', 'dataSource'].forEach((key) => {
      this[key] = pattern[key] || this.defaults[key]
    })

    this.render = new Render()
    this.genStyle()

    // this.events = this.genDefaultEvents()
    // this.bindEvents()
    if (!noRender)
    this.rerender()
  }

  genCanvasLayer(container) {
    const canvasMain = document.createElement('canvas')
    const canvasIa = document.createElement('canvas')
    const canvasMid = document.createElement('canvas')

    canvasMain.width = canvasIa.width = canvasMid.width = container.clientWidth
    canvasMain.height = canvasIa.height = canvasMid.height = container.clientHeight

    canvasMain.style.position = canvasIa.style.position = canvasMid.style.position = 'absolute'
    canvasMain.style.top = canvasIa.style.top = canvasMid.style.top = 0
    canvasMain.style.left = canvasIa.style.left = canvasMid.style.left = 0

    if (!container.style.position || container.style.position === 'static')
    container.style.position = 'relative'

    container.innerHTML = ''
    container.appendChild(canvasMain)
    container.appendChild(canvasMid)
    container.appendChild(canvasIa)
    return {
      canvasEl: canvasMain,
      iaCanvasEl: canvasIa,
      midCanvasEl: canvasMid
    }
  }

  genCtx(canvasEl) {
    const dpr = window ? window.devicePixelRatio : 1
    const ctx = canvasEl.getContext('2d')
    canvasEl.style.width = canvasEl.width + 'px'
    canvasEl.style.height = canvasEl.height + 'px'
    canvasEl.width *= dpr
    canvasEl.height *= dpr
    ctx.scale(dpr, dpr)
    return ctx
  }

  genStyle(){
    this.ctx.font = this.style.font.size + 'px ' + this.style.font.family
    this.iaCtx.font = this.ctx.font

    this.style.position = {
      left: this.style.padding.left,
      top: this.style.padding.top,
      right: this.originWidth - this.style.padding.right,
      bottom: this.originHeight - this.style.padding.bottom
    }
    this.dataSource.series.map(s => {
      s.style = s.style || this.dataStyle
    })
  }

  rerender(force){
    if (!force && +new Date - this.state.ctxClock <= 30) return

    // var self = this;
    this.state.ctxClock = +new Date()
    this.state.ready = 0

    this.clean()

    Utils.Draw.Fill(this.ctx, (ctx) => {
      ctx.rect(0, 0, this.originWidth, this.originHeight)
    }, this.style.grid.bg)

    if (this.dataSource.timeRanges){
      this.render.genPanes.call(this)
    } else {
      this.render.filterData.call(this)
    }
    this.render.genCoord.call(this)
    this.render.drawGrid.call(this)
    this.render.drawSeries.call(this)
    this.render.drawAxis.call(this)
    // this.render.drawAdditionalTips.call(this)

    this.state.ready = 1

    // rerender all linked charts
    if (this.linkedCharts.length()){
      this.linkedCharts.forEach((chart) => {
        chart.viewport = this.viewport
        chart.rerender()
      })
    }
  }

  clean(e, name, force){
    this.iaCtx.clearRect(0, 0, this.originWidth, this.originHeight)

    // rerender all linked charts
    if (this.linkedCharts.length() && !force){
      this.linkedCharts.forEach(chart => {
        chart.events.mouseout.clean.call(chart, null, 'clean', true)
      })
    }
  }

}
// console.log(1, render)
// Object.assign(Chart.prototype, render)
console.log(Chart.prototype)
export default Chart
