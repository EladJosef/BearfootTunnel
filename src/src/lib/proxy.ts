/// <reference types="chrome"/>

import type { ProxyConfig } from "./types";

export const getProxyConfig = async () => {
    return new Promise((resolve) => {
        chrome.storage.local.get(['proxyConfig'], (result) => {
            resolve(result.proxyConfig as ProxyConfig || null);
        });
    });
}

export const connectProxy = (host: string, port: string, username: string, password: string) => {
    chrome.storage.local.set({
        proxyConfig: {
            type: 'http',
            host: host,
            port: port,
            username: username,
            password: password
        }
    });

    chrome.runtime.sendMessage({ action: 'applyProxy' });
}

export const disconnectProxy = () => {
    chrome.runtime.sendMessage({ action: 'removeProxy' });
}

export const getExternalIP = async () => {
    /** check with myip.wtf */
    const response = await fetch('https://myip.wtf/json', {});
    const data = await response.json();
    
    return {
        ip: data.YourFuckingIPAddress,
        isp: data.YourFuckingISP,
        country: data.YourFuckingLocation,
        countryCode: data.YourFuckingCountryCode,
    }; 
}