import linePainter from './linePainter'
import candlestickPainter from './candlestickPainter'
import ohlcPainter from './ohlcPainter'
import columnPainter from './columnPainter'
import panesColumnPainter from './panesColumnPainter'

export default {
  line: linePainter,
  candlestick: candlestickPainter,
  OHLC: ohlcPainter,
  column: columnPainter,
  panesColumn: panesColumnPainter
}
