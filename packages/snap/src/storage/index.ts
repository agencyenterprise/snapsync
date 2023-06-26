import { encrypt } from './ipfs';
import { clearLocalState, getLocalState, saveLocalState } from './local';

export const saveState = async (state: any) => {
  await saveLocalState(state);
  await encrypt();
};

export const getState = async () => {
  return await getLocalState();
};

export const clearState = async () => {
  await clearLocalState();
};
