
subfold=ghg
for f in $subfold/*.txt
do
  newvar=${f//ghg\//}
  final=${newvar//.txt/}
  echo processing $f
  perl spa2xml.pl $f >> ghg/processed/ghg_$final.xml
done
