import { OnRpcRequestHandler } from '@metamask/snaps-types';

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
