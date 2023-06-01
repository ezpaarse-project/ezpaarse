# How to use

## Run the server

ezPAARSE launches from the command line.

Use the following commands from the installation directory to start and stop the server:

### Without Docker

```bash
make start   # start the server
make stop    # stop the server
make restart # restart the server
make status  # check the server status
```

### With Docker and Compose

```bash
docker compose up -d   # start the server
docker compose stop    # stop the server
docker compose restart # restart the server
docker compose ps      # check the server status
```

**NB**: for docker-compose version 1, replace `docker compose` by `docker-compose`.

## Let's Parse !

Visit [http://localhost:59599/](http://localhost:59599/) and create the first administrator of your local ezPAARSE instance. Administrators can manage the registered users and trigger updates from the web interface.

Once logged in, try drag-and-dropping a log file on the online form and processing it. If your logs are standard, you should be able to get a result immediately and see what ezPAARSE can produce for you.

Now you're up and ready to use ezPAARSE. Head onto the next section to learn about the basics.
