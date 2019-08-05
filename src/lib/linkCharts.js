export default function linkCharts(...charts) {
  charts.forEach(chart => {
    charts.forEach(otherChart => {
      if (chart !== otherChart)
      chart.linkedCharts && chart.linkedCharts.add(otherChart)
    })
  })
}
