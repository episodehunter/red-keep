import { create } from 'chain-spy'
import { EpisodeResolver } from '../episode.resolver'

test('Resolve an episode list', async () => {
  // Arrange
  const show = {
    id: 5
  }
  const dbEpisodes = [
    {
      id: 123,
      tvdb_id: 56,
      serie_tvdb_id: 59,
      serie_id: 5,
      name: 'Some name',
      season: 1,
      episode: 10,
      first_aired: '2016-06-12',
      overview: 'Some overview',
      image: 'image.jpg',
      lastupdated: 56789132345
    }
  ]
  const dbProxy = create({ then: (fn: any) => fn(dbEpisodes) })

  // Act
  const result = await EpisodeResolver.episodes(show as any, {}, { db: dbProxy })

  // Assert
  expect(result).toMatchSnapshot()
  expect(dbProxy.__execution_log__).toMatchSnapshot()
})

test('Resolve an empty array', async () => {
  // Arrange
  const show = {
    id: 5
  }
  const dbEpisodes: any[] = []
  const dbProxy = create({ then: () => dbEpisodes })

  // Act
  const result = await EpisodeResolver.episodes(show as any, {}, { db: dbProxy })

  // Assert
  expect(result).toEqual([])
})
