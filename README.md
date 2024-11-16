# 🌟 Memora Platform

Memora is a comprehensive blockchain-powered platform that helps users preserve and manage their digital legacy through smart contracts, AI-driven analysis, and secure data storage. The platform combines advanced NFT-based inheritance mechanisms with intelligent backend services.

## 🏗 Architecture Overview

### Smart Contracts (Rootstock)
- **MemoraNFTV2**: Advanced ERC721 token with inheritance and fund management capabilities
- **Buffer System**: Configurable time-delay mechanism for inheritance claims
- **Multi-Action Support**: Account management, closure, and fund transfer capabilities

### Backend Services
- **AI Analysis**: OpenAI-powered content evaluation and trigger condition analysis
- **Push Notifications**: Real-time event notifications via Push Protocol
- **Secure Storage**: Encrypted note storage using Nillion Network
- **Telegram Integration**: Interactive diary entries and user engagement

## 🔑 Key Features

### 1. Smart Contract Capabilities
- NFT minting with customizable inheritance parameters
- Judge-triggered inheritance mechanism
- Configurable buffer period for security
- Native token (BTC) management within NFTs
- Multiple account actions (Manage/Close/Transfer)

### 2. Backend Services
- AI-driven content analysis
- Personalized diary question generation
- Real-time notifications
- Secure communication channels
- Comprehensive user management

## 🛠 Technical Stack

### Blockchain Layer
- Solidity 0.8.20
- OpenZeppelin Contracts
- Hardhat Development Environment
- Ethers.js

### Backend Infrastructure
- Node.js with Express
- Sequelize ORM
- OpenAI Integration
- Push Protocol
- Telegram Bot API
- Nillion Network

## 📋 Smart Contract Details

### Core Functions

#### NFT Management

- **Minting NFTs**: Users can mint NFTs with custom URIs and assign a judge, heir, and action for account management.
- **Inheritance Mechanism**: After a judge declares a "trigger" and a buffer period passes, the heir can inherit the NFT or perform actions like managing accounts, closing accounts, or transferring funds.
- **Buffer Period**: A configurable time period that must pass after the judge triggers the inheritance process before the heir can act.
- **Account Actions**:
  - **Manage Account**: Transfer the NFT to the heir after trigger declaration.
  - **Close Account**: Burns the NFT when the trigger is declared and the heir signs.
  - **Transfer Funds**: The NFT's balance is transferred to the heir.
- **Funding the NFTs**: Owners and other users can add BTC to an NFT, which will be inherited by the designated heir.
- **Heir Signing**: Heirs need to sign after the buffer period to inherit the NFT or the funds associated with it.

## Contract Details

- **Name**: `MemoraNFTV2`
- **Token Standard**: ERC721
- **Solidity Version**: 0.8.20
- **License**: MIT

## Events

- **JudgeDeclaredTriggered**: Emitted when the judge declares a trigger.
- **HeirSigned**: Emitted when the heir signs after the buffer period.
- **NFTInherited**: Emitted when the NFT is successfully transferred to the heir.
- **TriggerDisabled**: Emitted when the trigger is disabled by the owner.
- **BufferChanged**: Emitted when the buffer period is modified.
- **NFTInheritedAndFundsReleased**: Emitted when funds are transferred to the heir along with the NFT.
- **FundsAdded**: Emitted when funds are added to the NFT's balance.

## Functions

### Minting and Management

- `mint(address heir, uint256 choice, string memory prompt, string memory tokenURI, uint256 farcasterID)`: Mints a new NFT.
- `declareTrigger(uint256 tokenId)`: The judge declares that a trigger event has occurred.
- `heirSign(uint256 tokenId)`: The heir signs and inherits the NFT or funds after the buffer period.
- `disableTrigger(uint256 tokenId)`: The NFT owner can disable a trigger.
- `changeBuffer(uint256 _buffer_period)`: Only the owner can change the buffer period for the contract.

### Fund Management

- `addFunds(uint256 tokenId)`: Adds Ether to an NFT, which can be inherited by the heir.
- `getTokenBalance(uint256 tokenId)`: Returns the balance of a given NFT.
- `withdrawFunds(uint256 tokenId)`: Allows the token owner to withdraw funds associated with the token.

