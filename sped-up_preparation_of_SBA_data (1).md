---
title: "sped-up preparation of SBA data"
output:
  word_document: default
  html_notebook: default
---

### Set-up the initial workspace:

Load the FOIA datasets into R (customize the directory to your workspace of course)
```
FOIA_504_FY1991_Present <- read_csv("F:/USERS/NBROD/Data/Lending/FOIA data/Nation-wide 7a and 504 FOIA loan data/FOIA - 504-FY1991-Present.csv")
load("F:/USERS/NBROD/Data/Lending/FOIA data/Nation-wide 7a and 504 FOIA loan data/CSV/FOIA - 7(a) (FY1991-FY1999).csv")
FOIA_7_a_FY1991_FY1999 <- read_csv("F:/USERS/NBROD/Data/Lending/FOIA data/Nation-wide 7a and 504 FOIA loan data/CSV/FOIA - 7(a) (FY1991-FY1999).csv")
FOIA_7_a_FY2000_FY2009_1 <- read_csv("F:/USERS/NBROD/Data/Lending/FOIA data/Nation-wide 7a and 504 FOIA loan data/CSV/FOIA - 7(a) (FY2000-FY2009) (1).csv")
FOIA_7_a_FY2010_Present <- read_csv("F:/USERS/NBROD/Data/Lending/FOIA data/Nation-wide 7a and 504 FOIA loan data/CSV/FOIA - 7(a) (FY2010-Present).csv")
```
Load the City Profiles into R
Load the SBIR data into R
```
SBIR_recipients_1983_2016 <- read_csv("F:/USERS/NBROD/Data/sbir/SBIR recipients 1983-2016.csv")
```
### Prep the 504/7a data

Combine all of the 7a datasets into a single dataframe and cleanup the workspace

```
FOIA_National_7A <- dplyr::union(FOIA_7_a_FY2010_Present,FOIA_7_a_FY2000_FY2009_1,FOIA_7_a_FY1991_FY1999)
remove(FOIA_7_a_FY2010_Present,FOIA_7_a_FY2000_FY2009_1,FOIA_7_a_FY1991_FY1999)
```

Rename the 504 dataframe columns:

```
FOIA_National_504 <- dplyr::rename(FOIA_National_504, BankName = CDC_Name, BankStreet = CDC_Street, BankCity = CDC_City, BankState = CDC_State, BankZip = CDC_Zip)
```

Add missing 504 columns to the 7a dataframe and the missing 7a columns to the 504 dataframe

```
FOIA_National_504$RevolverStatus <- ("NA")
FOIA_National_504$SBAGuaranteedApproval <- ("NA")

FOIA_National_7A$ThirdPartyLender_Name <- ("NA")
FOIA_National_7A$ThirdPartyLender_City <- ("NA")
FOIA_National_7A$ThirdPartyLender_State <- ("NA")
FOIA_National_7A$ThirdPartyDollars <- ("NA")

```

Fix column type mismatches

```
FOIA_National_504$DeliveryMethod <- as.character(FOIA_National_504$DeliveryMethod)
FOIA_National_504$RevolverStatus <- as.character(FOIA_National_504$RevolverStatus)
FOIA_National_504$SBAGuaranteedApproval <- as.character(FOIA_National_504$SBAGuaranteedApproval)

FOIA_National_7A$RevolverStatus <- as.character(FOIA_National_7A$RevolverStatus)
FOIA_National_7A$DeliveryMethod <- as.character(FOIA_National_7A$DeliveryMethod)
FOIA_National_7A$SBAGuaranteedApproval <- as.character(FOIA_National_7A$SBAGuaranteedApproval)
FOIA_National_7A$Program <- as.character(FOIA_National_7A$Program)

```

Join the 504 and the 7A data to a single dataframe and cleanup the workspace
```
 FOIA_National_504_7A <- dplyr::union(FOIA_National_7A,FOIA_National_504)
 remove(FOIA_National_7A,FOIA_National_504)
 
```

### Subset the 504/7a dataframe dataframe to the San Francisco District office region

Subset to California first
```
library(sqldf)
FOIA_California_504_7a <- sqldf::sqldf('SELECT * FROM FOIA_National_504_7A WHERE ProjectState IN ("CA")')
```

Then subset by Project County

```
FOIA_SFDO_504_7A <- sqldf::sqldf('SELECT * FROM FOIA_California_504_7a WHERE ProjectCounty IN("DEL NORTE","HUMBOLDT","MENDOCINO","LAKE","SONOMA","NAPA","MARIN","SAN FRANCISCO","SOLANO","CONTRA COSTA","ALAMEDA","SAN MATEO","SANTA CRUZ","SANTA CLARA")')

```

Export the data and clean the city names in refine and then excel

