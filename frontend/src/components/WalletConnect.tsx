import React from "react";

interface WalletConnectProps {
  principal: string | null;
  setPrincipal: (principal: string) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  principal,
  setPrincipal,
}) => {
  const connectPlug = async () => {
    // @ts-expect-error Plug wallet types are not available
    if (window.ic && window.ic.plug) {
      // @ts-expect-error Plug wallet types are not available
      const connected = await window.ic.plug.requestConnect();
      if (connected) {
        // @ts-expect-error Plug wallet types are not available
        const principalId = await window.ic.plug.getPrincipal();
        setPrincipal(principalId);
      }
    } else {
      alert("Plug wallet not found. Please install Plug extension.");
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {principal ? (
        <span className="text-green-600 font-mono">
          {typeof principal === "string"
            ? principal
            : principal?.toString?.() || JSON.stringify(principal)}
        </span>
      ) : (
        <button
          onClick={connectPlug}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Connect Plug Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnect;
