/* eslint-disable camelcase */
import {
	mobileTouch,
	isTouchEvent
} from './utils/mobileTouch'
import {
	ensure,
	ensureDefined,
	ensureNotNull
} from './utils/ensure'

import Utils from './Utils'


export default class MouseEventHandler {
	constructor(target, handler, preventDefault, verticalTouchScroll) {
		this._clickCount = 0
		this._clickTimeoutId = null
		this._lastTouchPosition = {
			x: 0,
			y: 0
		}
		this._mouseMoveStartPosition = null
		this._moveExceededManhattanDistance = false
		this._cancelClick = false
		this._unsubscribeOutsideEvents = null
		this._unsubscribeMousemove = null
		this._unsubscribeRoot = null
		this._startPinchMiddlePoint = null
		this._startPinchDistance = 0
		this._pinchPrevented = false
		this._mousePressed = false
		this._target = target
		this._handler = handler
		this._originalPreventDefault = preventDefault
		this._preventDefault = verticalTouchScroll ? false : preventDefault
		this._verticalTouchScroll = verticalTouchScroll
		this._init()
	}

	_init() {
		this._target.addEventListener('mouseenter', this._mouseEnterHandler.bind(this))
		const _temp_doc = this._target.ownerDocument

		const outsideHandlerTemp = (event) => {
			if (!this._handler.mouseDownOutsideEvent) {
				return
			}
			if (event.target && this._target.contains(event.target)) {
				return
			}
			this._handler.mouseDownOutsideEvent()
		}

		this._unsubscribeOutsideEvents = () => {
			_temp_doc.removeEventListener('mousedown', outsideHandlerTemp)
			_temp_doc.removeEventListener('touchstart', outsideHandlerTemp)
		}
		_temp_doc.addEventListener('mousedown', outsideHandlerTemp)
		_temp_doc.addEventListener('touchstart', outsideHandlerTemp)

		this._target.addEventListener('mouseleave', this._mouseLeaveHandler.bind(this))
		this._target.addEventListener('touchstart', this._mouseDownHandler.bind(this))
		if (!mobileTouch) {
			this._target.addEventListener('mousedown', this._mouseDownHandler.bind(this))
		}
		this._target.addEventListener('wheel', this._onWheelBound, { passive: false });

		this._initPinch()
	}

	_initPinch() {
		if (this._handler.pinchStartEvent === undefined &&
				this._handler.pinchEvent === undefined &&
				this._handler.pinchEndEvent === undefined) {
				return
		}
		this._target.addEventListener('touchstart', (event) => {
				this._checkPinchState(event.touches)
		})
		this._target.addEventListener('touchmove', (event) => {
				if (event.touches.length !== 2 || this._startPinchMiddlePoint === null) {
						return
				}
				if (this._handler.pinchEvent !== undefined) {
						var currentDistance = Utils.Coord.getDistance(event.touches[0], event.touches[1])
						var scale = currentDistance / this._startPinchDistance
						this._handler.pinchEvent(this._startPinchMiddlePoint, scale)
				}
		}, { passive: false })
		this._target.addEventListener('touchend', (event) => {
			this._checkPinchState(event.touches)
		})
	}

