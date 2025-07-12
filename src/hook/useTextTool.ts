import { useState } from 'react'
import useCanvas from './useCanvas'
export const useTextTool = (canvasRef: React.RefObject<HTMLCanvasElement | null>, onBlur?: () => void) => {
  const [textConfig, setTextConfig] = useState({
    color: '#000000',
    fontSize: 16,
    fontFamily: 'Arial',
  })
  
  const createText = (e: MouseEvent) => {
    const input = document.createElement('textarea')
    // 应用外部可配置的样式
    Object.assign(input.style, {
      position: 'absolute',
      left: `${e.clientX}px`,
      top: `${e.clientY}px`,
      border: 'none',
      outline: 'none',
      resize: 'none',
    });
    input.rows = 10;
    input.cols = 40;
    document.body.appendChild(input)
    input.focus()
    // 添加blur事件处理
    input.addEventListener('blur', () => {
      if (!input.value.trim()) {
        document.body.removeChild(input);
      }
      onBlur?.()
      
    });
    
  }

  return { createText }
}
