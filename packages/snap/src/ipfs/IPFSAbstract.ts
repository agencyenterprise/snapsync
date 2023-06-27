export abstract class IPFSAbstract {
  abstract put(data: string): Promise<string>;

  abstract get(hash: string): Promise<string>;
}
