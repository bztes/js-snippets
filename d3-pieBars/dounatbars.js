function DounatBars(nodeId) {
  var transTime = 750;

  var svg = d3
    .select(nodeId)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%");
  var width = 600;

  var pieSize = 100;
  var textSize = 20;
  var height = 300;

  var domain = [0, 66, 100];
  var range = ["red", "orange", "green"];
  var color = d3.scaleLinear().domain(domain).range(range);

  var pie = d3.pie().value((d) => d.data["Overall"].size);
  var arc = d3
    .arc()
    .innerRadius((pieSize / 2) * 0.5)
    .outerRadius((pieSize / 2) * 0.9);

  this.loadData = function (data, keys) {
    var x = d3
      .scaleBand()
      .rangeRound([0, width])
      .domain(data.map((d) => d.name))
      .paddingInner(0.05);
    var y = d3.scaleLinear().rangeRound([0, height]).domain([0, keys.length]);

    var parents = svg.selectAll(".parentGroup").data(data, (d) => d.name);

    parents
      .exit()
      .transition()
      .duration(transTime)
      .style("opacity", 0)
      .remove();

    var parentsEnter = parents
      .enter()
      .append("g")
      .attr("class", "parentGroup")
      .attr("transform", (d) => `translate(${x(d.name)}, 0)`);

    text = parentsEnter
      .append("text")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("dy", textSize / 2)
      .attr("dx", x.bandwidth() / 2)
      .text((d) => d.name);

    parents
      .select("text")
      .transition()
      .duration(transTime)
      .attr("dy", textSize / 2)
      .attr("dx", x.bandwidth() / 2);

    parentsEnter
      .append("g")
      .attr("class", "pieGroup")
      .attr(
        "transform",
        `translate(${x.bandwidth() / 2}, ${textSize + pieSize / 2})`
      );

    parentsEnter.append("g").attr("class", "barsGroup");

    parents = parentsEnter.merge(parents);

    parents
      .transition()
      .duration(750)
      .attr("transform", (d) => `translate(${x(d.name)}, 0)`);

    var pieGroup = parents.select(".pieGroup");
    pieGroup
      .transition()
      .duration(750)
      .attr(
        "transform",
        `translate(${x.bandwidth() / 2}, ${textSize + pieSize / 2})`
      );
    piePath = pieGroup.selectAll("path").data(pie(data));
    piePath.exit().remove();
    piePathEnter = piePath
      .enter()
      .append("path")
      .attr("fill", (d, i) => color(d.data.data["Overall"].cqi))
      .attr("opacity", function (d, i) {
        return d3.select(this.parentNode).datum() == d.data ? 1 : 0.1;
      })
      .attr("d", arc)
      .each(function (d) {
        this._current = d;
      });

    piePathEnter
      .merge(piePath)
      .transition()
      .duration(750)
      .attrTween("d", arcTween);

    var children = parents.select(".barsGroup");

    var childRects = children.selectAll("rect").data(
      (d) => d3.entries(d.data).filter((d) => keys.includes(d.key)),
      (d) => d.key
    );

    childRects
      .exit()
      .transition()
      .duration(transTime)
      .attr("opacity", 0)
      .remove();

    var childRectsEnter = childRects
      .enter()
      .append("rect")
      .attr("opacity", 0)
      .attr("y", (d, i) => textSize + pieSize + height - y(i + 1))
      .attr("height", (d, i) => y(i + 1) - y(i))
      .attr("width", x.bandwidth())
      .style("fill", (d) => color(d.value.cqi));

    childRects = childRectsEnter
      .merge(childRects)
      .transition()
      .duration(transTime)
      .attr("opacity", 1)
      .attr("y", (d, i) => textSize + pieSize + height - y(i + 1))
      .attr("height", (d, i) => y(i + 1) - y(i))
      .attr("width", x.bandwidth())
      .style("fill", (d) => color(d.value.cqi));

    function arcTween(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function (t) {
        return arc(i(t));
      };
    }
  };
}
