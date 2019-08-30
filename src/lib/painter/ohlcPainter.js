import Draw from '../utils/Draw'
import Utils from '../Utils'
import { calcOHLC } from './dataPrepare'



function drawOHLC(ctx, OHLC, columnWidth, ohlcColor) {
  let half = Utils.Coord.halfcandleWidth(columnWidth)

  let lineWidth = ~~(columnWidth / 10) || 1

  if (lineWidth > 1)
  lineWidth += ctx.lineWidth % 2 ? 0 : 1

  for (let direction in OHLC) {
    Draw.Stroke(ctx, ctx => {

      ctx.lineWidth = lineWidth
      var fixOffset = (lineWidth % 2 ? 0.5 : 0)

      OHLC[direction].forEach(ohlc => {
        ctx.moveTo(ohlc.x + fixOffset,  ohlc.low)
        ctx.lineTo(ohlc.x + fixOffset,  ohlc.high)
        ctx.moveTo(~~(ohlc.x - half) + fixOffset, ohlc.open)
        ctx.lineTo(ohlc.x, ohlc.open)
        ctx.moveTo(~~(ohlc.x + half) + fixOffset, ohlc.close)
        ctx.lineTo(ohlc.x, ohlc.close)
      })
    }, ohlcColor[direction])
  }
}


export default function(ctx, data, coord, seriesConf) {
  const OHLC = calcOHLC(data, coord, seriesConf)
  drawOHLC(ctx, OHLC, coord.viewport.barWidth, seriesConf.style)
}
