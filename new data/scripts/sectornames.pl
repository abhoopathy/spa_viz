# Perl trim function to remove whitespace from the start and end of the string
sub trimQuotes($)
{
	my $string = shift;
	$string =~ s/^[\s"']*//;
	$string =~ s/[\s"']*$//;
	return $string;
}

# chomps the sector name and just leaves the sector number from the sector string
sub getSectorNumber($)
{
	my $string = shift;
	$string =~ /^([0-9]*)\s*.*$/;
	return $1;
}

# chomps the sector number and just leaves the sector name from the sector string
sub getSectorName($)
{
	my $string = shift;
	$string =~ /^[0-9]*\s*;(.*)$/;
	return $1;
}


opendir(DIRHANDLE, $ARGV[0]);
@files = sort readdir(DIRHANDLE);
closedir(DIRHANDLE);

foreach $file (@files)
{
	$file =~ /^.*\_([0-9]*)\.txt/;
	# print "$1 : $file\n";
	open(FILE, "$ARGV[0]/$file") or die $!;
	my @lines = <FILE>;
	$lines[0] =~ /^.*:([^:]*)$/;
	$sector = $1;
	# print "sector number:".getsectornumber(trimquotes($sector))."\n";
	# print "sector name:".trimquotes(getsectorname(trimquotes($sector)))."\n";
	print getSectorNumber(trimQuotes($sector)).",";
	print trimQuotes(getSectorName(trimQuotes($sector)))."\n";
	close FILE;

}
