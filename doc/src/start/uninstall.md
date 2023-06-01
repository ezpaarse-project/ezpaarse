# Uninstall

## Without Docker

Stop the server:
```bash
make stop
```

Delete the database:
```bash
mongo ezpaarse
db.dropDatabase()
```

Remove the ezpaarse folder:
```bash
rm -rf ezpaarse
```

## With Docker and Compose

Stop and remove containers:
```bash
docker compose down -v
```

Remove the ezpaarse folder:
```bash
rm -rf ezpaarse
```
