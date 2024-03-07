import React from 'react';

export default function Tooltip({ text="Tooltip Text", position="right", style={bg: 'bg-black', text: 'text-white'} }) {
  const positionStyle = {
    right: 'left-[115%] after:border-[transparent_black_transparent_transparent] after:top-1/2 after:right-full after:-mt-1',
    left: 'right-[115%] after:border-[transparent_transparent_transparent_black] after:top-1/2 after:left-full after:-mt-1',
    top: 'bottom-[130%] -left-1/2 after:border-[black_transparent_transparent_transparent] after:top-full after:left-1/2 after:-ml-1',
    bottom: 'top-[130%] -left-1/2 after:border-[transparent_transparent_black_transparent] after:bottom-full after:left-1/2 after:-ml-1',
  }

  return (
    <span className={`hidden group-hover:inline-block z-20 px-2 py-1 rounded font-semibold ${style.bg} ${style.text} ${positionStyle[position]} absolute after:content-[""] after:absolute after:border-4 `}>
      { text }
    </span>
  )
}
