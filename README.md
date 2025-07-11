# Chrome TAO Wallet Extension

This is a demo app for creating or importing a TAO wallet on the Bittensor network. Users can view their balance on the wallet dashboard and access a transaction history. Currently, the transaction history displays mock transactions, as I was unable to find a free Bittensor indexer.



## 🚀 Setup

1. **Download the extension folder**  
   Make sure you have the complete extension files (including `manifest.json`). [Link](https://drive.google.com/drive/folders/1DOpcUYAJeEPUaTig_XEN3WgzFKEA2q2_?usp=drive_link)

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

### Recordings
[Create Wallet (Seed phrase shown for demo purposes — this is a burn wallet)](https://drive.google.com/file/d/1p_SQ7OEPEu-92HvFNKysco59_moVwumB/view?usp=drive_link)


[Import Wallet](https://drive.google.com/file/d/1nK6Sk9KWepY9J9ZjtzaVlWRvX0nUsVCa/view?usp=drive_link)

### Landing Page
<img width="377" height="605" alt="Screenshot 2025-07-11 at 9 02 25 AM" src="https://github.com/user-attachments/assets/50add583-65f6-49be-a3a3-75c281ca562e" />


### Create Wallet
<img width="382" height="607" alt="Screenshot 2025-07-11 at 9 02 35 AM" src="https://github.com/user-attachments/assets/b0254755-e4bf-4199-b771-8f55bb3c09cd" />


### Import Wallet
<img width="372" height="553" alt="Screenshot 2025-07-11 at 9 02 57 AM" src="https://github.com/user-attachments/assets/184e6a95-05fc-4ef2-8430-d566ff97e1b5" />
<img width="375" height="552" alt="Screenshot 2025-07-11 at 9 03 17 AM" src="https://github.com/user-attachments/assets/9a2a68ba-2806-43fc-9848-04916febf842" />


### Wallet Dashboard
<img width="375" height="604" alt="Screenshot 2025-07-11 at 9 03 27 AM" src="https://github.com/user-attachments/assets/eaabe05a-588f-4023-9fc6-11f0ba853175" />

### Locked Screen
<img width="373" height="602" alt="Screenshot 2025-07-11 at 9 03 36 AM" src="https://github.com/user-attachments/assets/3475c3d3-f088-4eee-b008-c6f1105c6f83" />







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





