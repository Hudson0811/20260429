<script setup>
import { onMounted, ref } from 'vue';
import p5 from 'p5';

const canvasContainer = ref(null);

onMounted(() => {
  new p5((p) => {
    p.setup = () => {
      p.createCanvas(400, 400).parent(canvasContainer.value);
      p.background(220);
    };

    p.draw = () => {
      p.fill(255, 0, 0);
      p.ellipse(p.mouseX, p.mouseY, 50, 50); // 滑鼠畫圓
    };
  });
});
</script>

<template>
  <div ref="canvasContainer"></div>
</template>