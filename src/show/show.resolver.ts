import { Context } from '../types/context.type'
import { episodesUpdate } from '../episode/episode.resolver'
import { ShowDefinitionType } from '../root-type'
import { assertShowExist, updateShow, addShow, findShow } from './show.db.util'

export async function mutateShow(
  {
    show,
    removeMissingEpisodes
  }: { show: Partial<ShowDefinitionType>; removeMissingEpisodes: true },
  context: Context
): Promise<ShowDefinitionType | null> {
  return assertShowExist(context.db, show)
    .then(showId => updateShow(context.db, showId, show))
    .then(showId => episodesUpdate(showId, removeMissingEpisodes, show.episodes, context))
    .then(() => findShow(context.db, show))
}

export async function mutateAddShow(
  { show }: { show: ShowDefinitionType },
  context: Context
): Promise<ShowDefinitionType | null> {
  return addShow(context.db, show).then(() => findShow(context.db, show))
}
