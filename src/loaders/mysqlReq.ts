import { MysqlReq } from 'mysql-oh-wait';
import { LoadDictElement, GetInstanceType } from 'di-why/build/src/DiContainer';

const loadDictElement: LoadDictElement<GetInstanceType<typeof MysqlReq>> = {
  before: async function ({ serviceLocator, deps }) {
    const env = await serviceLocator.get('env');
    return {
      ...deps,
      ...(serviceLocator.couldLoad('mysqlReqLogger') ? { logger: await serviceLocator.get('mysqlReqLogger')} : {}),
      connectionConfig: {
        multipleStatements: false,
        ...extractConfigFromEnv(env),
      },
    };
  },
  constructible: MysqlReq,
  locateDeps: {
    logger: 'logger',
  },
};
export default loadDictElement;
function extractConfigFromEnv(env: any): any {
  throw new Error('Function not implemented.');
}

