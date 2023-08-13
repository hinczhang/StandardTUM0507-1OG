<template>
    <div style="margin: 0 auto;" id="container"></div>
    <el-dialog title="选择一个选项" v-model="dialogVisible">
      <el-row>
        <el-col>
          <el-radio-group v-model="selectedOption">
            <el-radio label="0">Totally wrong</el-radio>
            <el-radio label="1">Group correct</el-radio>
            <el-radio label="2">Single correct</el-radio>
            <el-radio label="3">Information correct</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-button type="primary" @click="closeDialog">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-button type="primary" @click="outputData">输出</el-button>
</template>

<script>
import Konva from 'konva';

export default {
  name: 'IndoorMap',
  data () {
    return {
        dialogVisible: false,
        selectedOption: '',
        selectedCircle: null,
        layer: null,
    }
  },
  methods: {
    outputData () {
      var data = [];
      this.layer.find('Circle').forEach(function(circle) {
        data.push(circle.customAttribute);
      });
      console.log(data);
    },
    closeDialog() {
      var num = parseInt(this.selectedOption); 
      switch(num) {
        case 0:
          this.selectedCircle.fill('red');
          this.selectedCircle.customAttribute.score = 0;
          break;
        case 1:
          this.selectedCircle.fill('purple');
          this.selectedCircle.customAttribute.score = 1;
          break;
        case 2:
          this.selectedCircle.fill('green');
          this.selectedCircle.customAttribute.score = 2;
          break;
        case 3:
          this.selectedCircle.fill('blue');
          this.selectedCircle.customAttribute.score = 3;
          break;
        default:
          this.selectedCircle.fill('red');
          this.selectedCircle.customAttribute.score = 0;
      }
      this.dialogVisible = false;
    },
    async loadJSONData() {
      try {
        const response = await fetch("/landmarks.json");
        this.jsonData = await response.json();
        // console.log("JSON data loaded:", this.jsonData);
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
      var _this = this;
      items = this.normalizeAndCenterPoints(items);
      const stage = new Konva.Stage({
        container: 'container', // 用于渲染的容器的 id
        width: 900,
        height: 900,
      });
      _this.layer = new Konva.Layer();
      stage.add(_this.layer);
      var circleSize = 3;

      items.forEach(item => {
        var circle = null;
        if(item.style == 1) {
          circle = new Konva.Circle({
            x: item.y,
            y: item.x,
            radius: circleSize + 2,
            fill: 'yellow',
            draggable: false,
            stroke: 'black',
            strokeWidth: 1
          });
        } else {
          circle = new Konva.Circle({
            x: item.y,
            y: item.x,
            radius: circleSize,
            fill: 'white',
            draggable: false,
            stroke: 'black',
            strokeWidth: 1
          });
        }
        
        item.score = 0;
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
        _this.layer.add(tooltip);

        // 添加悬停事件监听器
        circle.on('mouseenter', function () {
          tooltip.position({
            x: circle.x(),
            y: circle.y() + circle.radius() + 10
          });
          tooltip.show();
          _this.layer.draw();
        });

        // 添加离开事件监听器
        circle.on('mouseleave', function () {
          tooltip.hide();
          _this.layer.draw();
        });

        // 添加点击事件监听器
        circle.on('click', function () {
          _this.dialogVisible = true;
          _this.selectedCircle = circle;
        });
        _this.layer.add(circle);
      });

      _this.layer.draw();

    }
  },
  mounted() {
    this.loadJSONData();
  },
}
</script>

<style>


    .konvajs-content {
      margin: 0 auto;
    }
</style>