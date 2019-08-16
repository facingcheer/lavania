import Draw from '../utils/Draw'
import Utils from '../Utils'

export default function(ctx, panes, coord, seriesConf, bottom) {
  const columns = {up: [], down: [], eq: []}
  panes.forEach((pane, paneIndex) => {
    pane.paneData.forEach((item, bIndex) => {
      let val = item[seriesConf.valIndex]
      if(!bIndex) item.isFirst = true
      if(bIndex === pane.paneData.length - 1 && paneIndex !== panes.length - 1) item.isLast = true
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

  for (let direction in columns){
    Draw.FillnStroke(ctx, (ctx) =>{
      columns[direction].forEach((item) => {
        let half  = seriesConf.lineWidth / 2 || 1
        if (item.x + half > coord.x.display[1]){
          item.isLast = true
        }
        if(item.isFirst || item.isLast) {
          half = half / 2
        }
        let posX = item.isFirst ? item.x : item.isLast ? item.x - half * 2 : item.x - half
        let baseVal = seriesConf.baseVal !== undefined ?
        seriesConf.baseVal
      :
        (seriesConf.baseIndex !== undefined ?
          item[seriesConf.baseIndex]
        :
          null)
        if (seriesConf.mode === 'bidirection'){
          ctx.rect(~~posX + 0.5,
          ~~Utils.Coord.linearActual2Display(baseVal, coord.y)+ 0.5,
          half * 2,
          ~~Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coord.y) - ~~Utils.Coord.linearActual2Display(baseVal, coord.y) + 0.02)
        } else {
          ctx.rect(~~posX + 0.5,
          ~~seriesConf.bottom ? ( seriesConf.bottom+ 0.5) : 0.5,
          half * 2,
          ~~Utils.Coord.linearActual2Display(item[seriesConf.valIndex], coord.y) - ~~Utils.Coord.linearActual2Display(baseVal, coord.y) + 0.02)
        }
      })
    }, seriesConf.color[direction], seriesConf.color[direction])
  }
}
