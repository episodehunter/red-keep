import {
  convertStatusBoleanToString,
  convertGenreArrayToString,
  getShowId
} from '../show.resolve.util'

describe('Convert status bool to string', () => {
  test('Convert true to ended', () => {
    // Arrange
    const ended = true

    // Act
    const result = convertStatusBoleanToString(ended)

    // Assert
    expect(result).toBe('Ended')
  })

  test('Convert false to continuing', () => {
    // Arrange
    const ended = false

    // Act
    const result = convertStatusBoleanToString(ended)

    // Assert
    expect(result).toBe('Continuing')
  })

  test('Convert undefined if we do not know', () => {
    // Arrange
    const ended = undefined

    // Act
    const result = convertStatusBoleanToString(ended)

    // Assert
    expect(result).toBe(undefined)
  })
})

describe('Convert genre to string array', () => {
  test('Convert to string', () => {
    // Arrange
    const genre = ['action', 'drama']

    // Act
    const result = convertGenreArrayToString(genre)

    // Assert
    expect(result).toBe('action|drama')
  })

  test('Convert to undefined when we do not know', () => {
    // Arrange
    const genre = null

    // Act
    const result = convertGenreArrayToString(genre)

    // Assert
    expect(result).toBe(undefined)
  })
})

describe('Get show id', () => {
  test('Return id when defined', () => {
    // Arrange
    const ids = { id: 5 }

    // Act
    const result = getShowId(ids)

    // Assert
    expect(result).toEqual({ id: 5 })
  })

  test('Return tvdb_id when defined', () => {
    // Arrange
    const ids = { tvdb_id: 5 }

    // Act
    const result = getShowId(ids)

    // Assert
    expect(result).toEqual({ tvdb_id: 5 })
  })

  test('Return tvdbId when defined', () => {
    // Arrange
    const ids = { tvdbId: 5 }

    // Act
    const result = getShowId(ids)

    // Assert
    expect(result).toEqual({ tvdb_id: 5 })
  })

  test('Return imdb_id when defined', () => {
    // Arrange
    const ids = { imdb_id: 'tt5' }

    // Act
    const result = getShowId(ids)

    // Assert
    expect(result).toEqual({ imdb_id: 'tt5' })
  })

  test('Return imdbId when defined', () => {
    // Arrange
    const ids = { imdbId: 'tt5' }

    // Act
    const result = getShowId(ids)

    // Assert
    expect(result).toEqual({ imdb_id: 'tt5' })
  })

  test(`Throw an error when we can't get an id`, () => {
    // Arrange
    const ids = {}
    const fun = () => getShowId(ids)

    // Act and assert
    expect(fun).toThrow('Missing id for updating show')
  })
})
