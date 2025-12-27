# 🔐 Secure Vault

A secure password management application built with React that uses advanced encryption to store and manage secrets. All data is encrypted using AES-256-GCM encryption with PBKDF2 key derivation.

---

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Workflow](#workflow)
- [Cryptography Details](#cryptography-details)
- [Getting Started](#getting-started)

---

## ✨ Features

- **Master Password Protection**: Secure vault locked behind a master password
- **AES-256-GCM Encryption**: Military-grade encryption for all stored secrets
- **PBKDF2 Key Derivation**: Password-based key derivation with 100,000 iterations
- **Add/Delete Secrets**: Full CRUD operations for managing secrets
- **Local Storage**: Encrypted data persisted in browser localStorage
- **Modal Dialogs**: Custom modal for adding and editing secrets

---

## 🏗 Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────┐
│                     User Interface                        │
│  (React Components, Forms, Tables, Modals)               │
└─────────────────────┬──────────────────────────────────┘
                      │
┌─────────────────────▼──────────────────────────────────┐
│              State Management (App.jsx)                 │
│  - Unlock State, Crypto Key, Secrets List, Salt        │
└─────────────────────┬──────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
┌───────▼─────────┐       ┌────────▼──────────┐
│ Crypto Service  │       │  Storage Service  │
│ - Encryption    │       │ - Load/Save       │
│ - Decryption    │       │ - localStorage    │
│ - Key Derivation│       │                   │
└───────┬─────────┘       └────────┬──────────┘
        │                          │
└───────┴──────────────────────────┘
        │
┌───────▼──────────────────────────────────┐
│  Browser APIs                             │
│  - Web Crypto API (SubtleCrypto)         │
│  - localStorage API                      │
│  - TextEncoder/Decoder                   │
└───────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
secure-vault/
├── public/                          # Static assets
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
│
├── src/
│   ├── components/                  # Reusable UI Components
│   │   ├── CustomButton.js          # Styled button component
│   │   ├── CustomModal.js           # Modal dialog component
│   │   └── CustomTable.js           # Data table component└── CustomTable.js
│   │   └── CustomLoader.js

│   ├── pages/                       # Page Components
│   │   ├── LockScreen.js            # Master password entry
│   │   ├── SecretList.js            # Display secrets table
│   │   ├── AddSecret.js             # Add new secret form
│   │   └── Vault.js                 # Main vault dashboard
│   │
│   ├── services/
│   │   └── vaultStorage.js          # localStorage operations
│   │

│   ├── utils/
│   │   └── crypto.js                # Encryption/decryption logic
│   │

│   ├── styles/                      # CSS Stylesheets
│   │   ├── Button.css
│   │   ├── LockScreen.css
│   │   ├── Modal.css
│   │   ├── Table.css
│   │   └── Vault.css
│   │   └── Loader.css

│   ├── App.jsx                      # Root component
│   ├── index.js                     # Entry point
│   └── index.css                    # Global styles
│
├── package.json                     # Dependencies & scripts
└── README.md                        # This file
```

---

## 🛠 Technology Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Frontend Framework** | React 18.2.0 | UI library and state management |
| **Runtime** | Node.js + npm | Package management and development |
| **Security** | Web Crypto API | AES-256-GCM encryption & PBKDF2 |
| **Storage** | Browser localStorage | Persistent encrypted data storage |
| **UI Components** | React Icons 5.5.0 | Icon components |
| **Modals** | React Modal 3.16.3 | Dialog components |
| **Data Tables** | React Table 7.8.0 | Table rendering |
| **Build Tool** | Create React App 5.0.1 | Zero-config React app setup |

---

## 🔄 Workflow

### 1️⃣ **Application Start**
```
User opens app → Load encrypted vault from localStorage
```

### 2️⃣ **Authentication Flow**
```
┌─────────────────────────────────────┐
│  User enters Master Password        │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Load salt from stored vault        │
│  OR Generate new salt (first time)  │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  PBKDF2: Derive crypto key from     │
│  password + salt (100k iterations)  │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Decrypt vault with AES-256-GCM     │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  ✅ Unlock Vault                    │
│  Display secrets in table           │
└─────────────────────────────────────┘
```

### 3️⃣ **Secret Management**

#### Add Secret
```
User → Form Input → Validation → Add to Secrets Array 
→ Encrypt with AES-256-GCM → Save to localStorage
```

#### Delete Secret
```
User → Delete Action → Remove from Array 
→ Re-encrypt Vault → Save to localStorage
```

### 4️⃣ **Data Persistence**
```
Each operation → Serialize secrets to JSON 
→ Encrypt with current crypto key
→ Store {salt, iv, ciphertext} in localStorage
```

---

## 🔐 Cryptography Details

### Key Derivation: PBKDF2-SHA-256

**Purpose**: Convert master password into a strong encryption key

```
Input:
├── Master Password (user input)
├── Salt (16 bytes, random)
├── Iterations: 100,000 (SHA-256)
└── Key Length: 256 bits

Process:
PBKDF2(password, salt, 100000, SHA-256) → CryptoKey

Output:
└── AES-256 compatible crypto key
```

**Security Benefits**:
- Salt prevents rainbow table attacks
- 100,000 iterations slow down brute force attacks
- Each vault has unique salt
- Key is non-extractable (cannot be accessed directly)

### Encryption: AES-256-GCM

**Purpose**: Encrypt vault data with authenticated encryption

```
Input:
├── Data: {secrets array as JSON}
├── Encryption Key: 256-bit CryptoKey (from PBKDF2)
└── IV: 12 bytes (random nonce)

Process:
AES-GCM(plaintext, key, iv) → {ciphertext, auth_tag}

Output:
├── IV (Base64): Random initialization vector
├── Ciphertext (Base64): Encrypted data
└── Authentication Tag: Built into ciphertext
```

**Storage Format**:
```json
{
  "salt": "Base64EncodedSalt",
  "iv": "Base64EncodedIV",
  "ciphertext": "Base64EncodedEncryptedData"
}
```

**Security Features**:
- **GCM Mode**: Provides authenticated encryption (AEAD)
- **Random IV**: New IV for each encryption operation
- **256-bit Keys**: Military-grade encryption strength
- **Authentication**: Detects tampering with ciphertext
- **Non-extractable Keys**: Keys never exposed to JavaScript

### Data Flow Diagram

```
Master Password
    │
    ▼
┌────────────────────────────────────┐
│  PBKDF2-SHA-256                    │
│  (100,000 iterations + Salt)       │
└────────────────┬───────────────────┘
                 │
                 ▼ (CryptoKey)
         ┌───────────────────┐
         │  AES-256-GCM      │
         │  Encrypt/Decrypt  │
         │  (Random IV)      │
         └───────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │  Ciphertext (Base64)
        │  + IV (Base64)     │
        │  + Salt (Base64)   │
        └────────────────────┘
                 │
                 ▼
         ┌──────────────────┐
         │  localStorage    │
         └──────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project**
   ```bash
   cd secure-vault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### First Time Setup

1. Open the app
2. Enter a strong master password (will be the only way to access vault)
3. Click "Unlock"
4. Start adding secrets!

---

## 📝 Available Scripts

### Development

**`npm start`** - Start development server
```bash
npm start
```
Runs app in development mode at [http://localhost:3000](http://localhost:3000)

### Production

**`npm run build`** - Create production build
```bash
npm run build
```
Builds optimized production bundle in `build/` folder

### Testing

**`npm test`** - Run tests
```bash
npm test
```
Launches test runner in interactive mode

---