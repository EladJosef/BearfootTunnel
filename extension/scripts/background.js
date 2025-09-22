chrome.runtime.onMessage.addListener((msg, sender) => {
    if (msg.action === 'applyProxy') {
        chrome.storage.local.get('proxyConfig', ({ proxyConfig }) => {
            if (proxyConfig) {
                const { type, host, port, username, password } = proxyConfig;
                const config = {
                    mode: 'fixed_servers',
                    rules: {
                        singleProxy: {
                            scheme: type,
                            host,
                            port: parseInt(port),
                        },
                        bypassList: ['localhost', '127.0.0.1']
                    }
                };

                chrome.proxy.settings.set({ value: config, scope: 'regular' }, () => {
                    if (chrome.runtime.lastError) {
                        console.error('Error setting proxy:', chrome.runtime.lastError);
                    } else {
                        console.log('Proxy settings applied:', config);
                    }
                    if (username && password && chrome.webRequest) {
                        chrome.webRequest.onAuthRequired.addListener(function handler(_, callback) {
                            callback({ authCredentials: { username, password } });
                            chrome.webRequest.onAuthRequired.removeListener(handler);
                        }, { urls: ["<all_urls>"] });
                    }
                });
            }
        });

        return true;
    }
    else if (msg.action === 'removeProxy') {
        chrome.proxy.settings.clear({ scope: 'regular' }, () => {
            if (chrome.runtime.lastError) {
                console.error('Error clearing proxy:', chrome.runtime.lastError);
            } else {
                console.log('Proxy settings cleared');
            }
        });

        return true;
    }
});