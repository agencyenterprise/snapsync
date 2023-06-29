import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text } from '@metamask/snaps-ui';
import { clearState, getState, saveState } from './storage';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  switch (request.method) {
    case 'saveState':
      return saveState(request.params).then(() => {
        return snap.request({
          method: 'snap_dialog',
          params: {
            type: 'alert',
            content: panel([
              text(`Saving state: **${JSON.stringify(request.params)}**`),
            ]),
          },
        });
      });
    case 'getState':
      return getState().then((state) => {
        return snap.request({
          method: 'snap_dialog',
          params: {
            type: 'alert',
            content: panel([text(`State: **${JSON.stringify(state)}**`)]),
          },
        });
      });

    case 'clearState':
      return clearState().then(() => {
        return snap.request({
          method: 'snap_dialog',
          params: {
            type: 'alert',
            content: panel([text(`State cleared.`)]),
          },
        });
      });

    case 'shareStateWithSync': {
      const state = await getState();
      return {
        state,
      };
    }

    default:
      throw new Error('Method not found.');
  }
};
