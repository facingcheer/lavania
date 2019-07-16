import Log from './Log'
const Utils = {
  Safe: {
    dataCheck(dataSource) {
      var data = dataSource.data
      var series = dataSource.series

      var maxIndex = 0
      series.forEach((line) => {
        for (var key in line) {
          if ((key.length === 1 || key.indexOf('index') > -1) && typeof line[key] === 'number') {
            if (line[key] > maxIndex)
              maxIndex = line[key]
          }
        }
      })

      if (dataSource.timeRanges) {
        for (var l = dataSource.timeRanges.length; l--;) {
          if (isNaN(dataSource.timeRanges[l][0]) ||
            isNaN(dataSource.timeRanges[l][1])) {
            throw 'Time ranges contains NaN'
          }
        }
      }

      if (data.length === 0)
        throw 'Chart input data is empty'

      if (data[0].length <= maxIndex)
        throw 'Chart input data is length(' + data[0].length + ') is less than required data index(' + maxIndex + ')'
    }
  },
  Animation: {
    linear(dataSet1, dataSet2, valIndexes) {
      var diff = dataSet1.map((d1, index) => {
        var data2 = dataSet2[index]

        var result = d1.slice()
        valIndexes.forEach((valIndex) => {
          var diff = data2[valIndex] - result[valIndex]
          result[valIndex] = diff / 60
        })
        return result
      })

      return function () {
        dataSet1.forEach((d1, index) => {
          valIndexes.forEach(function (valIndex) {
            d1[valIndex] += diff[index][valIndex]
          })
        })
      }
    }
  },

  Chart: {
    linkCharts(charts) {
      charts.forEach(function (chart) {
        charts.forEach(function (otherChart) {
          if (chart !== otherChart)
            chart.linkedCharts.insert(otherChart)
        })
      })
    }
  },

  DataTypes: {
    Set: function(){
      var set = function(d){
        this.d = d || []
      }
      set.prototype.insert = function(item){
        if (this.d.indexOf(item) < 0)
          this.d.push(item)
      }
      set.prototype.remove = function(item){
        var index = this.d.indexOf(item)
        if (index > -1)
          this.d.splice(index, 1)
      }
      set.prototype.length = function(){
        return this.d.length
      }
      set.prototype.forEach = function(func){
        this.d.forEach(func)
      }

      return function(lst){
        return new set(lst)
      }
    }()
  },
  Math: {
    sum(lst) {
      var sum = 0
      lst.forEach(function (item) {
        sum += item
      })
      return sum
    },
    // get Standard Deviation
    getSD(data, avg) {
      if (avg === undefined) {
        avg = Utils.Math.sum(data) / data.length
      }
      return Math.sqrt(
        Utils.Math.sum(
          data.map(function (item) {
            return Math.pow(item - avg, 2)
          })) /
        data.length)
    },
    iterOffsetN(data, index, n, callback) {
      if (!n) {
        return
      }

      var target = index + (Math.abs(n) - 1) * (n > 0 ? 1 : -1)
      if (target < 0)
        target = 0
      else if (target > data.length - 1)
        target = data.length - 1

      while (index !== target) {
        callback(data[index])
        index += n > 0 ? 1 : -1
      }

      callback(data[index])
    },
    leftPad(n, width) {
      var zeros = []
      while (width--) {
        zeros.push(0)
      }
      return zeros.join('').slice(0, zeros.length - n.toString().length) + n
    },
    rightPad(n, width) {
      var nStr = n.toString().replace('-', '')
      var nStrArr = nStr.split('.')
      var precision = width - nStrArr[0].length - 1
      return n.toFixed(precision >= 0 ? precision : 0)
    },
    distance(point1, point2) {
      return Math.sqrt(Math.pow(point2[0] - point1[0], 2) + Math.pow(point2[1] - point1[1], 2))
    }
  },
  Draw: {
    Basic(ctx, func) {
      ctx.save()
      ctx.beginPath()
      func(ctx)
    },
    Fill(ctx, func, style) {
      Utils.Draw.Basic(ctx, func)

      ctx.fillStyle = style || 'black'
      ctx.fill()
      ctx.closePath()
      ctx.restore()
    },
    Stroke(ctx, func, style) {
      Utils.Draw.Basic(ctx, func)

      ctx.strokeStyle = style || 'black'
      ctx.stroke()
      ctx.closePath()
      ctx.restore()
    },
    FillnStroke(ctx, func, fillStyle, strokeStyle) {
      Utils.Draw.Basic(ctx, func)

      ctx.fillStyle = fillStyle || 'black'
      ctx.strokeStyle = strokeStyle || 'black'
      ctx.fill()
      ctx.stroke()
      ctx.closePath()
      ctx.restore()
    },
    Text(ctx, func, fillStyle, fontStyle) {
      ctx.save()
      if (fontStyle)
        ctx.font = fontStyle

      ctx.fillStyle = fillStyle || 'black'
      func(ctx)
      ctx.restore()
    }
  },
  Coord: {

    getDateStr(date, noDate, noTime) {
      if (typeof date === 'number')
        date = new Date(date)

      var dateStr = Utils.Math.leftPad(date.getMonth() + 1, 2) + '/' + Utils.Math.leftPad(date.getDate(), 2)
      var timeStr = Utils.Math.leftPad(date.getHours(), 2) + ':' + Utils.Math.leftPad(date.getMinutes(), 2)

      var result = (noDate ? '' : dateStr) + ' ' + (noTime ? '' : timeStr)
      return result.trim()
    },

    /**
     *
     * @param {* dataSource for chart} data
     * @param {* timeRange to split chart} ranges
     * @param {* timeIndex in dataSource} tIndex
     */
    datafilterByTimeRanges(data, ranges, tIndex) {
      const buckets = ranges.map(() => [])
      let bucketIndex = 0
      for (let i = 0; i < data.length; i++) {
        let item = data[i]
        let time = item[tIndex]

        if (time >= ranges[bucketIndex][0] &&
          time <= ranges[bucketIndex][1]) {
          buckets[bucketIndex].push(item)
        } else {
          if (ranges[bucketIndex + 1] && time >= ranges[bucketIndex + 1][0]) {
            bucketIndex += 1
            i--
          }
        }
      }
      return buckets
    },

    dataFilterByViewport(data, viewport, style) {
      var displayWidth = style.position.right - style.padding.left
      var result = []
      var pointerX = viewport.offset
      var leftOffset = Number.MAX_VALUE
      var rightOffset = Number.MIN_VALUE
      for (var l = data.length; l--;) {
        data[l].x = null
        if (pointerX >= -30 && pointerX <= displayWidth + 30) {
          data[l].x = displayWidth - pointerX + style.padding.left
          result.unshift(data[l])
          if (l > rightOffset)
            rightOffset = l
          if (l < leftOffset)
            leftOffset = l
        }

        pointerX += viewport.width
      }

      return {
        filteredData: result,
        leftOffset: leftOffset,
        rightOffset: rightOffset
      }
    },

    linearPixels2Actual(length, coord) {
      return length * Math.abs(coord.actual[1] - coord.actual[0]) / Math.abs(coord.display[1] - coord.display[0])
    },
    linearActual2Display(val, coord) {
      return (val - coord.actual[0]) * (coord.display[1] - coord.display[0]) / (coord.actual[1] - coord.actual[0]) + coord.display[0]
    },
    linearDisplay2Actual(pos, coord) {
      return (pos - coord.display[0]) * (coord.actual[1] - coord.actual[0]) / (coord.display[1] - coord.display[0]) + coord.actual[0]
    },

    seekNeatPoints(range, count) {
      var diff = range[1] - range[0]
      if (!diff) diff = 0.001

      var precision = 1
      if (diff > 1) {
        while (diff / precision > 10) {
          precision *= 10
        }
        precision /= 10
      } else {
        while (diff / precision < 10) {
          precision /= 10
        }
      }
      var multiples = [1, 2, 5, 10, 20, 50]
      var points = []
      multiples.forEach(function (multiple) {
        var interval = multiple * precision
        if (!interval) return

        var newRange = []
        var x = 0
        if (range[1] < 0) {
          while (x >= range[0]) {
            if (x <= range[1])
              newRange.push(x)
            x -= interval
          }
        } else if (range[0] > 0) {
          while (x <= range[1]) {
            if (x >= range[0])
              newRange.push(x)
            x += interval
          }
        } else {
          x -= interval
          while (x >= range[0]) {
            newRange.push(x)
            x -= interval
          }
          x = 0
          while (x <= range[1]) {
            newRange.push(x)
            x += interval
          }
        }

        points.push(newRange)
      })

      if (!points.length)
        return []

      if (points[points.length - 1].length === 3)
        points.push([points[points.length - 1][1]])

      for (var i = 0; i < points.length - 1; i++) {
        if (points[i].length === count) {
          return points[i]
        } else if (points[i + 1].length < count) {
          return points[i + 1]
        }
      }

      return points[points.length - 1]
    },

    calcYRange(data, series) {
      var yMax = Number.MIN_VALUE
      var yMin = Number.MAX_VALUE

      data.forEach(d => {
        series.forEach(s => {
          var h = d[s.type === 'candlestick' ? s.h : s.valIndex]
          var l = d[s.type === 'candlestick' ? s.l : s.valIndex]

          if (h > yMax) yMax = h
          if (l < yMin) yMin = l
        })
      })
      return [yMin, yMax]
    },

    /**
     *
     * @param {* max & min value of visible data} yRange
     * @param {* if the max/min data nestle to to/bottom of chart} touchTop
     * @param {* style config for chart} style
     * @param {* baseValue for symmetry chart} baseValue
     */
    adjustYRange(yRange, touchTop, style, baseValue) {
       // calc the vertical padding of grid
      let [yMin, yMax] = yRange
      if (!touchTop) {
        const verticalPadding = Utils.Coord.linearPixels2Actual(style.grid.span.y, {
          display: [style.position.bottom, style.padding.top],
          actual: [yMin, yMax]
        })
        yMin -= verticalPadding
        yMax += verticalPadding
      }

      let yActual = [yMin, yMax]

      // enlarge the actual range of vertical coord when base value line is specified
      if (baseValue !== undefined) {
        const span = Math.max(Math.abs(baseValue - yMax), Math.abs(baseValue - yMin))
        yActual = [baseValue - span, baseValue + span]
      }
      return yActual
    }
  }
}

export default Utils
