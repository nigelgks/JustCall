global.appData = {
    walletSigner: null,
};

// Function to set the wallet signer
export const setWalletSigner = async (signer) => {
    try {
        global.appData.walletSigner = signer;
        console.log('[GLOBAL STORE] Wallet signer saved');
    } catch (error) {
        console.log('[GLOBAL STORE] Error saving wallet signer:', error);
    };
};

// Function to clear the wallet signer
export const clearWalletSigner = async () => {
    try {
        global.appData.walletSigner = null;
        console.log('[GLOBAL STORE] Wallet signer removed');
    } catch (error) {
        console.log('[GLOBAL STORE] Error clearing wallet signer:', error);
    };
};