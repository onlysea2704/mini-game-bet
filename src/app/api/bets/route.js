import { getSheet } from '@/lib/sheet';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sheet = await getSheet();
    const rows = await sheet.getRows();
    
    // 1. Map dữ liệu và chuyển đổi kiểu
    const rawHistory = rows.map(row => {
      const amount = parseInt(row.get('SoTien'));
      const odds = parseFloat(row.get('TyLeLucDat'));
      const potentialWin = parseFloat(row.get('TienThangDuKien'));
      
      return {
        time: row.get('ThoiGian'),
        name: row.get('NguoiDat'),
        pick: row.get('CuaDat'), // "A Hoàn" hoặc "Mèn Mén"
        amount: isNaN(amount) ? 0 : amount,
        odds: isNaN(odds) ? 0 : odds,
        potentialWin: isNaN(potentialWin) ? 0 : potentialWin,
      };
    });

    // 2. LỌC DỮ LIỆU LỖI (Quan trọng)
    // Chỉ lấy dòng có Tên người chơi VÀ Số tiền > 0
    const history = rawHistory.filter(item => item.name && item.amount > 0);

    // 3. Tính toán lại Pool
    let totalPool = 0;
    let poolA = 0; 
    let poolB = 0; 

    history.forEach(bet => {
      totalPool += bet.amount;
      if (bet.pick === 'A Hoàn') poolA += bet.amount;
      else if (bet.pick === 'Mèn Mén') poolB += bet.amount;
    });

    // Tính tỷ lệ phần trăm tiền cược (để vẽ thanh Progress bar ở Frontend)
    const percentA = totalPool === 0 ? 50 : Math.round((poolA / totalPool) * 100);

    const currentOddsA = poolA === 0 ? 1.8 : (totalPool / poolA) * 0.8;
    const currentOddsB = poolB === 0 ? 1.8 : (totalPool / poolB) * 0.8;

    return NextResponse.json({ 
      history: history.reverse(), 
      currentOdds: { A: currentOddsA.toFixed(2), B: currentOddsB.toFixed(2) },
      poolStats: { poolA, poolB, totalPool, percentA } // Gửi thêm thống kê tiền
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Lỗi lấy dữ liệu' }, { status: 500 });
  }
}

// POST giữ nguyên như cũ
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, pick, amount, currentOdds } = body;
    const sheet = await getSheet();
    
    const potentialWin = amount * currentOdds;

    await sheet.addRow({
      ThoiGian: new Date().toLocaleTimeString('vi-VN'),
      NguoiDat: name,
      CuaDat: pick,
      SoTien: amount,
      TyLeLucDat: currentOdds,
      TienThangDuKien: potentialWin
    });

    return NextResponse.json({ message: 'Success' });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi ghi dữ liệu' }, { status: 500 });
  }
}