```
write.csv(FOIA_SFDO_504_7A, "FOIA_SFDO_504_7A.csv")
```

import the newly cleaned dataset
```
FOIA_SFDO_504_7A <- read_csv("F:/USERS/NBROD/Data/Lending/FOIA data/FOIA - california/SFDO_504_7A-clean.csv")
```


### Importing new data/quarterly updates

Load the new data and prep it
```
FOIA_National_504_New <- read_csv("F:/USERS/NBROD/Data/Lending/FOIA data/Nation-wide 7a and 504 FOIA loan data/FOIA - 504-FY1991-Present.csv")
FOIA_National_7a_New <- read_csv("F:/USERS/NBROD/Data/Lending/FOIA data/Nation-wide 7a and 504 FOIA loan data/CSV/FOIA - 7(a) (FY2010-Present).csv")
```

Rename the 504 dataframe columns:

```
FOIA_National_504_New <- dplyr::rename(FOIA_National_504_New, BankName = CDC_Name, BankStreet = CDC_Street, BankCity = CDC_City, BankState = CDC_State, BankZip = CDC_Zip)
```

Add missing 504 columns to the 7a dataframe and the missing 7a columns to the 504 dataframe

```
FOIA_National_504_New$RevolverStatus <- ("NA")
FOIA_National_504_New$SBAGuaranteedApproval <- ("NA")

FOIA_National_7a_New$ThirdPartyLender_Name <- ("NA")
FOIA_National_7a_New$ThirdPartyLender_City <- ("NA")
FOIA_National_7a_New$ThirdPartyLender_State <- ("NA")
FOIA_National_7a_New$ThirdPartyDollars <- ("NA")

```

Fix column type mismatches

```
FOIA_National_504_New$DeliveryMethod <- as.character(FOIA_National_504_New$DeliveryMethod)
FOIA_National_504_New$RevolverStatus <- as.character(FOIA_National_504_New$RevolverStatus)
FOIA_National_504_New$SBAGuaranteedApproval <- as.character(FOIA_National_504_New$SBAGuaranteedApproval)

FOIA_National_7a_New$RevolverStatus <- as.character(FOIA_National_7a_New$RevolverStatus)
FOIA_National_7a_New$DeliveryMethod <- as.character(FOIA_National_7a_New$DeliveryMethod)
FOIA_National_7a_New$SBAGuaranteedApproval <- as.character(FOIA_National_7a_New$SBAGuaranteedApproval)
FOIA_National_7a_New$Program <- as.character(FOIA_National_7a_New$Program)

```

Join the 504 and the 7A data to a single dataframe and clean the workspace
```
 FOIA_National_504_7A_New <- dplyr::union(FOIA_National_7a_New,FOIA_National_504_New)
 remove(FOIA_National_7a_New,FOIA_National_504_New)
 
```
Subset to just the new rows and clean the workspace

```
FOIA_National_504_7A_Update <- dplyr::setdiff(FOIA_National_504_7A_New, FOIA_National_504_7A)
remove(FOIA_National_504_7A_New)
```

Merge the data with the national and california sets

```
FOIA_National_7A <- dplyr::union(FOIA_National_504_7A_Update,FOIA_National_504_7A)

library(sqldf)
FOIA_California_504_7a_Update <- sqldf::sqldf('SELECT * FROM FOIA_National_504_7A_Update WHERE ProjectState IN ("CA")')
FOIA_National_7A <- dplyr::union(FOIA_California_504_7a_Update,FOIA_California_504_7A)

```

Then subset by Project County

```
FOIA_SFDO_504_7A_Update <- sqldf::sqldf('SELECT * FROM FOIA_California_504_7a_Update WHERE ProjectCounty IN("DEL NORTE","HUMBOLDT","MENDOCINO","LAKE","SONOMA","NAPA","MARIN","SAN FRANCISCO","SOLANO","CONTRA COSTA","ALAMEDA","SAN MATEO","SANTA CRUZ","SANTA CLARA")')
```

(Optional) Export the data and check the city names in refine and then excel

```
write.csv(FOIA_SFDO_504_7A_Update, "FOIA_SFDO_504_7A_Update.csv")
```

And merge the updates into our San Francisco District office region

```
FOIA_SFDO_504_7A <- dplyr::union(FOIA_SFDO_504_7A_Update,FOIA_SFDO_504_7A)
```


### Subset the SBIR dataframe to the San Francisco District office region

