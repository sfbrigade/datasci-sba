2017-07-05 Business notes

    * 3 uses for dashboards
        * Simply navigating and viewing businesses
            * What filters apply here? 
            * search bar for addresses?
    * Identifying successful businesses (Noah's role)
        * Used to give awards to small businesses
        * Would love to be able to identify more successful small businesses. Currently, the majority of the awards are nominated through resource partners, which is not wholly egalitarian. 
        * Allow active outreach. "Amoeba records", well it's also an SBA program
        * Yelp connects effectively
    * Underserved areas
        * Instead it's "low participation and high participation"
            * Some low and high poverty areas don't participate. Low because of risk, high because of other options
        * Yelp? Older loans, current loans, PIF?
* Definitions of borrower vs project
    * should use project due to data avialable
    * does introduce error in cases where borrower<>project
    * projects in CA AND borrowers in CA
        * Relocate borrower in centroid of project county (what percent fall into this)
        * Google places does "creepy matching" with current address for old data.
            * Is there a better address for the borrower?
            * What about old addresses? Do we have a new address? Do they exist?
                * "Status" from google places API
            * Google API query, had to run 2 queries. First ran address through places to get place ID, then re-run to get specific schema items
        * Places has a 250k limit
    * Status 
        * NOT FUNDED - undetermined loan not funded. 
        * Undisbursed comes before cancelled

