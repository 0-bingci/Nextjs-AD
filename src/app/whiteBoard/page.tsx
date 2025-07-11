'use client'
import React, { useEffect, useState, useRef,useCallback } from 'react'
import {
  SearchOutlined,
  EditOutlined,
  ArrowUpOutlined,
  FontColorsOutlined,
  HighlightOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import useCanvas from '../../hook/useCanvas'
import {useTextTool} from '../../hook/useTextTool'
import { log } from 'console'

export default function Board() {
  const [activeButton, setActiveButton] = useState<string | null>('pointer')
  const { canvasRef, isDrawingMode, setDrawingMode,updateDrawConfig,setIsTextMode,setIsEraserMode,setIsPointerMode,isEraserMode,isPointerMode,isTextMode } = useCanvas()
  
  const handleModeChange = useCallback((mode: 'brush' | 'eraser' | 'text' | 'pointer') => {
    setActiveButton(mode);
    
    // 重置所有模式状态
    setDrawingMode(false);
    setIsTextMode(false);
    setIsEraserMode(false);
    setIsPointerMode(false);
    
    // 根据选择的模式设置对应状态
    switch(mode) {
      case 'brush':
        setDrawingMode(true);
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
  },[setDrawingMode, setIsTextMode, setIsEraserMode, setIsPointerMode]);
  const { createText } = useTextTool(canvasRef, useCallback(() => {
    console.log(1);
    handleModeChange('pointer');
  }, [handleModeChange]));

  return (
    <div className="bg-white h-[80vh] relative">
      <canvas className="w-full h-full border border-gray-200" id="canvas" ref={canvasRef}></canvas>
      <div className="space-x-2 w-[30%] h-[8vh] absolute bottom-0 left-[35%] flex justify-center items-center">
        {/* 按钮1 - 指针 */}
        <button
          className={`flex justify-center items-center m-1 p-2 w-full h-full 
      ${activeButton === 'pointer' ? 'bg-blue-500 text-white' : 'bg-[#f2f2f2]'}
      hover:bg-[#e0e0e0] hover:shadow-md transition-all`}
          onClick={() => handleModeChange('pointer')}
        >
          <ArrowUpOutlined className="h-[6vh] w-[6vh]" style={{ fontSize: '32px' }}/>
        </button>

        {/* 按钮2 - 画笔 */}
        <button
          className={`flex justify-center items-center m-1 p-2 w-full h-full 
      ${activeButton === 'brush' ? 'bg-blue-500 text-white' : 'bg-[#f2f2f2]'}
      hover:bg-[#e0e0e0] hover:shadow-md transition-all`}
          onClick={() => handleModeChange('brush')}
        >
          <HighlightOutlined className="h-[6vh] w-[6vh]" style={{ fontSize: '32px' }} />
        </button>

        {/* 按钮3 - 橡皮擦 */}
        <button
          className={`flex justify-center items-center m-1 p-2 w-full h-full 
      ${activeButton === 'eraser' ? 'bg-blue-500 text-white' : 'bg-[#f2f2f2]'}
      hover:bg-[#e0e0e0] hover:shadow-md transition-all`}
          onClick={() => handleModeChange('eraser')}
        >
          <DeleteOutlined className="h-[6vh] w-[6vh]" style={{ fontSize: '32px' }} />
        </button>
        {/* 按钮4 - 文字 */}
        <button
          className={`flex justify-center items-center m-1 p-2 w-full h-full 
      ${activeButton === 'text' ? 'bg-blue-500 text-white' : 'bg-[#f2f2f2]'}
      hover:bg-[#e0e0e0] hover:shadow-md transition-all`}
          onClick={() => handleModeChange('text')}
        >
          <FontColorsOutlined className="h-[6vh] w-[6vh]" style={{ fontSize: '32px' }} />
        </button>
      </div>
    </div>
  )
}