	_makeCompatEvent(event) {
		// TouchEvent has no clientX/Y coordinates:
		// We have to use the last Touch instead
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
		var box = this._target.getBoundingClientRect() || { left: 0, top: 0 }
		return {
				clientX: eventLike.clientX,
				clientY: eventLike.clientY,
				pageX: eventLike.pageX,
				pageY: eventLike.pageY,
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

	_mouseEnterHandler(enterEvent) {
		this._unsubscribeMousemove && this._unsubscribeMousemove()
		this._unsubscribeMousemove = () => {
			this._target.removeEventListener('mousemove', this._mouseMoveHandler.bind(this))
		}
		this._target.addEventListener('mousemove', this._mouseMoveHandler.bind(this))
		mobileTouch && this._mouseMoveHandler(enterEvent)
		const compatEvent = this._makeCompatEvent(enterEvent)
		this._processEvent(compatEvent, this._handler.mouseEnterEvent)
		this._preventDefaultIfNeeded(enterEvent)
	}

	_mouseMoveHandler(moveEvent) {
		if (this._mousePressed && !mobileTouch) return

		const compatEvent = this._makeCompatEvent(moveEvent)
		this._processEvent(compatEvent, this._handler.mouseMoveEvent)
		this._preventDefaultIfNeeded(moveEvent)
	}

	_mouseLeaveHandler(event) {
		if (this._unsubscribeMousemove) {
			this._unsubscribeMousemove()
		}
		const compatEvent = this._makeCompatEvent(event)
		this._processEvent(compatEvent, this._handler.mouseLeaveEvent)
		this._preventDefaultIfNeeded(event)
	}

	_mouseUpHandler(mouseUpEvent) {
		if ('button' in mouseUpEvent && mouseUpEvent.button !== 0 /* Left */ ) return

		const compatEvent = this._makeCompatEvent(mouseUpEvent)
		this._mouseMoveStartPosition = null
		this._mousePressed = false
		if (this._unsubscribeRoot) {
			this._unsubscribeRoot()
			this._unsubscribeRoot = null
		}
		if (mobileTouch || 'touches' in mouseUpEvent) {
			this._mouseLeaveHandler(mouseUpEvent)
		}
		this._processEvent(compatEvent, this._handler.mouseUpEvent)
			++this._clickCount
		if (this._clickTimeoutId && this._clickCount > 1) {
			this._processEvent(compatEvent, this._handler.mouseDoubleClickEvent)
			this._resetClickTimeout()
		} else {
			if (!this._cancelClick) {
				this._processEvent(compatEvent, this._handler.mouseClickEvent)
			}
		}
		this._preventDefaultIfNeeded(mouseUpEvent)
		if (mobileTouch) {
			this._mouseLeaveHandler(mouseUpEvent)
		}
	}

	_onWheelBound(event) {

		var deltaX = event.deltaX / 100;
		var deltaY = -(event.deltaY / 100);
		if ((deltaX === 0 || !this._options.handleScroll.mouseWheel) &&
				(deltaY === 0 || !this._options.handleScale.mouseWheel)) {
				return;
		}
		if (event.cancelable) {
				event.preventDefault();
		}
		switch (event.deltaMode) {
				case event.DOM_DELTA_PAGE:
						// one screen at time scroll mode
						deltaX *= 120;
						deltaY *= 120;
						break;
				case event.DOM_DELTA_LINE:
						// one line at time scroll mode
						deltaX *= 32;
						deltaY *= 32;
						break;
		}
		console.log('滚轮触发', deltaY)
		if (deltaY !== 0 && this._options.handleScale.mouseWheel) {
				var zoomScale = Math.sign(deltaY) * Math.min(1, Math.abs(deltaY));
				var scrollPosition = event.clientX - this._element.getBoundingClientRect().left;
				// this.model().zoomTime(scrollPosition, zoomScale);
		}
		if (deltaX !== 0 && this._options.handleScroll.mouseWheel) {
				// this.model().scrollChart(deltaX * -80); // 80 is a made up coefficient, and minus is for the "natural" scroll
		}
};

	_processEvent(event, eventFunc) {
		if (!eventFunc) {
				return
		}
		eventFunc.call(this._handler, event)
	}

	_preventDefaultIfNeeded (event) {
		if (this._preventDefault && event.cancelable) {
				event.preventDefault()
		}
	}

	_mouseDownHandler(downEvent) {
		if ('button' in downEvent && downEvent.button !== 0 /* Left */ ) {
			return
		}
		var compatEvent = this._makeCompatEvent(downEvent)
		this._cancelClick = false
		this._moveExceededManhattanDistance = false
		if (mobileTouch) {
			this._lastTouchPosition.x = compatEvent.pageX
			this._lastTouchPosition.y = compatEvent.pageY
			this._mouseEnterHandler(downEvent)
		}
		this._mouseMoveStartPosition = {
			x: compatEvent.pageX,
			y: compatEvent.pageY,
		}
		if (this._unsubscribeRoot) {
			this._unsubscribeRoot()
			this._unsubscribeRoot = null
		} {
			const mouseMoveDownHandler = this._mouseMoveWithDownHandler.bind(this)
			const mouseMoveUpHandler = this._mouseUpHandler.bind(this)
			const _root = this._target.ownerDocument.documentElement
			this._unsubscribeRoot = () => {
				_root.removeEventListener('touchmove', mouseMoveDownHandler)
				_root.removeEventListener('touchend', mouseMoveUpHandler)
				_root.removeEventListener('mousemove', mouseMoveDownHandler)
				_root.removeEventListener('mouseup', mouseMoveUpHandler)
			}
			_root.addEventListener('touchmove', mouseMoveDownHandler, {
				passive: false
			})
			_root.addEventListener('touchend', mouseMoveUpHandler)
			if (!mobileTouch) {
				_root.addEventListener('mousemove', mouseMoveDownHandler)
				_root.addEventListener('mouseup', mouseMoveUpHandler)
			}
		}
		this._mousePressed = true
		this._processEvent(compatEvent, this._handler.mouseDownEvent)
		if (!this._clickTimeoutId) {
			this._clickCount = 0
			this._clickTimeoutId = setTimeout(this._resetClickTimeout.bind(this), 500 /* ResetClick */ )
		}
		this._preventDefaultIfNeeded(downEvent)
		if (this._preventDefault) {
			try {
				window.focus()
			} catch (er) {
				// empty block
			}
		}
	}

	_mouseMoveWithDownHandler(moveEvent)  {
		if ('button' in moveEvent && moveEvent.button !== 0 /* Left */) {
				return
		}
		if (this._startPinchMiddlePoint !== null) {
				return
		}
		// prevent pinch if move event comes faster than the second touch
		this._pinchPrevented = true
		var preventProcess = false
		var compatEvent = this._makeCompatEvent(moveEvent)
		var isTouch = mobileTouch || moveEvent.touches
		if (isTouch) {
				if (this._verticalTouchScroll) {
						// tslint:disable-next-line:no-shadowed-variable
						var xOffset_1 = Math.abs((compatEvent.pageX - this._lastTouchPosition.x) * 0.5)
						// tslint:disable-next-line:no-shadowed-variable
						var yOffset_1 = Math.abs(compatEvent.pageY - this._lastTouchPosition.y)
						if (xOffset_1 <= yOffset_1) {
								preventProcess = true
								this._preventDefault = false
						}
						else {
								this._preventDefault = this._originalPreventDefault
						}
				}
				this._lastTouchPosition.x = compatEvent.pageX
				this._lastTouchPosition.y = compatEvent.pageY
		}
		var startMouseMovePos = ensure(this._mouseMoveStartPosition)
		var xOffset = Math.abs(startMouseMovePos.x - compatEvent.pageX)
		var yOffset = Math.abs(startMouseMovePos.y - compatEvent.pageY)
		this._moveExceededManhattanDistance = this._moveExceededManhattanDistance || xOffset + yOffset > 5
		if (this._moveExceededManhattanDistance) {
				// if manhattan distance is more that 5 - we should cancel click event
				this._cancelClick = true
		}
		else if (isTouch) {
				preventProcess = true
		}
		if (!preventProcess) {
				this._processEvent(compatEvent, this._handler.pressedMouseMoveEvent)
		}
		this._preventDefaultIfNeeded(moveEvent)
	}

	_checkPinchState(touches) {
		if (touches.length === 1) {
			this._pinchPrevented = false
		}
		if (touches.length !== 2 || this._pinchPrevented) {
			this._stopPinch()
		}
		else {
			this._startPinch(touches)
		}
	}

	_startPinch(touches) {
		var box = getBoundingClientRect(this._target)
		this._startPinchMiddlePoint = {
			x: ((touches[0].clientX - box.left) + (touches[1].clientX - box.left)) / 2,
			y: ((touches[0].clientY - box.top) + (touches[1].clientY - box.top)) / 2,
		}
		this._startPinchDistance = Utils.Coord.getDistance(touches[0], touches[1])
		if (this._handler.pinchStartEvent !== undefined) {
			this._handler.pinchStartEvent()
		}
	}

	_stopPinch() {
		if (this._startPinchMiddlePoint === null) {
			return
		}
		this._startPinchMiddlePoint = null
		if (this._handler.pinchEndEvent !== undefined) {
			this._handler.pinchEndEvent()
		}
	}

	_resetClickTimeout() {
		if (this._clickTimeoutId !== null) {
			clearTimeout(this._clickTimeoutId)
		}
		this._clickCount = 0
		this._clickTimeoutId = null
	}

	destroy() {
		if (this._unsubscribeOutsideEvents !== null) {
			this._unsubscribeOutsideEvents()
			this._unsubscribeOutsideEvents = null
		}
		if (this._unsubscribeMousemove !== null) {
			this._unsubscribeMousemove()
			this._unsubscribeMousemove = null
		}
		if (this._unsubscribeRoot !== null) {
			this._unsubscribeRoot()
			this._unsubscribeRoot = null
		}
	}
}
