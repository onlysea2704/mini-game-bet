'use client'; 

import { useState, useEffect } from 'react';

export default function Admin() {
  const [data, setData] = useState({ currentOdds: { A: 1.8, B: 1.8 } });
  const [form, setForm] = useState({ name: '', amount: '', pick: 'A Hoàn' });
  const [loading, setLoading] = useState(false);

  const refreshOdds = async () => {
    const res = await fetch('/api/bets');
    const json = await res.json();
    if(json.currentOdds) setData(json);
  };

  useEffect(() => { refreshOdds(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const currentOdds = form.pick === 'A Hoàn' ? data.currentOdds.A : data.currentOdds.B;

    await fetch('/api/bets', {
      method: 'POST',
      body: JSON.stringify({ ...form, amount: parseInt(form.amount), currentOdds }),
    });

    setForm({ name: '', amount: '', pick: 'A Hoàn' }); 
    await refreshOdds(); 
    setLoading(false);
    alert('Đã ghi nhận cược!');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Nhà Cái</h1>
        
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-gray-600 mb-1">Tỷ lệ hiện tại:</p>
          <div className="flex justify-between font-bold text-lg">
            <span className="text-blue-600">A Hoàn: {data.currentOdds?.A}</span>
            <span className="text-red-600">Mèn Mén: {data.currentOdds?.B}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên người chơi</label>
            <input 
              required
              className="mt-1 block w-full p-2 border rounded-md"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Chọn phe</label>
            <select 
              className="mt-1 block w-full p-2 border rounded-md"
              value={form.pick}
              onChange={e => setForm({...form, pick: e.target.value})}
            >
              <option value="A Hoàn">A Hoàn</option>
              <option value="Mèn Mén">Mèn Mén</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Số tiền</label>
            <input 
              type="number"
              required
              className="mt-1 block w-full p-2 border rounded-md"
              value={form.amount}
              onChange={e => setForm({...form, amount: e.target.value})}
            />
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 font-bold"
          >
            {loading ? 'Đang lưu...' : 'Ghi Nhận Cược'}
          </button>
        </form>
      </div>
    </div>
  );
}