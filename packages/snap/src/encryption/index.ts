import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';
import { Json } from '@metamask/snaps-types';
import { decrypt, encrypt } from 'eciesjs';

/**
 * Get the private key for the second account in the MetaMask wallet.
 *
 * @returns The private key for the second account in the MetaMask wallet.
 * @throws If the private key is not found.
 */
export async function getPrivateKey() {
  const dogecoinNode = await snap.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: 3,
    },
  });
  const deriveDogecoinAddress = await getBIP44AddressKeyDeriver(dogecoinNode);
  const secondAccount = await deriveDogecoinAddress(1);
  const { privateKey } = secondAccount;
  if (!privateKey) {
    throw new Error('Private key not found');
  }
  return privateKey;
}

/**
 * Get the public key for the second account in the MetaMask wallet.
 *
 * @returns The public key for the second account in the MetaMask wallet.
 */
export async function getPublicKey() {
  const dogecoinNode = await snap.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: 3,
    },
  });
  const deriveDogecoinAddress = await getBIP44AddressKeyDeriver(dogecoinNode);
  const secondAccount = await deriveDogecoinAddress(1);
  const { publicKey } = secondAccount;
  return publicKey;
}

/**
 * Decrypt data using the private key.
 *
 * @param data - The data to decrypt.
 * @returns The decrypted data.
 */
export async function decryptData(
  data: string,
): Promise<Json[] | Record<string, Json>> {
  const privateKey = await getPrivateKey();
  const decryptedData = decrypt(privateKey, Buffer.from(data, 'hex'));
  return JSON.parse(decryptedData.toString('utf8'));
}

/**
 * Encrypt data using the public key.
 *
 * @param data - The data to encrypt.
 * @returns The encrypted data.
 */
export async function encryptData(data: Json[] | Record<string, Json>) {
  const publicKey = await getPublicKey();
  const encryptedData = encrypt(publicKey, Buffer.from(JSON.stringify(data)));
  return encryptedData.toString('hex');
}
