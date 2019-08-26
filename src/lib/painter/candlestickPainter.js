import Draw from '../utils/Draw'
import Utils from '../Utils'
import { calcOHLC } from './dataPrepare'

function drawWicks(ctx, candles, wickColor) {
  for (var direction in candles){
    Draw.Stroke(ctx, ctx => {
      candles[direction].forEach(line => {
        ctx.moveTo(line.x + 0.5, line.low + 0.5)
        ctx.lineTo(line.x + 0.5, line.high + 0.5)
      })
    }, wickColor[direction])
  }
}

function drawCandle(ctx, candles, columnWidth, blockColor, borderColor) {
  let half = Utils.Coord.halfcandleWidth(columnWidth)
  for (let direction in candles) {
    Draw.FillnStroke(ctx, ctx => {
      candles[direction].forEach(candle => {
        ctx.rect(~~(candle.x - half) + 0.5 , ~~Math.min(candle.open, candle.close) + 0.5, half * 2 ,~~Math.abs(candle.open - candle.close)) // + 0.02 is for IE fix
      })
    }, blockColor[direction], borderColor[direction])
  }
}

export default function(ctx, data, coord, seriesConf) {
  const candles = calcOHLC(data, coord, seriesConf)

  drawWicks(ctx, candles, seriesConf.style.wick)
  drawCandle(ctx, candles, coord.viewport.barWidth, seriesConf.style.block, seriesConf.style.border)
}
