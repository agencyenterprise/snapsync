import { BIP44Node } from '@metamask/key-tree';

abstract class NetworkAbstract {
  public static readonly BIP_44_ESPECIFICATION = 'snap_getBip44Entropy';

  public static readonly BIP_32_ESPECIFICATION = 'snap_getBip32Entropy';

  abstract derivateAccount(): Promise<BIP44Node>;
}

export default NetworkAbstract;
