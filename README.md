# lavania
a finance stock chart
# demo
see in https://facingcheer.github.io/lavania/

# usage
```html
<div ref="chart" id="chart"></div>
```

```js
  import {Chart} from 'lavania'
  const dataSource = [
    [1479931200000,1.0549,1.0553,1.0557,1.0548,-0.001,-0.001,-0.002,1.0554000000000001,1.0564699999999998],
    [1479934800000,1.0553,1.0554,1.0554,1.0549,-0.001,-0.002,-0.002,1.0553,1.0557800000000002],
    [1479938400000,1.0553,1.0553,1.0556,1.0547,-0.001,-0.002,-0.002,1.0552199999999998,1.05519],
    [1479942000000,1.0551,1.0542,1.0551,1.0539,-0.001,-0.002,-0.002,1.0550199999999998,1.0550399999999998],
    [1479945600000,1.0543,1.0539,1.0545,1.0533,-0.001,-0.002,-0.002,1.0548199999999999,1.0549],
    [1479949200000,1.0541,1.0535,1.0544,1.0532,0,-0.002,-0.002,1.05446,1.0549300000000001],
    [1479952800000,1.0535,1.053,1.0539,1.0528,0,-0.002,-0.002,1.05398,1.0546399999999998],
    [1479956400000,1.053,1.0532,1.0537,1.0525,0,-0.002,-0.002,1.0535600000000003,1.0543900000000002],
    [1479960000000,1.0533,1.0544,1.0545,1.0532,0,-0.002,-0.002,1.0535999999999999,1.0543099999999996],
    [1479963600000,1.0543,1.0547,1.0551,1.0541,0,-0.002,-0.002,1.05376,1.0542899999999997]]
  const pattern = {
    type: 'scalable',
    seriesInfo: {
      timeIndex: 0,
      series: [{
        name: 'K线',
        seriesType: 'candlestick',
        openIndex: 1,
        closeIndex: 2,
        highIndex: 3,
        lowIndex: 4
      }]
    },
    viewport: {
      barWidth: 100,
      offset: 0
    }
  }
  new Chart(this.$refs.chart, dataSource, pattern)
```

## default setting for chart

  see in https://github.com/facingcheer/lavania/blob/master/src/conf/default.js

 >you can play in the demo above and most configures for the chart has comments in JsonViewer
