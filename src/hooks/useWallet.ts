import { useState, useCallback } from 'react';
import { VIRTUAL_REWARDS } from '../lib/economy';

export interface WalletState {
  balanceCredits: number;
  virtualLawyerCredits: number;
  casesWon: number;
  level: number;
  role: string;
}

const INITIAL_WALLET: WalletState = {
  balanceCredits: 5000,
  virtualLawyerCredits: 2400,
  casesWon: 6,
  level: 3,
  role: 'LAWYER',
};

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>(INITIAL_WALLET);

  const addCredits = useCallback((amount: number) => {
    setWallet(prev => ({
      ...prev,
      balanceCredits: prev.balanceCredits + amount,
    }));
  }, []);

  const spendCredits = useCallback((amount: number): boolean => {
    if (wallet.balanceCredits < amount) return false;
    setWallet(prev => ({
      ...prev,
      balanceCredits: prev.balanceCredits - amount,
    }));
    return true;
  }, [wallet.balanceCredits]);

  const rewardLawyerWin = useCallback(() => {
    setWallet(prev => {
      const newVirtualCredits = prev.virtualLawyerCredits + VIRTUAL_REWARDS.CREDITS_PER_WIN;
      const newLevel = Math.floor(newVirtualCredits / VIRTUAL_REWARDS.LEVEL_THRESHOLD) + 1;
      return {
        ...prev,
        virtualLawyerCredits: newVirtualCredits,
        casesWon: prev.casesWon + VIRTUAL_REWARDS.CASES_WON_INCREMENT,
        level: newLevel,
      };
    });
  }, []);

  return {
    wallet,
    addCredits,
    spendCredits,
    rewardLawyerWin,
  };
}
