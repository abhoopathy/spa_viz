require "rexml/document"

# A "helper" class. Nodes created form text file
# and then converted to XML
class Node

  # creates getter/setter for these variables:
  # @depth_num
  # @value
  # @descendants
  # @path
  attr_accessor :depth_num, :value, :descendants, :path, :sector_id

  def initialize( depth, value, descendants, path )
    @depth_num = depth
    @value = value
    @descendants = descendants
    @path = path
    @sector_id = @path.last
  end

  def to_XML()
    element = REXML::Element.new "depth#{@depth_num}"
    element.attributes["name"] = @sector_id
    element.attributes["value"] = @value
    element.attributes["descendants"] = @descendants
    return element
  end

end


# The main parser
class Parser

  # A 2D array of nodes. Each sub-array contains Nodes  for a single depth.
  # For most of our files, this means 3 sub arrays.
  @all_depths

  # Constructor, creates a Parser for the file and populates @all_depths
  def initialize(file_name)
    @all_depths = []

    file = File.new(file_name,"r")

    #for each line in the file
    file.each do |line|

        # parse line like this:
        #   9 :     2    : 22.19878577 : 32.17893478  : 1 ; Oilseed farming : 19 ; Agriculture and forestry support activities : 130 ; Fertilizer Manufacturing
        #   0 :  1 depth :   2 value   : 3 descendant :                     :                                                        ;

        # into a depth like this:
        #   < @depth=0, @value=2059.72, @descendants=3026.54506497 @path=[1,19,130] >

        # array of raw column values for each row, defined by ':'
        arr = line.split( ":" ).each{ |a| a.chomp }

        # value is the 3rd column, conv to float
        value = arr[2].to_f

        # desc is the 4th column, conv to float
        descendants = arr[3].to_f

        # each column after the 5th is another depth
        depth = arr[1].to_i

        # path to this node represented by integer array of sector IDs
        path = []
        arr[4..arr.length].each do |path_node|
          path.push( path_node.to_i )
        end

        # create Node object and add to node array
        d = Node.new( depth, value , descendants, path )

        # if Node array does not exist for depth, we must create one
        if (@all_depths[depth] == nil)
          @all_depths[depth] = []
        end

        # add this Node to array of nodes for depth
        @all_depths[ depth ].push( d )

    end ##end each do line
  end


  def get_xml_doc()
    doc = REXML::Document.new "<top description='My Description' name='My Data Set'></top>"

    #add depth node to xml
    depth0 = @all_depths[0][0]
    depth0_XML = depth0.to_XML

    doc.root.add_element depth0_XML

    @all_depths[1..@all_depths.length].each do |depth|

       depth.each do |node|
         path_string = "top"
         i = 0
         node.path[0...node.path.length-1].each do |path_item|
           path_string << "/depth#{i}[@name='#{path_item}']"
           i = i+1
         end

         parent = doc.elements[path_string]
         parent.add_element(node.to_XML)

       end
     end

    return doc
  end
end

start = Time.now

p = Parser.new("1.txt")
doc = p.get_xml_doc
f = File.new "nonopt.xml", "w"
doc.write f, 2

#p stop = Time.now - start

#p stop
