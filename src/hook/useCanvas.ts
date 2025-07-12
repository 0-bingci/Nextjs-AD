'use client'
import { useRef, useEffect, useState, useCallback } from 'react'
import { useTextTool } from '../hook/useTextTool'

export default function useCanvas() {
  // 初始配置
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const [drawConfig, setDrawConfig] = useState({
    color: '#000000',
    lineWidth: 5,
    lineCap: 'round' as CanvasLineCap,
    lineJoin: 'round' as CanvasLineJoin,
  })
  // 模式设置
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isTextMode, setIsTextMode] = useState(false);
  const [isPointerMode, setIsPointerMode] = useState(false);
  const [isEraserMode, setIsEraserMode] = useState(false);
  //hook导出方法
  const { createText } = useTextTool(canvasRef,()=>{handleModeChange('pointer');});  

  const handleModeChange = useCallback((mode: 'brush' | 'eraser' | 'text' | 'pointer') => {
    // 重置所有模式状态
    setIsDrawingMode(false);
    setIsTextMode(false);
    setIsEraserMode(false);
    setIsPointerMode(false);
    
    // 根据选择的模式设置对应状态
    switch(mode) {
      case 'brush':
        setIsDrawingMode(true);
        break;
      case 'eraser':
        setIsEraserMode(true);
        break;
      case 'text':
        setIsTextMode(true);
        break;
      case 'pointer':
        setIsPointerMode(true);
        break;
    }
    handleModeChange1();
  },[setIsDrawingMode, setIsTextMode, setIsEraserMode, setIsPointerMode]);

  // 使用AbortController管理事件监听器
  const abortControllerRef = useRef<AbortController | null>(null)

  // 根据模式动态添加/移除事件监听器
  const handleModeChange1 = () => {
    if (!canvasRef.current) return
    lastPointRef.current = null
    // 终止之前的控制器以移除所有事件监听器
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    // 创建新的AbortController
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current
    
    if (isDrawingMode) {
      // 绘图模式：只添加双击事件
      updateDrawConfig({color: '#000000'})
      canvasRef.current.addEventListener('dblclick', createText, { signal })
      canvasRef.current.addEventListener('mousedown', handleMouseDown, { signal })
      canvasRef.current.addEventListener('mousemove', handleMouseMove, { signal })
      canvasRef.current.addEventListener('mouseup', handleMouseUp, { signal })
    } else if (isTextMode) {
      // 文本模式：添加单击和双击事件
      canvasRef.current.addEventListener('click', createText, { signal })
      canvasRef.current.addEventListener('dblclick', createText, { signal })
    } else if (isEraserMode) {
      updateDrawConfig({color: '#ffffff'});
      canvasRef.current.addEventListener('mousedown', handleMouseDown, { signal })
      canvasRef.current.addEventListener('mousemove', handleMouseMove, { signal })
      canvasRef.current.addEventListener('mouseup', handleMouseUp, { signal })
    }
    
    // // 始终添加移动和释放事件（在handleMouseDown中会检查模式）
    // canvasRef.current.addEventListener('mousemove', handleMouseMove, { signal })
    // canvasRef.current.addEventListener('mouseup', handleMouseUp, { signal })
  }
  // 监听模式
  useEffect(() => {
    handleModeChange1();
  }, [isDrawingMode, isTextMode, isPointerMode, isEraserMode])
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

  }, [])

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
    if (!isDrawingMode && !isEraserMode) return;
    const { x, y } = getCanvasCoordinates(e)
    // drawPoint(x, y)
    lastPointRef.current = { x, y }
  }

  // 鼠标移动事件
  function handleMouseMove(e: MouseEvent) {
    if (!isDrawingMode && !isEraserMode) return;
    if (!lastPointRef.current) return
    const { x, y } = getCanvasCoordinates(e)
    drawLine(lastPointRef.current.x, lastPointRef.current.y, x, y)
    lastPointRef.current = { x, y }
  }

  // 鼠标释放事件
  function handleMouseUp() {
    lastPointRef.current = null; // 重置最后点
    
    if (!canvasRef.current) return
    console.log(ctxRef.current,canvasRef.current);
    console.log(canvasRef.current.toDataURL());
    
    // canvasRef.current.removeEventListener('mousemove', handleMouseMove)
    // canvasRef.current.removeEventListener('mouseup', handleMouseUp)
  }
  const updateDrawConfig = (config: Partial<typeof drawConfig>) => {
    setDrawConfig((prev) => ({ ...prev, ...config }))
  }

  //   // 清空画布
  //   function clearCanvas() {
  //     if (!canvasRef.current || !ctxRef.current) return
  //     ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
  //   
  return {
    canvasRef,
    drawConfig,
    updateDrawConfig,
    isDrawingMode,
    setDrawingMode: setIsDrawingMode,
    setIsTextMode,
    isTextMode,
    setIsPointerMode,
    isPointerMode,
    setIsEraserMode,
    isEraserMode,
    handleModeChange1,
    handleModeChange,
  }
}
