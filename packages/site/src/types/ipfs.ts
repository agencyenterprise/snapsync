export type IPFS = {
  id: string;
  ipfs_pin_hash: string;
  size: string;
  date_pinned: Date;
  metadata: {
    name: string;
  };
};
