import { Zap, Clock, DollarSign, Layers, TrendingUp } from 'lucide-react';
import { efficiencyData } from '../data/demoData';

export default function EfficiencyBoard() {
  const timeReduction = Math.round(
    ((efficiencyData.timeComparison.manual.reduce((a, b) => a + b, 0) -
      efficiencyData.timeComparison.ai.reduce((a, b) => a + b, 0)) /
      efficiencyData.timeComparison.manual.reduce((a, b) => a + b, 0)) * 100
  );

  const costReduction = Math.round(
    ((efficiencyData.costComparison.values[0] - efficiencyData.costComparison.values[1]) /
      efficiencyData.costComparison.values[0]) * 100
  );

  const manualOutput = efficiencyData.outputComparison.manual.reduce((a, b) => a + b, 0);
  const aiOutput = efficiencyData.outputComparison.ai.reduce((a, b) => a + b, 0);
  const outputIncrease = Math.round(((aiOutput - manualOutput) / manualOutput) * 100);

  const productivityIncrease = Math.round(
    ((efficiencyData.productivityComparison.ai - efficiencyData.productivityComparison.manual) /
      efficiencyData.productivityComparison.manual) * 100
  );

  return (
    <div className="animate-fade-in space-y-6">
      {/* 核心指标卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5" />
            <p className="text-sm opacity-90">效率提升</p>
          </div>
          <p className="text-3xl font-bold">{timeReduction}%</p>
          <p className="text-xs opacity-75 mt-1">拆书时间缩短</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5" />
            <p className="text-sm opacity-90">成本降低</p>
          </div>
          <p className="text-3xl font-bold">{costReduction}%</p>
          <p className="text-xs opacity-75 mt-1">单本书生产成本</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-5 h-5" />
            <p className="text-sm opacity-90">产出倍增</p>
          </div>
          <p className="text-3xl font-bold">{outputIncrease}%</p>
          <p className="text-xs opacity-75 mt-1">内容形态数量</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" />
            <p className="text-sm opacity-90">人均产出</p>
          </div>
          <p className="text-3xl font-bold">{productivityIncrease}%</p>
          <p className="text-xs opacity-75 mt-1">编辑月产出提升</p>
        </div>
      </div>

      {/* 详细对比 */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-5 h-5 text-yellow-500" />
          <h3 className="font-bold text-gray-800 text-lg">人工 vs AI 详细对比</h3>
        </div>

        {/* 时间对比 */}
        <div className="mb-8">
          <h4 className="font-semibold text-gray-700 mb-4">生产周期对比（小时）</h4>
          <div className="space-y-3">
            {efficiencyData.timeComparison.labels.map((label, idx) => {
              const manual = efficiencyData.timeComparison.manual[idx];
              const ai = efficiencyData.timeComparison.ai[idx];
              const maxVal = Math.max(manual, ai);
              return (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{label}</span>
                    <div className="flex gap-4">
                      <span className="text-red-500">人工 {manual}h</span>
                      <span className="text-blue-500">AI {ai}h</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-red-400 h-full rounded-full transition-all"
                        style={{ width: `${(manual / maxVal) * 100}%` }}
                      />
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all"
                        style={{ width: `${(ai / maxVal) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 成本对比 */}
        <div className="mb-8">
          <h4 className="font-semibold text-gray-700 mb-4">成本对比（元/本）</h4>
          <div className="flex items-end gap-8 h-40">
            <div className="flex-1 flex flex-col items-center">
              <span className="text-red-500 font-bold mb-2">¥{efficiencyData.costComparison.values[0]}</span>
              <div className="w-full bg-red-100 rounded-t-lg relative" style={{ height: '120px' }}>
                <div className="absolute bottom-0 w-full bg-red-400 rounded-t-lg" style={{ height: '100%' }} />
              </div>
              <span className="text-sm text-gray-600 mt-2">人工成本</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <span className="text-green-500 font-bold mb-2">¥{efficiencyData.costComparison.values[1]}</span>
              <div className="w-full bg-green-100 rounded-t-lg relative" style={{ height: '120px' }}>
                <div className="absolute bottom-0 w-full bg-green-500 rounded-t-lg" style={{ height: `${(efficiencyData.costComparison.values[1] / efficiencyData.costComparison.values[0]) * 100}%` }} />
              </div>
              <span className="text-sm text-gray-600 mt-2">AI成本</span>
            </div>
          </div>
        </div>

        {/* 内容形态对比 */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-4">内容形态产出对比</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {efficiencyData.outputComparison.labels.map((label, idx) => {
              const manual = efficiencyData.outputComparison.manual[idx];
              const ai = efficiencyData.outputComparison.ai[idx];
              return (
                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">{label}</p>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-lg font-bold text-red-500">{manual}</p>
                      <p className="text-xs text-gray-400">人工</p>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <span className="text-gray-400">→</span>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-500">{ai}</p>
                      <p className="text-xs text-gray-400">AI</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 底部总结 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
        <h4 className="font-bold text-blue-800 mb-3">AI拆书助手核心价值</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
            <div>
              <p className="font-semibold text-gray-800">效率提升</p>
              <p className="text-sm text-gray-600">5天拆书 → 30分钟完成</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
            <div>
              <p className="font-semibold text-gray-800">成本降低</p>
              <p className="text-sm text-gray-600">3000元/本 → 50元/本</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
            <div>
              <p className="font-semibold text-gray-800">规模化</p>
              <p className="text-sm text-gray-600">4本/月 → 15本/月</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
