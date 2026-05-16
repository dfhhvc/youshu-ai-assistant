import React, { useState } from 'react';
import { GitGraph, Download, ZoomIn, ZoomOut } from 'lucide-react';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  children?: Node[];
}

const mindMapData: Node = {
  id: 'root',
  label: '被讨厌的勇气',
  x: 400,
  y: 50,
  color: '#2563eb',
  children: [
    {
      id: 'preview',
      label: '预告篇',
      x: 200,
      y: 150,
      color: '#d97706',
      children: [
        { id: 'hook', label: '核心钩子', x: 100, y: 250, color: '#f59e0b' },
        { id: 'pain', label: '痛点共鸣', x: 200, y: 250, color: '#f59e0b' },
        { id: 'value', label: '全书价值', x: 300, y: 250, color: '#f59e0b' }
      ]
    },
    {
      id: 'chapters',
      label: '正文篇',
      x: 400,
      y: 150,
      color: '#059669',
      children: [
        { id: 'day1', label: 'Day1:你的不幸是你选的', x: 150, y: 250, color: '#10b981' },
        { id: 'day2', label: 'Day2:烦恼来自人际关系', x: 300, y: 250, color: '#10b981' },
        { id: 'day3', label: 'Day3:课题分离', x: 450, y: 250, color: '#10b981' },
        { id: 'day4', label: 'Day4:被讨厌的勇气', x: 600, y: 250, color: '#10b981' },
        { id: 'day5', label: 'Day5:活在当下', x: 750, y: 250, color: '#10b981' }
      ]
    },
    {
      id: 'summary',
      label: '总结篇',
      x: 600,
      y: 150,
      color: '#7c3aed',
      children: [
        { id: 'review', label: '全书回顾', x: 500, y: 250, color: '#8b5cf6' },
        { id: 'transform', label: '核心转变', x: 600, y: 250, color: '#8b5cf6' },
        { id: 'action', label: '行动号召', x: 700, y: 250, color: '#8b5cf6' }
      ]
    }
  ]
};

function renderNode(node: Node, parentX?: number, parentY?: number): React.ReactElement {
  return (
    <g key={node.id}>
      {parentX !== undefined && parentY !== undefined && (
        <line
          x1={parentX}
          y1={parentY + 20}
          x2={node.x}
          y2={node.y - 20}
          stroke="#cbd5e1"
          strokeWidth="2"
        />
      )}
      <rect
        x={node.x - (node.label.length * 7)}
        y={node.y - 20}
        width={node.label.length * 14}
        height="40"
        rx="8"
        fill={node.color}
        opacity="0.9"
      />
      <text
        x={node.x}
        y={node.y + 5}
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontWeight="bold"
      >
        {node.label}
      </text>
      {node.children?.map(child => renderNode(child, node.x, node.y))}
    </g>
  );
}

export default function MindMap() {
  const [scale, setScale] = useState(1);

  const handleDownload = () => {
    const svg = document.querySelector('#mindmap-svg') as SVGSVGElement;
    if (!svg) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = '被讨厌的勇气-思维导图.svg';
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <GitGraph className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-800 text-lg">知识图谱</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-500 w-12 text-center">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale(prev => Math.min(2, prev + 0.1))}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm ml-2"
            >
              <Download className="w-4 h-4" />
              下载SVG
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-auto bg-gray-50" style={{ height: '500px' }}>
          <svg
            id="mindmap-svg"
            width="900"
            height="400"
            viewBox="0 0 900 400"
            style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
          >
            {renderNode(mindMapData)}
          </svg>
        </div>

        <p className="text-xs text-gray-400 mt-3 text-center">
          基于AI拆书大纲自动生成的知识图谱 · 《被讨厌的勇气》
        </p>
      </div>
    </div>
  );
}
