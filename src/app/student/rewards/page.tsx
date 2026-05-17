"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Coins, 
  Ticket, 
  Pizza, 
  IceCream, 
  Gamepad2, 
  Play, 
  Banknote, 
  PartyPopper,
  HelpCircle
} from 'lucide-react';

const COUPONS_NEEDED_FOR_REWARD = 3;

export default function RewardShopPage() {
  const router = useRouter();

  // State
  const [coins, setCoins] = useState(0);
  const [coupons, setCoupons] = useState(0);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [coinsNeeded, setCoinsNeeded] = useState(1);

  const fetchData = async () => {
    try {
      const resTasks = await fetch('/api/tasks');
      const taskData = await resTasks.json();
      const totalTasks = Math.max(1, taskData.length);
      setCoinsNeeded(totalTasks);
      const resProg = await fetch('/api/student/progress');
      const progData = await resProg.json();
      setCoins(progData.coins || 0);
      setCoupons(progData.coupons || 0);
      if ((progData.coins || 0) >= totalTasks && totalTasks > 1) {
        setShowCouponModal(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTradeCoins = async () => {
    try {
      await fetch('/api/student/progress', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          coins: Math.max(0, coins - coinsNeeded),
          coupons: coupons + 1
        })
      });
      setShowCouponModal(false);
      fetchData();
    } catch (error) {
      console.error('Error trading coins:', error);
    }
  };

  const handleClaimReward = async (rewardTitle: string) => {
    if (coupons >= COUPONS_NEEDED_FOR_REWARD) {
      try {
        await fetch('/api/student/progress', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            coupons: coupons - COUPONS_NEEDED_FOR_REWARD 
          })
        });
        alert(`🎉 Reward Claimed: ${rewardTitle}!`);
        fetchData();
      } catch (error) {
        console.error('Error claiming reward:', error);
      }
    }
  };

  const rewards = [
    { title: "Pizza Party", icon: <Pizza size={32} />, bgColor: "bg-orange-100", textColor: "text-orange-600" },
    { title: "Ice Cream", icon: <IceCream size={32} />, bgColor: "bg-pink-100", textColor: "text-pink-600" },
    { title: "30 Min Game Time", icon: <Gamepad2 size={32} />, bgColor: "bg-indigo-100", textColor: "text-indigo-600" },
    { title: "30 Min YouTube", icon: <Play size={32} />, bgColor: "bg-red-100", textColor: "text-red-600" },
    { title: "2000 KRW Cash", icon: <Banknote size={32} />, bgColor: "bg-green-100", textColor: "text-green-600" },
  ];

  return (
    <main className="min-h-screen bg-indigo-50 p-8 relative font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header Area */}
        <div className="flex items-center gap-6 mb-10">
          <button
            onClick={() => router.back()}
            className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-600 hover:bg-slate-50 transition-colors group"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-indigo-900 tracking-tight">Reward Shop</h1>
            <p className="text-indigo-600/70 font-medium text-lg">Complete your homework to earn coins and coupons!</p>
          </div>
        </div>

        {/* Dual Progress Banner */}
        <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-indigo-100/50 flex flex-col md:flex-row gap-10 mb-10">
          {/* Coins Section */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 p-3 rounded-2xl border-2 border-yellow-400">
                <Coins className="text-yellow-600" size={28} />
              </div>
              <div>
                <p className="text-sm font-black text-indigo-300 uppercase tracking-widest">Current Coins</p>
                <p className="text-3xl font-black text-indigo-900">{coins}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <span>Progress to Coupon</span>
                <span>{coins}/{coinsNeeded}</span>
              </div>
              <div className="h-4 bg-indigo-50 rounded-full overflow-hidden border-2 border-indigo-50">
                <div 
                  className="h-full bg-yellow-400 rounded-full transition-all duration-500 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]"
                  style={{ width: `${Math.min((coins / coinsNeeded) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px bg-indigo-50" />

          {/* Coupons Section */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-2xl border-2 border-blue-400">
                <Ticket className="text-blue-600" size={28} />
              </div>
              <div>
                <p className="text-sm font-black text-indigo-300 uppercase tracking-widest">Weekly Coupons</p>
                <p className="text-3xl font-black text-indigo-900">{coupons} / {COUPONS_NEEDED_FOR_REWARD}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <span>Progress to Reward</span>
                <span>{coupons}/{COUPONS_NEEDED_FOR_REWARD}</span>
              </div>
              <div className="h-4 bg-indigo-50 rounded-full overflow-hidden border-2 border-indigo-50">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]"
                  style={{ width: `${Math.min((coupons / COUPONS_NEEDED_FOR_REWARD) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rewards.map((reward, index) => (
            <div key={index} className="bg-white rounded-[2rem] p-8 shadow-md border-2 border-transparent hover:border-indigo-100 transition-all flex flex-col group">
              <div className={`${reward.bgColor} ${reward.textColor} w-20 h-20 rounded-3xl flex items-center justify-center mb-6 self-center shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                {reward.icon}
              </div>
              
              <h3 className="text-xl font-black text-indigo-900 text-center mb-6">{reward.title}</h3>
              
              <div className="mt-auto space-y-4">
                <div className="flex items-center justify-center gap-2 bg-blue-50 py-2 rounded-full border-2 border-blue-100">
                  <Ticket className="text-blue-600" size={16} />
                  <span className="text-sm font-black text-blue-700">{COUPONS_NEEDED_FOR_REWARD} Coupons</span>
                </div>

                {coupons >= COUPONS_NEEDED_FOR_REWARD ? (
                  <button 
                    onClick={() => handleClaimReward(reward.title)}
                    className="w-full bg-green-500 hover:bg-green-400 text-white font-black py-4 rounded-2xl border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all text-lg shadow-sm"
                  >
                    Claim Reward!
                  </button>
                ) : (
                  <button 
                    disabled 
                    className="w-full bg-slate-200 text-slate-500 font-black py-4 rounded-2xl cursor-not-allowed text-lg"
                  >
                    Need {COUPONS_NEEDED_FOR_REWARD} Coupons
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Level-Up Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-indigo-900/60 flex items-center justify-center z-[100] backdrop-blur-sm p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full text-center shadow-2xl transform transition-all animate-in zoom-in-95 duration-300 border-4 border-yellow-400">
            <div className="mx-auto mb-6 w-24 h-24 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center shadow-inner animate-bounce">
              <PartyPopper size={48} />
            </div>
            
            <h2 className="text-3xl font-black text-indigo-900 mb-2">Week Complete!</h2>
            <p className="text-indigo-600/70 font-bold text-lg mb-8 leading-relaxed">
              You earned enough coins! Trade them in for 1 Weekly Coupon!
            </p>

            <button
              onClick={handleTradeCoins}
              className="w-full bg-blue-500 hover:bg-blue-400 text-white text-2xl font-black py-5 px-8 rounded-3xl border-b-8 border-blue-700 active:border-b-0 active:translate-y-2 transition-all shadow-xl"
            >
              Get My Coupon!
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 bg-indigo-900 text-white p-4 rounded-full shadow-2xl cursor-pointer hover:scale-110 hover:-rotate-6 transition-all active:scale-95 group z-50">
        <HelpCircle size={32} />
        <span className="absolute right-full mr-5 top-1/2 -translate-y-1/2 bg-indigo-900 text-white text-sm font-black px-4 py-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border-2 border-indigo-700">
          Need help?
        </span>
      </div>
    </main>
  );
}
