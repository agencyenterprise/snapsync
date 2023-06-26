import { Json } from '@metamask/snaps-types';

export const saveLocalState = async (newState: any): Promise<void> => {
  await snap.request({
    method: 'snap_manageState',
    params: { operation: 'update', newState },
  });
};

export const getLocalState = async (): Promise<Record<string, Json> | null> => {
  return snap.request({
    method: 'snap_manageState',
    params: { operation: 'get' },
  });
};

export const clearLocalState = async (): Promise<Record<
  string,
  Json
> | null> => {
  return snap.request({
    method: 'snap_manageState',
    params: { operation: 'clear' },
  });
};
