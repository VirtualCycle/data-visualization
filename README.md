A project to visualize data using D3.js

In order to install redis follow these steps:
```
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
```

Install redis server and run it:

```
sudo apt-get install redis-server

redis-server
```
Check if redis is up and running:

```
redis-cli ping
```
it should reply with PONG

Recommended node version: 6.9.1 LTS

clone this repo and cd into it

install all the dependencies

```
npm install
```

To import all the data to redis, run

```
npm run import
```

Then start the server by running 
```
npm start
```

In your browser, go to localhost:3000 to view the project





