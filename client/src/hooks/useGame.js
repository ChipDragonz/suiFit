import { useSignAndExecuteTransaction, useSuiClientQuery, useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID, GAME_INFO_ID, CLOCK_ID } from '../utils/constants';
import { useToast } from '../context/ToastContext';
import { useState, useEffect } from 'react';

export const useGame = () => {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const toast = useToast();
  const [nextMintTime, setNextMintTime] = useState(0);

  const checkCooldown = async () => {
    if (!account) return;
    try {
      const gameInfoObj = await client.getObject({ id: GAME_INFO_ID, options: { showContent: true } });
      const mintersTableId = gameInfoObj.data?.content?.fields?.minters?.fields?.id?.id;
      if (!mintersTableId) return;
      const result = await client.getDynamicFieldObject({ parentId: mintersTableId, name: { type: 'address', value: account.address } });
      if (result.data?.content?.fields?.value) {
        setNextMintTime(parseInt(result.data.content.fields.value) + 86400000);
      }
    } catch (e) { setNextMintTime(0); }
  };

  useEffect(() => { checkCooldown(); }, [account]);

  const { data: heroData, refetch } = useSuiClientQuery('getOwnedObjects', {
    owner: account?.address,
    filter: { StructType: `${PACKAGE_ID}::game::Hero` },
    options: { showContent: true },
  }, { enabled: !!account, refetchInterval: 5000 });

  const mintHero = () => {
    const txb = new Transaction();
    
    txb.moveCall({
      target: `${PACKAGE_ID}::game::create_hero`,
      arguments: [
        txb.object(GAME_INFO_ID),      
        txb.object(CLOCK_ID),          
      ],
    });
    
    signAndExecute({ transaction: txb }, {
      onSuccess: () => { 
        toast.success('✅ A new SuiHero has been Summoned!'); 
        setTimeout(() => { refetch(); checkCooldown(); }, 1000); 
      },
      onError: () => toast.error('❌ Transaction failed or Cooldown active.'),
    });
  };

  const workout = (heroId, multiplier, onSuccess) => {
    const txb = new Transaction();
    txb.moveCall({
      target: `${PACKAGE_ID}::game::workout`,
      arguments: [
        txb.object(heroId), 
        txb.object(GAME_INFO_ID), 
        txb.object(CLOCK_ID), 
        txb.pure.u64(multiplier)
      ],
    });
    
    signAndExecute({ transaction: txb }, {
      onSuccess: () => { 
        toast.success(`💪 Successfully earned XP for ${multiplier} sets!`); 
        setTimeout(refetch, 1000); 
        onSuccess?.(); 
      },
      onError: (err) => {
        const isOutOfStamina = err.message.includes("2");
        toast.error(isOutOfStamina ? "😫 Out of Stamina!" : "❌ Wallet transaction error.");
      },
    });
  };

  // --- [HÀM GỌI HỢP THỂ TRÊN BLOCKCHAIN - ĐÃ FIX LỖI ĐỒNG BỘ] ---
  const fuseHeroes = async (id1, id2, id3) => {
    const txb = new Transaction(); // Sửa từ TransactionBlock thành Transaction

    txb.moveCall({
      target: `${PACKAGE_ID}::game::fuse_heroes`,
      arguments: [
        txb.object(id1),       
        txb.object(id2),       
        txb.object(id3),       
        txb.object(GAME_INFO_ID), // Sửa từ GAME_INFO thành GAME_INFO_ID cho đúng hằng số
        txb.object(CLOCK_ID),     // Dùng CLOCK_ID thay cho '0x6' cho đồng bộ
      ],
    });

    signAndExecute({ transaction: txb }, {
      onSuccess: () => {
        toast.success('⚡ Evolution successful! A more powerful Hero has emerged!');
        setTimeout(refetch, 1000); 
      },
      onError: (err) => {
        const isNotFusible = err.message.includes("5"); // Mã lỗi E_NOT_FUSIBLE từ Move
        toast.error(isNotFusible ? "❌ Heroes must be same Level and Class!" : "❌ Evolution failed.");
      }
    });
  };

  return { 
    account, 
    heroes: heroData?.data || [], 
    mintHero, 
    workout, 
    fuseHeroes, // Đã thêm vào return để App.jsx dùng được
    nextMintTime, 
    refetch 
  };
};