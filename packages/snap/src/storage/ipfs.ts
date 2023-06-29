import { PinataIPFSService } from '../ipfs/services/Pinata';

/**
 * Uploads the encrypted data to IPFS.
 *
 * @param encryptedData - The encrypted data to upload.
 */
export async function uploadToIPFSStorage(
  encryptedData: string,
): Promise<string> {
  const ipfsClient = new PinataIPFSService();
  const cid = await ipfsClient.put(encryptedData);
  return cid;
}

/**
 * Downloads the encrypted data from IPFS.
 *
 * @param cid - The CID of the data to download.
 * @returns The encrypted data.
 * @throws If the data cannot be downloaded.
 */
export async function downloadFromIPFSStorage(cid: string): Promise<string> {
  const ipfsClient = new PinataIPFSService();
  const data = await ipfsClient.get(cid);
  return data;
}

/**
 * Updates the encrypted data on IPFS.
 *
 * @param cid - The CID of the data to update.
 * @param data - The new data.
 * @returns The new CID.
 * @throws If the data cannot be updated.
 */
export async function updateIPFSStorage(
  cid: string,
  data: string,
): Promise<string> {
  const ipfsClient = new PinataIPFSService();
  return await ipfsClient.update(cid, data);
}
