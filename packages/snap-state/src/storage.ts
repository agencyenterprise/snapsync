import { Json } from '@metamask/snaps-types';

export const saveState = async (newState: any): Promise<void> => {
  await snap.request({
    method: 'snap_manageState',
    params: { operation: 'update', newState },
  });
};

export const getState = async (): Promise<Record<string, Json> | null> => {
  return snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  });
};

export const clearState = async (): Promise<Record<string, Json> | null> => {
  return snap.request({
    method: 'snap_manageState',
    params: { operation: 'clear' },
  });
};
