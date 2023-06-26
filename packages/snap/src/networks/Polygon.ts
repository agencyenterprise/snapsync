import { BIP44Node, getBIP44AddressKeyDeriver } from '@metamask/key-tree';

import { CoinType } from '../types/enum/CoinType';
import NetworkAbstract from './NetworkAbstract';

export default class Polygon implements NetworkAbstract {
  async derivateAccount(): Promise<BIP44Node> {
    const polygonNode = await snap.request({
      method: NetworkAbstract.BIP_44_ESPECIFICATION,
      params: { coinType: CoinType.POLYGON_COIN_TYPE },
    });

    const derivePolygonAddress = await getBIP44AddressKeyDeriver(polygonNode);
    return derivePolygonAddress(1);
  }
}
