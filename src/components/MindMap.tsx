import { useState } from 'react';
import { GitGraph, Download, ZoomIn, ZoomOut, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { bookOutline } from '../data/demoData';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
  children?: Node[];
}

function generateMindMapData(outline: any): Node {
  const chapters = outline.chapters || [];
  const chapterSpacing = chapters.length > 0 ? 700 / (chapters.length + 1) : 100;

  return {
    id: 'root',
    label: outline.preview?.hook?.slice(0, 15) || '核心主题',
    x: 400,
    y: 40,
    color: '#2563eb',
    children: [
      {
        id: 'preview',
        label: '预告篇',
        x: 150,
        y: 140,
        color: '#d97706',
        children: [
          { id: 'hook', label: '核心钩子', x: 60, y: 230, color: '#f59e0b' },
          { id: 'pain', label: '痛点共鸣', x: 150, y: 230, color: '#f59e0b' },
          { id: 'value', label: '全书价值', x: 240, y: 230, color: '#f59e0b' }
        ]
      },
      {
        id: 'chapters',
        label: `正文篇(${chapters.length}天)`,
        x: 400,
        y: 140,
        color: '#059669',
        children: chapters.map((ch: any, idx: number) => ({
          id: `day${ch.day}`,
          label: ch.title.length > 8 ? ch.title.slice(0, 8) + '...' : ch.title,
          x: 80 + idx * chapterSpacing,
          y: 230,
          color: '#10b981'
        }))
      },
      {
        id: 'summary',
        label: '总结篇',
        x: 650,
        y: 140,
        color: '#7c3aed',
        children: [
          { id: 'review', label: '全书回顾', x: 570, y: 230, color: '#8b5cf6' },
          { id: 'transform', label: '核心转变', x: 650, y: 230, color: '#8b5cf6' },
          { id: 'action', label: '行动号召', x: 730, y: 230, color: '#8b5cf6' }
        ]
      }
    ]
  };
}

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
        width={Math.max(node.label.length * 14, 80)}
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
        fontSize="13"
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
  const { bookOutline: dynamicOutline, useRealApi } = useApp();

  const outline = dynamicOutline || bookOutline;
  const data = generateMindMapData(outline);

  const handleDownload = () => {
    const svg = document.querySelector('#mindmap-svg') as SVGSVGElement;
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AI拆书-思维导图.svg';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in">
      {!useRealApi && !dynamicOutline && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold">当前显示基于预置数据的思维导图</p>
            <p>配置Kimi API Key后，思维导图将根据AI拆书结果动态生成。</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <GitGraph className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-800 text-lg">知识图谱</h3>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-500 w-12 text-center">{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(prev => Math.min(2, prev + 0.1))} className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm ml-2">
              <Download className="w-4 h-4" />
              下载SVG
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-auto bg-gray-50" style={{ height: '500px' }}>
          <svg id="mindmap-svg" width="900" height="350" viewBox="0 0 900 350"
            style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            {renderNode(data)}
          </svg>
        </div>

        <p className="text-xs text-gray-400 mt-3 text-center">
          基于AI拆书大纲自动生成的知识图谱 · 支持缩放和下载
        </p>
      </div>
    </div>
  );
}
