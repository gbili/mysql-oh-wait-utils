#!/usr/bin/env node
import 'dotenv/config';
import { readFileSync, existsSync } from 'fs';
import Logger from 'saylo';
import DiContainer from 'di-why';
import mysql from 'mysql';
import { MysqlReq, MysqlDump } from 'mysql-oh-wait';
import { getUserRootDirOrThrow } from 'swiss-army-knifey'

const udir = getUserRootDirOrThrow();

const schemaFilePath = `${udir}/src/data/schema.sql`;

const logger = new Logger({log: true, debug: true});

  const envVarNames = {
    host: 'DB_HOST',
    user: 'DB_USER',
    password: 'DB_PASSWORD',
    database: 'DB_NAME',
  };
  const di = new DiContainer({
    load: {
      'mysqlReq': {
        constructible: MysqlReq,
        deps: {
          adapter: mysql,
          logger,
          connectionConfig: {
            ...MysqlReq.extractConfigFromEnv(process.env, envVarNames),
            multipleStatements: true,
          },
        },
        async after({me, serviceLocator}) {
          await me.connect();
        },
      },

      'mysqlDump': {
        injectable: new MysqlDump(),
        deps: {
          logger,
          readFileSync,
          existsSync
        },
        locateDeps: {
          requestor: 'mysqlReq'
        },
      },
    },
  });

  (async function () {
    await di.loadAll();
    await (await di.get('mysqlDump')).executeSqlFileOnExistingConnection({filePath: schemaFilePath, disconnectOnFinish: true});
  })();
