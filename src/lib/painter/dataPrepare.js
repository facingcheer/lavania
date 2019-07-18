import Utils from '../Utils'

export const calcOHLC = (data, coord, seriesConf) => {
  const res = {up: [], down: []}

  data.forEach((item, index) => {
    const o = ~~Utils.Coord.linearActual2Display(item[seriesConf.o], coord.y)
    const c = ~~Utils.Coord.linearActual2Display(item[seriesConf.c], coord.y)
    const h = ~~Utils.Coord.linearActual2Display(item[seriesConf.h], coord.y)
    const l = ~~Utils.Coord.linearActual2Display(item[seriesConf.l], coord.y)

    const direction = c === o && index > 0 ? (data[index - 1][seriesConf.c] < item[seriesConf.c] ? 'up' : 'down') : (c < o ? 'up' : 'down')
    res[direction].push({
      x: ~~item.x,
      low: l,
      high: h,
      close: c,
      open: o
    })
  })
  return res
}
