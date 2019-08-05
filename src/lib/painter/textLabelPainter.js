
import Utils from '../Utils'

const originPosMap ={
  left: [0, 0.5],
  top: [0.5, 0],
  right: [1, 0.5],
  bottom: [0.5, 1],
  lefttop: [0,0],
  righttop: [1, 0],
  leftbottom: [0,1],
  rightbottom: [1,1],
  center: [0.5,0.5]
}
// originPos: provide origin in the position of the label
export default function textLabelPainter ({ctx, text, origin, originPos, labelHeight, labelXPadding, font, xMax, yMax, fontColor, labelBg}) {
  let labelWidth
  Utils.Draw.Text(ctx, ctx => {
    labelWidth = ctx.measureText(text).width + labelXPadding * 2
  }, null ,font)
  // realOrigin origin can be use for CanvasRenderingContext2D.rect() {x:x,y:y}

  let realOrigin = {
    x: origin.x - originPosMap[originPos][0] * labelWidth,
    y: origin.y - originPosMap[originPos][1] * labelHeight
  }

  realOrigin.x = realOrigin.x < 0 ? 0 : (realOrigin.x + labelWidth > xMax ? xMax - labelWidth : realOrigin.x)

  Utils.Draw.Fill(ctx, ctx => {
    ctx.rect(realOrigin.x, realOrigin.y, labelWidth, labelHeight)
  }, labelBg)

  // draw x label text
  let textX = realOrigin.x + labelXPadding
  let textY =  realOrigin.y + labelHeight / 2
  Utils.Draw.Text(ctx, ctx =>{
    ctx.fillText(text,
      textX, textY) }, fontColor, font, 'middle')
}
