const Draw = {
  Basic(ctx, func) {
    ctx.save()
    ctx.beginPath()
    func(ctx)

  },
  Fill(ctx, func, style) {
    Draw.Basic(ctx, func)

    ctx.fillStyle = style || 'black'
    ctx.fill()
    ctx.closePath()
    ctx.restore()
  },
  Stroke(ctx, func, style) {
    Draw.Basic(ctx, func)

    ctx.strokeStyle = style || 'black'
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  },

  FillnStroke(ctx, func, fillStyle, strokeStyle) {
    Draw.Basic(ctx, func)

    ctx.fillStyle = fillStyle || 'black'
    ctx.strokeStyle = strokeStyle || 'black'
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
    ctx.restore()
  },
  Text(ctx, func, fillStyle, fontStyle) {
    ctx.save()
    if (fontStyle) {
      ctx.font = fontStyle
    }
    ctx.fillStyle = fillStyle || 'black'
    func(ctx)
    ctx.restore()
  }
}

export default Draw
