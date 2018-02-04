import { create } from 'chain-spy'
import { ShowResolver } from '../show.resolver'

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
    ended: 'Ended',
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
