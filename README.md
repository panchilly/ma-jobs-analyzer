# ma-jobs-analyzer
analyzing physical locations in the greater boston area and their proximity to jobs.

# overview
It should be possible to build a computer model to estimate which areas of Massachusetts are likely to be desirable based on some simple data sources. This model could be used when deciding a town to purchase a home in. Long gone are the days of staying with an employer for an entire career so chosing a location that has a wide variety of employers is ideal. The goal of this program is to solve this problem and find the most optimal location for access to jobs.

This algorithm is looking at 3 pieces of data:

1. the lat/lng coordinates of each town within 50 miles from Boston.
1. the # of jobs in that town according to the official government H1B filings which is public data. I believe H1B filings are a good proxy for total job counts. H1b jobs tend to be high paying and it is a reliable government data source.
1. Using straight line distances to approximate commuting time. In our region, straight line distance is highly correlated with commute time. Using google maps to estimate commute time would obviously be better but that would require special API access. 

# origin of data
For jobs it is using the disclosure file H-1B_FY2018.xlsx located on this government website:
https://www.foreignlaborcert.doleta.gov/performancedata.cfm#dis
For prices it is using 
https://www.bostonmagazine.com/top-places-to-live-2019-single-family-homes/

# simple algorithm
The general idea is: for each town sum up all of the jobs commutable from that town. Towns that have more commutable jobs should be more desirable as they would cater to a larger swath of the population.

Commutable is defined as follows:
* if the job is <= 15 miles away then it is fully commutable
* for each mile over 15 miles the commutability drops by 6%. For example at 25 miles the job is only 40% commutable. So if you are in town A and town B has 1000 jobs at 25 miles away, then town A would receive only 400 jobs since it is penalized by 60%. At 32 miles it is 0% commutable so no jobs at >= 32 miles benefit a town.

# Rationale behind 15 mile cutoff and 6% decay rate
Ultimately any values for these can be used. If you use a lower number (e.g. 5 mile cutoff and 3% decay rate) you skew the top rated towns more urban. 

There have been studies that show that people are perfectly happy to take a commute up to 45 minutes if they attain a better job. Additionally, it has been shown that individuals with shorter commutes tend to upgrade their homes or location as they age in exchange for a longer commute up to 45 minutes. https://www.telegraph.co.uk/news/2018/11/19/45-minutes-ideal-commute-according-scientists/ 

When it comes to driving commutes, i find most individuals are perfectly happy with a 30 minute drive. Most individuals will gladly take a 30min drive to a much better job vs a less optimal job with a 15 minute commute. For train commutes i think this is closer to 45 minutes as train time can be productive time.

Roughly speaking a 15 mile suburb to suburb commute during rush hour should be roughly 30 minutes. 

A 15 mile suburb to city commute would be 1hr during rush hour by car and about 45 by train. 

# output of top 30 towns
1. 1 MA,Weston 22326.416538021247 0.014521246528794307
1. 0.995981463709645 MA,Wellesley 22236.697022929628 0.015469006624646698
1. 0.99529477013905 MA,Wayland 22221.36561623854 0.028235534455195097
1. 0.9921150319724447 MA,Natick 22150.373457449066 0.03544059753191851
1. 0.9913834692944385 MA,Lincoln 22134.04028437623 0.017707232227500987
1. 0.9902063399919981 MA,Waltham 22107.759205250837 0.03639137317736763
1. 0.9828034631867403 MA,Needham 21942.479494116993 0.020354804725525966
1. 0.9784177184850307 MA,Lexington 21844.561531077205 0.018995270896588874
1. 0.9736493041500905 MA,Dover 21738.09992640946 0.01780352164325099
1. 0.9734501348285326 MA,Belmont 21733.65318917476 0.01873590792170238
1. 0.9716581167232194 MA,Newton 21693.643846511866 0.018003023939014
1. 0.9712331517873597 MA,Watertown 21684.155902339808 0.03236441179453703
1. 0.9709541321909042 MA,Bedford 21677.92639460707 0.029736524546786106
1. 0.9669604279157898 MA,Arlington 21588.761289431193 0.026818337005504587
1. 0.9528325656732439 MA,Winchester 21273.33675221233 0.017884267971595064
1. 0.946066057809922 MA,Medford 21122.26487914801 0.03423381665988332
1. 0.9455794606874443 MA,Brookline 21111.400909105367 0.011877018795558575
1. 0.9439649798322187 MA,Woburn 21075.35533703894 0.042154926166694556
1. 0.942832074912004 MA,Burlington 21050.061629892254 0.03610645219535549
1. 0.9416024709858123 MA,Somerville 21022.60898045931 0.02644353330875385
1. 0.9388770560111356 MA,Cambridge 20961.760230495718 0.014972685878925513
1. 0.9363949642937054 MA,Westwood 20906.3440169268 0.026803005149906155
1. 0.9307187175733684 MA,Dedham 20779.61376827598 0.04019267653438294
1. 0.922261178607035 MA,Concord 20590.787230427075 0.01977981482269652
1. 0.9217823375902205 MA,Charlestown 20580.096426430184 0
1. 0.920236456763914 MA,Stoneham 20545.582447183922 0.036688540084257
1. 0.9192688751102087 MA,Malden 20523.979816148752 0.041715406130383645
1. 0.9189043401389152 MA,Boston 20515.841056536978 0.033359091148840614
1. 0.9162789381905534 MA,Norwood 20457.22523905812 0.04306784260854341
1. 0.9150527858089955 MA,Everett 20429.849650248372 0.045909774494940166
