import {
  getEpisodeId,
  undefinedIfNull,
  isSameEpisode,
  splitEpisodeList,
  isSameDefEpisode,
  removeDuplicatesEpisode
} from '../episode.resolve.util'

describe('Get episode id', () => {
  test('Return id when defined', () => {
    // Arrange
    const ids = { id: 5 }

    // Act
    const result = getEpisodeId(ids)

    // Assert
    expect(result).toEqual({ id: 5 })
  })

  test('Return tvdb_id when defined', () => {
    // Arrange
    const ids = { tvdb_id: 5 }

    // Act
    const result = getEpisodeId(ids)

    // Assert
    expect(result).toEqual({ tvdb_id: 5 })
  })

  test(`Throw an error when we can't get an id`, () => {
    // Arrange
    const ids = {}
    const fun = () => getEpisodeId(ids)

    // Act and assert
    expect(fun).toThrow('Missing id for updating episode')
  })
})

describe('Convert null to undefined', () => {
  test('Return undefined', () => {
    // Arrange
    const value = null

    // Act
    const result = undefinedIfNull(value)

    // Assert
    expect(result).toBe(undefined)
  })

  test('Return the value', () => {
    // Arrange
    const value = 5

    // Act
    const result = undefinedIfNull(value)

    // Assert
    expect(result).toBe(5)
  })
})

describe('Is same episode', () => {
  test('Is same episode', () => {
    // Arrange
    const dbEpisode = {
      tvdb_id: 6,
      season: 1,
      episode: 1
    }
    const defEpisode = {
      tvdbId: 6,
      season: 2,
      episode: 3
    }

    // Act
    const result = isSameEpisode(dbEpisode as any, defEpisode as any)

    // Assert
    expect(result).toBe(true)
  })

  test('Is not the same episode', () => {
    // Arrange
    const dbEpisode = {
      tvdb_id: 6,
      season: 1,
      episode: 1
    }
    const defEpisode = {
      tvdbId: 5,
      season: 1,
      episode: 1
    }

    // Act
    const result = isSameEpisode(dbEpisode as any, defEpisode as any)

    // Assert
    expect(result).toBe(false)
  })
})

test('Split episode array', () => {
  // Arrange
  const dbEpisodes = [
    {
      tvdb_id: 1, // Do not update
      lastupdated: 2
    },
    {
      tvdb_id: 2, // Update
      lastupdated: 1
    },
    {
      tvdb_id: 3, // Remove
      lastupdated: 1
    }
  ]
  const defEpisodes = [
    {
      tvdbId: 1,
      lastupdated: 1,
      season: 1,
      episode: 1
    },
    {
      tvdbId: 2,
      lastupdated: 2,
      season: 1,
      episode: 2
    },
    {
      tvdbId: 4, // Add
      lastupdated: 1,
      season: 1,
      episode: 3
    },
    {
      tvdbId: 5, // Invalid episode
      lastupdated: -1,
      season: 0,
      episode: 1
    },
    {
      tvdbId: 6, // Invalid episode
      lastupdated: -1,
      season: 1,
      episode: 0
    }
  ]

  // Act
  const result = splitEpisodeList(dbEpisodes as any, defEpisodes as any)

  // Assert
  expect(result.episodesToAdd.length).toBe(1)
  expect(result.episodesToAdd[0].tvdbId).toBe(4)
  expect(result.episodesToRemove.length).toBe(1)
  expect(result.episodesToRemove[0].tvdb_id).toBe(3)
  expect(result.episodesToUpdate.length).toBe(1)
  expect(result.episodesToUpdate[0].tvdbId).toBe(2)
})

test('Is same def episode', () => {
  // Arrange
  const a = { tvdbId: 123 }
  const b = { tvdbId: 123 }

  // Act
  const result = isSameDefEpisode(a as any, b as any)

  // Assert
  expect(result).toBe(true)
})

test('Is not same def episode', () => {
  // Arrange
  const a = { tvdbId: 124 }
  const b = { tvdbId: 123 }

  // Act
  const result = isSameDefEpisode(a as any, b as any)

  // Assert
  expect(result).toBe(false)
})

test('Remove duplicate episode', () => {
  // Arrange
  const episodes = [{ tvdbId: 123 }, { tvdbId: 124 }, { tvdbId: 123 }]

  // Act
  const result = removeDuplicatesEpisode(episodes as any)

  // Assert
  expect(result.length).toBe(2)
  expect(result[0].tvdbId).toBe(123)
  expect(result[1].tvdbId).toBe(124)
})
