const RGX = /([^{]*?)\w(?=\})/g

const MAP = {
	YYYY: 'getFullYear',
	YY: 'getYear',
	MM: function (d) {
		return d.getMonth() + 1
	},
	DD: 'getDate',
	HH: 'getHours',
	mm: 'getMinutes',
	ss: 'getSeconds',
	fff: 'getMilliseconds'
}

export default function (date, pattern, custom) {
	let parts=[], offset=0

	pattern.replace(RGX, (key, _, idx) => {
		// save preceding string
		parts.push(pattern.substring(offset, idx - 1))
		offset = idx += key.length + 1
		// save function
		parts.push(custom && custom[key] || function (d) {
			return ('00' + (typeof MAP[key] === 'string' ? d[MAP[key]]() : MAP[key](d))).slice(-key.length)
		})
	})

	if (offset !== pattern.length) {
		parts.push(pattern.substring(offset))
	}

  let out='', i=0
  let d = typeof date === 'number' ? new Date(date): date

  for (; i<parts.length; i++) {
      out += (typeof parts[i]==='string') ? parts[i] : parts[i](d)
  }
  return out
}
