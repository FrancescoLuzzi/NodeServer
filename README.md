# Description

Simple node.js server that offers an API to connect to a mariadb DB.

To connect to the DB this script needs a .env file in which all required variables are:

```console
MARIADB_IP=xxx.xxx.xxx.xxx
MARIADB_USER=USER
MARIADB_PASSWORD=PASSWD
MARIADB_DB=DB_NAME
```

You can also configure a different port to serve this app.

```console
PORT=8000
```
