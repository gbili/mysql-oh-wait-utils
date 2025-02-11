import mysql from 'mysql';
import { MysqlReq } from 'mysql-oh-wait';
import { LoadDictElement, GetInstanceType } from 'di-why/build/src/DiContainer';
import { sleep } from 'swiss-army-knifey';

const loadDictElement: LoadDictElement<GetInstanceType<typeof MysqlReq>> = {
  before: async function ({ serviceLocator, deps }) {
    const env = await serviceLocator.get('env');
    return {
      ...deps,
      ...(serviceLocator.couldLoad('mysqlReqLogger') ? { logger: await serviceLocator.get('mysqlReqLogger')} : {}),
      connectionConfig: {
        multipleStatements: false,
        ...MysqlReq.extractConfigFromEnv(env),
      },
    };
  },
  constructible: MysqlReq,
  deps: {
    adapter: mysql,
  },
  locateDeps: {
    logger: 'logger',
  },
  after: async ({ me, deps }) => {
    const logger: { log: (...args: any[]) => void; } = deps.logger;
    let actionResult;
    const secondsBetweenReconnections = 5;
    let secondsUntilReconnect = 0;
    while (actionResult === undefined || actionResult.value === null) {
      if (secondsUntilReconnect > 0) {
        logger.log("Will try again in", secondsUntilReconnect, 'seconds');
        await sleep(1000);
        secondsUntilReconnect -= 1;
        continue;
      }
      logger.log("Will attemp to connect");
      actionResult = await me.connect();
      if (actionResult.error) {
        logger.log("Problem connecting: ", actionResult.error);
        secondsUntilReconnect = secondsBetweenReconnections;
      }
    }
  },
};
export default loadDictElement;
