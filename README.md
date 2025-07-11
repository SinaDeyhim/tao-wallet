# Chrome TAO Wallet Extension

This is a demo app for creating or importing a TAO wallet on the Bittensor network. Users can view their balance on the wallet dashboard and access a transaction history. Currently, the transaction history displays mock transactions, as I was unable to find a free Bittensor indexer.



## 🚀 Setup

1. **Download the extension folder**  
   Make sure you have the complete extension files (including `manifest.json`).

2. **Open Chrome (or a Chromium-based browser)**

3. **Navigate to the Extensions page:**  
   Go to `chrome://extensions/` in your browser's address bar.

4. **Enable Developer Mode:**  
   Toggle the **Developer mode** switch in the top-right corner.

5. **Load the unpacked extension:**  
   Click the **Load unpacked** button and select the folder containing the extension files.

6. **Use the extension:**  
   The TAO Wallet icon should now appear in your browser toolbar and be ready to use.

### Notes

- No environment variables or additional configuration is needed.  
- If you want to disable or remove the extension, return to `chrome://extensions/` and click **Remove** or toggle it off.



## 💅 UI Screenshots



## 📖  Instructions 

### 🆕  Create Wallet
You can create a wallet by clicking the “Create Wallet” button on the landing page. You’ll be prompted to choose a password. Once the wallet is created, a 12-word mnemonic phrase will be shown—make sure to copy and store it safely. For security reasons, the clipboard will be cleared after 30 seconds, so you may need to copy it again if you miss it the first time.

### 📥  Import Wallet
You can import your wallet by clicking the “Import Wallet” button on the landing page. You’ll be prompted to enter your 12-word mnemonic phrase and choose a password.

### 🔒  Lock Wallet
You can lock your wallet from the wallet dashboard by pressing the “Lock” button. This will take you to the locked screen, where you will have the option to log back in.


### 📥  Remove Wallet
You can remove an account by first locking your wallet and then pressing the “Log out” button on the locked screen.


### 🕘  Transaction History
Currently, the transaction history displays mock transactions, as I was unable to find a free Bittensor indexer.


## 🛠️ Developer Guide

### 🧱 Tech Stack

- **React 19** – UI framework
- **Vite** – Fast build tool and dev server
- **TypeScript** – Strong typing
- **Tailwind CSS** – Utility-first styling
- **Radix UI** – Accessible component primitives
- **Jest** + **Testing Library** – Testing
- **@polkadot/api** – Bittensor (Substrate) blockchain interaction
- **CRXJS** – Vite plugin for building Chrome Extensions

### 📦 Setup

```bash
npm install      # Installs all project dependencies listed in package.json

npm run dev      # Starts the development server for live preview at http://localhost:5173/ 
                 # or can be used to load the extension as an unpacked extension with hot-reloading

npm run build    # Compiles and bundles the extension for production into the /dist folder

npm test         # Runs all unit and integration tests using Jest and Testing Library

```





