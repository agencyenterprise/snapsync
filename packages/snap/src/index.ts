import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { getState, saveState } from './storage/local';

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
    // TODO Verify that the snap is the one that invoked the request. Others snaps should not be able to invoke this snap's methods.
    case 'get_api_key':
      return handleGetAPIKey();
    case 'save_api_key':
      return handleSaveAPIKey((request.params as { apiKey: string }).apiKey);

    // case 'uploadToIPFS':
    //   return uploadToIPFSStorage(request.params[0] as string).then(
    //     (cid: string) => {
    //       return snap.request({
    //         method: 'snap_dialog',
    //         params: {
    //           type: 'alert',
    //           content: panel([text(`Uploaded! CID: **${cid}**`)]),
    //         },
    //       });
    //     },
    //   );
    // case 'downloadFromIPFS':
    //   return downloadFromIPFSStorage(request.params[0] as string).then(
    //     (data: string) => {
    //       return snap.request({
    //         method: 'snap_dialog',
    //         params: {
    //           type: 'alert',
    //           content: panel([text(`Downloading from IPFS: **${data}**`)]),
    //         },
    //       });
    //     },
    //   );

    // case 'updateIPFS': {
    //   return updateIPFSStorage(
    //     request.params[0] as unknown as string,
    //     request.params[1] as unknown as string,
    //   ).then((cid: string) => {
    //     return snap.request({
    //       method: 'snap_dialog',
    //       params: {
    //         type: 'alert',
    //         content: panel([text(`${cid} Updated!`)]),
    //       },
    //     });
    //   });
    // }

    // case 'listIPFS':
    //   return listIPFSStorage();

    default:
      throw new Error('Method not found.');
  }
};

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
