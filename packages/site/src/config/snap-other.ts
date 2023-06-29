/**
 * The snap origin to use.
 * Will default to the local hosted snap if no value is provided in environment.
 */
export const defaultOtherSnapOrigin =
  process.env.SNAP_ORIGIN ?? `local:http://localhost:9090`;
