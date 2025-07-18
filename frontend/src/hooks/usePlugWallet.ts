import { useEffect, useState } from "react";

export function usePlugWallet() {
  const [principal, setPrincipal] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // @ts-expect-error Plug wallet types are not available
    if (window.ic && window.ic.plug && window.ic.plug.isConnected) {
      // @ts-expect-error Plug wallet types are not available
      window.ic.plug.isConnected().then((connected: boolean) => {
        if (connected) {
          // @ts-expect-error Plug wallet types are not available
          window.ic.plug.getPrincipal().then((principalId: string) => {
            setPrincipal(principalId);
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
  }, []);

  const connect = async () => {
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

  const disconnect = () => {
    setPrincipal(null);
  };

  return { principal, connect, disconnect, loading };
}
