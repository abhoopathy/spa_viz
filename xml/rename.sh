for f in water/water_*.xml
do
  final=${f##water*r_}
  mv $f water/$final
done
