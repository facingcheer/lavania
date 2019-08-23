import Utils from './Utils'
import Hammer from 'hammerjs'

export default class EventHandler {
	constructor(target, events, preventDefault = false) {
    this._target = target
    this._events = events
    this._preventDefault = preventDefault
    this._hammer = new Hammer(target)
    this._init()
  }

  _init(){
		this._hammer.get('pinch').set({ enable: true })
		this._hammer.on('pinchstart', this.makeEventHander('pinchStartEvent', true), { passive: false })
		this._hammer.on('pinchmove',  this.makeEventHander('pinchMoveEvent', true), { passive: false })
		this._hammer.on('pinchend',  this.makeEventHander('pinchEndEvent', true), { passive: false })

    this._hammer.on('panstart', this.makeEventHander('panStartEvent', true))
		this._hammer.on('panmove',  this.makeEventHander('panMoveEvent', true))
		this._hammer.on('panend',  this.makeEventHander('panEndEvent', true))

    this._target.addEventListener('mousemove', this.makeEventHander('mouseMoveEvent'))
    this._target.addEventListener('mouseleave', this.makeEventHander('mouseLeaveEvent'))
    this._target.addEventListener('wheel', this.makeEventHander('mouseWheelEvent'), { passive: false })
	}

	makeEventHander(eventName, isHammer = false) {
		return function(e) {
			if (event.cancelable) {
				event.preventDefault()
			}
			const compatEvent = isHammer ? e : this._makeCompatEvent(e)
			this._processEvent(compatEvent, this._events[eventName])
			this._preventDefaultIfNeeded(e)
		}.bind(this)
	}

  _preventDefaultIfNeeded (event) {
    if (this._preventDefault && event.cancelable) {
        event.preventDefault()
    }
  }

  _makeCompatEvent(event) {
		let eventLike
		if ('touches' in event && event.touches.length) {
				eventLike = event.touches[0]
		}
		else if ('changedTouches' in event && event.changedTouches.length) {
				eventLike = event.changedTouches[0]
		}
		else {
				eventLike = event
		}
		var deltaX = event.deltaX / 100
		var deltaY = -(event.deltaY / 100)
		switch (event.deltaMode) {
				case event.DOM_DELTA_PAGE:
						// one screen at time scroll mode
						eventLike.deltaX = deltaX * 120
						eventLike.deltaY *= deltaY * 120
						break
				case event.DOM_DELTA_LINE:
						// one line at time scroll mode
						eventLiked.deltaX = deltaX * 32
						eventLike.deltaY = deltaY * 32
						break
		}

		var box = this._target.getBoundingClientRect() || { left: 0, top: 0 }
		return {
				clientX: eventLike.clientX,
				clientY: eventLike.clientY,
				pageX: eventLike.pageX,
				pageY: eventLike.pageY,
				deltaX: eventLike.deltaX || null,
				deltaY: eventLike.deltaY || null,
				screenX: eventLike.screenX,
				screenY: eventLike.screenY,
				localX: eventLike.clientX - box.left,
				localY: eventLike.clientY - box.top,
				ctrlKey: event.ctrlKey,
				altKey: event.altKey,
				shiftKey: event.shiftKey,
				metaKey: event.metaKey,
				target: eventLike.target,
				view: event.view,
				preventDefault() {
						if (event.cancelable) {
								event.preventDefault()
						}
				},
		}
	}

  _processEvent(event, eventFunc) {
		if (!eventFunc) {
				return
		}
		eventFunc.call(this._events, event)
	}
}
