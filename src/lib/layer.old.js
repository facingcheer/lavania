import Utils from './Utils'

export default {
  genLinearCoord() {
    var self = this
    var series = this.dataSource.series[0]

    this.dataSource.filteredDataBuckets = Utils.Coord.datafilterByTimeRanges(this.dataSource.data,
      this.dataSource.timeRanges, series.t)

    var yMax = Number.MIN_VALUE
    var yMin = Number.MAX_VALUE
    var yActuals = this.dataSource.filteredDataBuckets.map(function(bucket){
      var result = Utils.Coord.calcYRange.line(bucket, series)
      if (result[0] === result[1]){
        result[0] -= result[0] * 0.001
        result[1] += result[1] * 0.001
      }

      if (result[0] < yMin) yMin = result[0]
      if (result[1] > yMax) yMax = result[1]
      return result
    })

    // calc the vertical padding of grid
    if (!this.dataSource.touchTop) {
      var verticalPadding = Utils.Coord.linearPixels2Actual(self.style.grid.span.y * 2, {
        display: [this.viewport.bottomPos, this.style.padding.top],
        actual: [yMin, yMax]
      })
      yMin -= verticalPadding
      yMax += verticalPadding
    }

    var yActual = [yMin, yMax]

    // enlarge the actual range of vertical coord when base value line is specified
    if (this.dataSource.baseValue !== undefined){
      var baseValue = this.dataSource.baseValue
      var span = Math.max(Math.abs(baseValue - yMax), Math.abs(baseValue - yMin))
      yActual = [baseValue - span, baseValue + span]
    }

    // create coord
    this.coord = {
      x: {display: [this.style.padding.left, this.viewport.right],
          actual: [this.dataSource.timeRanges[0][0], this.dataSource.timeRanges[this.dataSource.timeRanges.length - 1][1]]},
      y: {display: [this.viewport.bottomPos, this.style.padding.top], actual: yActual},
      viewport: this.viewport,
      coordWidth: (this.viewport.right- this.style.padding.left) / this.dataSource.timeRanges.length
    }

    // each splitted coord
    this.coords = this.dataSource.timeRanges.map(function(range, index){
      var left = self.style.padding.left + self.coord.coordWidth * index
      var right = left + self.coord.coordWidth

      if (self.dataSource.timeRangesRatio) {
        var width = self.viewport.right- self.style.padding.left
        var prevRatio = self.dataSource.timeRangesRatio.slice(0, index).reduce(function(acc, x){return acc + x}, 0)
        left = Math.round(self.style.padding.left + prevRatio * width)
        right = Math.round(left + self.dataSource.timeRangesRatio[index] * width)
      }

      return {
        x: {display: [left, right], actual: [range[0], range[1]]},
        y: {display: [self.viewport.bottomPos, self.style.padding.top], actual: yActuals[index]}
      }
    })

    // calc display position x of each visiable point
    this.dataSource.filteredDataBuckets.forEach(function(bucket, index){
      bucket.forEach(function(item){
        item.x = ~~Utils.Coord.linearActual2Display(item[series.t], self.coords[index].x)
      })
    })
  },
  drawGrid() {
    var self = this
    // draw background
    Util.Draw.Fill(this.ctx, function(ctx){
      ctx.rect(0, 0, self.originWidth, self.originHeight)
    }, this.style.grid.bg)

    // calculate horizontal lines position
    var yNum = ~~((this.coord.y.display[0] - this.coord.y.display[1]) / this.style.grid.span.y)
    if (yNum > self.style.grid.limit.y[1]) yNum = self.style.grid.limit.y[1]
    if (yNum < self.style.grid.limit.y[0]) yNum = self.style.grid.limit.y[0]
    var horizLines = []

    if (this.dataSource.baseValue === undefined){
      // no base value line specified

      if (this.coord.y.actual[0] === this.coord.y.actual[1]){
        var offset = this.coord.y.actual[0] / 100
        this.coord.y.actual[0] -= offset
        this.coord.y.actual[1] += offset
      }
      horizLines = Util.Coord.seekNeatPoints(this.coord.y.actual, yNum + 1)
    } else {
      // with base value line
      var yActual = this.coord.y.actual
      var baseValue = this.dataSource.baseValue
      var span = (yActual[1] - yActual[0]) / 2
      horizLines = [yActual[0], baseValue]
      while (horizLines.length < yNum){
        LOG.MARK(0)
        span /= 2
        for (var i = 0, limit = horizLines.length; i < limit; i++){
          horizLines.push(horizLines[i] + span)
        }
      }
      horizLines.push(yActual[1])
    }
    horizLines = horizLines.map(function(val){
      return {actual: val, display: ~~Util.Coord.linearActual2Display(val, self.coord.y) + 0.5}
    })

    // draw horizontal lines
    Util.Draw.Stroke(this.ctx, function(ctx){
      horizLines.forEach(function(y, index){
        ctx.moveTo(self.style.padding.left, y.display)
        ctx.lineTo(self.viewport.right, y.display)
      })
    }, this.style.grid.color.x)
    this.coord.horizLines = horizLines

    // calculate vertical lines position
    var verticalLines = []

    if (this.dataSource.timeRanges){
      // vertical grid line drawing for linear chart
      this.dataSource.timeRanges.forEach(function(range, index){
          if (self.dataSource.timeRangesRatio) {
            var width = self.viewport.right- self.style.padding.left
            var widthRatio = self.dataSource.timeRangesRatio
            var prevRatio = widthRatio.slice(0, index).reduce(function(acc, x){return acc + x}, 0)
            var ratio = widthRatio[index]
            var left = Math.round(self.style.padding.left + prevRatio * width)
            var right = Math.round(left + ratio * width)
            displayRange = [left, right]

            verticalLines.push({display: left + 0.5, actual: range[0]})
          } else {
            verticalLines.push({display: ~~(self.style.padding.left + self.coord.coordWidth * index) + 0.5, actual: range[0]})

            if (index === self.dataSource.timeRanges.length - 1){
              verticalLines.push({display: self.viewport.right+ 0.5, actual: range[1]})
            }
          }


      })


    } else {
      // vertical grid line drawing for candlestick chart
      for (var l = this.dataSource.data.length - 1; l >= 0 ; l -= ~~(this.style.grid.span.x / this.viewport.barWidth)){
        if (this.dataSource.data[l].x > this.style.padding.left &&
            this.dataSource.data[l].x < this.viewport.right)
          verticalLines.push({display: ~~this.dataSource.data[l].x + 0.5, actual: this.dataSource.data[l][self.dataSource.series[0].t]})
      }
    }

    // draw vertical lines
    Util.Draw.Stroke(this.ctx, function(ctx){
      verticalLines.forEach(function(val, ind){
        ctx.moveTo(val.display, self.style.padding.top)
        ctx.lineTo(val.display, self.viewport.bottomPos)
      })
    }, this.style.grid.color.y)

    this.coord.verticalLines = verticalLines
  }
}
