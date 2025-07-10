'use client'
import { useRef, useEffect, useState } from 'react'

export default function useCanvas() {
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const [drawConfig, setDrawConfig] = useState({
    color: '#000000',
    lineWidth: 5,
    lineCap: 'round' as CanvasLineCap,
    lineJoin: 'round' as CanvasLineJoin,
  })
  
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  // 在useEffect中应用配置
  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = drawConfig.color
      ctxRef.current.lineWidth = drawConfig.lineWidth
      ctxRef.current.lineCap = drawConfig.lineCap
      ctxRef.current.lineJoin = drawConfig.lineJoin
    }
  }, [drawConfig])
  // 初始化画布
  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // 设置画布尺寸
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    if (!ctx) return
    ctxRef.current = ctx

    // 设置绘图样式
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 5
    ctx.strokeStyle = '#000'

    // 添加事件监听
    canvas.addEventListener('mousedown', handleMouseDown)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
    }
  }, [isDrawingMode])

  // 获取画布坐标
  function getCanvasCoordinates(e: MouseEvent) {
    if (!canvasRef.current) return { x: 0, y: 0 }
    const rect = canvasRef.current.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  // 绘制点
  function drawPoint(x: number, y: number) {
    if (!ctxRef.current) return
    const ctx = ctxRef.current
    ctx.beginPath()
    ctx.arc(x, y, ctx.lineWidth / 2, 0, 2 * Math.PI, false)
    ctx.fill()
  }

  // 绘制线
  function drawLine(x1: number, y1: number, x2: number, y2: number) {
    if (!ctxRef.current) return
    const ctx = ctxRef.current
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }

  // 鼠标按下事件
  function handleMouseDown(e: MouseEvent) {
    if (!isDrawingMode) return;
    const { x, y } = getCanvasCoordinates(e)
    drawPoint(x, y)
    lastPointRef.current = { x, y }

    canvasRef.current?.addEventListener('mousemove', handleMouseMove)
    canvasRef.current?.addEventListener('mouseup', handleMouseUp)
  }

  // 鼠标移动事件
  function handleMouseMove(e: MouseEvent) {
    if (!isDrawingMode) return;
    if (!lastPointRef.current) return
    const { x, y } = getCanvasCoordinates(e)
    drawLine(lastPointRef.current.x, lastPointRef.current.y, x, y)
    lastPointRef.current = { x, y }
  }

  // 鼠标释放事件
  function handleMouseUp() {
    if (!canvasRef.current) return
    canvasRef.current.removeEventListener('mousemove', handleMouseMove)
    canvasRef.current.removeEventListener('mouseup', handleMouseUp)
  }
  const updateDrawConfig = (config: Partial<typeof drawConfig>) => {
    setDrawConfig((prev) => ({ ...prev, ...config }))
  }

  //   // 清空画布
  //   function clearCanvas() {
  //     if (!canvasRef.current || !ctxRef.current) return
  //     ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
  //   }

  return {
    canvasRef,
    drawConfig,
    updateDrawConfig,
    isDrawingMode,
    setDrawingMode: setIsDrawingMode,
  }
}
