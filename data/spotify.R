## ----------------------------------------------------------------------------------------------------------------
library(tidyverse)
library(spotifyr)
token <- read.csv("data/spotify_token")
Sys.setenv(SPOTIFY_CLIENT_ID = token[1, 1])
Sys.setenv(SPOTIFY_CLIENT_SECRET = token[1, 2])


## ----------------------------------------------------------------------------------------------------------------
access_token <- get_spotify_access_token()


## ----------------------------------------------------------------------------------------------------------------
# given album name and singer name, get album's tracks data 
get_tracks_data <- function(album_name, singer) {
  res <- search_spotify(paste(album_name, singer, sep = ", "), type = "album")[1, 5] %>%
    get_album_tracks()
  ids <- res$id
  
  # Popularity
  pop <- get_tracks(ids) %>%
    select(
      duration_ms,
      name,
      popularity,
    )

  # Audio features
  feature <- data.frame()
  for (id in ids) {
    track_feature <- get_track_audio_features(id) %>%
      select(
        id,
        acousticness,
        danceability,
        energy,
        instrumentalness,
        key,
        liveness,
        loudness,
        mode,
        speechiness,
        tempo,
        time_signature,
        valence
      )
    feature <- rbind(feature, track_feature)
  }

  df <- merge(pop, feature, by.x = "id", by.y = "id", all.x = TRUE) %>%
    mutate(album = album_name)

    # group_by(album.name) %>%
    # summarise(
    #   avg_pop = mean(popularity),
    #   max_pop = max(popularity),
    #   sum_pop = sum(popularity),
    #   n = n()
    # )
  return(df)
}


## ----------------------------------------------------------------------------------------------------------------
# given album name and singer name, get stream popularity
get_album_data <- function(album_name, singer) {
  res <- search_spotify(paste(album_name, singer, sep = ", "), type = "album")[1, 5] %>%
    get_album_tracks()
  
  res <-  get_tracks(res$id) %>%
    summarise(
      pop = summary(popularity),
      n = n()
    )
 
  return(res)
}


## ----------------------------------------------------------------------------------------------------------------
# for music in metacritic_data.csv get spotify popularity
df <- read.csv("data/metacritic_data_new.csv")


## ----------------------------------------------------------------------------------------------------------------
not_matched <- 0
spotify_data <- data.frame(matrix(ncol = 4, nrow = 0))

for (i in 1:1) {
  album_name <- df[i, "Album_Name"]
  singer <- df[i, "Singer"]
  tryCatch({
    row <- get_album_data(album_name, singer)
    spotify_data <- rbind(spotify_data, row)
    print(c(i, '✅', singer, album_name))
  }, error = function(e) {
    not_matched <<- c(not_matched, i)
    print(c(i, '❌', singer, album_name))
  })
}


## ----------------------------------------------------------------------------------------------------------------
# export to csv
write.csv(spotify_data, "data/spotify_new.csv", row.names=FALSE)

