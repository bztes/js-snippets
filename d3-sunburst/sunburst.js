function Sunburst(nodeId) {
    let width = 932;
    let layers = [0, .3, .7, .95, 1];
    let transTime = 750;
    let domain = [0, 66, 100];
    let range = ["red", "orange", "green"];

    let arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(width / 4)
        .innerRadius(d => radius(d.y0))
        .outerRadius(d => radius(d.y1) - 1);

    let partition = data => {
        var root = d3.hierarchy(data)
            .sum(d => d.size);
        return d3.partition()
            .size([2 * Math.PI, root.height + 1])
            (root);
    };

    var svg = d3.select(nodeId).append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    var g = svg.append("g")
        .attr("transform", `translate(${width / 2},${width / 2})`);

    var path = g.append("g");
    var label = g.append("g");
    var center = g.append("g").attr("class", "center");
    center.append("text");

    // inner shadow
    // var filter = svg.append("defs").append("filter").attr("id", "innerShadow");
    // filter.append("feFlood").attr("flood-color", "black");
    // filter.append("feComposite").attr("operator", "out").attr("in2", "SourceGraphic");
    // filter.append("feGaussianBlur").attr("stdDeviation", "2");
    // filter.append("feComposite").attr("operator", "atop").attr("in2", "SourceGraphic");
    // center.select("text").attr("filter", "url(#innerShadow)");

    var color = d3.scaleLinear().domain(domain).range(range);

    var root;
    var selectedNode;

    this.loadData = function (data) {
        root = partition(data);
        root.each(d => d.current = d);

        path = path.selectAll("path")
            .data(root.descendants(), d => d.data.name)
            .join("path")
            .attr("fill", d => color(d.data.cqi))
            .attr("fill-opacity", d => arcVisible(d.current) ? 1 : 0)
            .attr("d", d => arc(d.current));

        path.filter(d => d.children)
            .style("cursor", "pointer")
            .on("click", clicked);

        path.append("title")
            .text(d => `${d.ancestors().map(d => d.data.name).reverse().join(" >> ")}\nCQI: ${d.data.cqi}`);

        label = label.selectAll("text")
            .data(root.descendants(), d => d.data.name)
            .join("text")
            .attr("dy", "0.35em")
            .attr("fill-opacity", d => +labelVisible(d.current))
            .attr("transform", d => labelTransform(d.current))
            .text(d => d.data.name);

        selectedNode = root;

        center.select("text")
            .text(selectedNode.data.cqi);
    }

    function clicked(node) {
        if (selectedNode == node) {
            node = selectedNode.parent;
        }

        if (node === undefined) {
            return;
        }

        root.each(d => d.target = {
            x0: Math.max(0, Math.min(1, (d.x0 - node.x0) / (node.x1 - node.x0))) * 2 * Math.PI,
            x1: Math.max(0, Math.min(1, (d.x1 - node.x0) / (node.x1 - node.x0))) * 2 * Math.PI,
            y0: Math.max(0, d.y0 - node.depth),
            y1: Math.max(0, d.y1 - node.depth)
        });

        center.transition().duration(150).attr("fill-opacity", 0);

        const t = g.transition().duration(transTime);

        path.transition(t)
            .tween("data", d => {
                const i = d3.interpolate(d.current, d.target);
                return t => d.current = i(t);
            })
            .filter(function (d) {
                return +this.getAttribute("fill-opacity") || arcVisible(d.target);
            })
            .attr("fill-opacity", d => arcVisible(d.target) ? 1 : 0)
            .attrTween("d", d => () => arc(d.current));

        label.filter(function (d) {
            return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        }).transition(t)
            .attr("fill-opacity", d => +labelVisible(d.target))
            .attrTween("transform", d => () => labelTransform(d.current));

        center.select("text").text(node.data.cqi);
        center.transition().duration(150).delay(transTime).attr("fill-opacity", 1);

        selectedNode = node;
    }

    function arcVisible(d) {
        return d.y1 < layers.length && d.x1 > d.x0;
    }

    function labelVisible(d) {
        return d.y1 == 2 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.1;
    }

    function labelTransform(d) {
        var x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        var y = radius(d.y0 + d.y1) / 2;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }

    function radius(y) {
        var radius = width / 2;
        let y0 = Math.floor(y);
        let y0Radius = y0 < layers.length ? layers[y0] : 1.1;
        let y1 = Math.ceil(y);
        let y1Radius = y1 < layers.length ? layers[y1] : 1.1;
        return (y1Radius - y0Radius) * radius * (y - y0) + y0Radius * radius;
    }
}