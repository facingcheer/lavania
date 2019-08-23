export default function dateFormatter(date, pattern = 'YYYY-MM-DD HH:mm:ss') {
	if(!(date instanceof Date)) {
		date = new Date(date)
	}

  const formatObj = {
    YYYY: date.getFullYear(),
    MM: date.getMonth() + 1,
    DD: date.getDate(),
    HH: date.getHours(),
    mm: date.getMinutes(),
		ss: date.getSeconds()
	}
	const patternType = Object.prototype.toString.call(pattern)
	if(patternType === '[object Function]') {
		return pattern(date)
	} else if (patternType === '[object String]') {
		return pattern.replace(/(YYYY|MM|DD|HH|mm|ss)+/g, (match, p1) => {
			let value = formatObj[p1]
			if (match.length > 0 && value < 10) value = `0${value}`
			return value
		})
	} else {
		return 'YYYY-MM-DD HH:mm:ss'.replace(/(YYYY|MM|DD|HH|mm|ss)+/g, (match, p1) => {
			let value = formatObj[p1]
			if (match.length > 0 && value < 10) value = `0${value}`
			return value
		})
	}
}
