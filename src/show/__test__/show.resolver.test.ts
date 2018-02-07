import { create } from 'chain-spy'
import { spy } from 'simple-spy'
import { ShowResolver, mutateShow } from '../show.resolver'

test('Resolve a show', async () => {
  // Arrange
  const dbShow = {
    id: 5,
    tvdb_id: 2,
    imdb_id: 'tt12345',
    name: 'Dexter',
    airs_dayOfWeek: 'Monday',
    airs_time: '09:00 PM',
    first_aired: '2016-03-15',
    genre: 'Drama|Action',
    language: 'en',
    network: 'AMC',
    overview: 'Something, somthing',
    runtime: '60',
    status: 'Ended',
    fanart: 'fanart.jpg',
    poster: 'poster.jpg',
    lastupdate: 1234567891
  }
  const dbProxy = create({ where: () => dbShow })
  const args = { id: 5 }

  // Act
  const result = await ShowResolver.RootQuery.show(undefined, args, { db: dbProxy })

  // Assert
  expect(result).toMatchSnapshot()
  expect(dbProxy.__execution_log__).toMatchSnapshot()
})

test('Resolve null', async () => {
  // Arrange
  const dbShow = null
  const dbProxy = create({ where: () => dbShow })
  const args = { id: 5 }

  // Act
  const result = await ShowResolver.RootQuery.show(undefined, args, { db: dbProxy })

  // Assert
  expect(result).toBe(null)
})

test('Mutate a show', async () => {
  // Arrange
  const show = {
    id: 5,
    tvdbId: 2,
    imdbId: 'tt12345',
    name: 'Dexter',
    airsDayOfWeek: 'Monday',
    airsTime: '09:00 PM',
    firstAired: '2016-03-15',
    genre: ['Drama', 'Action'],
    language: 'en',
    network: 'AMC',
    overview: 'Something, somthing',
    runtime: 60,
    ended: false,
    fanart: 'fanart.jpg',
    poster: 'poster.jpg',
    lastupdate: 1234567891,
    episodes: [
      {
        id: 1,
        name: 'new episode name'
      }
    ]
  }
  const resolveShow = (obj, args, context) => Promise.resolve(args)
  const episodesUpdate = spy(() => Promise.resolve(1))
  const db = create({ where: () => Promise.resolve(undefined) })

  // Act
  const result = await mutateShow(
    undefined,
    { show } as any,
    { db },
    resolveShow as any,
    episodesUpdate as any
  )

  // Assert
  expect(result).toMatchSnapshot()
  expect(db.__execution_log__).toMatchSnapshot()
  expect(episodesUpdate.callCount).toBe(1)
  expect(episodesUpdate.args[0][0]).toBe(show.episodes)
})
