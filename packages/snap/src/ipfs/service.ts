import { getState } from '../storage/local';
import { config } from './config';

type PinListResponse = {
  count: number;
  rows: { ipfs_pin_hash: string }[];
};

// TODO Handle rate limiting errors
export class PinataIPFSService {
  private static _instance: PinataIPFSService;

  private _token = '';

  static get instance() {
    return this._instance || (this._instance = new this());
  }

  private get token(): Promise<string> {
    if (this._token) {
      return Promise.resolve(this._token);
    }

    return this.loadToken().then(() => this._token);
  }

  private async loadToken() {
    if (this._token) {
      return;
    }

    const localState = await getState();
    if (localState?.apiKey) {
      this._token = localState.apiKey;
    }
  }

  /**
   * Get the hash of a snap state by its metadata.
   *
   * @param snapId - The id of the snap.
   * @returns The hash of the snap state, or null if not found.
   */
  private async getHash(snapId: string): Promise<string | null> {
    const url = `${config.url}/data/pinList?status=pinned&metadata[name]=snap-${snapId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await this.token}`,
      },
    });

    const data = (await response.json()) as PinListResponse;
    if (!response.ok || data.rows.length === 0) {
      return null;
    }

    return data.rows[0].ipfs_pin_hash;
  }

  /**
   * Get the state of a snap by its id.
   *
   * @param snapId - The id of the snap.
   * @returns The state of the snap, or null if not found.
   */
  async get(snapId: string): Promise<unknown | null> {
    const hash = await this.getHash(snapId);
    if (!hash) {
      return null;
    }

    const url = `${config.gatewayUrl}/ipfs/${hash}`;
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  }

  /**
   * Delete a snap state by its hash ID.
   *
   * @param hash - The hash of the snap state.
   */
  private async deleteHash(hash: string): Promise<void> {
    const response = await fetch(`${config.url}/pinning/unpin/${hash}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await this.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete hash.');
    }
  }

  /**
   * Delete a snap by its ID.
   *
   * @param snapId - The ID of the snap.
   */
  async delete(snapId: string): Promise<void> {
    const hash = await this.getHash(snapId);
    if (!hash) {
      return;
    }

    await this.deleteHash(hash);
  }

  /**
   * Set the state of a snap.
   *
   * @param snapId - The ID of the snap.
   * @param data - The state of the snap.
   */
  async set(snapId: string, data: unknown): Promise<void> {
    // Get current hash to delete in the end when succeeds
    const currentHash = await this.getHash(snapId);

    // Save new state
    const response = await fetch(`${config.url}/pinning/pinJSONToIPFS`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await this.token}`,
      },
      body: JSON.stringify({
        pinataContent: data,
        pinataMetadata: { name: `snap-${snapId}` },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to upload file.');
    }

    // Delete old state
    if (currentHash) {
      await this.deleteHash(currentHash);
    }
  }
}
