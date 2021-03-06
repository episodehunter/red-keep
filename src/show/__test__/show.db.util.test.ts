import { create } from 'chain-spy'
import {
  assertShowExist,
  assertShowNotExist,
  updateShow,
  findShow,
  addShow,
  filterOutNonExistingShows
} from '../show.db.util'

describe('Assert show exist', () => {
  test('Return show id', async () => {
    // Arrange
    const show = {
      tvdbId: 5
    }
    const dbRow = { id: 2 }
    const db = create({ where: () => Promise.resolve(dbRow) })

    // Act
    const result = await assertShowExist(db, show)

    // Assert
    expect(result).toBe(2)
  })

  test('Reject if not exist', () => {
    // Arrange
    const show = {
      tvdbId: 5
    }
    const dbRow = null
    const db = create({ where: () => Promise.resolve(dbRow) })

    // Act and assert
    return expect(assertShowExist(db, show)).rejects.toEqual(expect.any(Error))
  })

  test('Make same request every time', async () => {
    // Arrange
    const show = {
      tvdbId: 5
    }
    const dbRow = { id: 2 }
    const db = create({ where: () => Promise.resolve(dbRow) })

    // Act
    await assertShowExist(db, show)

    expect(db.__execution_log__).toMatchSnapshot()
  })
})

describe('Assert show not exist', () => {
  test('Return null', async () => {
    // Arrange
    const show = {
      tvdbId: 5
    }
    const dbRow = null
    const db = create({ where: () => Promise.resolve(dbRow) })

    // Act
    const result = await assertShowNotExist(db, show)

    // Assert
    expect(result).toBe(null)
  })

  test('Reject if exist', () => {
    // Arrange
    const show = {
      tvdbId: 5
    }
    const dbRow = { id: 2 }
    const db = create({ where: () => Promise.resolve(dbRow) })

    // Act and assert
    return expect(assertShowNotExist(db, show)).rejects.toEqual(expect.any(Error))
  })

  test('Make same request every time', async () => {
    // Arrange
    const show = {
      tvdbId: 5
    }
    const dbRow = null
    const db = create({ where: () => Promise.resolve(dbRow) })

    // Act
    await assertShowNotExist(db, show)

    expect(db.__execution_log__).toMatchSnapshot()
  })
})

test('Update show', async () => {
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
    lastupdate: 1234567891
  }
  const db = create({ where: (key, value) => Promise.resolve(value) })

  // Act
  const result = await updateShow(db, 5, show)

  // Assert
  expect(result).toBe(5)
  expect(db.__execution_log__).toMatchSnapshot()
})

describe('Add show', () => {
  test('Throw if trying to set id', () => {
    // Arrange
    const show = {
      id: 5
    }

    // Act and Assert
    expect(() => addShow(null, show as any)).toThrow('Can not set id for insert!')
  })

  test('tvdbId is required', () => {
    // Arrange
    const show = {
      tvdbId: undefined
    }

    // Act and Assert
    expect(() => addShow(null, show as any)).toThrow('tvdbId is required!')
  })
})

describe('Find show', () => {
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
    const db = create({ where: () => dbShow })

    // Act
    const result = await findShow(db, { id: 5 })

    // Assert
    expect(result).toMatchSnapshot()
    expect(db.__execution_log__).toMatchSnapshot()
  })

  test('Resolve null', async () => {
    // Arrange
    const dbShow = null
    const db = create({ where: () => dbShow })

    // Act
    const result = await findShow(db, { id: 5 })

    // Assert
    expect(result).toBe(null)
  })
})

test('Filter out non existing shows', async () => {
  // Arrange
  const db = create({ whereIn: () => [{ id: 2, tvdb_id: 5, imdb_id: 'Hello' }] })
  const ids = [0, 2, 5]

  // Act
  const result = await filterOutNonExistingShows(db, ids)

  // Assert
  expect(result).toEqual([{ id: 2, tvdbId: 5, imdbId: 'Hello' }])
  expect(db.__execution_log__).toMatchSnapshot()
})
