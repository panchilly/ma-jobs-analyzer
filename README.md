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

# top 100 towns by score per dollar of house
1. 1 MA,Lynn 19058.88223237781 0.05445394923536517
1. 0.873200526441488 MA,Holbrook 16642.22599869863 0.048962124150334296
1. 0.9529008484263792 MA,Randolph 18161.22504929126 0.0484299334647767
1. 0.9571729213620417 MA,Maynard 18242.64598426018 0.047743119561005444
1. 0.8602659462331278 MA,Avon 16395.707357782245 0.04691189515817524
1. 1.0719332540678341 MA,Everett 20429.849650248372 0.045909774494940166
1. 0.9136847436427049 MA,Stoughton 17413.809926606624 0.04582581559633322
1. 1.0427381519264645 MA,Revere 19873.42363677377 0.04563357895929683
1. 0.7114843890160361 MA,Lowell 13560.097180431912 0.045200323934773044
1. 1.0605192960434915 MA,Chelsea 20212.312368457122 0.04486639815417785
1. 0.6913885455874296 MA,Brockton 13177.092867165798 0.04466811141412135
1. 1.0395971527239924 MA,Saugus 19813.559702881863 0.04452485326490306
1. 1.0248060856469627 MA,Billerica 19531.658497369554 0.04340368554971012
1. 1.0733696231306136 MA,Norwood 20457.22523905812 0.04306784260854341
1. 0.9313251936110687 MA,Millis 17750.01718507982 0.04226194567876148
1. 1.000808992319527 MA,Framingham 19074.300721722575 0.04219978035779331
1. 1.1058022752895489 MA,Woburn 21075.35533703894 0.042154926166694556
1. 0.901519686219298 MA,Weymouth 17181.957529823798 0.04190721348737512
1. 1.0768721673132535 MA,Malden 20523.979816148752 0.041715406130383645
1. 0.9229335949190824 MA,Salem 17590.08269386788 0.041388429867924424
1. 0.9635365347876752 MA,Peabody 18363.929343111708 0.041267256950812826
1. 0.8844802128146961 MA,Hull 16857.204212903758 0.0406197691877199
1. 1.0902850185502977 MA,Dedham 20779.61376827598 0.04019267653438294
1. 0.9071825895903792 MA,Tewksbury 17289.88613826657 0.03938470646529971
1. 0.6981824495512351 MA,Rockland 13306.577082710053 0.03913699141973545
1. 0.5696769658797914 MA,Lawrence 10857.406203201257 0.038776450725718774
1. 0.970480192776073 MA,Quincy 18496.267702974492 0.03746079534779644
1. 1.0245606822450732 MA,Winthrop 19526.981382833514 0.03733648447960519
1. 1.0483826196574384 MA,Wilmington 19981.000882522858 0.03714285878338667
1. 0.7589344352653329 MA,Marlborough 14464.442023818141 0.03699345786142747
1. 0.9022437403153873 MA,Ashland 17195.757191571036 0.03698012299262588
1. 1.078005635203541 MA,Stoneham 20545.582447183922 0.036688540084257
1. 1.1599714472076175 MA,Waltham 22107.759205250837 0.03639137317736763
1. 1.0520242318227289 MA,Wakefield 20050.405939917124 0.036126857549400225
1. 1.1044751404220214 MA,Burlington 21050.061629892254 0.03610645219535549
1. 0.7128744988357845 MA,Hudson 13586.591119776569 0.035943362750731664
1. 0.8751908666465272 MA,Danvers 16680.159658268836 0.03571768663440864
1. 1.1622073733064646 MA,Natick 22150.373457449066 0.03544059753191851
1. 0.8218266891159678 MA,Chelmsford 15663.098083286202 0.03500133649896358
1. 0.7201499307069001 MA,Abington 13725.252718997852 0.03474747523796925
1. 0.982734580051729 MA,Walpole 18729.822626891168 0.03436664702181866
1. 0.8714035183812237 MA,Holliston 16607.977033707415 0.034243251615891576
1. 1.10826357084388 MA,Medford 21122.26487914801 0.03423381665988332
1. 1.0140867403543046 MA,Canton 19327.359757828588 0.03420771638553732
1. 0.5912595326927809 MA,Whitman 11268.74580236245 0.03409605386493933
1. 0.7883559252007515 MA,Medway 15025.182735598373 0.033463658653893925
1. 1.0764451349452193 MA,Boston 20515.841056536978 0.033359091148840614
1. 1.137745416439066 MA,Watertown 21684.155902339808 0.03236441179453703
1. 1.0531703035927482 MA,Reading 20072.248786811775 0.03211559805889884
1. 0.7843330919864558 MA,Beverly 14948.512031126615 0.0319276207414067
1. 0.8845234872268565 MA,Sharon 16858.028974828798 0.03180760183929962
1. 0.9577690735248466 MA,Swampscott 18254.007978123656 0.031472427548489064
1. 1.0717934871868784 MA,Melrose 20427.18584972425 0.03142643976880654
1. 0.5901712989326062 MA,Dracut 11248.005283285984 0.031244459120238845
1. 0.5718996021368468 MA,Milford 10899.767165869887 0.03119120665580165
1. 1.049250387878585 MA,Medfield 19997.53957485469 0.030718186750928866
1. 0.7177897620808907 MA,Foxborough 13680.270543106186 0.030400601206902637
1. 1.1374185605586014 MA,Bedford 21677.92639460707 0.029736524546786106
1. 1.0150206512192477 MA,Lynnfield 19345.159055019074 0.029090464744389585
1. 1.1659322590539023 MA,Wayland 22221.36561623854 0.028235534455195097
1. 1.0404195494862234 MA,Milton 19829.23366592151 0.028027185393528636
1. 0.8341046771320155 MA,Norfolk 15897.102810934603 0.027889654054271233
1. 0.4892581187974705 MA,Bellingham 9324.712867395703 0.027669771119868555
1. 0.8211814748747448 MA,Stow 15650.80102104808 0.027639383701630164
1. 0.9273673915606803 MA,Acton 17674.585901902406 0.027191670618311396
1. 0.6585814678353059 MA,Franklin 12551.826635899612 0.026996078365199724
1. 0.8841800505035795 MA,Middleton 16851.48345476559 0.026854953712773844
1. 1.132740158956203 MA,Arlington 21588.761289431193 0.026818337005504587
1. 1.096934424696243 MA,Westwood 20906.3440169268 0.026803005149906155
1. 1.1030347280673922 MA,Somerville 21022.60898045931 0.02644353330875385
1. 1.0393631910222103 MA,Sudbury 19809.10065436071 0.026413895132156424
1. 0.4833887414067325 MA,Ayer 9212.849094928246 0.025591247485911794
1. 0.48238918849474477 MA,Methuen 9193.798733693642 0.025538329815815674
1. 0.478512571917386 MA,Plainville 9119.914754885678 0.025158385530719113
1. 0.8958631716658149 MA,Marblehead 17074.15068510323 0.024763090188692143
1. 0.7335136637970704 MA,Littleton 13979.950534148336 0.024515476605257932
1. 0.6374926890640257 MA,Wrentham 12149.898084873112 0.024299796169746223
1. 0.5690639059263931 MA,Mansfield 10845.721965748053 0.024101604368329005
1. 1.0341162598523206 MA,Sherborn 19709.10001111239 0.02335201423117582
1. 0.7106671268727611 MA,Westford 13544.521077490255 0.023153027482889325
1. 0.43681349742921133 MA,Hanson 8325.177005016407 0.022379508078001095
1. 0.7567085559637716 MA,Andover 14422.019252346197 0.021752668555574957
1. 0.9944981760151492 MA,Carlisle 18954.02361698727 0.02166174127655688
1. 0.7583393505462062 MA,Boxborough 14453.100374238016 0.02141200055442669
1. 0.6570896556632853 MA,Topsfield 12523.39436340024 0.020959655838326763
1. 1.1512993903094926 MA,Needham 21942.479494116993 0.020354804725525966
1. 0.40080987211190583 MA,Norton 7638.9881501552245 0.020155641557137796
1. 0.5834275581980362 MA,Hanover 11119.477122820123 0.02003509391499121
1. 0.8550482430471502 MA,Hingham 16296.263767237197 0.019873492399069752
1. 1.0803774838089306 MA,Concord 20590.787230427075 0.01977981482269652
1. 0.6816279748704792 MA,Hopkinton 12991.067299350645 0.01924602562866762
1. 1.1461617352337168 MA,Lexington 21844.561531077205 0.018995270896588874
1. 1.1403424883046378 MA,Belmont 21733.65318917476 0.01873590792170238
1. 0.6191979066040724 MA,Norwell 11801.21998050189 0.018511717616473553
1. 0.5676568514691613 MA,Scituate 10818.90508055313 0.018352680374135927
1. 0.32522386746221965 MA,Haverhill 6198.403389120895 0.018338471565446435
1. 0.6726604914816762 MA,Wenham 12820.157089522645 0.018317126860298107
1. 0.5983853026073622 MA,Harvard 11404.555011979475 0.01817458966052506
1. 1.1382432391369752 MA,Newton 21693.643846511866 0.018003023939014
1. 1.1161901570529953 MA,Winchester 21273.33675221233 0.017884267971595064
