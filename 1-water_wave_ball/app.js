function createCanvas(w = 200, h = 200) {
  let ratio = window.devicePixelRatio ?? 1;
  let canvas = document.createElement('canvas');
  canvas.style.width = `${w}px`; // 画板显示宽度
  canvas.style.height = `${h}px`; // 画板显示高度
  canvas.width = w * ratio; // 实际绘图宽度
  canvas.height = h * ratio; // 实际绘图高度
  canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
  canvas.w = w
  canvas.h = h
  return canvas;
}

class SinWave {
  constructor(config) {
    const { width, amplitude, startX, xOffset, speed, color } = config
    this.startX = startX ?? 0
    this.xOffset = xOffset ?? 0
    this.width = width ?? 60
    this.amplitude = amplitude ?? 4
    this.speed = speed ?? 0.2
    this.color = color ?? "#f2864d"
    this.cw = canvas.w
    this.ch = canvas.h
  }

  draw(ctx, height) {
    if (this.color.grad) {
      let lingrad = ctx.createLinearGradient(this.cw/2, height, this.cw/2, this.ch);
      lingrad.addColorStop(0, this.color.start);
      lingrad.addColorStop(1, this.color.end);
      ctx.fillStyle = lingrad;
    } else {
      ctx.fillStyle = this.color
      ctx.globalAlpha = 0.5;
    }

    ctx.save()
    ctx.translate(0, height)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    this.xOffset += this.speed
    const step = this.cw / 50
    for (let x = this.startX; x <= this.startX + this.cw; x += step) {
      const y = this.amplitude * Math.sin((this.xOffset + x) / this.width * 6)
      ctx.lineTo(x, y)
    }
    ctx.lineTo(this.cw, this.ch)
    ctx.lineTo(this.startX, this.ch)

    // ctx.stroke();
    ctx.fill()
    ctx.restore()
  }

}

const canvas = createCanvas()
const ctx = canvas.getContext('2d')
document.querySelector('body').appendChild(canvas)

let raf
let loadPercentTarget = 0 // 0~1
let loadPercent = 0 // 0~1
const circlePercent = 0.8
const paddingPercent = (1 - circlePercent) / 2
const circleRadius = canvas.h * circlePercent * 0.5
const percentToHeight = (loadPercent) => {
  return canvas.h * (1 - circlePercent * loadPercent - paddingPercent)
}
let height = percentToHeight(loadPercent)
const frontWave = new SinWave({ speed: 0.3, color: { grad: true, start: '#f2864d', end: '#e19471' } })
const bgWave = new SinWave({ speed: -0.1, freq: 0.07 })

function draw() {
  // ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.clearRect(0, 0, canvas.w, canvas.h)

  // 画个圆
  ctx.fillStyle = "#fff"
  ctx.beginPath()
  ctx.arc(canvas.w/2, canvas.h/2, circleRadius, 0, Math.PI * 2)
  // ctx.fillRect(0, 0, canvas.w, canvas.h)
  ctx.fill()

  // ctx.clip() // ctx.clip方法有点耗费性能. 没注释ctx.clip()前, firefox CPU占用 24%, 注释ctx.clip()后, firefox CPU占用 4%

  // 背景波
  ctx.save()
  ctx.globalCompositeOperation = 'source-atop' // 新图形只在与现有画布内容重叠的地方绘制
  bgWave.draw(ctx, height)
  ctx.restore()

  // 前景波
  ctx.save()
  ctx.globalCompositeOperation = 'source-atop' // 新图形只在与现有画布内容重叠的地方绘制
  frontWave.draw(ctx, height)
  ctx.restore()

  // 画个圈
  ctx.strokeStyle = "#cca094"
  ctx.beginPath()
  ctx.arc(canvas.w / 2, canvas.h / 2, circleRadius, 0, Math.PI * 2)
  ctx.stroke()

  // 加载动画
  // if (height > canvas.h * (1 - circlePercent * loadPercentTarget - paddingPercent)) {
  //   height -= 1
  // }
  if(loadPercent > 1) loadPercent = 1
  if(loadPercentTarget > 1) loadPercentTarget = 1
  if(loadPercent < loadPercentTarget) {
    loadPercent += 0.01
    height = percentToHeight(loadPercent)
  }

  // 百分比数字
  ctx.font = "40px serif";
  ctx.fillStyle = "#793c19"
  ctx.textAlign = 'center'
  ctx.fillText(`${Math.floor(loadPercent * 100)}%`, canvas.w / 2, canvas.h / 2 + 10)

  raf = window.requestAnimationFrame(draw);

}

window.requestAnimationFrame(draw)

function addPercent(step) {
  // console.log(111);
  loadPercentTarget += step
}