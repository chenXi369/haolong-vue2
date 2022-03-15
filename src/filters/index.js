// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// 房屋资源 => 房屋列表 朝向
export function orientation(val) {
  switch(val) {
    case "east": {
      return "东"
    }
    case "south": {
      return "南"
    }
    case "west": {
      return "西"
    }
    case "north": {
      return "北"
    }
    case "southEast": {
      return "东南"
    }
    case "northEast": {
      return "东北"
    }
    case "southWest": {
      return "西南"
    }
    case "northWest": {
      return "西北"
    }
    case "frontage": {
      return "临街"
    }
    case "seascape": {
      return "海景"
    }
    case "park": {
      return "公园"
    }
  }
}

// 房屋资源 => 房屋列表 朝向
export function construction(val) {
  switch(val) {
    case "oneHomeOne": {
      return "一房一厅"
    }
    case "twoHome": {
      return "二房一厅"
    }
    case "oneHomeTwo": {
      return "一房二厅"
    }
    case "threeHomeOne": {
      return "三房一厅"
    }
    case "threeHomeTwo": {
      return "三房二厅"
    }
    case "fourHome": {
      return "四房二厅"
    }
    case "fiveHome": {
      return "五房二厅"
    }
    case "single": {
      return "单身公寓"
    }
    case "double": {
      return "复式"
    }
    case "saltation": {
      return "跃式"
    }
    case "house": {
      return "住宅"
    }

    case "work": {
      return "办公"
    }
    case "store": {
      return "商铺"
    }
    case "plant": {
      return "厂房"
    }
    case "other": {
      return "其他"
    }
  }
}

// 房屋列表 => 房屋列表 用途
export function purpose(val) {
  switch(val) {
    case "house": {
      return "住宅"
    }
    case "work": {
      return "办公"
    }
    case "shop": {
      return "商铺"
    }
    case "plant": {
      return "厂房"
    }
    case "other": {
      return "其他"
    }
  }
}
