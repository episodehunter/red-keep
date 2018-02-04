# Red keep [![Build Status](https://travis-ci.org/episodehunter/red-keep.svg?branch=master)](https://travis-ci.org/episodehunter/red-keep) [![Coverage Status](https://coveralls.io/repos/github/episodehunter/red-keep/badge.svg?branch=master)](https://coveralls.io/github/episodehunter/red-keep?branch=master)

> GraphQL interface for episodehunters database


## Requirements

- [Docker](https://docs.docker.com/install/#supported-platforms)
- [nodejs](https://nodejs.org/en/)

## Getting started

> (you only need to follow these steps once)

### Install dependencies

```bash
npm install
```

### Start a local mysql server

```bash
docker run --name episodehunter-db \
  -e MYSQL_ROOT_PASSWORD=rootpass \
  -e MYSQL_DATABASE=episodehunter \
  -e MYSQL_USER=user \
  -e MYSQL_PASSWORD=123 \
  -p 3306:3306 \
  -d mysql:latest
```

### Reset and seed the database

```bash
node seed-db/seed-db.js
```

## Run the application

```bash
npm run compile
npm start
```

Visit `http://localhost:4000/graphiql`

## Run the tests

```bash
npm test
```

## License

MIT
