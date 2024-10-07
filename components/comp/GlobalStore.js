global.appData = {
    walletProvider: null,
};

// Function to set the wallet provider
export const setWalletProvider = (provider) => {
    global.appData.walletProvider = provider;
};

// Function to clear the wallet provider
export const clearWalletProvider = () => {
    global.appData.walletProvider = null;
};