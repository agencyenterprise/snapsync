// Origin of the app used to install and manage the snap dapp, running on port :8000 on development
// const DAPP_SNAP_ORIGIN = ['http://localhost:8000'];
const DAPP_SNAP_ORIGIN = [
  'https://metamask-ipfs-state-poc-site.vercel.app/',
  'https://metamask-ipfs-state-poc-site.vercel.app',
];

/**
 * Helper function to check if the origin is the snap dapp.
 *
 * @param origin - The origin to check
 * @returns Whether the origin is the snap dapp
 */
export function isSnapDapp(origin: string): boolean {
  return DAPP_SNAP_ORIGIN.includes(origin);
}