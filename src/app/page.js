'use client';

import { useState, useEffect } from 'react';

// Hàm format tiền tệ cho đẹp (ví dụ: 50.000)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};

export default function Home() {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/bets');
      const json = await res.json();
      if (json.history) setData(json);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000); // Tăng tốc cập nhật lên 3s
    return () => clearInterval(interval);
  }, []);

  if (!data) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-purple-500 selection:text-white pb-10">
      
      {/* Header with Glow Effect */}
      <div className="relative pt-10 pb-6 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>
        <h1 className="relative z-10 text-5xl md:text-6xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 drop-shadow-lg">
          Đại Chiến Tửu Lượng
        </h1>
        <p className="text-slate-400 mt-2 font-medium tracking-wide">SÀN GIAO DỊCH UY TÍN NHẤT CÔNG TY</p>
      </div>

      {/* Main Odds Cards */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          
          {/* VS Badge ở giữa */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-slate-900 border-4 border-slate-800 rounded-full w-20 h-20 items-center justify-center font-black text-2xl text-slate-500 shadow-xl">
            VS
          </div>

          {/* Card A Hoàn */}
          <div className="group relative bg-gradient-to-br from-blue-900/80 to-slate-900 border border-blue-500/30 rounded-3xl p-8 text-center shadow-2xl shadow-blue-900/20 overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl font-black text-blue-500 rotate-12 select-none">A</div>
            <h2 className="text-3xl font-bold text-blue-400 mb-2 uppercase tracking-widest">A Hoàn</h2>
            <div className="text-7xl font-black text-white drop-shadow-md transition-all group-hover:scale-110 duration-300">
              <span className="text-3xl text-blue-500/50">x</span>{data.currentOdds.A}
            </div>
            <div className="mt-4 inline-block bg-blue-500/20 text-blue-300 px-4 py-1 rounded-full text-sm font-semibold">
              Tổng cược: {formatCurrency(data.poolStats?.poolA || 0)}
            </div>
          </div>

          {/* Card Mèn Mén */}
          <div className="group relative bg-gradient-to-bl from-red-900/80 to-slate-900 border border-red-500/30 rounded-3xl p-8 text-center shadow-2xl shadow-red-900/20 overflow-hidden">
            <div className="absolute top-0 left-0 p-4 opacity-10 text-9xl font-black text-red-500 -rotate-12 select-none">M</div>
            <h2 className="text-3xl font-bold text-red-400 mb-2 uppercase tracking-widest">Mèn Mén</h2>
            <div className="text-7xl font-black text-white drop-shadow-md transition-all group-hover:scale-110 duration-300">
              <span className="text-3xl text-red-500/50">x</span>{data.currentOdds.B}
            </div>
            <div className="mt-4 inline-block bg-red-500/20 text-red-300 px-4 py-1 rounded-full text-sm font-semibold">
              Tổng cược: {formatCurrency(data.poolStats?.poolB || 0)}
            </div>
          </div>
        </div>

        {/* Thanh Power Bar (Tỷ lệ dòng tiền) */}
        <div className="mt-8 mb-12">
          <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
            <span>Phe A Hoàn ({data.poolStats?.percentA}%)</span>
            <span>Phe Mèn Mén ({100 - (data.poolStats?.percentA || 50)}%)</span>
          </div>
          <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(59,130,246,0.6)]" 
              style={{ width: `${data.poolStats?.percentA}%` }}
            ></div>
            <div className="flex-1 bg-gradient-to-r from-orange-400 to-red-600 shadow-[0_0_15px_rgba(239,68,68,0.6)]"></div>
          </div>
        </div>

        {/* Bảng Lịch sử */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl">
          <div className="px-6 py-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Lịch sử giao dịch
            </h3>
            <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-700">
              Total: {data.history.length}
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-sm uppercase tracking-wider border-b border-slate-700/50">
                  <th className="p-4 font-medium">Thời gian</th>
                  <th className="p-4 font-medium">Người chơi</th>
                  <th className="p-4 font-medium text-center">Chọn</th>
                  <th className="p-4 font-medium text-right">Vào Tiền</th>
                  <th className="p-4 font-medium text-center">Tỷ lệ</th>
                  <th className="p-4 font-medium text-right text-emerald-400">Thắng Dự Kiến</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30 text-slate-300">
                {data.history.length === 0 ? (
                   <tr><td colSpan="6" className="p-8 text-center text-slate-500">Chưa có ai xuống tiền cả...</td></tr>
                ) : (
                  data.history.map((bet, idx) => (
                    <tr key={idx} className="hover:bg-slate-700/30 transition-colors duration-150">
                      <td className="p-4 text-sm text-slate-500 font-mono">{bet.time}</td>
                      <td className="p-4 font-bold text-white">{bet.name}</td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase ${
                          bet.pick === 'A Hoàn' 
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {bet.pick}
                        </span>
                      </td>
                      <td className="p-4 text-right font-medium">{formatCurrency(bet.amount)}</td>
                      <td className="p-4 text-center text-slate-400">x{bet.odds}</td>
                      <td className="p-4 text-right text-emerald-400 font-bold font-mono">
                        +{formatCurrency(bet.potentialWin)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="text-center text-slate-600 text-xs mt-8 mb-4">
          Hệ thống tự động cập nhật mỗi 3 giây
        </div>
      </div>
    </div>
  );
}