// app/solarMint.tsx
import React, { useEffect, useMemo, useState } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { Connected } from "@coinbase/onchainkit/connected";
import { Address, createPublicClient, formatEther, http } from "viem";
import { base, baseSepolia } from "viem/chains";

type NetKey = "base" | "baseSepolia";

const CHAIN = {
  base: base,
  baseSepolia: baseSepolia,
} as const;

const CHAIN_ID = {
  base: 8453,
  baseSepolia: 84532,
} as const;

const EXPLORER = {
  base: "https://basescan.org",
  baseSepolia: "https://sepolia.basescan.org",
} as const;

const RPC = {
  base: (import.meta as any).env?.VITE_BASE_RPC_URL || "https://mainnet.base.org",
  baseSepolia:
    (import.meta as any).env?.VITE_BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
} as const;

function isAddress(v: string): v is Address {
  return /^0x[a-fA-F0-9]{40}$/.test(v.trim());
}

export default function SolarMint() {
  const [net, setNet] = useState<NetKey>("baseSepolia");
  const [address, setAddress] = useState<string>("");
  const [contract, setContract] = useState<string>(
    (import.meta as any).env?.VITE_CONTRACT_ADDRESS || ""
  );
  const [status, setStatus] = useState<string>("Idle");
  const [chainId, setChainId] = useState<number | null>(null);
  const [block, setBlock] = useState<bigint | null>(null);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [error, setError] = useState<string>("");

  const chain = CHAIN[net];
  const expectedChainId = CHAIN_ID[net];
  const explorer = EXPLORER[net];
  const rpcUrl = RPC[net];

  const publicClient = useMemo(() => {
    return createPublicClient({
      chain,
      transport: http(rpcUrl),
    });
  }, [chain, rpcUrl]);

  async function runReads() {
    setError("");
    setStatus("Reading onchain state…");
    try {
      const [rpcChainId, blockNumber] = await Promise.all([
        publicClient.getChainId(),
        publicClient.getBlockNumber(),
      ]);
      setChainId(rpcChainId);
      setBlock(blockNumber);

      if (isAddress(address)) {
        const bal = await publicClient.getBalance({ address: address as Address });
        setBalance(bal);
      } else {
        setBalance(null);
      }

      setStatus("Done");
    } catch (e: any) {
      setStatus("Error");
      setError(e?.message || String(e));
    }
  }

  useEffect(() => {
    setChainId(null);
    setBlock(null);
    setBalance(null);
    setStatus("Idle");
    setError("");
  }, [net]);

  const contractOk = contract.trim() === "" || isAddress(contract);
  const contractAddr = contractOk && contract.trim() !== "" ? (contract.trim() as Address) : null;

  return (
    <div style={{ maxWidth: 860, margin: "32px auto", padding: 16, fontFamily: "ui-sans-serif, system-ui" }}>
      <h1 style={{ margin: 0 }}>SolarMint — Built for Base</h1>
      <p style={{ marginTop: 8, marginBottom: 16 }}>
        Base network probe using OnchainKit Wallet UI + Viem public client reads.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
        <label>
          Network:&nbsp;
          <select value={net} onChange={(e) => setNet(e.target.value as NetKey)}>
            <option value="baseSepolia">Base Sepolia (84532)</option>
            <option value="base">Base Mainnet (8453)</option>
          </select>
        </label>

        <button onClick={runReads} style={{ padding: "6px 12px" }}>
          Run Onchain Reads
        </button>

        <span>
          Status:&nbsp;<strong>{status}</strong>
        </span>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div>Explorer: {explorer}</div>
        <div>RPC: {rpcUrl}</div>
        <div>Expected chainId: {expectedChainId}</div>
      </div>

      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12, marginBottom: 12 }}>
        <OnchainKitProvider chain={chain}>
          <Wallet />
          <Connected>
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <label style={{ flex: "1 1 320px" }}>
                  Connected address (paste):
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="0x…"
                    style={{ width: "100%", padding: 8, marginTop: 6 }}
                  />
                </label>

                <label style={{ flex: "1 1 320px" }}>
                  Deployed contract address (optional):
                  <input
                    value={contract}
                    onChange={(e) => setContract(e.target.value)}
                    placeholder="0x…"
                    style={{ width: "100%", padding: 8, marginTop: 6 }}
                  />
                </label>
              </div>

              <div style={{ marginTop: 12, lineHeight: 1.6 }}>
                <div>
                  Wallet Basescan link:&nbsp;
                  {isAddress(address) ? (
                    <a href={`${explorer}/address/${address}`} target="_blank" rel="noreferrer">
                      {explorer}/address/{address}
                    </a>
                  ) : (
                    "Enter a valid address to show link"
                  )}
                </div>

                <div>
                  Contract Basescan link:&nbsp;
                  {contractAddr ? (
                    <a href={`${explorer}/address/${contractAddr}`} target="_blank" rel="noreferrer">
                      {explorer}/address/{contractAddr}
                    </a>
                  ) : (
                    "Optional (set VITE_CONTRACT_ADDRESS or paste a valid address)"
                  )}
                </div>

                <div>
                  Contract verification link:&nbsp;
                  {contractAddr ? (
                    <a href={`${explorer}/address/${contractAddr}#code`} target="_blank" rel="noreferrer">
                      {explorer}/address/{contractAddr}#code
                    </a>
                  ) : (
                    "Optional"
                  )}
                </div>
              </div>
            </div>
          </Connected>
        </OnchainKitProvider>
      </div>

      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
        <h2 style={{ marginTop: 0 }}>Onchain Read Results</h2>
        <div>RPC chainId: {chainId ?? "—"}</div>
        <div>Latest block: {block !== null ? block.toString() : "—"}</div>
        <div>
          Native balance (ETH):{" "}
          {balance !== null ? formatEther(balance) : isAddress(address) ? "Loading/Run reads" : "—"}
        </div>
        {chainId !== null && chainId !== expectedChainId && (
          <div style={{ marginTop: 10 }}>
            Warning: RPC returned chainId {chainId}, expected {expectedChainId}.
          </div>
        )}
        {error && <div style={{ marginTop: 10 }}>Error: {error}</div>}
      </div>
    </div>
  );
}