Subset to California
```
California_SBIR_STTR <- sqldf::sqldf('SELECT * FROM SBIR_STTR_1983_2016 WHERE State IN("CA")')

```
And then to the SFDO cities
```
SBIR_SFDO <- sqldf::sqldf('SELECT * FROM SBIR_California WHERE City IN("Blue Lake","Point Arena","Rio Dell","Trinidad","Ross","Ferndale","Colma","Monte Sereno","Yountville","Rio Vista","Portola Valley","Atherton","Brisbane","Cloverdale","American Canyon","Clayton","Clearlake","Calistoga","Piedmont","Woodside","Fairfax","Fortuna","Willits","Hillsborough","Hercules","Moraga","Cotati","Dixon","Suisun City","Crescent City","Fort Bragg","Lakeport","East Palo Alto","Pinole","Oakley","Belvedere","Half Moon Bay","Capitola","Corte Madera","Scotts Valley","Albany","Arcata","Millbrae","San Pablo","San Anselmo","Orinda","El Cerrito","Windsor","Pacifica","St. Helena","Healdsburg","Belmont","Rohnert Park","Benicia","Sausalito","Pittsburg","Ukiah","San Bruno","Saratoga","Emeryville","Pleasant Hill","Newark","Tiburon","Sebastopol","Lafayette","Martinez","Foster City","Brentwood","Sonoma","Union City","Morgan Hill","Dublin","Gilroy","Watsonville","San Carlos","Eureka","Mill Valley","Daly City","Los Altos","Cupertino","Antioch","Danville","South San Francisco","Richmond","Alameda","Milpitas","Menlo Park","Burlingame","Vacaville","Los Gatos","Campbell","Vallejo","Petaluma","San Ramon","Fairfield","Livermore","Novato","San Leandro","Mountain View","Napa","Pleasanton","Redwood City","Santa Cruz","Concord","San Rafael","Sunnyvale","San Mateo","Walnut Creek","Palo Alto","Berkeley","Hayward","Santa Clara","Fremont","Santa Rosa","Oakland","San Jose","San Francisco")')
```


# Generate A City Profile (incomplete)


Export the city 7a & 504 data

```
Novato <- sqldf::sqldf('SELECT * FROM FOIA_SFDO_504_7a WHERE BorrCity IN("NOVATO")')

Novato_SBIR <- sqldf::sqldf('SELECT * FROM SBIR_STTR_1983_2016 WHERE City IN("Novato")')

```
# Searching

Search a specific dataset for a specific row
  
```
grep('ARUN', MyDat$NAME) 

```


# Geocoding


### With Google maps
#### Set-up

```
library(dplyr)
library(tidyverse)
library(devtools)
install_github("dkahle/ggmap")
library(ggmap)

#register and check your key
register_google(key = "[API key]", account_type = "premium")
ggmap_credentials()

```


#### SBIR data

Create your geocoding address column

```
GEOCODED_SBIR_SFDO <- tidyr::unite(SBIR_SFDO,"Address",Address1,City,State,Zip, sep = " , ", remove = FALSE)
```

And geocode it!
```
GEOCODED_SBIR_SFDO <- GEOCODED_SBIR_SFDO %>% mutate_geocode(Address)

```

#### 504/7a FOIA Data

This is difficult to do with the FOIA data because: 

1. The Borrower address is not necessarily the project address.  
2. The Borrower name is not necessarily the business's public-facing name
3. Even when the business is discernable, the business may have since moved to another location



Strategy:
Google radius search followed by a lat/long geocode of BorrAddresses where the Borrcity falls within the project county

Google radius search is probably the best for approaching this issue using the city name and the business name isn't bad for this (but you DO get errors!)



Create a single address column for the 504/7a set

```
GEOCODED_FOIA_SFDO_504_7a <- tidyr::unite(FOIA_SFDO_504_7a,"BorrAddress",BorrStreet,BorrCity,BorrState,BorrZip, sep = " , ", remove = FALSE)
```

Geocoding the 504/7a SFDO Borrower data

```
GEOCODED_FOIA_SFDO_504_7a <- GEOCODED_FOIA_SFDO_504_7a %>% mutate_geocode(BorrAddress, source = c("dsk"))

or (with google)

GEOCODED_FOIA_SFDO_504_7a <- GEOCODED_FOIA_SFDO_504_7a %>% mutate_geocode(BorrAddress)
```


***

#To Do:


1. Subset the SFDO data such that only borrowers whose city resides within the project county are listed (this will increase the accuracy of the geocoding)

2. Make API calls for google PLACES data (grab lat/long, ratings, business name, business type)
3. Generate dynamic reports
  + Pivot table-style summaries
  + Top Ten city lists unadjusted (unit, $)
  + Top Ten city lists Adjusted (unit, $)
  + Top Ten city lists Segmented (unit, $)
  + Top Ten city listsSegmented & Adjusted (unit, $)
  + Top Ten Lender lists (unit, $)

4. Generate visualizations
  + Map of borrower locations
  + Loans over time
  + Loan Heatmap  (unit, $)

4. Package some of the above in a ShinyApp?