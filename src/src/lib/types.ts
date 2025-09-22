export interface ProxyConfig {
    type: 'http' | 'socks5' | 'https';
    host: string;
    port: string;
    username?: string;
    password?: string;
}