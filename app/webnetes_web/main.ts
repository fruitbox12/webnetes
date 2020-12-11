import { WebnetesManager } from "../../lib/management/webnetes-manager";
import { IResource } from "../../lib/models/resource";

(window as any).setImmediate = window.setInterval; // Polyfill

(async () => {
  const mgr = new WebnetesManager();

  try {
    await Promise.all(
      [
        {
          apiVersion: "webnetes.felix.pojtinger.com/v1alpha1",
          kind: "Runtime",
          metadata: {
            name: "Generic WASI",
            label: "generic_wasi",
          },
        },
        {
          apiVersion: "webnetes.felix.pojtinger.com/v1alpha1",
          kind: "Capability",
          metadata: {
            name: "Binding aliases",
            label: "bind_alias",
          },
          spec: {
            privileged: true,
          },
        },
        {
          apiVersion: "webnetes.felix.pojtinger.com/v1alpha1",
          kind: "Capability",
          metadata: {
            name: "Connecting to aliases",
            label: "connect_to_alias",
          },
          spec: {
            privileged: false,
          },
        },
        {
          apiVersion: "webnetes.felix.pojtinger.com/v1alpha1",
          kind: "Node",
          metadata: {
            name: "Felix's iPhone",
            label: "felixs_iphone",
          },
          spec: {
            runtimes: ["generic_wasi"],
            capabilities: ["bind_alias", "connect_to_alias"],
          },
        },
        {
          apiVersion: "webnetes.felix.pojtinger.com/v1alpha1",
          kind: "StunServer",
          metadata: {
            name: "Google STUN Server",
            label: "google",
          },
          spec: {
            urls: ["stun.l.google.com:19302"],
          },
        },
        {
          apiVersion: "webnetes.felix.pojtinger.com/v1alpha1",
          kind: "StunServer",
          metadata: {
            name: "Twillio STUN Server",
            label: "twillio",
          },
          spec: {
            urls: ["stun:global.stun.twilio.com:3478?transport=udp"],
          },
        },
        {
          apiVersion: "webnetes.felix.pojtinger.com/v1alpha1",
          kind: "TurnServer",
          metadata: {
            name: "Twillio TURN Server",
            label: "twillio",
          },
          spec: {
            urls: ["turn:global.turn.twilio.com:3478?transport=tcp"],
            username:
              "f4b4035eaa76f4a55de5f4351567653ee4ff6fa97b50b6b334fcc1be9c27212d",
            credential: "w1uxM55V9yVoqyVFjt+mxDBV0F87AUCemaYVQGxsPLw=",
          },
        },
        {
          apiVersion: "webnetes.felix.pojtinger.com/v1alpha1",
          kind: "Signaler",
          metadata: {
            name: "Public unisockets Signaling Server",
            label: "unisockets_public",
          },
          spec: {
            urls: ["wss://unisockets.herokuapp.com"],
            retryAfter: 1000,
          },
        },
        {
          apiVersion: "webnetes.felix.pojtinger.com/v1alpha1",
          kind: "Network",
          metadata: {
            name: "Public unisockets network",
            label: "unisockets_public",
          },
          spec: {
            signaler: "unisockets_public",
            stunServers: ["google", "twillio"],
            turnServers: ["twillio"],
          },
        },
        {
          apiVersion: "webnetes.felix.pojtinger.com/v1alpha1",
          kind: "Subnet",
          metadata: {
            name: "Echo Network",
            label: "echo_network",
          },
          spec: {
            network: "unisockets_public",
            prefix: "127.0.0",
          },
        },
        {
          apiVersion: "webnetes.felix.pojtinger.com/v1alpha1",
          kind: "Tracker",
          metadata: {
            name: "OpenWebTorrent",
            label: "openwebtorrent",
          },
          spec: {
            urls: ["wss://tracker.openwebtorrent.com"],
          },
        },
        {
          apiVersion: "webnetes.felix.pojtinger.com/v1alpha1",
          kind: "Tracker",
          metadata: {
            name: "βTorrent",
            label: "btorrent",
          },
          spec: {
            urls: ["wss://tracker.btorrent.xyz"],
          },
        },
        {
          apiVersion: "webnetes.felix.pojtinger.com/v1alpha1",
          kind: "Tracker",
          metadata: {
            name: "Fastcast",
            label: "fastcast",
          },
          spec: {
            urls: ["wss://tracker.fastcast.nz"],
          },
        },
        {
          apiVersion: "webnetes.felix.pojtinger.com/v1alpha1",
          kind: "Repository",
          metadata: {
            name: "Public WebTorrent",
            label: "webtorrent_public",
          },
          spec: {
            trackers: ["openwebtorrent", "btorrent", "fastcast"],
          },
        },
        {
          apiVersion: "webnetes.felix.pojtinger.com/v1alpha1",
          kind: "File",
          metadata: {
            name: "Echo Server Binary",
            label: "echo_server",
          },
          spec: {
            repository: "webtorrent_public",
            uri:
              "magnet:?xt=urn:btih:93af63ab65e5c600087ab79e8813551d4ae00a72&dn=data&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com",
          },
        },
        {
          apiVersion: "webnetes.felix.pojtinger.com/v1alpha1",
          kind: "Arguments",
          metadata: {
            name: "Echo Server Configuration",
            label: "echo_server",
          },
          spec: {
            argv: ["-laddr", "127.0.0.1:1234"],
          },
        },
        {
          apiVersion: "webnetes.felix.pojtinger.com/v1alpha1",
          kind: "Workload",
          metadata: {
            name: "Echo Server",
            label: "echo_server",
          },
          spec: {
            file: "echo_server",
            runtime: "generic_wasi",
            capabilities: ["bind_alias"],
            subnet: "echo_network",
            arguments: "echo_server",
          },
        },
      ].map((resource) => mgr.applyResource(resource as IResource<any>))
    );
  } finally {
    // await mgr.close();
  }
})();
