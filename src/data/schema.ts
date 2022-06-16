import { MysqlDump } from 'mysql-oh-wait';
import { GetInstanceType } from 'di-why/build/src/DiContainer';
import { getUserRootDirOrThrow } from 'swiss-army-knifey'

import Logger from 'saylo';
const logger = new Logger({log: true, debug: true});
const udir = getUserRootDirOrThrow();

const schemaFilePath = `${udir}/src/data/schema.sql`;

const undumpSchema = async function (mysqlDump: GetInstanceType<typeof MysqlDump>) {
  (logger as any).log('Undumping Schema', schemaFilePath);
  await mysqlDump.executeSqlFile({filePath: schemaFilePath, disconnectOnFinish: true});
};

export { undumpSchema, schemaFilePath };
export default schemaFilePath;