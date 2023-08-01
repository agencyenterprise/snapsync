// Origin of the app used to install and manage the snap dapp, running on port :8000 on development
const DAPP_SNAP_ORIGIN = process.env.SNAP_ORIGIN || 'http://localhost:8000';

/**
 * Helper function to check if the origin is the snap dapp.
 *
 * @param origin - The origin to check
 * @returns Whether the origin is the snap dapp
 */
export function isSnapDapp(origin: string): boolean {
  return origin === DAPP_SNAP_ORIGIN;
}
