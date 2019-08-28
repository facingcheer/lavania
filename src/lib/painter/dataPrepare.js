import Utils from '../Utils'

export const calcOHLC = (data, coord, seriesConf) => {
  const res = {
    up: [],
    down: []
  }

  data.forEach((item, index) => {
    const o = ~~Utils.Coord.linearActual2Display(item[seriesConf.openIndex], coord.y)
    const c = ~~Utils.Coord.linearActual2Display(item[seriesConf.closeIndex], coord.y)
    const h = ~~Utils.Coord.linearActual2Display(item[seriesConf.highIndex], coord.y)
    const l = ~~Utils.Coord.linearActual2Display(item[seriesConf.lowIndex], coord.y)

    const direction = c === o && index > 0 ? (data[index - 1][seriesConf.closeIndex] < item[seriesConf.closeIndex] ? 'up' : 'down') : (c < o ? 'up' : 'down')
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
