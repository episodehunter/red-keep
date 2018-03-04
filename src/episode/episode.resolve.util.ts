import { BadInput } from '../custom-error'
import { EpisodeDefinitionType, EpisodeDatabaseType } from '../root-type'

export function getEpisodeId(episode: Partial<EpisodeDatabaseType>) {
  const { id, tvdb_id } = episode
  if (id) {
    return { id }
  } else if (tvdb_id) {
    return { tvdb_id }
  }
  throw new BadInput('Missing id for updating episode')
}

export function undefinedIfNull<T>(val: T): T | undefined {
  if (val === null) {
    return undefined
  }
  return val
}

export function mapDatabaseEpisodeToDefinition(
  episode: EpisodeDatabaseType
): EpisodeDefinitionType {
  return {
    id: episode.id,
    tvdbId: episode.tvdb_id,
    serieId: episode.serie_id,
    name: episode.name,
    season: episode.season,
    episode: episode.episode,
    firstAired: episode.first_aired,
    overview: episode.overview,
    image: episode.image,
    lastupdated: episode.lastupdated
  }
}

export function mapDefinitionEpisodeToDatabase(
  episode: EpisodeDefinitionType,
  showId?: number
): EpisodeDatabaseType {
  return {
    id: undefinedIfNull(episode.id),
    tvdb_id: undefinedIfNull(episode.tvdbId),
    serie_id: undefinedIfNull(episode.serieId) || showId,
    name: undefinedIfNull(episode.name),
    season: undefinedIfNull(episode.season),
    episode: undefinedIfNull(episode.episode),
    first_aired: undefinedIfNull(episode.firstAired),
    overview: undefinedIfNull(episode.overview),
    image: undefinedIfNull(episode.image),
    lastupdated: undefinedIfNull(episode.lastupdated)
  }
}

export function isSameEpisode(
  dbEpisode: EpisodeDatabaseType,
  defEpisode: EpisodeDefinitionType
) {
  return dbEpisode.tvdb_id === defEpisode.tvdbId
}

function isValidEpisode(episode: EpisodeDefinitionType) {
  return Boolean(episode.episode && episode.season)
}

export function splitEpisodeList(
  dbEpisodes: EpisodeDatabaseType[],
  defEpisodes: EpisodeDefinitionType[]
): {
  episodesToAdd: EpisodeDefinitionType[]
  episodesToUpdate: EpisodeDefinitionType[]
  episodesToRemove: EpisodeDatabaseType[]
} {
  const episodesToAdd: EpisodeDefinitionType[] = []
  const episodesToUpdate: EpisodeDefinitionType[] = []
  const episodesToRemove: EpisodeDatabaseType[] = []

  for (const defEpisode of defEpisodes) {
    if (!isValidEpisode(defEpisode)) {
      continue
    }
    const dbEpisode = dbEpisodes.find(dbEpisode => isSameEpisode(dbEpisode, defEpisode))
    if (!dbEpisode) {
      episodesToAdd.push(defEpisode)
      continue
    }
    if (defEpisode.lastupdated > dbEpisode.lastupdated) {
      episodesToUpdate.push(defEpisode)
    }
  }

  for (const dbEpisode of dbEpisodes) {
    const defEpisode = defEpisodes.find(defEpisode =>
      isSameEpisode(dbEpisode, defEpisode)
    )
    if (!defEpisode) {
      episodesToRemove.push(dbEpisode)
    }
  }

  return {
    episodesToAdd,
    episodesToUpdate,
    episodesToRemove
  }
}
