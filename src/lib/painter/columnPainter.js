import Draw from '../utils/Draw'
import Utils from '../Utils'

export default function(ctx, data, coord, seriesConf, viewport) {
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
  const half = Utils.Coord.halfcandleWidth(coord.viewport.barWidth)
  for (var direction in columns){
    Draw.FillnStroke(ctx, ctx => {
      columns[direction].forEach((item) => {
        if (seriesConf.mode === 'bidirection') {
          ctx.rect(~~(item.x - half) + 0.5,
            ~~Utils.Coord.linearActual2Display(seriesConf.baseVal, coordY) + 0.5,
            half * 2 ,
            ~~(Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coordY) -
              Utils.Coord.linearActual2Display(seriesConf.baseVal, coordY)) + 0.02) // + 0.02 is for IE fix
        } else {
          ctx.rect(~~(item.x - half) + 0.5,
            ~~coordY.display[0] + 0.5,
            half * 2,
            ~~(Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coordY) -
            ~~coordY.display[0]) + 0.02)
        }
      })
    }, seriesConf.style.column.block[direction], seriesConf.style.column.border[direction])
  }
}
