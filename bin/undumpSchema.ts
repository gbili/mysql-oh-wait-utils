#!/usr/bin/env node
import 'dotenv/config';
import { readFileSync, existsSync } from 'fs';
import DiContainer from 'di-why';
import mysql from 'mysql';
import { MysqlReq, MysqlDump } from 'mysql-oh-wait';
import { getUserRootDirOrThrow } from 'swiss-army-knifey/build/src/node'
import { logger } from 'swiss-army-knifey';

const udir = getUserRootDirOrThrow();

const schemaFilePath = `${udir}/src/data/schema.sql`;

const envVarNames = {
  host: 'DB_HOST',
  user: 'DB_USER',
  password: 'DB_PASSWORD',
  database: 'DB_NAME',
};
const di = new DiContainer({
  load: {
    'logger': {
      instance: logger,
    },
    'mysqlReq': {
      constructible: MysqlReq,
      deps: {
        adapter: mysql,
        connectionConfig: {
          ...MysqlReq.extractConfigFromEnv(process.env, envVarNames),
          multipleStatements: true,
        },
      },
      locateDeps: {
        logger: 'logger',
      },
      async after({me, serviceLocator}) {
        await me.connect();
      },
    },

    'mysqlDump': {
      injectable: new MysqlDump(),
      deps: {
        readFileSync,
        existsSync
      },
      locateDeps: {
        requestor: 'mysqlReq',
        logger: 'logger',
      },
    },
  },
});

(async function () {
  await di.loadAll();
  await (await di.get('mysqlDump')).executeSqlFileOnExistingConnection({filePath: schemaFilePath, disconnectOnFinish: true});
})();
