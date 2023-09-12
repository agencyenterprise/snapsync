import { OnRpcRequestHandler } from '@metamask/snaps-types';

import { divider, heading, panel, text, copyable } from '@metamask/snaps-ui';
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
    case 'get_api_key': {
      verifyIsSnapDapp(origin);
      const providerGet = (request.params as { provider: 'infura' | 'pinata' })
        .provider;
      return handleGetAPIKey(providerGet);
    }

    case 'get_api_keys': {
      verifyIsSnapDapp(origin);
      return handleGetAPIKeys();
    }

    case 'save_api_key': {
      verifyIsSnapDapp(origin);
      const { apiKey, provider: providerSave } = request.params as {
        apiKey: string;
        provider: 'infura' | 'pinata';
      };
      return handleSaveAPIKey(providerSave, apiKey);
    }

    case 'has_api_key': {
      const providerHas = (request.params as { provider: 'infura' | 'pinata' })
        .provider;
      return Boolean((await getState()).apiKeys?.[providerHas]);
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
 * Returns a provider key from managed state.
 *
 * @param provider - the provider to get the key for.
 * @returns found key or empty if not found.
 */
async function handleGetAPIKey(provider: 'infura' | 'pinata'): Promise<string> {
  const state = await getState();
  return state.apiKeys?.[provider] || '';
}

/**
 * Save the provider key to managed state.
 *
 * @param provider - the provider to get the key for.
 * @param apiKey - The key to save.
 */
async function handleSaveAPIKey(
  provider: 'infura' | 'pinata',
  apiKey: string,
): Promise<void> {
  const state = await getState();
  const apiKeys = { ...state.apiKeys, [provider]: apiKey };
  await saveState({ apiKeys });
}

/**
 * Prompt the user to save the pinata key.
 */
async function dialogSaveAPIKey(): Promise<void> {
  const provider = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'prompt',
      content: panel([
        heading('Select your IPFS provider to use SnapSync.'),
        divider(),
        copyable('Pinata'),
        copyable('Infura'),
        text('Type or paste in the provider name.'),
      ]),
    },
  });

  const validProviders: { [key: string]: string } = {
    pinata: 'Enter your pinata JWT',
    infura: 'Enter your Infura API key in the format API_KEY:API_SECRET',
  };

  if (typeof provider === 'string') {
    const lowerProvider = provider.toLowerCase();

    if (validProviders[lowerProvider]) {
      const ipfsKey = await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'prompt',
          content: panel([
            heading(validProviders[lowerProvider]),
            text('Enter your key below:'),
          ]),
        },
      });

      if (ipfsKey && typeof ipfsKey === 'string') {
        return await handleSaveAPIKey(
          lowerProvider as 'infura' | 'pinata',
          ipfsKey.trim(),
        );
      }
    }
  }

  throw new Error('No input provided.');
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
  await PinataIPFSService.instance.set(encodedId, snapState);
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
