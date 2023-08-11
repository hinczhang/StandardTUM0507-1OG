<template>
    <div id="container"></div>
    <el-dialog title="选择一个选项" v-model="dialogVisible">
      <el-radio-group v-model="selectedOption">
        <el-radio label="1">选项 1</el-radio>
        <el-radio label="2">选项 2</el-radio>
        <el-radio label="3">选项 3</el-radio>
      </el-radio-group>
      <el-button type="primary" @click="closeDialog">确定</el-button>
    </el-dialog>
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
    }
  },
  mounted() {
    // 创建一个 Konva 舞台
    const stage = new Konva.Stage({
      container: 'container', // 用于渲染的容器的 id
      width: 500,
      height: 300,
    });

    // 创建一个 Konva 图层
    const layer = new Konva.Layer();

    // 创建长方形
    const rect = new Konva.Rect({
      x: 150,
      y: 150,
      width: 200,
      height: 100,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 2,
    });

    // 将长方形添加到图层
    layer.add(rect);

    // 将图层添加到舞台
    stage.add(layer);

    // 添加四个小圆圈
    var circleSize = 6;
    var circle1 = new Konva.Circle({
      x: rect.x(),
      y: rect.y(),
      radius: circleSize,
      fill: 'green',
      draggable: true
    });

    var circle2 = new Konva.Circle({
      x: rect.x() + rect.width(),
      y: rect.y(),
      radius: circleSize,
      fill: 'green',
      draggable: true
    });

    var circle3 = new Konva.Circle({
      x: rect.x(),
      y: rect.y() + rect.height(),
      radius: circleSize,
      fill: 'green',
      draggable: true
    });

    var circle4 = new Konva.Circle({
      x: rect.x() + rect.width(),
      y: rect.y() + rect.height(),
      radius: circleSize,
      fill: 'green',
      draggable: true
    });

    // 添加小圆圈到图层
    layer.add(circle1, circle2, circle3, circle4);

    // 更新图层
    layer.draw();

    // 添加点击事件处理
    [circle1, circle2, circle3, circle4].forEach(circle => {
      circle.on('click', () => {
        this.dialogVisible = true;
        circle.fill('red');
        layer.draw();
      });
    });
  },
}
</script>