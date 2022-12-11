library(tidyverse)
library(spotifyr)
token <- read.csv('~/tmp/review-vs-stream/data/spotify_token')
Sys.setenv(SPOTIFY_CLIENT_ID = token[1,1])
Sys.setenv(SPOTIFY_CLIENT_SECRET = token[1,2])

access_token <- get_spotify_access_token()

# given album name and singer name, get stream popularity
get_spotify_data <- function(album, singer){
  res <- search_spotify(paste(album, singer, sep = ", "), type="album")[1,5] %>% 
    get_album_tracks()
  res <- get_tracks(res$id) %>%
    group_by(album.name) %>% 
    summarise(
      avg_pop = mean(popularity),
      max_pop = max(popularity),
      sum_pop = sum(popularity)
    )
  return(res)
}

# for music in metacritic_data.csv get spotify popularity
df <- read.csv("data/metacritic_data.csv")
spotify_data = data.frame(matrix(ncol = 4, nrow = 0))
for(i in 2158:nrow(df)){
  row = get_spotify_data(df[i, "Album_Name"], df[i, "Singer"])
  spotify_data <- rbind(spotify_data, row)
  print(i)
}


# export to csv
write.csv(spotify_data, "data/spotify.csv", row.names=FALSE)
