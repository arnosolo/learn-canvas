function createHDCanvas(w = 200, h = 200) {
  let ratio = window.devicePixelRatio || 1;
  let canvas = document.createElement('canvas');
  canvas.width = w * ratio; // 实际渲染像素
  canvas.height = h * ratio; // 实际渲染像素
  canvas.style.width = `${w}px`; // 控制显示大小
  canvas.style.height = `${h}px`; // 控制显示大小
  // canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
  return canvas;
}

const canvas = createHDCanvas()
const ctx = canvas.getContext('2d')
document.querySelector('body').appendChild(canvas)

let raf
let xOffset = 0
let height = 250

class SinWave {
  constructor(config) {
    const { ctx, freq, amplitude, startX, xOffset } = config
    this.startX = startX ?? 0
    // this.dotsNum = Math.floor((1 - this.startX / canvas.width) * 100)
    // console.log(this.dotsNum);
    // ctx = ctx
    this.xOffset = xOffset
    this.freq = freq ?? 5
    this.amplitude = amplitude ?? 3
    this.dots = []
    this.count = 100
    for (let i = 0; i < 100; i++) {
      this.dots.push({
        x: 2 * i + this.startX,
        y: Math.sin(this.freq / 15 * i) * this.amplitude
      })
    }
    this.cw = canvas.width
    this.ch = canvas.height
  }

  update() {
    this.dots.forEach(dot => {
      dot.x -= 1
    })

    if (this.dots[0].x < 0) {
      this.dots.shift()
      this.dots.push({
        x: 200,
        y: Math.sin(this.freq / 15 * this.count) * this.amplitude
      })
      this.count += 1
    }
    // console.log(this.dots.length);
  }


  draw(height, ctx) {
    ctx.fillStyle = "#f50"
    ctx.save()
    ctx.translate(0, height)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    const step = this.cw / 10
    for (let x = this.startX; x <= this.startX + this.cw; x += step) {
      // ctx.lineTo(this.dots[i].x, this.dots[i].y)
      const y = this.amplitude * Math.sin((this.xOffset + x) * 0.2)
      ctx.lineTo(x, y)
    }
    ctx.lineTo(this.cw, this.ch)
    ctx.lineTo(this.startX, this.ch)

    ctx.stroke();
    ctx.fill()
    ctx.restore()
  }

}

function draw() {
  // ctx.globalCompositeOperation = 'destination-over'
  // let ratio = 1.5
  // ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  // ctx.fillStyle = "#333"
  // ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = "#fff"
  ctx.beginPath()
  ctx.arc(canvas.width / 2, canvas.height / 2, 120, 0, Math.PI * 2)
  // ctx.closePath()
  ctx.stroke()
  ctx.fill()
  // ctx.clip() // ctx.clip方法有点耗费性能. 没注释ctx.clip()前, firefox CPU占用 24%, 注释ctx.clip()后, firefox CPU占用 4%

  ctx.save()
  // 新图形只在与现有画布内容重叠的地方绘制
  ctx.globalCompositeOperation = 'source-atop'
  // draw Sin wave
  const sinWave = new SinWave({ startX: 0, xOffset })
  sinWave.draw(height, ctx)
  ctx.restore()


  // ctx.beginPath()
  // ctx.arc(canvas.width/2, canvas.height/2, 118, 0, Math.PI*2)
  // ctx.closePath()
  // ctx.stroke()

  xOffset -= 0.5
  if (height > 90) {
    height -= 1
  }
  // ctx.fillStyle = "#fff"
  // ctx.fillRect(0, 0, canvas.width, canvas.height)

  raf = window.requestAnimationFrame(draw);


}

canvas.addEventListener('mouseover', () => {
  raf = window.requestAnimationFrame(draw);
})

canvas.addEventListener('mouseout', () => {
  // console.log(111);
  window.cancelAnimationFrame(raf)
})

// const sinWave2 = new SinWave({ctx, freq:5, amplitude:3, startX:40})
window.requestAnimationFrame(draw)
