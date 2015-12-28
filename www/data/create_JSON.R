library(RMySQL)
library(jsonlite)
setwd("C:\\Users\\Alex\\Desktop\\Projetos\\Projeto Final\\DB Management")

# Connect to the dzVis database and get the names of all the tables
connection <- dbConnect(MySQL(), db="dzVis",  user = "dzvisuser", host = "Desktop", port=3306)
results <- dbGetQuery(connection, "show databases;")
allTables <- dbListTables(connection)

# Select only the description tables
tableNames <- allTables[grepl("^desc_", allTables)]

# Get all the data from each of these tables
dbDesc = vector(mode ="list", length = length(tableNames))
for(index in seq_along(tableNames) ){
  dbDesc[[index]] = dbReadTable(connection,tableNames[index])
}

# Select only the tables with aggregate data form IBGE
tableNames <- allTables[!grepl("^desc_", allTables)]

# Get all the data from each of these tables 
dbAD = vector(mode ="list", length = length(tableNames))
for(index in seq_along(tableNames) ){
  dbAD[[index]] = dbReadTable(connection,tableNames[index])
}

names(dbAD) <- tableNames
names(dbDesc) <- tableNames 

# Loop through aggregate data tables to find columns of the type enum and
# append their levels to the corresponding description table
for(dbName in names(dbAD)){
  
  iAD = dbAD[[dbName]] 
  
  # Get the corresponding description table for table dbName
  iDesc = dbDesc[[dbName]] 
  
  # Initialize column to be appended to the description table
  newCol = vector(mode="list", nrow(iDesc))
  count = 1
  
  for(colName in names(iAD)){
    
    # If the column type is enum, get its levels and fill a data.frame with it
    if(iDesc[iDesc$cod == colName,"ctype"] == "enum"){
      
        fac <- as.factor(iAD[,colName])
        levels <- levels(fac)
        nLevels <- length(levels(fac)) 
        
        # Initialize empty data.frame
        tempList = vector(mode="list", length = nLevels) 
        lvl =  data.frame(matrix(NA, nrow=1, ncol=3 ))
        
        names(lvl) = c("id","text","type")
        lvl[1,3] = "lvl"
          
          for(index in seq_along(levels)){
              lvl[1,2] = levels[index] 
              tempList[[index]] = lvl
          }
        
        newCol[[count]] = tempList 
    }
    else {
      newCol[[count]] = FALSE
    }
    count = count + 1
  }
  dbDesc[[dbName]]$children = newCol
  
  # Change column names to be compatible with jstree 
  names(dbDesc[[dbName]])[1] <- "id"
  names(dbDesc[[dbName]])[2] <- "type"
  names(dbDesc[[dbName]])[3] <- "text"
  
  dbDesc[[dbName]]["id"] <- lapply(dbDesc[[dbName]]["id"], function(x){paste(dbName,".",x,sep="")})
  
  dbDesc[[dbName]][2] <- rep("attr",nrow(dbDesc[[dbName]][2])) 
}



# Assemble the JSON file with all the relevant information
completeJSON = "["
for(index in seq_along(dbDesc)){
  tableJSON <- toJSON(dbDesc[index], pretty= TRUE)
  completeJSON <- paste(completeJSON, " ", tableJSON, "\n\n", sep="")
}

completeJSON = paste(completeJSON, "]", sep="")

completeJSON = gsub(',\n      \"children\": \\[false\\]\n',"",completeJSON)
completeJSON = gsub('\"children\": \\[\n        \\[\n',"\"children\": \\[\n",completeJSON)
completeJSON = gsub('\"type\": \"lvl\"\n          \\}\n        \\],\n',"\"type\": \"lvl\"\n         \\},",completeJSON)
completeJSON = gsub('\"type\": \"lvl\"\n         \\},        \\[',"\"type\": \"lvl\"\n         },",completeJSON)
completeJSON = gsub(' \"type\": \"lvl\"\n          \\}\n        \\]\n      \\]\n'," \"type\": \"lvl\"\n          \\}\n        \\]\n",completeJSON)
completeJSON = gsub('\\}\n\n \\{',"\\},\n{",completeJSON)

for(name in names(dbAD)){
  name <- paste('\"',name,'\"',sep="")
  rootNode = paste('\"id\": ',name,', \"text\": ', gsub("_", " ", name), ', \"children\"', sep="")
  completeJSON = gsub(name,rootNode,completeJSON)
}

con <- file("menu.json", encoding="utf8")
write(completeJSON,file = con)

# Disconnect from dzvis database
dbDisconnect(connection)


