# SolarMint (Built for Base)

## Overview

SolarMint is a minimal Base ecosystem repository that demonstrates:
- Wallet connection UX using OnchainKit Wallet components
- Base network selection and chainId awareness for both Base Mainnet and Base Sepolia
- Onchain read operations using Viem public clients (block number, chainId, balance)
- Basescan-ready deployment and verification links for an accompanying smart contract

This repository is intentionally aligned with Base:
- Built for Base
- Uses Base chain identifiers in documentation and runtime (8453 / 84532)
- Provides explicit Basescan explorer URLs for contract deployment and verification workflows

## Base Networks

Base Mainnet
- chainId (decimal): 8453
- Explorer: https://basescan.org
- Public RPC (rate-limited): https://mainnet.base.org

Base Sepolia (testnet)
- chainId (decimal): 84532
- Explorer: https://sepolia.basescan.org
- Public RPC (rate-limited): https://sepolia.base.org

## What the App Does

Primary file: app/solarMint.tsx

Runtime flow:
1) Wraps the UI with OnchainKitProvider using a selected Base chain (Base or Base Sepolia)
2) Renders the OnchainKit Wallet component to support user onboarding and wallet connection UX
3) Creates a Viem Public Client pinned to the selected Base chain’s RPC
4) Performs Base onchain reads:
   - getChainId
   - getBlockNumber
   - getBalance for a provided address
5) Prints Basescan links for:
   - the connected wallet address (when provided)
   - a deployed contract address (optional; can be provided via environment variable or input)
   - a contract verification link (Basescan source code view)

SolarMint is meant to serve as a compact validation harness for Base-compatible tooling, account-abstraction-friendly onboarding UX, and onchain read operations.

## Project Structure

- app/
  - solarMint.tsx
    React entry component. OnchainKit wallet UI + Base chain selection + Viem public reads + Basescan links.

Typical supporting files (recommended for a complete repo):
- package.json
  Declares dependencies and scripts for a standard React build setup.
- tsconfig.json
  TypeScript configuration.
- index.html / main.tsx (or Next.js entry files)
  Application bootstrapping and rendering.
- .env
  Local environment values (do not commit secrets).

## Libraries Used

OnchainKit
- Purpose: Wallet UX components and Base-first onchain app building primitives
- Package usage: OnchainKitProvider, Wallet, Connected
- Repository: https://github.com/coinbase/onchainkit

Viem
- Purpose: EVM client library used for Base onchain reads through JSON-RPC
- Used actions: getChainId, getBlockNumber, getBalance

## Installation

Requirements:
- Node.js 18+ recommended
- A browser environment for wallet UI rendering

Install dependencies in the repository root using your preferred package manager.

## Configuration

Optional environment variables:
- VITE_BASE_RPC_URL
  Overrides Base Mainnet RPC (default: https://mainnet.base.org)
- VITE_BASE_SEPOLIA_RPC_URL
  Overrides Base Sepolia RPC (default: https://sepolia.base.org)
- VITE_CONTRACT_ADDRESS
  A deployed contract address to display Basescan deployment and verification links in the UI

Runtime inputs:
- Network selection: Base (8453) or Base Sepolia (84532)
- Address input: used for balance reads and a Basescan address link
- Contract address input (optional): used for Basescan contract and verification links

## Running

Run as a browser app:
- Start your dev server (React/Vite/Next.js are all valid approaches).
- Open the app in a browser.
- Select Base Sepolia (84532) for test reads, or Base Mainnet (8453) for mainnet reads.
- Connect a wallet via the OnchainKit Wallet UI.
- Paste an address to read balance (or paste the connected address).
- Optionally set or paste a deployed contract address.
- Click “Run Onchain Reads”.

Expected results:
- RPC chainId value and a warning if it does not match the selected network
- Latest block number for the selected Base network
- Native ETH balance for the provided address
- Basescan links for address, contract, and contract verification (if contract address is provided)

## License

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Author

GitHub: https://github.com/chymak0vadina
Public contact (email): 02-albums.deer@icloud.com
Public contact (X): https://x.com/chymakovadina2

## References

Base Account SDK reference (createBaseAccount):
https://docs.base.org/base-account/reference/core/createBaseAccount?utm_source=chatgpt.com

OnchainKit Wallet documentation:
https://docs.base.org/onchainkit/wallet/wallet

## Testnet Deployment (Base Sepolia)

A smart contract has been deployed to the Base Sepolia test network for validation and testing purposes.

- Network: Base Sepolia
- chainId (decimal): 84532
- Explorer: https://sepolia.basescan.org
- Deployed contract "imports" address: 0x4d895dfe4bb6353152ade1f718a24539a20ace03
- Deployed contract "errors" address: 0x441b5ec7fd331674407c4331c2ed6a6de38dd32a
- Basescan deployment and verification links:
- Contract "imports" address: https://sepolia.basescan.org/address/0x4d895dfe4bb6353152ade1f718a24539a20ace03
- Contract "errors" address: https://sepolia.basescan.org/address/0x441b5ec7fd331674407c4331c2ed6a6de38dd32a
- Contract "imports" verification (source code): https://sepolia.basescan.org/0x4d895dfe4bb6353152ade1f718a24539a20ace03/0#code
- Contract "errors" verification (source code): https://sepolia.basescan.org/0x441b5ec7fd331674407c4331c2ed6a6de38dd32a/0#code
- This deployment is used to validate Base-compatible tooling, account abstraction flows, and onchain read operations in a test environment prior to mainnet usage.
