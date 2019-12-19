(async function(){
  var demo_data_addr = 'https://forexdata.wallstreetcn.com/kline?prod_code=nzdusd&candle_period=1&data_count=10&end_time=0&fields=time_stamp,open_px,close_px,high_px,low_px,ma5';

  let queryAddr = 'https://api-ddc-wscn.xuangubao.cn/market/kline?prod_code=000001.SS&tick_count=500&period_type=86400&fields=tick_at%2Copen_px%2Cclose_px%2Chigh_px%2Clow_px%2Cturnover_volume%2Cturnover_value%2Caverage_px%2Cpx_change%2Cpx_change_rate%2Cavg_px%2Cma2'
  

  const response = await fetch(queryAddr)
  const resData = await response.json();

  console.log(resData)
  // fake_data = fake_data.data.candle.eurusd.map(function(x){x[0] *= 1000; return x});
  window.fake_data = resData.data.candle['000001.SS'].lines.map(x => {
    x[resData.data.fields.indexOf('tick_at')] *= 1000; return x
  })
  window.fields = resData.data.fields
})()
