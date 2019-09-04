import Draw from '../utils/Draw'
import Utils from '../Utils'
import linePainter from './linePainter'

export default function(ctx, data, coord, seriesConf) {
  const decorators = []
  decorators.push(function gradientDecorator(points, seriesConf) {
    // draw gradient
      var gradient = ctx.createLinearGradient(0, 0, 0, coord.y.display[0] - coord.y.display[1])
      gradient.addColorStop(0, seriesConf.style.gradientUp)
      gradient.addColorStop(1, seriesConf.style.gradientDown)

      Draw.Fill(ctx, ctx => {
        ctx.moveTo(points[0].x, coord.y.display[0])
        points.forEach((point, index) => {
          ctx.lineTo(point.x, point.y)
        })
        ctx.lineTo(points[points.length - 1].x, coord.y.display[0])
        ctx.closePath()
      }, gradient)
  })
  return linePainter(ctx, data, coord, seriesConf, decorators)
}
