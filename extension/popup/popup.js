document.addEventListener('DOMContentLoaded', function () {
	const pasteButton = document.getElementById('pasteButton');

	if (pasteButton) {
		pasteButton.addEventListener('click', async () => {
			try {
				const text = await navigator.clipboard.readText();
				// Expect format: type:host:port:username:password (colon separated)
				const parts = text.split(':');

				if (parts.length >= 2) {
					document.getElementById('host').value = parts[0] || '';
					document.getElementById('port').value = parts[1] || '';
					document.getElementById('username').value = parts[2] || '';
					document.getElementById('password').value = parts[3] || '';
				}
			} catch (err) {
				alert('Could not read clipboard: ' + err);
			}
		});
	}
});

const connectButton = document.getElementById('connectButton');

if (connectButton) {
	connectButton.addEventListener('click', async () => {
		const proxyType = document.getElementById('proxyType').value;
		const host = document.getElementById('host').value;
		const port = document.getElementById('port').value;
		const username = document.getElementById('username').value;
		const password = document.getElementById('password').value;

		if (!host || !port) {
			const msg = document.getElementById('msg');
			msg.innerHTML += '>> Host and port are required! <br/>';
			return;
		}

		chrome.storage.local.set({
			proxyConfig: {
				type: proxyType,
				host: host,
				port: port,
				username: username,
				password: password
			}
		});

		console.log("Proxy config saved:", { type: proxyType, host, port, username, password });

		await chrome.runtime.sendMessage({ action: 'applyProxy' });

		console.log("Connect button clicked");
	});
}

// kill switch button
const killSwitchButton = document.getElementById('killSwitchButton');

if (killSwitchButton) {
	killSwitchButton.addEventListener('click', async () => {
		await chrome.runtime.sendMessage({ action: 'clearProxy' });
		console.log("Kill Switch button clicked");
	});
}

chrome.storage.local.get('proxyConfig', ({ proxyConfig }) => {
	if (proxyConfig) {
		document.getElementById('proxyType').value = proxyConfig.type || 'http';
		document.getElementById('host').value = proxyConfig.host || '';
		document.getElementById('port').value = proxyConfig.port || '';
		document.getElementById('username').value = proxyConfig.username || '';
		document.getElementById('password').value = proxyConfig.password || '';
	}
});