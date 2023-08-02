import { OnRpcRequestHandler } from '@metamask/snaps-types';

import { getState, saveState } from './storage/local';
import { stringToHex } from './utils/string';
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
    case 'get_api_key':
      // verifyIsSnapDapp(origin);
      return handleGetAPIKey();

    case 'save_api_key':
      // verifyIsSnapDapp(origin);
      return handleSaveAPIKey((request.params as { apiKey: string }).apiKey);

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
 * Returns the pinata key from managed state.
 *
 * @returns found key or empty if not found.
 */
async function handleGetAPIKey(): Promise<{ apiKey: string }> {
  const state = await getState();
  return { apiKey: state?.apiKey || '' };
}

/**
 * Save the pinata key to managed state.
 *
 * @param apiKey - The pinata key to save.
 */
async function handleSaveAPIKey(apiKey: string): Promise<void> {
  const state = await getState();
  await saveState({ ...state, apiKey });
}

/**
 * Get snap state from IPFS.
 *
 * @param snapId - The snap ID.
 */
async function handleGet(snapId: string): Promise<unknown> {
  const encodedId = stringToHex(snapId);
  return await PinataIPFSService.instance.get(encodedId);
}

/**
 * Save snap state to IPFS.
 *
 * @param snapId - The snap ID.
 * @param snapState - The snap state.
 */
async function handleSave(snapId: string, snapState: unknown): Promise<void> {
  const encodedId = stringToHex(snapId);
  await PinataIPFSService.instance.set(encodedId, {
    ...snapState,
    snapId,
    encodedId,
  });
}

/**
 * Clear snap state from IPFS.
 *
 * @param snapId - The snap ID.
 */
async function handleClear(snapId: string): Promise<void> {
  const encodedId = stringToHex(snapId);
  await PinataIPFSService.instance.delete(encodedId);
}
