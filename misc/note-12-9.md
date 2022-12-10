---
modified: 2022-12-10T00:10:55
---

# 12/9 Note

## Sources

What topics we want to explore decides what sources we should/can turn to

| Topic         | Source                  | Raw Data Type      | Transformed Data Type | Fetch Method           | Main Features                         |
| ------------- | ----------------------- | ------------------ | --------------------- | ---------------------- | ------------------------------------- |
| Critic Review | Metacritic              | charts, webpage    | CSV/table             | scrape                 | rank, score                           |
| User Rating   | Rate Your Music         | charts, webpage    | CSV/table             | scrape, unofficial API | rank, score, genre                    |
| Popularity    | Spotify, YouTube        | a dict for a track | array                 | API                    | popularity, region, acoustic features |
| Stream        | ChartMasters, Billboard | charts, webpage    | CSV/table             | scrape                 | rank, stream                          |
| Lyrics        | ?                       | ?                  | ?                     | ?                      | ?                                     |
| Other         | ?                       | ?                  | ?                     | ?                      | ?                                     |

## Basic Data Workflow

Possible basic data process workflow:

1. Get a table from some charts, then we focus on the albums in this table
2. For every album in this table, get its other review and rating information
    - Thus, we need to be able to (using a script) get such information based on the album title, artist, etc
3. For every album in this table, get the stream and popularity information of its tracks
    - Thus, we need to be able to (using a script) get such information based on the album title, artist, etc
4. Aggregate tracks' stream and popularity information for every album
    - Aggregation method: sum, average, max, weight, **range**

## Timeline

- 10: decide data sources, topics, and graphs
- 11-12: process data
- 12-13: make graphs
- 14: write report

