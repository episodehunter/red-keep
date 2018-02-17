import { create } from 'chain-spy'
import {
  findAllepisodesInDb,
  addNewEpisodesInDb,
  removeEpisodesInDb,
  updateEpisodesInDb
} from '../episode.db.util'

test('Find all episodes', () => {
  // Arrange
  const showId = 5
  const db = create()

  // Act
  findAllepisodesInDb(db, showId)

  // Assert
  expect(db.__execution_log__).toMatchSnapshot()
})

describe('Add new episodes', () => {
  test('Return undefined for empty array', async () => {
    // Arrange
    const showId = 5
    const db = create()
    const episodes = []

    // Act
    const result = await addNewEpisodesInDb(db, showId, episodes)

    // Assert
    expect(result).toBe(undefined)
  })

  test('Insert episode in db', () => {
    // Arrange
    const showId = 5
    const db = create()
    const episodes = [
      {
        tvdbId: 1234567,
        name: 'episode name',
        season: 1,
        episode: 2,
        firstAired: '2017-09-27',
        overview: 'This is some text',
        lastupdated: 1234567890
      }
    ]

    // Act
    addNewEpisodesInDb(db, showId, episodes as any)

    // Assert
    expect(db.__execution_log__).toMatchSnapshot()
  })
})

describe('Remove episodes', () => {
  test('Return undefined for empty array', async () => {
    // Arrange
    const db = create()
    const episodes = []

    // Act
    const result = await removeEpisodesInDb(db, episodes)

    // Assert
    expect(result).toBe(undefined)
  })

  test('Remove episode in db', () => {
    // Arrange
    const db = create()
    const episodes = [{ id: 2 }, { id: 5 }]

    // Act
    removeEpisodesInDb(db, episodes as any)

    // Assert
    expect(db.__execution_log__).toMatchSnapshot()
  })
})

test('Update episodes in db', () => {
  // Arrange
  const showId = 5
  const db = create()
  const episodes = [
    {
      tvdbId: 1234567,
      name: 'episode name',
      season: 1,
      episode: 2,
      firstAired: '2017-09-27',
      overview: 'This is some text',
      lastupdated: 1234567890
    },
    {
      tvdbId: 1234599,
      name: 'episode name 2',
      season: 2,
      episode: 3,
      firstAired: '2017-11-27',
      overview: 'This is some text 2',
      lastupdated: 1234567900
    }
  ]

  // Act
  updateEpisodesInDb(db, showId, episodes as any)

  // Assert
  expect(db.__execution_log__).toMatchSnapshot()
})
