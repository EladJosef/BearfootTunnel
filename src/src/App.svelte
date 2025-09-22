<script lang="ts">
  import { Input, Label, Dropdown, Button } from "flowbite-svelte";
  import { BottomNav, BottomNavItem, Radio } from "flowbite-svelte";

  import { ChevronDownOutline } from "flowbite-svelte-icons";
  import { Share2, Unplug, Globe, Clipboard, PawPrint } from "@lucide/svelte";

  import {
    connectProxy,
    getProxyConfig,
    disconnectProxy,
    getExternalIP,
  } from "./lib/proxy";
  import type { ProxyConfig } from "./lib/types";

  let host = $state("");
  let port = $state("");
  let username = $state("");
  let password = $state("");
  let proxyType = $state("http");

  let externalIP = $state<string | null>(null);
  let userLocation = $state<string | null>(null);
  let isp = $state<string | null>(null);

  getExternalIP().then((data) => {
    externalIP = data.ip;
    userLocation = `${data.country}`;
    isp = data.isp;
  });

  getProxyConfig().then((value) => {
    const config = value as ProxyConfig | null;
    if (config) {
      host = config.host;
      port = config.port;
      username = config.username || "";
      password = config.password || "";
      proxyType = config.type;
    }
  });

  const updateGeoLocation = async () => {
    getExternalIP().then((data) => {
      externalIP = data.ip;
      userLocation = `${data.country}`;
      isp = data.isp;
    });
  };

  const onPaste = async (event: Event) => {
    try {
      const text = await navigator.clipboard.readText();

      const [h, p, u, pass] = text.split(":");

      host = h || "";
      port = p || "";
      username = u || "";
      password = pass || "";
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  const onConnect = (event: Event) => {
    connectProxy(host, port, username, password);
    setTimeout(updateGeoLocation, 1500);
  };

  const unplugProxy = () => {
    disconnectProxy();
    setTimeout(updateGeoLocation, 1500);
  };

  updateGeoLocation();
</script>

<header>
  <h1
    class="p-4 text-3xl font-semibold text-center text-white bg-primary-800 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-b border-gray-300 dark:border-gray-700"
  >
    Bearfoot Proxy <PawPrint class="inline h-6 w-6 mb-1" />
  </h1>
</header>
<form
  class="p-6"
  onsubmit={(e) => {
    onConnect(e);
    return false;
  }}
>
  <div class="mb-4 grid gap-6 grid-cols-2">
    <div>
      <Label for="host" class="mb-2">Host</Label>
      <Input
        type="text"
        id="host"
        placeholder="Domain or IP"
        required
        bind:value={host}
      />
    </div>
    <div>
      <Label for="port" class="mb-2">Port</Label>
      <Input
        type="number"
        id="port"
        placeholder="Port Number"
        min="1"
        max="65535"
        step="1"
        required
        bind:value={port}
      />
    </div>
    <div>
      <Label for="username" class="mb-2">Username</Label>
      <Input
        type="text"
        id="username"
        placeholder="Your username"
        bind:value={username}
      />
    </div>
    <div>
      <Label for="password" class="mb-2">Password</Label>
      <Input
        type="password"
        id="password"
        placeholder="•••••••••"
        bind:value={password}
      />
    </div>
    <div>
      <Label for="proxy-type" class="mb-2">Proxy Type</Label>
      <Button
        id="proxy-type"
        class="w-full justify-between mb-4 bg-gray-50 border-gray-300 border-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
      >
        {proxyType}<ChevronDownOutline
          class="ms-2 h-6 w-6 text-gray-400 dark:text-white"
        />
      </Button>
      <Dropdown simple class="space-y-10 p-2 text-sm bg-gray-100">
        <li>
          <Radio name="group1" bind:group={proxyType} value={"http"}>HTTP</Radio
          >
        </li>
        <li>
          <Radio name="group1" bind:group={proxyType} value={"https"}
            >HTTPS</Radio
          >
        </li>
        <li>
          <Radio name="group1" bind:group={proxyType} value={"socks5"}
            >SOCKS5</Radio
          >
        </li>
      </Dropdown>
    </div>
  </div>

  <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border">
    <Label class="mb-2 block text-lg font-medium"
      >Geo IP {#if isp}<span class="text-gray-500 text-xs">(ISP: {isp})</span
        >{/if}</Label
    >
    <div class="grid gap-4 grid-cols-2">
      <div>
        <Label class="mb-1 text-sm text-gray-600 dark:text-gray-400"
          >IP Address</Label
        >
        <div
          class="p-2 bg-white dark:bg-gray-600 rounded border text-sm font-mono"
        >
          {externalIP || "Loading..."}
        </div>
      </div>
      <div>
        <Label class="mb-1 text-sm text-gray-600 dark:text-gray-400"
          >Location</Label
        >
        <div class="p-2 bg-white dark:bg-gray-600 rounded border text-sm">
          {userLocation || "Loading..."}
        </div>
      </div>
    </div>
  </div>

  <BottomNav position="absolute" classes={{ inner: "grid-cols-4" }}>
    <BottomNavItem btnName="Connect" onclick={onConnect} class="cursor-pointer">
      <Share2
        class="group-hover:text-primary-600 dark:group-hover:text-primary-500 mb-1 h-6 w-6 text-gray-500 dark:text-gray-400"
      />
    </BottomNavItem>
    <BottomNavItem
      btnName="Unconnect"
      onclick={unplugProxy}
      class="cursor-pointer"
    >
      <Unplug
        class="group-hover:text-primary-600 dark:group-hover:text-primary-500 mb-1 h-6 w-6 text-gray-500 dark:text-gray-400"
      />
    </BottomNavItem>
    <BottomNavItem
      btnName="Geo IP"
      onclick={updateGeoLocation}
      class="cursor-pointer"
    >
      <Globe
        class="group-hover:text-primary-600 dark:group-hover:text-primary-500 mb-1 h-6 w-6 text-gray-500 dark:text-gray-400"
      />
    </BottomNavItem>
    <BottomNavItem btnName="Paste" onclick={onPaste} class="cursor-pointer">
      <Clipboard
        class="group-hover:text-primary-600 dark:group-hover:text-primary-500 mb-1 h-6 w-6 text-gray-500 dark:text-gray-400"
      />
    </BottomNavItem>
  </BottomNav>
</form>
