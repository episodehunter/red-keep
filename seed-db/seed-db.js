const fs = require('fs')
const path = require('path')
const util = require('util')
const mysql = require('mysql')

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'user',
  password: '123',
  database: 'episodehunter',
  multipleStatements: true
})

const readdir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)
const query = util.promisify(connection.query.bind(connection))

function readAndRunSql(fileName) {
  console.log('Running ' + fileName)
  return readFile(path.join(__dirname, fileName), 'utf-8')
    .then(sql => query(sql))
    .then(ongoing => Promise.all(ongoing))
}

async function seed() {
  const sqlFiles = await readdir(__dirname).then(files =>
    files.filter(fileName => fileName.endsWith('.sql'))
  )

  try {
    for (const fileName of sqlFiles) {
      await readAndRunSql(fileName)
    }
  } catch (error) {
    console.error(error)
  } finally {
    connection.end()
  }
}

seed()
