import Draw from '../utils/Draw'
import Utils from '../Utils'

export default function(ctx, data, coord, seriesConf, decorators) {
  const points = []
  data.forEach((item) => {
    points.push({
      x: item.x,
      y: Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coord.y)
    })
  })

  Draw.Stroke(ctx, ctx => {
    ctx.lineWidth = seriesConf.lineWidth || 1
    points.forEach((point, index) => {
        if (!index)
          ctx.moveTo(point.x, point.y)
        ctx.lineTo(point.x, point.y)
      })
  }, seriesConf.style.lineColor)
  if (decorators && decorators.length) {
    decorators.forEach(d => {
      if (typeof d === 'function') {
        d(points, seriesConf)
      }
    })
  }
}
