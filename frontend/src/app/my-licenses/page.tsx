"use client";
import React, { useEffect, useState } from "react";
import WalletConnect from "../../components/WalletConnect";
import { getActor } from "../../ic/agent";

const MyLicenses = () => {
  const [principal, setPrincipal] = useState<string | null>(null);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (principal) fetchLicenses();
    // eslint-disable-next-line
  }, [principal]);

  const fetchLicenses = async () => {
    setLoading(true);
    try {
      const actor = getActor();
      const res = await actor.get_my_licenses();
      setLicenses(res);
    } catch (e) {
      // handle error
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Licenses</h1>
      <WalletConnect principal={principal} setPrincipal={setPrincipal} />
      <div className="my-4">
        <a href="/" className="text-blue-500 underline">
          Back to Marketplace
        </a>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          {licenses.length === 0 ? (
            <div>No licenses found.</div>
          ) : (
            licenses.map((lic: any) => (
              <div key={lic.id} className="border p-4 rounded shadow">
                <div className="font-semibold">
                  License ID: {lic.id.toString()}
                </div>
                <div className="text-gray-700">
                  Item ID: {lic.itemId.toString()}
                </div>
                <div className="text-xs text-gray-400">
                  Buyer:{" "}
                  {typeof lic.buyer === "string"
                    ? lic.buyer
                    : lic.buyer?.toString?.() || JSON.stringify(lic.buyer)}
                </div>
                <div className="text-xs text-gray-400">
                  Timestamp: {lic.timestamp.toString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MyLicenses;
