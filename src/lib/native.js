// import { Daemon, WalletBackend } from 'kryptokrona-wallet-backend-js';

import RPC from 'tiny-buffer-rpc';
import ce from 'compact-encoding';
import { requireNativeModule } from 'expo-modules-core';
import { rpc_message } from './rpc';
import {
  getRoomMessages,
  roomMessageExists,
  getRoomReplyMessage,
  getLatestRoomHashes,
} from '@/services/bare/sqlite';
import { Wallet } from 'services/kryptokrona/wallet';
requireNativeModule('HelloBare').install();

// forward bare's logs to console
HelloBare.onLog = console.log;

// RPC FROM FRONT END
const rpc = new RPC(HelloBare.sendMessage);
HelloBare.onMessage = rpc.recv.bind(rpc);

const mainRPC = rpc.register(0, {
  request: ce.string,
  response: ce.string,
});

// Right now we use a stream to send IPC messages.
// This may need to be bidirectional if we send files etc.
rpc.register(1, {
  request: ce.string,
  response: ce.string,
  onstream: (stream) => {
    stream.on('data', (a) => {
      rpc_message(a);
    });
  },
});

rpc.register(2, {
  request: ce.string,
  response: ce.string,
  onrequest: async (data) => {
    const request = JSON.parse(data);
    switch (request.type) {
      case 'get-room-history':
        const messages = await getRoomMessages(request.key, 0, true);
        return JSON.stringify(messages);
      case 'get-latest-room-hashes':
        const hashes = await getLatestRoomHashes(request.key);
        return JSON.stringify(hashes);
      case 'room-message-exists':
        const exists = await roomMessageExists(request.hash);
        return JSON.stringify(exists);
      case 'get-room-message':
        const message = await getRoomReplyMessage(request.hash, true);
        return JSON.stringify(message[0]);
      case 'get-priv-key':
        //Temporary until we sign all messages with xkr address
        const key = Wallet.spendKey();
        return JSON.stringify(key);
      case 'sign-message':
        const sig = await Wallet.sign(request.message);
        return JSON.stringify(sig);
      case 'verify-signature':
        const verify = await Wallet.verify(
          request.data.message,
          request.data.address,
          request.data.signature,
        );
        return JSON.stringify(verify);
    }
  },
});

// Exported functions to client
export const bare = async (user) => {
  const data = JSON.stringify({
    type: 'init_bare',
    user,
  });
  return await mainRPC.request(data);
};

export const update_bare_user = async (user) => {
  const data = JSON.stringify({ type: 'update_bare_user', user });
  return mainRPC.request(data);
};

export const swarm = async (hashkey, key, admin) => {
  const data = JSON.stringify({ type: 'new_swarm', key, hashkey, admin });
  mainRPC.request(data);
};

export const end_swarm = (key) => {
  const data = JSON.stringify({ type: 'end_swarm', key });
  return mainRPC.request(data);
};

export const send_swarm_msg = async (key, message, reply, tip) => {
  const data = JSON.stringify({
    type: 'send_room_msg',
    key,
    message,
    reply,
    tip,
  });
  return await mainRPC.request(data);
};

export const group_random_key = async () => {
  const data = JSON.stringify({ type: 'group_random_key' });
  return await mainRPC.request(data);
};

export const begin_send_file = (json_file_data) => {
  const data = JSON.stringify({ type: 'begin_send_file', json_file_data });
  return mainRPC.request(data);
};

export const keep_alive = () => {
  const data = JSON.stringify({ type: 'keep_alive' });
  mainRPC.request(data);
};

export const send_idle_status = (status) => {
  const data = JSON.stringify({ type: 'idle_status', mode: status });
  mainRPC.request(data);
};

export const close_all_connections = () => {
  const data = JSON.stringify({ type: 'close_connections' });
  mainRPC.request(data);
};

// Function to test wallet support for different JS engines
const wallet = async () => {
  // const daemon = new Daemon('privacymine.net', 11898);
  // const config = {};
  // const wallet = await WalletBackend.createWallet(daemon, config);
  // console.log('Wallet!', wallet);
};
