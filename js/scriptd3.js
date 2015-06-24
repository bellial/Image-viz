var insertPoint = "body";
var dir = "/data/images/";
var fileName = "tweets_imagens.csv";
var title = "Image Vis";

var viewBox = d3.select("body")
.append("div")
.attr("class","view")
.style("opacity",0).style("position","absolute").style("background-color","lightcyan")
.style("text-align","center").style("border-radius","2px");

var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 10,
    height = 10;

    
var y;
var n;
var counter;
var thumbnail_width;

reset();

var increment = 2;
var limit = 1000;
var dsv = d3.dsv("|","text/plain");

dsv(fileName,function(error,data){ console.log(data[0]);
  var svg = d3.select(insertPoint).append("svg")
    .attr("width", width + margin.left + margin.right + 200)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    data.sort(function(a,b){return (b.rt_count - a.rt_count);});
    
    var images = svg.selectAll("a")
    .data(data)
    .enter()
    .append("a")
    .attr("xlink:href",function(d){return d.media_url;})
    .attr("target","_blank")
    .append("image")
    .attr("xlink:href",function(d){return d.media_url})
    .attr("x",function(d){return calcX();})
    .attr("width",function(d,i){if(i==0){reset()}; return calcWidth();})
    .attr("height",function(d,i){if(i==0){reset()}; return calcWidth();})
    .attr("y",function(d,i){if(i==0){reset()}; return calcY();})
    .on("mouseover",function(d){
       var str = "<span>" + d.text + "</span><br>" + "<span>" + d.rt_count + "</span><br>";
       viewBox.html(str).style("opacity",1).style("left", (d3.event.pageX +20) + "px").style("top", (d3.event.pageY - 12) + "px");
    });
  
});

function reset(){
  y = 0;
  n = 4;
  counter = 0;  
  thumbnail_width = parseInt(width/n);
}

function calcX(){
  r = thumbnail_width * counter;  
  counter++;
    if (counter == n){
    counter = 0;
    n = n + increment;
    thumbnail_width = parseInt(width/n);
  }
  return r;
}

function calcWidth(){
  r = thumbnail_width;
  counter++;
    if (counter == n){
    counter = 0;
    n = n + increment;
    thumbnail_width = parseInt(width/n);
  }
  return r;
}

function calcY(){
  counter++;
  var r = y;
  if (counter == n){
    counter = 0;
    n = n + increment;
    y = y + thumbnail_width;
    thumbnail_width = parseInt(width/n);    
  }
  return r;  
}
