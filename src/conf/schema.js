const labelProperty = {
  show: {
    title: 'whether show the label',
    type: 'boolean'
  },
  color: {
    title: 'label font color',
    type: 'string'
  },
  fontSize: {
    title: 'label font size',
    type: 'number'
  },
  textAlign: {
    title: 'label text align',
    description: 'mdn: CanvasRenderingContext2D.textAlign',
    type: 'string'
  },
  textBaseline: {
    title: 'label textBaseline',
    description: 'mdn: CanvasRenderingContext2D.textBaseline',
    type: 'string'
  },
  offset: {
    title: 'position offset for adjust title',
    type: 'object',
    properties: {
      x: {
        title: 'horizone offset',
        type: 'number'
      },
      y:{
        title: 'vertical offset',
        type: 'number'
      }
    }
  }
}

const updownColorProperty = {
  up: {
    title: 'up color',
    type: 'string'
  },
  down:{
    title: 'down color',
    type: 'string'
  }
}

export default {
  title: 'chart-config',
  title: 'lavania config',
  type: 'object',
  required: ['type'],
  properties: {
    type: {
      title: 'chart type, use "scalable" to specify a chart that can be zoomed or paned, if scalable is defined, series.timeRanges will be ignored. use "unscalable" to specify a chart can not change viewport',
      enum: ['scalable', 'unscalable']
    },
    viewport: {
      title: 'when chart.type is scalable, viewport will used to describe the data viewport',
      properties: {
        barWidth: {
          title: 'width of each data column',
          minimum: 4,
          maximum: 64,
          type: 'number'
        },
        offset: {
          title: 'x-offset of the chart, change this value will make the initial viewport move left or right',
          type: 'number'
        }
      }
    },
    valuePrecision: {
      title: 'price precision for chart label',
      type: 'number',
    },
    // valueFormatter: {
    //   description: 'if valuePrecision is not good enough for need, you can use valueFormatter provide a function to gennerate the priceText from value',
    //   type: 'function',
    // },
    dateFormat: {
      title: 'dateFormatter to format date, can be datePattern(like "YYYY-MM-DD HH:mm:ss") or a function',
      type: 'string'
    },
    font: {
      title: 'chart font config',
      type: 'object',
      properties: {
        family: {
          title: 'font family',
          type: 'string',
        },
        size: {
          title: 'font size',
          type: 'number',
        }
      }
    },
    padding: {
      title: 'chart padding to canvas container',
      type: 'object',
      properties: {
        left: {
          title: 'left padding of the canvas container',
          type: 'number'
        },
        right: {
          title: 'right padding of the canvas container',
          type: 'number'
        },
        top: {
          title: 'top padding of the canvas container',
          type: 'number'
        },
        bottom: {
          title: 'bottom padding of the canvas container',
          type: 'number'
        }
      }
    },
    zoomSpeed: {
      title: 'speed for zoom chart when triggled by mouseWheel Event',
      type: 'number',
    },
    valueRangeBoundary: {
      title: 'line indicator for highest & lowest value in viewport',
      type: 'object',
      properties: {
        show: {
          title: 'whether show the lines ',
          type: 'boolean'
        },
        dash: {
          title: 'line dash',
          description: 'refer to mdn: CanvasRenderingContext2D.setLineDash',
          type: 'array'
        },
        lineWidth: {
          title: 'boundary line width',
          type: 'number'
        },
        highColor: {
          title: 'line color indicate the highest value in viewport',
          description: 'refer to mdn: CanvasRenderingContext2D.lineWidth',
          type: 'string'
        },
        lowColor: {
          title: 'line color indicate the lowest value in viewport',
          description: 'refer to mdn: CanvasRenderingContext2D.lineWidth',
          type: 'string'
        }
      }
    },
    crosshair: {
      title: 'crosshair indicator for mouseMove | touch(in mobile) event',
      type: 'object',
      properties: {
        snapToData: {
          title: 'whether crosshair snap to the value or align with mouse position',
          type: 'boolean',
        },
        color:  {
          title: 'crosshair line color',
          type: 'string',
        },
        dash: {
          title: 'line dash',
          title: 'refer to mdn: CanvasRenderingContext2D.setLineDash',
          type: 'array'
        },
        lineWidth: {
          title: 'crosshair line width',
          type: 'number'
        },
        axisLabel: {
          title: 'axis label for the snap point',
          type: 'object',
          properties: {
            xAxisLabelPos: {
              title: 'corsshair axis label position for x-axis, can be: bottom | top',
              type: 'string',
            },
            xAxisLabelPos: {
              title: 'corsshair axis label position for y-axis, can be: top | bottom',
              type: 'string',
            },
            fontSize: {
              title: 'corsshair axis label fontsize',
              type: 'number',
            },
            height: {
              title: 'corsshair axis label height',
              type: 'number',
            },
            bg: {
              title: 'corsshair axis label background color',
              type: 'string',
            },
            color: {
              title: 'corsshair axis label font-color',
              type: 'string',
            },
            horizPadding: {
              title: 'left & right padding of the corsshair axis label',
              type: 'number',
            },
            posOffset: {
              title: 'position offset for the corsshair axis label,which can used for adjust the position',
              type: 'object',
              properties: {
                yAxisLabel: {
                  title: 'vertical position offset for the corsshair y-axis label, which can used for adjust the position',
                  type: 'object',
                  properties: {
                    x: {
                      title: 'horizone offset',
                      type: 'number'
                    },
                    y:{
                      title: 'vertical offset',
                      type: 'number'
                    }
                  }
                },
                xAxisLabel: {
                  title: 'position offset for the corsshair x-axis label, which can used for adjust the position',
                  type: 'object',
                  properties: {
                    x: {
                      title: 'horizone offset',
                      type: 'number'
                    },
                    y:{
                      title: 'vertical offset',
                      type: 'number'
                    }
                  }
                }
              }
            }
          }
        },
        selectedPoint: {
          title: 'style for selected point, define as several nested circles',
          type: 'object',
          properties: {
            radius: {
              title: 'array to describe radius of each layer',
              type: 'array',
            },
            color: {
              title: 'array to describe color of each layer',
              type: 'array',
            }
          }
        }
      }
    },
    grid: {
      title: 'style for the grid',
      type: 'object',
      properties: {
        bg: {
          title: 'background color for the grid',
          type: 'string',
        },
        lineColor: {
          title: 'line color for the grid',
          type: 'object',
          properties: {
            x:{
              title: 'color for lines parallel to the x-axis',
              type: 'string',
            },
            y:{
              title: 'color for lines parallel to the y-axis',
              type: 'string',
            }
          }
        },
        span: {
          title: 'span between lines of grid',
          type: 'object',
          properties: {
            x:{
              title: 'span between lines parallel to the x-axis',
              type: 'number',
            },
            y:{
              title: 'span between lines parallel to the y-axis',
              type: 'number',
            }
          }
        },
        limit: {
          title: 'count limit of grid lines',
          type: 'object',
          properties: {
            y:{
              title: 'count limit of  grid lines parallel to the y-axis',
              type: 'object',
              properties: {
                max: {
                  title: 'max limit of  grid lines parallel to the y-axis',
                  type: 'number',
                },
                min: {
                  title: 'min limit of  grid lines parallel to the y-axis',
                  type: 'number',
                }
              }
            }
          }
        }
      }
    },
    axis: {
      title: 'axis style for chart',
      type: 'object',
      properties: {
        showBorder: {
          title: 'whether show axis border',
          type: 'boolean',
        },
        borderColor: {
          title: 'color of axis border',
          type: 'string',
        },
        bgColor: {
          title: 'axis background color',
          type: 'string'
        },
        label: {
          title: 'axis background color',
          type: 'object',
          properties: {
            left: {
              title: 'label on the left side of the chart',
              type: 'object',
              properties: labelProperty
            },
            top: {
              title: 'label on the top side of the chart',
              type: 'object',
              properties: labelProperty
            },
            right: {
              title: 'label on the right side of the chart',
              type: 'object',
              properties: labelProperty
            },
            bottom: {
              title: 'label on the bottom side of the chart',
              type: 'object',
              properties: labelProperty
            }
          }
        }
      }
    },
    seriesStyle: {
      title: 'default style config for series',
      type: 'object',
      properties: {
        baseValue: {
          title: 'base value line color, base-value line will show when a series  been set baseValue',
          type: 'string'
        },
        candlestick: {
          title: 'color style for candlestick chart',
          type: 'object',
          properties: {
            block : {
              title: 'candlestock block color',
              properties: updownColorProperty
            },
            border : {
              title: 'candlestock border color',
              properties: updownColorProperty
            },
            wick : {
              title: 'candlestock wick color',
              properties: updownColorProperty
            }
          }
        },
        OHLC: {
          title: 'color style for OHLC chart',
          type: 'object',
          properties: updownColorProperty
        },
        mountain: {
          title: 'color style for mountain-like chart',
          type: 'object',
          properties: {
            lineWidth: {
              title: 'mountain-like chart lineWidth',
              type: 'number'
            },
            lineColor: {
              title: 'mountain-like chart lineColor',
              type: 'string'
            },
            gradientUp: {
              title: 'first stop color for linear mountain body',
              type: 'string'
            },
            gradientDown: {
              title: 'last stop color for linear mountain body',
              type: 'string'
            }
          }
        },
        column:{
          title: 'color style for column chart',
          type: 'object',
          properties: {
            block : {
              title: 'column block color',
              properties: updownColorProperty
            },
            border : {
              title: 'column border color',
              properties: updownColorProperty
            }
          }
        }
      }
    },
    seriesInfo: {
      title: 'chart series config relate to data, specify which data will use to render the chart',
      type: 'object',
      properties: {
        timeIndex: {
          title: 'specify the index of time in the data, multi series will share the timeIndex',
          type: 'number',
        },
        mainSeriesIndex: {
          title: 'specify the index of the main series, main series is used for crosshair to snap to, default to 0',
          type: 'number',
        },
        series: {
          title: 'series config',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string'
              },
              seriesType: {
                title: 'chart type, can be "line | mountain | candlestick | OHLC"',
                type: 'string'
              },
              snapToProp: {
                title: 'when crosshair move, specify a property which crosshair will snapto, if this prop is not defined, will try data[valIndex], if valIndex is not defined, will use data[c]',
                type: 'string'
              },
              o: {
                type: 'number'
              },
              c: {
                type: 'number'
              },
              h: {
                type: 'number'
              },
              l: {
                type: 'number'
              },
              valIndex: {
                type: 'number'
              },
              style: {
                type: 'object'
              }
            }
          }
        }
      }
    }
  }
}
