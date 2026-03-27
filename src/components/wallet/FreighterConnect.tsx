import React from 'react';

export interface FreighterWalletInfo {
  publicKey: string;
}

export interface FreighterConnectProps {
  showNetworkIndicator?: boolean;
  onConnect?: (walletInfo: FreighterWalletInfo) => void;
  onDisconnect?: () => void;
}

/** Minimal Stellar Freighter UI stub for mentor wallet flows (extend with @stellar/freighter-api as needed). */
export const FreighterConnect: React.FC<FreighterConnectProps> = ({
  showNetworkIndicator = false,
  onConnect,
  onDisconnect,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">Stellar wallet</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Connect Freighter to manage trustlines and payouts.
            {showNetworkIndicator ? ' · Testnet' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onConnect?.({ publicKey: 'G DEMO STELLAR ADDRESS 00000' })}
            className="rounded-xl bg-stellar px-4 py-2 text-xs font-bold text-white hover:opacity-90"
          >
            Connect
          </button>
          <button
            type="button"
            onClick={() => onDisconnect?.()}
            className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreighterConnect;
