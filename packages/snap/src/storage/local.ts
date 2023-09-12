import type { Json } from '@metamask/snaps-types';

export type APIKeys = {
  infura?: string;
  pinata?: string;
};

export type LocalState = {
  apiKeys: APIKeys;
};

export const saveState = async (newState: LocalState): Promise<void> => {
  await snap.request({
    method: 'snap_manageState',
    params: { operation: 'update', newState },
  });
};

export const getState = async (): Promise<LocalState> => {
  const state = await snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  });

  return (state as LocalState) || { apiKeys: {} };
};

export const clearState = async (): Promise<Record<string, Json> | null> => {
  return snap.request({
    method: 'snap_manageState',
    params: { operation: 'clear' },
  });
};
