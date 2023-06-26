import { OnRpcRequestHandler } from '@metamask/snaps-types';
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

    default:
      throw new Error('Method not found.');
  }
};
