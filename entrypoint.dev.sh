#!/bin/sh
# Only needed in Node16, in dev mode
# Creating user and home for pm2 and volumes permissions

# Creating user with the same id as the one owning volume
useradd -u "${EZP_USERID:=1001}" ezpaarse

# Creating home for pm2
mkdir -p /home/ezpaarse
chown -R ezpaarse:ezpaarse /home/ezpaarse

# Running ezpaarse in dev
su -c "npm run build && npm run pm2:dev" ezpaarse