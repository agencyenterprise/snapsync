export abstract class IPFSAbstract {
  /**
   * Save data to IPFS
   *
   * @param data - data to save
   */
  abstract put(data: string): Promise<string>;

  /**
   * Get data from IPFS
   *
   * @param hash - hash of data to get
   * @returns data
   * @throws if data not found
   */
  abstract get(hash: string): Promise<string>;

  /**
   * Update data on IPFS
   *
   * @param hash - hash of data to update
   * @param data - new data
   * @returns new hash
   * @throws if data not found
   */
  abstract update(hash: string, data: string): Promise<string>;
}
