library(robotstxt)
library(rvest)
# reference: https://stackoverflow.com/questions/57279093/rvest-read-table-with-cells-that-span-multiple-rows
url <- "https://www.metacritic.com/browse/albums/score/metascore/year/filtered?view=condensed&year_selected=2020&sort=desc"
paths_allowed(url)

# page <- read_html(url)
# tb <- html_table(page)[[4]]
# View(tb)
# as.character(tb[2,2])

get_data_from_url <- function(url) {
  # get the lines of the table
  lines <- url %>%
    read_html() %>%
    html_nodes(xpath="//table") %>%
    html_nodes(xpath = 'tr')
  
  # define the empty table
  ncol <-  lines %>%
    .[[1]] %>%
    html_nodes('span, h3, div')%>%
    length()
  nrow <- length(lines)
  table <- as.data.frame(matrix(nrow = nrow,ncol = ncol))
  
  # fill the table
  for(i in 1:nrow){
    # get content of the line
    linecontent <- lines[[i]]%>%
      html_nodes('span, h3, div') %>%
      html_text() %>%
      gsub("\n","",.) %>%
      trimws()
    
    # attribute the content to free columns
    colselect <- is.na(table[i,])
    table[i,colselect] <- linecontent
    
    # get the line repetition of each columns
    repetition <- lines[[i]]%>%
      html_children()%>%
      html_attr("rowspan")%>%
      ifelse(is.na(.),1,.) %>% # if no rowspan, then it is a normal row, not a multiple one
      as.numeric
    
    # repeat the cells of the multiple rows down
    for(j in 1:length(repetition)){
      span <- repetition[j]
      if(span > 1){
        table[(i+1):(i+span-1),colselect][,j] <- rep(linecontent[j],span-1)
      }
    }
  }
  
  return(table)
}

# sample url
url <- "https://www.metacritic.com/browse/albums/score/metascore/year/filtered?view=condensed&year_selected=2020&sort=desc&page=0"
# initialize df
df <- data.frame(matrix(ncol = 10, nrow = 0))
# map between years and number of pages
year_page <- c('2018'=6, '2019'=6, '2020'=5, '2021'=4, '2022'=4)

# gather metacritic data from year 2018 to year 2022;
for(year in 2018:2022){
  for(page in 0:(year_page[as.character(year)] - 1)){
    crt_url <- gsub("2020", as.character(year), url)
    crt_url <- gsub("page=0", paste("page=",page, sep = ""), crt_url)
    crt_table <- get_data_from_url(crt_url)
    crt_table$Year = year
    df <- rbind(df, crt_table)
  }
}

# data cleaning
library("dplyr")
str(df)
# del useless columns
df <- subset(df, select = -c(V2,V6,V8,V9) )
# rename columns
df <- df %>% 
  rename("Metacritic_Score" = "V1",
         "Album_Name" = "V3",
         "Singer" = "V4",
         "Release_Date" = "V5",
         "Desciption" = "V7",
         "User_Score"= "V10",
         "Release_Year" = "Year")
str(df)
# transform data in each column
df$Metacritic_Score <- as.integer(df$Metacritic_Score)
df$Singer <- gsub("by ","",df$Singer)
df$Release_Date <- as.Date(df$Release_Date , format = "%B %d, %Y")
df$User_Score <- as.numeric(df$User_Score, NA)
summary(df)

# export to csv
write.csv(df, "data/metacritic_data.csv", row.names=FALSE)


