export default {
  title: 'chart-config',
  description: 'lavania config',
  type: 'object',
  required: ['type'],
  properties: {
    type: {
      description: 'chart type, use scalable to define a chart that can be zoomed or paned, if scalable is defined, series.timeRanges will be ignored. use unscalable to define a chart can not change viewport',
      enum: ['scalable', 'unscalable']
    },
    viewport: {
      description: 'when chart.type is scalable, viewport will used to describe the data viewport',
      properties: {
        barWidth: {
          description: 'width of each data in "px"',
          type: 'number'
        },
        offset: {
          description: 'x-offset of the chart, change this value will make the init viewport move left or right',
          type: 'number'
        }
      }
    },
    valuePrecision: {
      description: 'price precision for chart label',
      'data-hint': 'wow',
      type: 'number',
    },
    // valueFormatter: {
    //   description: 'if valuePrecision is not good enough for need, you can use valueFormatter provide a function to gennerate the priceText from value',
    //   type: 'function',
    // },
    dateFormat: {
      description: 'dateFormatter to format date, can be datePattern(like "YYYY-MM-DD HH:mm:ss") or a function',
      type: 'string'
    },
    font: {
      description: 'chart font config',
      type: 'object',
      properties: {
        family: {
          description: 'font family',
          type: 'string',
        },
        size: {
          description: 'font size',
          type: 'number',
        }
      }
    },
    padding: {
      description: 'chart padding to canvas container',
      type: 'object',
      properties: {
        left: {
          description: 'left padding of the canvas container',
          type: 'number'
        },
        right: {
          description: 'right padding of the canvas container',
          type: 'number'
        },
        top: {
          description: 'top padding of the canvas container',
          type: 'number'
        },
        bottom: {
          description: 'bottom padding of the canvas container',
          type: 'number'
        }
      }
    },
    zoomSpeed: {
      description: 'speed for zoom chart when triggled by mouseWheel Event',
      type: 'number',
    },
    valueRangeBoundary: {
      description: 'lines indicator highest & lowest value in viewport',
      type: 'object',
      properties: {
        show: {
          description: 'whether show the lines ',
          type: 'boolean'
        },
        dash: {
          description: 'An Array of numbers that specify distances to alternately draw a line and a gap (in coordinate space units). If the number of elements in the array is odd, the elements of the array get copied and concatenated. For example, [5, 15, 25] will become [5, 15, 25, 5, 15, 25]. If the array is empty, the line dash list is cleared and line strokes return to being solid.',
          type: 'array'
        }
      }
    }
  }
}
