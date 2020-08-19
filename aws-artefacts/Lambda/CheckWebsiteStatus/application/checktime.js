const validValue = (_value, _reference) => {
  if (_value == '*' || _value == _reference) {
    return true;
  }

  let value = (_value.replace('*', _reference))

  value = value.replace('/', '%')

  let sobra = eval(value)

  if (sobra == 0 && value.indexOf('%') > 0) {
  	return true
  }

  return false;
}

const checkTime = (_time) => {
  let now = new Date()
  let second = now.getSeconds()
  let minute = now.getMinutes()
  let hour = now.getHours()
  let day = now.getDate()
  let month = now.getMonth()
  let dayOfWeek = now.getDay()
  let times = _time.split(' ')
  let timeValid = validValue()

  if (validValue(times[0], second)
    && validValue(times[1], minute)
    && validValue(times[2], hour)
    && validValue(times[3], day)
    && validValue(times[4], month + 1)
   	&& validValue(times[5], dayOfWeek)) {
   	return true
  }

  return false
}

module.exports = checkTime