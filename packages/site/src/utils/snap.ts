import { defaultOtherSnapOrigin, defaultSnapOrigin } from '../config';
import { GetSnapsResponse, IPFS, Snap } from '../types';

/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (): Promise<GetSnapsResponse> => {
  return (await window.ethereum.request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;
};

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string,
  params: Record<'version' | string, unknown> = {},
) => {
  await window.ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      [snapId]: params,
    },
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param id - The ID of the snap to install.
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (
  id: string,
  version?: string,
): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    console.log(Object.values(snaps));
    return Object.values(snaps).find(
      (snap) => snap.id === id && (!version || snap.version === version),
    );
  } catch (e) {
    console.log('Failed to obtain installed snap', e);
    return undefined;
  }
};

export const sendSaveState = async (data: object) => {
  return window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultOtherSnapOrigin,
      request: { method: 'saveState', params: { data } },
    },
  });
};

export const sendGetState = async () => {
  return window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultOtherSnapOrigin,
      request: { method: 'getState' },
    },
  });
};

export const sendClearState = async () => {
  return window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultOtherSnapOrigin,
      request: { method: 'clearState' },
    },
  });
};

export const encrypt = async (data: Record<string, unknown>) => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: { method: 'encrypt', params: [data] },
    },
  });
};

export const dencrypt = async (encryptedData: string) => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: { method: 'decrypt', params: [encryptedData] },
    },
  });
};

export const uploadToIPFS = async (encryptedData: string) => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: { method: 'uploadToIPFS', params: [encryptedData] },
    },
  });
};

export const downloadFromIPFS = async (cid: string) => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: { method: 'downloadFromIPFS', params: [cid] },
    },
  });
};

export const updateIPFS = async (cid: string, data: string) => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: { method: 'updateIPFS', params: [cid, data] },
    },
  });
};

export const encryptWithOtherSnap = async (data: Record<string, unknown>) => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultOtherSnapOrigin,
      request: { method: 'encryptWithOtherSnap', params: [data] },
    },
  });
};

export const getGlobalState = async () => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: { method: 'getState' },
    },
  });
};

export const getIPFSList = async (): Promise<IPFS[]> => {
  const response = await window.ethereum.request<IPFS[]>({
    method: 'wallet_invokeSnap',
    params: {
      snapId: defaultSnapOrigin,
      request: { method: 'listIPFS' },
    },
  });
  return (response ?? []) as IPFS[];
};

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
