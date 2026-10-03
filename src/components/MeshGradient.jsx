import { useEffect, useRef } from 'react'

// WebGL'da sekin oqib turuvchi ipak gradient. Yarim o'lchamda chiziladi
// (yengil), ko'rinmay qolganda to'xtaydi. WebGL bo'lmasa — CSS gradient qoladi.
const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec3 c0; uniform vec3 c1; uniform vec3 c2; uniform vec3 c3; uniform vec3 c4;
// Silliq "nur to'pi": markazdan chetga Gauss bo'yicha so'nadi
float blob(vec2 uv, vec2 c, float r) {
  vec2 d = uv - c;
  return exp(-dot(d, d) / (r * r));
}
void main(){
  float asp = u_res.x / u_res.y;
  vec2 uv = gl_FragCoord.xy / u_res;
  uv.x *= asp;
  float t = u_time * 0.11;
  vec2 m = vec2(asp * 0.5, 0.5);
  vec2 p1 = m + vec2(cos(t * 0.70) * 0.42 * asp, sin(t * 0.90) * 0.30);
  vec2 p2 = m + vec2(sin(t * 0.55 + 2.0) * 0.40 * asp, cos(t * 0.65 + 1.0) * 0.34);
  vec2 p3 = m + vec2(cos(t * 0.45 + 4.0) * 0.36 * asp, sin(t * 0.75 + 3.0) * 0.32);
  vec2 p4 = m + vec2(sin(t * 0.80 + 5.0) * 0.30 * asp, cos(t * 0.50 + 2.5) * 0.28);
  float r = 0.42 + 0.06 * sin(t);
  vec3 col = c0;
  col = mix(col, c1, blob(uv, p1, r * 1.05) * 0.95);
  col = mix(col, c2, blob(uv, p2, r * 0.95) * 0.9);
  col = mix(col, c3, blob(uv, p3, r * 1.10) * 0.85);
  col = mix(col, c4, blob(uv, p4, r * 0.80) * 0.75);
  // Juda nozik dithering — gradientda "zinapoya" chiqmasligi uchun
  float n = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  gl_FragColor = vec4(col + (n - 0.5) / 255.0, 1.0);
}`
const VERT = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`

export const LIGHT = ['#F6F0E8', '#F0C9B8', '#EDD3A6', '#C9DACE', '#FFFCF6']
export const DARK = ['#121110', '#3B2A20', '#22302B', '#4A3B28', '#1E1B24']

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)

// colors: [fon, to'p1, to'p2, to'p3, to'p4]
export default function MeshGradient({ colors = LIGHT, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
    if (!gl) return
    const sh = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'a')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uTime = gl.getUniformLocation(prog, 'u_time')
    ;['c0', 'c1', 'c2', 'c3', 'c4'].forEach((n, i) => gl.uniform3fv(gl.getUniformLocation(prog, n), hex(colors[i])))

    const scale = 0.35
    const resize = () => {
      canvas.width = Math.max(2, Math.round(canvas.clientWidth * scale))
      canvas.height = Math.max(2, Math.round(canvas.clientHeight * scale))
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
    }
    resize()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)
    let raf
    let last = 0
    const t0 = performance.now() - 20000
    const draw = (now) => {
      raf = requestAnimationFrame(draw)
      if (!visible || now - last < 33 || canvas.offsetParent === null) return
      last = now
      gl.uniform1f(uTime, (now - t0) / 1000)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    if (reduce) {
      gl.uniform1f(uTime, 20)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    } else raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [])
  return <canvas ref={ref} className={`mesh ${className}`} aria-hidden />
}
