export const EpisodeDefinition = `
  type Episode {
    id: ID!,
    name: String!
  }
`

export const EpisodeResolver = {
  episodes: (obj: { id: number }, args: {}, context: any) => {
    console.log('episodes obj', obj)
    console.log('episodes args', args)
    console.log('episodes context', context)
    return [{ id: 5, name: 'First episode' }]
  }
}
