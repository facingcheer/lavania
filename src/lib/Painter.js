import Draw from './utils/Draw'
import Utils from './Utils'

export const LinearIndicatorPainter = {
  line (ctx, seriesConf, panes, coord){
    Draw.Stroke(ctx, (ctx) => {
      ctx.lineWidth = seriesConf.lineWidth || 1
      panes.forEach((pane, index) => {
          pane.paneData.forEach((item, bIndex) => {
            if (!bIndex)
              ctx.moveTo(Utils.Coord.linearActual2Display(item[seriesConf.t], pane.paneView.x),
              Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coord.y))

            ctx.lineTo(Utils.Coord.linearActual2Display(item[seriesConf.t], pane.paneView.x),
            Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coord.y))
          })
      })
    }, seriesConf.color)
  },

  column(ctx, seriesConf, panes, coord){
    var columns = {up: [], down: [], eq: []}

    panes.forEach((pane, paneIndex) => {
      pane.paneData.forEach((item, bIndex) => {
        var val = item[seriesConf.valIndex]

        // make some changes to base define
        var baseVal = seriesConf.baseVal !== undefined ?
                          seriesConf.baseVal
                        :
                          (seriesConf.baseIndex !== undefined ?
                            item[seriesConf.baseIndex]
                          :
                            null)

        if (baseVal !== null)
          columns[val >= baseVal ? 'up' : 'down'].push(item)

        if (seriesConf.color.detect)
          columns[seriesConf.color.detect(item, bIndex, pane.paneData, paneIndex, panes)].push(item)
      })
    })

    for (var direction in columns){
      Draw.Stroke(ctx, (ctx) =>{
        ctx.lineWidth = seriesConf.lineWidth || 1

        columns[direction].forEach((item) => {
          var baseVal = seriesConf.baseVal !== undefined ?
          seriesConf.baseVal
        :
          (seriesConf.baseIndex !== undefined ?
            item[seriesConf.baseIndex]
          :
            null)
          if (seriesConf.mode === 'bidirection'){
            ctx.moveTo(~~item.x + 0.5, Utils.Coord.linearActual2Display(baseVal, coord.y))
            ctx.lineTo(~~item.x + 0.5, Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coord.y))
          } else {
            ctx.moveTo(~~item.x + 0.5, seriesConf.bottom || 0)
            ctx.lineTo(~~item.x + 0.5, Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coord.y))
          }
        })

      }, seriesConf.color[direction])
    }
  }
}


export const CandleStickIndicatorPainter = {
  line (ctx, seriesConf, filteredData, coord){
      Draw.Stroke(ctx, ctx => {
      ctx.lineWidth = seriesConf.line_width || 1
      var started = false
      filteredData.forEach((item, index) => {
        var val = item[seriesConf.valIndex]
        if (val === null)
          return

        if (!started) {
          ctx.moveTo(item.x, Utils.Coord.linearActual2Display(val, coord.y))
          started = true
        }

        ctx.lineTo(item.x, Utils.Coord.linearActual2Display(val, coord.y))
      })

    }, seriesConf.color)
  },

  column (ctx, seriesConf, filteredData, coord){
    var columns = {up: [], down: [], eq: []}

    filteredData.forEach((item, index) => {
      var val = item[seriesConf.valIndex]
      var baseVal = seriesConf.baseVal !== undefined ?
                        seriesConf.baseVal
                      :
                        (seriesConf.baseIndex !== undefined ?
                          item[seriesConf.baseIndex]
                        :
                          null)

      if (baseVal !== null)
        columns[val >= baseVal ? 'up' : 'down'].push(item)

      if (seriesConf.color.detect)
        columns[seriesConf.color.detect(item, index, filteredData)].push(item)
    })

    // a股K线下面的图换成矩形画法
    var coordY = seriesConf.linearMode ? {actual: [0, coord.y.actual[1]], display: coord.y.display} : coord.y
    for (var direction in columns){
      Draw.FillnStroke(ctx, (ctx) => {
        columns[direction].forEach((item) => {
          if (seriesConf.mode === 'bidirection') {
            ctx.rect(~~(item.x - (seriesConf.viewport.width - 4) / 2) + 0.5,
              ~~Utils.Coord.linearActual2Display(seriesConf.baseVal, coordY) + 0.5,
              seriesConf.viewport.width - 4,
              ~~(Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coordY) -
                Utils.Coord.linearActual2Display(seriesConf.baseVal, coordY)) + 0.02) // + 0.02 is for IE fix
          } else {
            ctx.rect(~~(item.x - (seriesConf.viewport.width - 4) / 2) + 0.5,
              ~~seriesConf.position.bottom + 0.5,
              seriesConf.viewport.width - 4,
              ~~(Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coordY) -
              seriesConf.position.bottom) + 0.02) // + 0.02 is for IE fix
          }
        })
      }, seriesConf.color[direction], seriesConf.border ? seriesConf.border[direction] : seriesConf.color[direction])
    }
  }

}
