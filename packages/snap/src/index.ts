import { OnRpcRequestHandler } from '@metamask/snaps-types';

import { heading, panel, text } from '@metamask/snaps-ui';
import { getState, saveState } from './storage/local';
import { PinataIPFSService } from './ipfs/service';
import { isSnapDapp } from './utils/snap';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @param args.origin -
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  request,
  origin,
}) => {
  switch (request.method) {
    case 'get_api_keys': {
      verifyIsSnapDapp(origin);
      return handleGetAPIKeys();
    }

    case 'save_api_key': {
      verifyIsSnapDapp(origin);
      const { apiKey } = request.params as { apiKey: string };
      return handleSaveAPIKey(apiKey);
    }

    case 'has_api_key': {
      return Boolean((await getState()).apiKeys?.pinata);
    }

    case 'dialog_api_key':
      return dialogSaveAPIKey();

    case 'get':
      return handleGet(origin);

    case 'set':
      return handleSave(origin, request.params || {});

    case 'clear':
      return handleClear(origin);

    default:
      throw new Error('Method not found.');
  }
};

/**
 * Verify that the origin is the snap dapp.
 *
 * @param origin - The origin to check.
 */
function verifyIsSnapDapp(origin: string): void {
  if (!isSnapDapp(origin)) {
    throw new Error('You are not allowed to invoke this method.');
  }
}

/**
 * Returns all the API keys from managed state.
 *
 * @returns found keys or empty if not found.
 */
async function handleGetAPIKeys(): Promise<Record<string, string>> {
  const state = await getState();
  return state.apiKeys || {};
}

/**
 * Save the provider key to managed state.
 *
 * @param apiKey - The key to save.
 */
async function handleSaveAPIKey(apiKey: string): Promise<void> {
  const state = await getState();
  const apiKeys = { ...state.apiKeys, pinata: apiKey };

  await saveState({ apiKeys });
}

/**
 * Prompt the user to save the pinata key.
 */
async function dialogSaveAPIKey(): Promise<void> {
  const ipfsKey = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'prompt',
      content: panel([
        heading('Enter your Piñata JWT token'),
        text('Enter your key below:'),
      ]),
    },
  });

  if (ipfsKey && typeof ipfsKey === 'string') {
    return await handleSaveAPIKey(ipfsKey.trim());
  }

  throw new Error('No input provided.');
}

/**
 * Get snap state from IPFS.
 *
 * @param snapId - The snap ID.
 */
async function handleGet(snapId: string): Promise<unknown> {
  return await PinataIPFSService.instance.get(snapId);
}

/**
 * Save snap state to IPFS.
 *
 * @param snapId - The snap ID.
 * @param snapState - The snap state.
 */
async function handleSave(snapId: string, snapState: unknown): Promise<void> {
  await PinataIPFSService.instance.set(snapId, snapState);
}

/**
 * Clear snap state from IPFS.
 *
 * @param snapId - The snap ID.
 */
async function handleClear(snapId: string): Promise<void> {
  await PinataIPFSService.instance.delete(snapId);
}
