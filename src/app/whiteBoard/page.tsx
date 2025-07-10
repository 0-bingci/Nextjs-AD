'use client'
import React, { useEffect, useState, useRef } from 'react'
import {
  SearchOutlined,
  EditOutlined,
  FontColorsOutlined,
  HighlightOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import useCanvas from '../../hook/useCanvas'

export default function Board() {
  const [activeButton, setActiveButton] = useState<string | null>(null)
  const { canvasRef, isDrawingMode, setDrawingMode,updateDrawConfig } = useCanvas()

  const handleBrushClick = () => {
  setActiveButton('brush');
  setDrawingMode(true); // 切换绘图模式
  updateDrawConfig({
    color: 'black',
  });
  };

  const handleEraserClick = () => {
    setActiveButton('eraser');
    updateDrawConfig({
      color: 'white'
    })
     // 切换橡皮擦模式
  };

  return (
    <div className="bg-white h-[80vh] relative">
      <canvas className="w-full h-full border border-gray-200" id="canvas" ref={canvasRef}></canvas>
      <div className="space-x-2 w-[30%] h-[8vh] absolute bottom-0 left-[35%] flex justify-center items-center">
        {/* 按钮1 - 指针 */}
        <button
          className={`flex justify-center items-center m-1 p-2 w-full h-full 
      ${activeButton === 'color' ? 'bg-blue-500 text-white' : 'bg-[#f2f2f2]'}
      hover:bg-[#e0e0e0] hover:shadow-md transition-all`}
          onClick={() => setActiveButton('color')}
        >
          <FontColorsOutlined className="h-[6vh] w-[6vh]" style={{ fontSize: '32px' }} />
        </button>

        {/* 按钮2 - 画笔 */}
        <button
          className={`flex justify-center items-center m-1 p-2 w-full h-full 
      ${activeButton === 'brush' ? 'bg-blue-500 text-white' : 'bg-[#f2f2f2]'}
      hover:bg-[#e0e0e0] hover:shadow-md transition-all`}
          onClick={handleBrushClick}
        >
          <HighlightOutlined className="h-[6vh] w-[6vh]" style={{ fontSize: '32px' }} />
        </button>

        {/* 按钮3 - 指针 */}
        <button
          className={`flex justify-center items-center m-1 p-2 w-full h-full 
      ${activeButton === 'eraser' ? 'bg-blue-500 text-white' : 'bg-[#f2f2f2]'}
      hover:bg-[#e0e0e0] hover:shadow-md transition-all`}
          onClick={handleEraserClick}
        >
          <DeleteOutlined className="h-[6vh] w-[6vh]" style={{ fontSize: '32px' }} />
        </button>
        {/* 按钮1 - 文字 */}
        <button
          className={`flex justify-center items-center m-1 p-2 w-full h-full 
      ${activeButton === 'color' ? 'bg-blue-500 text-white' : 'bg-[#f2f2f2]'}
      hover:bg-[#e0e0e0] hover:shadow-md transition-all`}
          onClick={() => setActiveButton('color')}
        >
          <FontColorsOutlined className="h-[6vh] w-[6vh]" style={{ fontSize: '32px' }} />
        </button>
      </div>
    </div>
  )
}
