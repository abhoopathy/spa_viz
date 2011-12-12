require "rexml/document"

# A "helper" class. Nodes are created from each line in the txt file
class Node

  attr_accessor :depth, :value, :descendants,
    :path, :sec_id, :xml, :children

  def initialize( depth, value, descendants, path, sec_id )
    @depth = depth
    @value = value
    @descendants = descendants
    @path = path
    @sec_id = sec_id
    @xml = to_XML
    @children = Hash.new
  end

  # return REXML element object <DepthX name="sec_id" >
  def to_XML()
    element = REXML::Element.new "depth#{@depth}"
    element.attributes["name"] = @sec_id
    element.attributes["value"] = @value
    element.attributes["descendants"] = @descendants
    return element
  end

  def has_children?
    return true unless ( @children == nil || @children.empty? )
  end

  def child_exists?(sec_id)
    return @children.has_key?(sec_id)
  end

  def get_child(sec_id)
    return @children[sec_id]
  end

  def add_child(node)
    if (node.class == Node)
      @children[node.sec_id] = node
    end
  end

end


# The main parser
class Parser

  # A 2D array of nodes. Each sub-array contains Nodes  for a single depth.
  # For most of our files, this means 3 sub arrays.
  attr_accessor :all_depths
  @root

  # Constructor, creates a Parser for the file and populates @all_depths
  def initialize(file_name)
    @all_depths = []

    file = File.new(file_name,"r")

    #for each line in the file, parse and add to @all_depths
    file.each do |line|

        # parse line like this:
        #   9 :     2    : 22.19878577 : 32.17893478  : 1 ; Oilseed farming : 19 ; Agriculture and forestry support activities : 130 ; Fertilizer Manufacturing
        #   0 :  1 depth :   2 value   : 3 descendant :                     :                                                        ;

        # into a node like this:
        #   < @Node depth=0, @value=2059.72, @descendants=3026.54506497 @path=[1,19,130] >

        # array of raw column values for each row, defined by ':'
        arr = line.split( ":" ).each{ |a| a.chomp }

        value = arr[2].to_f # value is col 3
        descendants = arr[3].to_f # desc is col 4
        depth = arr[1].to_i # each column after 5 is a depth

        # path to node represented by arr of sec_id's
        path = []
        arr[4..arr.length].each do |path_node|
          path.push( path_node.to_i )
        end

        sec_id = path.last # sec_id is last item in path

        # create Node object and add to @all_depths
        node = Node.new( depth, value , descendants, path, sec_id )
        add_node_to_depths(node)

    end # end each do line

    #see method below
    optimize_depth_array

  end


  # helper method, add method to correct spot in all_depths,
  # which is an array of hashes representing each depth.
  # each hash, indexed by sec_id contains either a singular
  # node, or an array of nodes with the same sec_id
  def add_node_to_depths(node)

    depth = node.depth
    sec_id = node.sec_id

    # if Node array does not exist for depth, we must create one
    if (@all_depths[depth] == nil)
      @all_depths[depth] = Hash.new
    end

    # add this Node to array of nodes for depth
    hash = @all_depths[depth]

    # if there is nothing at this position in the hash
    if !hash.has_key?(sec_id)
      hash[sec_id] = node

    # if there is already an Array at this position, just add node to array
    elsif hash[sec_id].class == Array
      hash[sec_id].push( node )

    # if there is an existing node, replace with Array containing that node
    # and current node
    elsif hash[sec_id].class == Node
      arr = Array.new
      arr.push( hash[sec_id] )
      arr.push( node )
      hash[sec_id] = arr
    end
  end

  # creates a tree structure by iterating through every node, and adding
  # children to parents, making XML generation much quicker
  def optimize_depth_array()

    @root = @all_depths[0].first[1]

    # for each depth in tree
    @all_depths[1..@all_depths.length-1].each do |depth|
      # for each item in depth (could be node or array of nodes)
      depth.each do |sec_id, item|
        if (item.class == Node)
          node = item
          parent = get_parent(node.path)
          parent.add_child(node)
        else # item is array of nodes
          item.each do |node|
            parent = get_parent(node.path)
            parent.add_child(node)
          end
        end
      end
    end

  end

  # get parent of a Node with given path array
  # e.g. [1,43,78,9]
  def get_parent(path)
    parent = @root
    path[1..path.length-1].each do |path_item|
      if parent.child_exists?(path_item)
        parent = parent.get_child(path_item)
      end
    end

    return parent
  end


  # return XML document reflecting all_depths arr
  # must follow optimization
  def get_xml_doc()
    doc = REXML::Document.new "<top description='My Description' name='My Data Set'></top>"
    root_node = @all_depths[0].first[1]
    doc.elements["top"].add_element root_node.xml

    # see method below
    xml_recurse_helper(root_node)

    return doc
  end

  def xml_recurse_helper(node)
    if ( !node.has_children? )
      return
    else
      node.children.each do |sec_id, child|
        node.xml.add_element child.xml
        xml_recurse_helper(child)
      end
    end
  end

end

class Main

  # take start time, for testing
  start = Time.now

  # main method
  parser = Parser.new("1.txt")

  doc = parser.get_xml_doc
  f = File.new "optimized.xml", 'w'
  doc.write f, 2

  # report elapsed time
  stop = Time.now - start
  p stop

end
