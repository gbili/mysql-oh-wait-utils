# Mysql-oh-wait-utils

Load your schema without coding any loading logic.

## `db-undump` bin

### Usage

Make sure to have schema.sql file in `my-project/src/data/schema.sql` (see example below).
Also make sure to have the proper `.env` variables:

```env
DB_HOST=localhost
DB_USER=some_username
DB_PASSWORD=users_password
DB_NAME=my_dbname
```

Finally execute the binary:

```sh
npx db-undump
```

Done! Have a look at your database, and it should have the new schema.

### Example `schema.sql` file

```sql
SET foreign_key_checks = 0;
DROP TABLE IF EXISTS `User`;
CREATE TABLE IF NOT EXISTS `User` (
  `UUID` varchar(255) NOT NULL,
  `username` varchar(30) NOT NULL UNIQUE,
  `email` varchar(200) NOT NULL UNIQUE,
  `cryptedPassword` varchar(255) NOT NULL,
  `isLoginAllowed` boolean NOT NULL DEFAULT 0,
  PRIMARY KEY (`UUID`),
  UNIQUE(`username`),
  UNIQUE(`email`)
);

DROP TABLE IF EXISTS `User_Meta`;
CREATE TABLE IF NOT EXISTS `User_Meta` (
  `userUUID` varchar(255) NOT NULL,
  PRIMARY KEY (`userUUID`),
  FOREIGN KEY (`userUUID`)
    REFERENCES `User` (`UUID`)
    ON DELETE CASCADE
);
```

## MysqlReq loader for `di-why`

From your usual `src/loaders/index.ts` you can import `MysqlReq`'s generic loader:

```ts
import { mysqlReqLoader } from 'mysql-oh-wait-utils';

const loadDict = {
  mysqlReq: mysqlReqLoader,
};

// logger can come from somwhere else
const logger = new Logger({log: true, debug: true});

const di = new DiContainer({ logger, load: injectionDict });

export default di;
```