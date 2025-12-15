import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useState } from 'react';
import AIWorkout from './AIWorkout';

// ================= CẤU HÌNH (ĐIỀN CÁI MỚI VÀO ĐÂY) =================
const PACKAGE_ID = "0x27b0338edaa780aeae89bd7fdb6f624d0b4f39ea001aaa1f6b54ad8991fe1712";
const GAME_INFO_ID = "0x85d13453702597c075f249f2472eed9df90dfd7ef4c94f9c04b19f6df2a6570d"; 
const CLOCK_ID = "0x6"; // Mặc định của SUI, không cần sửa
// ===================================================================

function App() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [digest, setDigest] = useState('');
  const [manualSelection, setManualSelection] = useState(''); 

  // Tự động tìm Hero
  const { data: userObjects, refetch: refetchHeroes } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: account?.address,
      filter: { StructType: `${PACKAGE_ID}::game::Hero` },
      options: { showContent: true },
    },
    { enabled: !!account }
  );

  const currentHeroId = manualSelection || (userObjects?.data?.[0]?.data?.objectId) || '';

  // 1. MINT HERO MỚI
  const mintHero = () => {
    const txb = new Transaction();
    txb.moveCall({
      target: `${PACKAGE_ID}::game::create_hero`,
      arguments: [
        txb.pure.string('SuiFighter'), // Tên Hero
        txb.object(GAME_INFO_ID)       // Phải truyền Luật chơi vào
      ],
    });

    signAndExecute({ transaction: txb }, {
        onSuccess: (result) => {
          alert('✅ Đã tạo Hero mới!');
          setDigest(result.digest);
          setTimeout(() => refetchHeroes(), 2000); 
        },
        onError: (err) => alert('Lỗi: ' + err.message),
    });
  };

  // 2. WORKOUT (ĐÃ NÂNG CẤP)
  const submitWorkout = () => {
    if (!currentHeroId) return alert("Không tìm thấy Hero!");
    
    const txb = new Transaction();
    txb.moveCall({
      target: `${PACKAGE_ID}::game::workout`,
      arguments: [
        txb.object(currentHeroId), // 1. Hero
        txb.object(GAME_INFO_ID),  // 2. Luật chơi (GameInfo)
        txb.object(CLOCK_ID)       // 3. Đồng hồ (Clock)
      ],
    });

    signAndExecute({ transaction: txb }, {
        onSuccess: (result) => {
          console.log('Success:', result);
          setDigest(result.digest);
          alert('💪 TẬP THÀNH CÔNG! (XP đã tăng, kiểm tra Explorer)');
        },
        onError: (err) => {
          // Nếu lỗi chứa code "2", nghĩa là đang Cooldown
          if(err.message.includes("2")) {
             alert("⏳ TỪ TỪ THÔI! Đang hồi chiêu (Cooldown 5s)");
          } else {
             alert('Lỗi: ' + err.message);
          }
        },
    });
  };

  return (
    <div style={{ padding: 20, textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>🏋️‍♂️ FitSui Pro - Move To Earn</h1>
      <div style={{ marginBottom: 20 }}> <ConnectButton /> </div>

      {!account ? (
        <p>Kết nối ví để bắt đầu!</p>
      ) : (
        <div>
           {/* KHU VỰC CHỌN HERO */}
<div style={{ padding: 15, background: '#e3f2fd', borderRadius: 10, margin: '20px auto', maxWidth: 500 }}>
    <h3>Nhân vật của bạn</h3>
    
    {userObjects?.data?.length > 0 ? (
    // TRƯỜNG HỢP 1: ĐÃ CÓ HERO
    <>
        <select 
            style={{ padding: 10, fontSize: 16, width: '100%' }}
            onChange={(e) => setManualSelection(e.target.value)}
            value={currentHeroId}
        >
            {userObjects.data.map((obj, index) => (
            <option key={obj.data.objectId} value={obj.data.objectId}>
                🦸‍♂️ Hero #{index + 1} ({obj.data.objectId.slice(0, 5)}...)
            </option>
            ))}
        </select>
        {/* Đã có Hero rồi thì ẩn nút Mint đi, hoặc disable nó */}
        <p style={{color: 'green', fontWeight: 'bold'}}>✅ Bạn đã sở hữu Chiến Binh!</p>
    </>
    ) : (
    // TRƯỜNG HỢP 2: CHƯA CÓ HERO -> HIỆN NÚT MINT
    <>
        <p>Chưa có nhân vật.</p>
        <button onClick={mintHero} style={{ marginTop: 10, padding: '8px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}>
        + Mint Hero Mới
        </button>
    </>
    )}
</div>

           {/* AI CAMERA */}
           {currentHeroId && (
             <div style={{ marginBottom: 30 }}>
                <AIWorkout onWorkoutComplete={(count) => {
                   if(count === 3) {
                      // alert("🎉 HOÀN THÀNH! Đang gửi lên Blockchain...");
                      submitWorkout();
                   }
                }} />
             </div>
           )}

           <div style={{ marginTop: 20, fontSize: 12, color: 'gray' }}>{digest && <p>Tx: {digest}</p>}</div>
        </div>
      )}
    </div>
  );
}

export default App;