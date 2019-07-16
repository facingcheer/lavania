const Log = {
  errList: [],
  MARK: function() {
    var lastMark = -1
    var count = 0
    var reportedMark = {}
    return function(mark){
      if (lastMark === mark)
        count += 1
      else
        count = 0

      if (typeof console !== 'undefined' &&
          count > 100000 &&
          !(mark in reportedMark)){
        reportedMark[mark] = 1
        console.warn(mark)
      }

      lastMark = mark
    }
  }(),
  EXIST (elem, name){
    if (!elem){
      var err = new Error()
      var exceptionDesc = '(' + name + ') IN [' + arguments.callee.caller.name + '] NOT EXIST'

      if (Log.errList.length &&
          err.stack + exceptionDesc === Log.errList[Log.errList.length - 1].stack +
                                         Log.errList[Log.errList.length - 1].desc)
        return

      if (Log.errList.length > 100)
        Log.errList.shift()

      Log.errList.push({
        desc: exceptionDesc,
        stack: err.stack,
        date: +new Date
      })
    }
  }
}

export default Log
