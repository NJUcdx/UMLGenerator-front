<template>
  <div class="lean fullScreen"></div>
</template>
<script>
import go from 'gojs'
import {Bus} from '@utils/bus.js'

export default {
  props: ['LinksModel','NodesModel'],
  data() {
    return {
      diagram: ''
    }
  },
  mounted() {
    Bus.$on("update",()=>{
      this.diagram.div=null
      this.init()
    })
    this.init()
  },
  methods: {
    init(){
      const GO = go.GraphObject.make
      this.diagram = GO(go.Diagram, this.$el, {
        "undoManager.isEnabled": true,
        layout: GO(go.TreeLayout,
            { // this only lays out in trees nodes connected by "generalization" links
              angle: 90,
              path: go.TreeLayout.PathSource,  // links go from child to parent
              setsPortSpot: false,  // keep Spot.AllSides for link connection spot
              setsChildPortSpot: false,  // keep Spot.AllSides
              // nodes not connected by "generalization" links are laid out horizontally
              arrangement: go.TreeLayout.ArrangementHorizontal
            })
      });
      let propertyTemplate =
          GO(go.Panel, "Horizontal",
              // property visibility/access
              GO(go.TextBlock,
                  {isMultiline: false, editable: false, width: 12},
                  new go.Binding("text", "visibility", this.convertVisibility)),
              // property name, underlined if scope=="class" to indicate static property
              GO(go.TextBlock,
                  {isMultiline: false, editable: true},
                  new go.Binding("text", "name").makeTwoWay(),
                  new go.Binding("isUnderline", "scope", s => s[0] === 'c')),
              // property type, if known
              GO(go.TextBlock, "",
                  new go.Binding("text", "type", t => t ? ": " : "")),
              GO(go.TextBlock,
                  {isMultiline: false, editable: true},
                  new go.Binding("text", "type").makeTwoWay()),
              // property default value, if any
              GO(go.TextBlock,
                  {isMultiline: false, editable: false},
                  new go.Binding("text", "default", s => s ? " = " + s : ""))
          );
      let methodTemplate =
          GO(go.Panel, "Horizontal",
              // method visibility/access
              GO(go.TextBlock,
                  {isMultiline: false, editable: false, width: 12},
                  new go.Binding("text", "visibility", this.convertVisibility)),
              // method name, underlined if scope=="class" to indicate static method
              GO(go.TextBlock,
                  {isMultiline: false, editable: true},
                  new go.Binding("text", "name").makeTwoWay(),
                  new go.Binding("isUnderline", "scope", s => s[0] === 'c')),
              // method parameters
              GO(go.TextBlock, "()",
                  // this does not permit adding/editing/removing of parameters via inplace edits
                  new go.Binding("text", "parameters", function (parr) {
                    var s = "(";
                    for (var i = 0; i < parr.length; i++) {
                      var param = parr[i];
                      if (i > 0) s += ", ";
                      s += param.name + ": " + param.type;
                    }
                    return s + ")";
                  })),
              // method return type, if any
              GO(go.TextBlock, "",
                  new go.Binding("text", "type", t => t ? ": " : "")),
              GO(go.TextBlock,
                  {isMultiline: false, editable: true},
                  new go.Binding("text", "type").makeTwoWay())
          );


      this.diagram.nodeTemplate = GO(go.Node, "Auto",
          {
            locationSpot: go.Spot.Center,
            fromSpot: go.Spot.AllSides,
            toSpot: go.Spot.AllSides
          },
          GO(go.Shape, {fill: "lightyellow"}),
          GO(go.Panel, "Table",
              {defaultRowSeparatorStroke: "black"},
              // header
              GO(go.TextBlock,
                  {
                    row: 0, columnSpan: 2, margin: 3, alignment: go.Spot.Center,
                    font: "bold 12pt sans-serif",
                    isMultiline: false, editable: true
                  },
                  new go.Binding("text", "name").makeTwoWay()),
              // properties
              GO(go.TextBlock, "Properties",
                  {row: 1, font: "italic 10pt sans-serif"},
                  new go.Binding("visible", "visible", v => !v).ofObject("PROPERTIES")),
              GO(go.Panel, "Vertical", {name: "PROPERTIES"},
                  new go.Binding("itemArray", "properties"),
                  {
                    row: 1, margin: 3, stretch: go.GraphObject.Fill,
                    defaultAlignment: go.Spot.Left, background: "lightyellow",
                    itemTemplate: propertyTemplate
                  }
              ),
              GO("PanelExpanderButton", "PROPERTIES",
                  {row: 1, column: 1, alignment: go.Spot.TopRight, visible: false},
                  new go.Binding("visible", "properties", arr => arr.length > 0)),
              // methods
              GO(go.TextBlock, "Methods",
                  {row: 2, font: "italic 10pt sans-serif"},
                  new go.Binding("visible", "visible", v => !v).ofObject("METHODS")),
              GO(go.Panel, "Vertical", {name: "METHODS"},
                  new go.Binding("itemArray", "methods"),
                  {
                    row: 2, margin: 3, stretch: go.GraphObject.Fill,
                    defaultAlignment: go.Spot.Left, background: "lightyellow",
                    itemTemplate: methodTemplate
                  }
              ),
              GO("PanelExpanderButton", "METHODS",
                  {row: 2, column: 1, alignment: go.Spot.TopRight, visible: false},
                  new go.Binding("visible", "methods", arr => arr.length > 0))
          )
      );


      this.diagram.linkTemplate = GO(go.Link,
          {routing: go.Link.Orthogonal},
          new go.Binding("isLayoutPositioned", "type", this.convertIsTreeLink),
          GO(go.Shape, {}, new go.Binding("strokeDashArray", "type", this.convertLinkType)),
          GO(go.Shape, {scale: 1.3, fill: "white"},
              new go.Binding("fromArrow", "type", this.convertFromArrow)),
          GO(go.Shape, {scale: 1.3},
              new go.Binding("fill", "type", this.convertToColor),
              new go.Binding("toArrow", "type", this.convertToArrow))
      );


      this.diagram.model = new go.GraphLinksModel(this.NodesModel,this.LinksModel)
    },
    convertVisibility(v) {
      switch (v) {
        case "public":
          return "+";
        case "private":
          return "-";
        case "protected":
          return "#";
        case "package":
          return "~";
        default:
          return v;
      }
    },
    convertIsTreeLink(r) {
      return r === "generalization";
    },

    convertFromArrow(r) {
      switch (r) {
        case "aggregation":
          return "BackWardOpenTriangle";
        case "composition":
          return "BackWardOpenTriangle";
        default:
          return "";
      }
    },

    convertToArrow(r) {
      switch (r) {
        case "generalization":
          return "Triangle";
        case "aggregation":
          return "StretchedDiamond";
        case "realization":
          return "Triangle";
        case "association":
          return "OpenTriangle";
        case "composition":
          return "StretchedDiamond";
        default:
          return "";
      }
    },
    convertLinkType(r) {
      switch (r) {
        case "realization":
          return [6, 3];
        default:
          return [6, 0];
      }
    },
    convertToColor(r) {
      switch (r) {
        case "composition":
          return "black";
        default:
          return "white";
      }
    }
  }
}
</script>
<style scoped>
.lean {
  height: 100%;
  width: 100%;
  background: #f8f8f8;
}

.fullScreen {
  height: 100%;
  width: 100%;
}
</style>