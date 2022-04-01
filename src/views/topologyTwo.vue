<template>
  <div class="lean fullScreen"></div>
</template>
<script>
import go from 'gojs'
import {Bus} from '@utils/bus.js'

export default {
  data() {
    return {
      diagram: ''
    }
  },
  mounted() {
    const GO = go.GraphObject.make
    this.diagram = GO(go.Diagram, this.$el, {
      isReadOnly: true
    })
    this.diagram.nodeTemplateMap.add("router",
        GO(go.Node,
            {click: this.clickNode},
            "Vertical",
            new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),

            GO(
                go.Picture,
                {
                  width: 86,
                  height: 70,

                  source: "../../image/router.png"
                },
            ),
            GO(
                go.TextBlock,
                new go.Binding("text", "name")
            )
        ))
    this.diagram.nodeTemplateMap.add("switch",
        GO(go.Node,
            // {click: this.clickNode},
            "Vertical",
            new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),

            GO(
                go.Picture,
                {
                  width: 86,
                  height: 70,

                  source: "../../image/switch.png"
                },
            ),
            GO(
                go.TextBlock,
                new go.Binding("text", "name")
            )
        ))
    this.diagram.nodeTemplateMap.add("pc",
        GO(go.Node,
            // {click: this.clickNode},
            "Vertical",
            new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),

            GO(
                go.Picture,
                {
                  width: 86,
                  height: 70,

                  source: "../../image/pc.png"
                },
            ),
            GO(
                go.TextBlock,
                new go.Binding("text", "name")
            )
        ))
    this.diagram.linkTemplateMap.add("crosswire",
        GO(go.Link,
            GO(go.Shape, {click: this.clickLink, stroke: "red", strokeWidth: 3}),
            GO(go.Shape,
                {toArrow: "Circle", fill: "#00ff0d", scale: 1, stroke: "#00ff0d"}),
            GO(go.Shape,
                {fromArrow: "Circle", fill: "#00ff0d", scale: 1, stroke: "#00ff0d"})
        ))
    this.diagram.linkTemplateMap.add("ink",
        GO(go.Link,
            GO(go.Shape, {click: this.clickLink, stroke: "black", strokeWidth: 1}),
            GO(go.Shape,
                {toArrow: "Circle", fill: "#00ff0d", scale: 1, stroke: "#00ff0d"}),
            GO(go.Shape,
                {fromArrow: "Circle", fill: "#00ff0d", scale: 1, stroke: "#00ff0d"})
        ))
    this.diagram.linkTemplateMap.add("ring",
        GO(go.Link,
            GO(go.Shape, { stroke: "black", strokeWidth: 1}),
            GO(go.Shape,
                {toArrow: "Standard", scale: 1}),
        ))

    this.diagram.model = new go.GraphLinksModel([
          {key: "RouterA", name: "RouterA", category: "router", location: "50 400"},
          {key: "RouterB", name: "RouterB", category: "router", location: "340 100"},
          {key: "RouterC", name: "RouterC", category: "router", location: "630 400"},
          {key: "SwitchA", name: "SwitchA", category: "switch", location: "340 400"},
          {key: "pc1", name: "pc1", category: "pc", location: "340 700"},
        ],
        [
          {from: "RouterA", to: "RouterB", category: "crosswire"},
          {from: "RouterA", to: "RouterA", category: "ring"},
          {from: "RouterC", to: "RouterC", category: "ring"},
          {from: "RouterB", to: "RouterC", category: "crosswire"},
          {from: "SwitchA", to: "RouterB", category: "ink"},
          {from: "SwitchA", to: "RouterA", category: "ink"},
          {from: "SwitchA", to: "RouterC", category: "ink"},
          {from: "pc1", to: "SwitchA", category: "ink"},
        ])

  },
  methods: {
    clickNode(e, node) {
      console.log(node.data)
      Bus.$emit("clickNode", node.data.name)
    },
    clickLink(e, link) {
      console.log(link.part.data)
      Bus.$emit("clickLink", link.part.data.from, link.part.data.to)
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