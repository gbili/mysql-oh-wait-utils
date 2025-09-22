import { LoadDict } from 'di-why/build/src/DiContainer';
import mysqlReq from './mysqlReq';
import mysqlMultipleReq from './mysqlMultipleReq';

/**
 * Pre-typed LoadDict containing MySQL loaders.
 * This avoids TypeScript union type issues when importing from external packages.
 */
export const mysqlReqLoadDict: LoadDict = {
  mysqlReq,
  mysqlMultipleReq,
};

export default mysqlReqLoadDict;