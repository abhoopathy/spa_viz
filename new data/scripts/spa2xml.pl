
# Node Object = {id => ?, depth => ?, value_here => ?, value_total => ?, drilldown_array => ?}

# static declarations
$SPA_DELIM = ':';

# Perl trim function to remove whitespace from the start and end of the string
sub trim($)
{
	my $string = shift;
	$string =~ s/^\s+//;
	$string =~ s/\s+$//;
	return $string;
}

# chomps the sector name and just leaves the sector number from the sector string
sub getSectorNumber($)
{
	my $string = shift;
	$string =~ /^([0-9]*)\s*.*$/;
	return $1;
}

sub buildNodeObj($)
{
	my $line = shift;
	my $obj = {};
	$obj->{"drilldown"} = ();
	
	@tokens = split($SPA_DELIM, $line);
	$obj->{"id"} = trim(@tokens[0]);
	#print "id=".$obj->{"id"}."\n";
	$obj->{"depth"} = trim(@tokens[1]);
	#print "depth=".$obj->{"depth"}."\n";
	$obj->{"value_here"} = trim(@tokens[2]);
	#print "value=".$obj->{"value_here"}."\n";
	$obj->{"value_total"} = trim(@tokens[3]);
	foreach $elem (@tokens[4 .. $#tokens]) {
		push(@{$obj->{"drilldown"}}, getSectorNumber(trim($elem)));
		#print "drilldown=".trim($elem)."\n";
	}
	return $obj;
}

sub printXMLTree
{
	my $node = shift;
	my $height = shift;
	my $all = shift;
	
	printNodeTag($height, $node);
	foreach $curr (@$all) {
		if (checkParent($curr, $node) == 1) {
			printXMLTree($curr, $height + 1, $all);
		}
	}
	printCloseTag($height);
}

sub printNodeTag
{
	my $height = shift;
	my $node = shift;
	for ($i=0; $i<$height; $i++) {
		print "\t";
	}
	print "<depth".$height." ";
	print "name=\"".$node->{"drilldown"}[$node->{"depth"}]."\" ";
	print "value=\"".$node->{"value_here"}."\" ";
	$total = $total + $node->{"value_here"};
	print ">\n";
}

sub printCloseTag
{
	my $height = shift;
	for ($i=0; $i<$height; $i++) {
		print "\t";
	}
	print "</depth".$height.">\n";
}

sub checkParent
{
	my $child = shift;
	my $parent = shift;

	if ($child->{"depth"} != $parent->{"depth"} + 1) {
		return -1;
	}
	else {
		$index = 0;
		while ($index <= $parent->{"depth"}) {
			# print ${$child->{"drilldown"}}[$index]."\n";
			# print ${$parent->{"drilldown"}}[$index]."\n";
			if (${$child->{"drilldown"}}[$index] ne
					${$parent->{"drilldown"}}[$index]) {
				# print "not equal\n";	
				return -1;		
			}
			else {
				# print "equal strings\n";
			}
			$index++;
		}
	}
	return 1;
}

@nodes = ();

while(<>)
{
	push(@nodes, buildNodeObj($_));	
}

print "<top name=\"My Data Set\" description=\"My Description\" >\n";
printXMLTree(@nodes[0], 0, \@nodes);
print "</top>\n";
