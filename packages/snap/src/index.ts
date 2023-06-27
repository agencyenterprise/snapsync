import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';
import { decryptData, encryptData } from './encryption';
import { getState, saveState } from './storage';
import { clearLocalState } from './storage/local';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @param args._origin
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  switch (request.method) {
    case 'saveState':
      return saveState(request.params);

    case 'getState':
      return getState();

    case 'clearState':
      return clearLocalState();

    case 'encrypt':
      return encryptData(request.params).then((encrypted) => {
        return snap.request({
          method: 'snap_dialog',
          params: {
            type: 'alert',
            content: panel([
              text(`Encrypting message: **${JSON.stringify(request.params)}**`),
              text(`Encrypted message: **${encrypted}**`),
            ]),
          },
        });
      });
    case 'decrypt':
      const [encrypted] = request.params;
      return decryptData(encrypted).then((decrypted) => {
        return snap.request({
          method: 'snap_dialog',
          params: {
            type: 'alert',
            content: panel([
              text(`Decrypting message: **${encrypted}**`),
              text(`Decrypted message: **${decrypted}**`),
            ]),
          },
        });
      });

    default:
      throw new Error('Method not found.');
  }
};
