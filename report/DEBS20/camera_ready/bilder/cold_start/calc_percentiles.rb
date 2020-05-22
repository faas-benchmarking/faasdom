#!/usr/bin/ruby
# TODO add the possibility to ask for a specific percentile or a set of percentiles (e.g. -p "10 25 50 95 100")

require 'optparse'

options = {}
OptionParser.new do |opts|
  opts.banner = 
    "Usage: calc_percentiles.rb "+
    "[-f/--file inputfile] "+
    "[-c/--col=I] "+
    "[-p/--percentile=I] "+
    "[-h/--help]"

  opts.on("-h", "--help", "Get some help") do
    puts opts.banner
    exit()
  end
  opts.on("-f inputfile", "--file filename", "Inputfile") do |f|
    options[:inputfile] = f
  end
  opts.on("-p integer", "--percentile integer", "Percentiles to output (as a string)") do |s|
    options[:percentile_string] = s
  end
  opts.on("-c integer", "--col integer", "Column to use") do |c|
    options[:column] = c.to_i-1
  end
end.parse!

# check the arguments and apply defaults
if options[:inputfile] and !File.exists?(options[:inputfile])
  puts "File #{options[:inputfile]} does not exist"
  exit()
end
if !options[:column]
  options[:column]=0 # first column is the default
end
if !options[:percentile_string]
  options[:percentile_string]="25 50 75 100" # outputing the median is the default
end

# convert the percentiles string in an array
options[:percentiles]=Array.new
options[:percentile_string].split().each do |p|
  options[:percentiles] << p.to_i
  #puts("perc: #{p.to_i} (string = #{options[:percentile_string]})")
end

# construct the set of elements
$elements=[]
def process_elem(line, col)
  num=line.split(' ')[col]
  $elements << num.to_f
end

if options[:inputfile]
  File.open(options[:inputfile]).each do |line|
    if !(line =~ /(^[[:space:]]*#|^[[:space:]]*$)/)
      process_elem(line,options[:column])
    end
  end
else
  STDIN.readlines.each do |line|
    if !(line =~ /(^[[:space:]]*#|^[[:space:]]*$)/)
      process_elem(line,options[:column])
    end
  end
end

$elements.sort!{|x,y| x<=>y}
if $elements.size == 0 then
  STDERR.puts("calc_percentiles.rb: no data!")
  exit()
end
res=""
options[:percentiles].each do |p|
  # compute the index
  index=((($elements.size - 1) * p)/100)
  res="#{res} #{$elements[index]}"
end
avg=  $elements.inject{ |sum, el| sum + el }.to_f / $elements.size
#puts("#25th 50th 75th 100th min max avg")
puts("#{res.lstrip} #{$elements[0]} #{$elements[-1]} #{avg}") # 1st-quartile, median, 3rd-quartile, min, max, avg