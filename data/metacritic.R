library(robotstxt)
library(rvest)
# reference: https://stackoverflow.com/questions/57279093/rvest-read-table-with-cells-that-span-multiple-rows
url <- "https://www.metacritic.com/browse/albums/score/metascore/year/filtered?view=condensed&year_selected=2020&sort=desc"
paths_allowed(url)

# page <- read_html(url)
# tb <- html_table(page)[[4]]
# View(tb)
# as.character(tb[2,2])

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