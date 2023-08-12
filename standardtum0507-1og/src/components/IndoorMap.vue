<template>
    <div id="container"></div>
    <!-- <el-dialog title="选择一个选项" v-model="dialogVisible">
      <el-radio-group v-model="selectedOption">
        <el-radio label="1">选项 1</el-radio>
        <el-radio label="2">选项 2</el-radio>
        <el-radio label="3">选项 3</el-radio>
      </el-radio-group>
      <el-button type="primary" @click="closeDialog">确定</el-button>
    </el-dialog> -->
</template>

<script>
import Konva from 'konva';

export default {
  name: 'IndoorMap',
  data () {
    return {
        dialogVisible: false,
        selectedOption: '',
    }
  },
  methods: {
    closeDialog() {
      this.dialogVisible = false;
      console.log(this.selectedOption);
    },
    async loadJSONData() {
      try {
        const response = await fetch("/landmarks.json");
        this.jsonData = await response.json();
        console.log("JSON data loaded:", this.jsonData);
        this.drawPoint(this.jsonData);
      } catch (error) {
        console.error("Error loading JSON data:", error);
      }
    },
    normalizeAndCenterPoints(jsonData) {
      let minX = Number.MAX_VALUE;
      let minY = Number.MAX_VALUE;
      let maxX = Number.MIN_VALUE;
      let maxY = Number.MIN_VALUE;

      const width = 800;
      const height = 800;
      // 找出最小和最大的 x、y 坐标
      for (const point of jsonData) {
        if (point.x < minX) minX = point.x;
        if (point.y < minY) minY = point.y;
        if (point.x > maxX) maxX = point.x;
        if (point.y > maxY) maxY = point.y;
      }

      const scaleX = width / (maxX - minX);
      const scaleY = height / (maxY - minY);
      const scale = Math.min(scaleX, scaleY);

      const offsetX = (width - (maxX - minX) * scale) / 2;
      const offsetY = (height - (maxY - minY) * scale) / 2;

      // 标准化并居中点群
      for (const point of jsonData) {
        point.x = (point.x - minX) * scale + offsetX + 10;
        point.y = (point.y - minY) * scale + offsetY + 10;
      }
      return jsonData;
    },

    drawPoint(items) {
      items = this.normalizeAndCenterPoints(items);
      const stage = new Konva.Stage({
        container: 'container', // 用于渲染的容器的 id
        width: 900,
        height: 900,
      });
      const layer = new Konva.Layer();
      stage.add(layer);
      var circleSize = 3;

      items.forEach(item => {
        var circle = new Konva.Circle({
          x: item.y,
          y: item.x,
          radius: circleSize,
          fill: 'green',
          draggable: false
        });
        circle.customAttribute = item;
        // 创建提示框
        var tooltip = new Konva.Label({
          opacity: 0.75,
          visible: false,
          listening: false // 禁止交互
        });
        tooltip.add(new Konva.Tag({
          fill: 'black',
          pointerDirection: 'down',
          pointerWidth: 5,
          pointerHeight: 5
        }));
        tooltip.add(new Konva.Text({
          text: item.objectName,
          fontFamily: 'Calibri',
          fontSize: 10,
          padding: 4,
          fill: 'white'
        }));
        layer.add(tooltip);

        // 添加悬停事件监听器
        circle.on('mouseenter', function () {
          tooltip.position({
            x: circle.x(),
            y: circle.y() + circle.radius() + 10
          });
          tooltip.show();
          layer.draw();
        });

        // 添加离开事件监听器
        circle.on('mouseleave', function () {
          tooltip.hide();
          layer.draw();
        });
        layer.add(circle);
      });

      layer.draw();

    }
  },
  mounted() {
    this.loadJSONData();


  },
}
</script>