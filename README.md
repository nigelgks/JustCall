# JustCall
A decentralized Caller ID Android application (DApp) that binds Malaysian mobile numbers to a unique blockchain-backed identity. Built to increase transparency, authenticity, and trust in everyday communication.

> **Final Year Project 2024** <br>
> Supervised by **Dr. Aida Osman**, Universiti Teknologi PETRONAS

### Features
- Register an immutable caller ID secured on-chain
- Background incoming call detection with real-time Caller ID pop-up
- Reown wallet integration (MetaMask, Trust Wallet, OKX, and more)
- eKYC verification powered by AnyForm
- Browse, search, and contact verified caller IDs

### Stacks
- React Native
- Expo Development Build
- Supabase (Cloud DB and IAM)
- Hardhat (Solidity)
- Reown Wallet SDK
- Infura (Blockchain ledger provider)
- AnyForm (KYC) <br><br>

## Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/nigelgks/JustCall.git
cd justcall
```
### 2. Install dependencies
```bash
npm install
```
> ⚠️ All packages were last maintained on December 2024, and may be outdated, expired, or deprecated.

### 3. Install Expo CLI (if you haven't already)
```bash
npm install -g expo-cli
```

### 4. Create your environment file
```makefile
SUPABASE_URL=
SUPABASE_ANON_KEY=
INFURA_PROJECT_ID=
ANYFORM_API_KEY=
```

### 5. Run and develop
```bash
npm start
```
> ⚠️ Some packages do not support Expo Go. Recommend to use Expo Dev Build instead.
