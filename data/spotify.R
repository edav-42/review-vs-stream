library(tidyverse)
library(spotifyr)
Sys.setenv(SPOTIFY_CLIENT_ID = '8cccb4c2ec73415782df7737df5ce6d5')
Sys.setenv(SPOTIFY_CLIENT_SECRET = '03cd502aae094f688594d28ba2ba29fa')

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