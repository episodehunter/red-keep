import { config } from './config'

if (!config.inDevelopMode) {
  const Engine = require('apollo-engine')
  const engine = new Engine({
    engineConfig: {
      apiKey: process.env.APOLLO_ENGINE_API_KEY
    }
  })
  engine.start()
}
