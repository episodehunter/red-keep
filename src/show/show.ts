import { EpisodeDefinition, EpisodeResolver } from './episode'

export const ShowDefinition = `
  enum WeekDay {
    Monday
    Tuesday
    Wednesday
    Thursday
    Friday
    Saturday
    Sunday
  }

  enum ShowStatus {
    Ended
    Continuing
  }

  type Show {
    id: ID!,
    tvdbId: Int!,
    imdbId: String,
    name: String!,
    airsDayOfWeek: WeekDay,
    airsTime: String,
    firstAired: String,
    genre: [String],
    language: String,
    network: String,
    overview: String,
    runtime: Int,
    status: ShowStatus,
    fanart: String,
    poster: String,
    lastupdate: Int,
    episodes: [Episode]
  }
`

export const ShowResolver = {
  RootQuery: {
    show: (obj: { id: number }, args: any, context: any) => {
      console.log('show obj', obj)
      console.log('show args', args)
      console.log('show context', context)
      return {
        id: 2,
        tvdbId: 76290,
        imdbId: 'tt0285331',
        name: '24',
        airsDayOfWeek: 'Monday',
        airsTime: '9:00 PM',
        firstAired: '2012-01-16',
        genre: ['action'],
        language: 'en',
        network: 'AMC',
        overview: 'Some story',
        runtime: 60,
        status: 'Ended',
        fanart: 'fanart.jpg',
        poster: 'poster.jpg',
        lastupdate: 1000000
      }
    }
  },
  Show: {
    episodes: EpisodeResolver.episodes
  }
}

export const ShowDefinitions = [ShowDefinition, EpisodeDefinition]
