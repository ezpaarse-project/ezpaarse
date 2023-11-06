# MongoDB connection issues

## Cannot connect to `mongodb://localhost:27017/ezpaarse`

On fresh installs, you may encounter an issue when running `make` :

```bash
MongoDB
  ✖ Cannot connect to mongodb://localhost:27017/ezpaarse
```

If you're sure that your instance MongoDB is running and ready (`systemctl` and `mongosh` can help to check that), it may come from the fact that the DNS has both `IPv4` and `IPv6` records for `localhost`, so the Nodejs driver tries to connect using `IPv6`. However, MongoDB does not listen to `IPv6` by default, so the connection fails.

### Solution A: Force ezPAARSE to use `IPv4`

Force ezPAARSE to use IPv4 by creating a `config.local.json` file and replacing `localhost` by `127.0.0.1`  in the MongoDB URL.
```json
{
  "EZPAARSE_MONGO_URL": "mongodb://127.0.0.1:27017/ezpaarse"
}
```

### Solution B: Allow MongoDB to listen for `IPv6`

Edit the MongoDB configuration to make it listen to IPv6. In `/etc/mongod.conf`:

```yaml
net:
  port: 27017
  bindIp: 127.0.0.1,::1
  ipv6: true
```