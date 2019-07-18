import Draw from '../utils/Draw'
import Utils from '../Utils'

export default function(ctx, data, coord, seriesConf, bottom) {
    let columns = {up: [], down: [], eq: []}

    data.forEach((item, index) => {
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

      if (seriesConf.detect)
        columns[seriesConf.detect(item, index, data)].push(item)
    })

    // a股K线下面的图换成矩形画法
    var coordY = seriesConf.linearMode ? {actual: [0, coord.y.actual[1]], display: coord.y.display} : coord.y
    console.log('columns', columns,coordY)
    for (var direction in columns){
      Draw.FillnStroke(ctx, ctx => {
        columns[direction].forEach((item) => {
          if (seriesConf.mode === 'bidirection') {
            ctx.rect(~~(item.x - (coord.viewport.width - 4) / 2) + 0.5,
              ~~Utils.Coord.linearActual2Display(seriesConf.baseVal, coordY) + 0.5,
              coord.viewport.width - 4,
              ~~(Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coordY) -
                Utils.Coord.linearActual2Display(seriesConf.baseVal, coordY)) + 0.02) // + 0.02 is for IE fix
          } else {
            ctx.rect(~~(item.x - (coord.viewport.width - 4) / 2) + 0.5,
              ~~coordY.display[0] + 0.5,
              coord.viewport.width - 4,
              ~~(Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coordY) -
              ~~coordY.display[0]) + 0.02) // + 0.02 is for IE fix

              // ctx.rect(~~(item.x - (coord.viewport.width - 4) / 2) + 0.5,
              // ~~coord.y.display[1] + 0.5,
              // coord.viewport.width - 4,
              // ~~(Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coordY) -
              // ~~coord.y.display[1]) + 0.02) // + 0.02 is for IE fix
          }
        })
      }, seriesConf.style.column.block[direction], seriesConf.style.column.border[direction])
    }
}
