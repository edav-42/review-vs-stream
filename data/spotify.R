library(tidyverse)
library(spotifyr)
token <- read.csv('spotify_token')
Sys.setenv(SPOTIFY_CLIENT_ID = token[1,1])
Sys.setenv(SPOTIFY_CLIENT_SECRET = token[1,2])

access_token <- get_spotify_access_token()
res <- search_spotify('future nostalgia, dua lipa', type="album")[1,5] %>% 
  get_album_tracks()
res <- get_tracks(res$id) %>%
  group_by(album.name) %>% 
  summarise(
    avg_pop = mean(popularity),
    max_pop = max(popularity),
    sum_pop = sum(popularity)
  )
