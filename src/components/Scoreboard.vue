<script setup>
import { ref } from 'vue'
const teams = ref([{ id: 1, name: '第一組', score: 0 }])
const addTeam = () => teams.value.push({ id: Date.now(), name: `第${teams.value.length + 1}組`, score: 0 })
</script>

<template>
  <div class="score-container">
    <button @click="addTeam" class="add-team-btn">+ 新增組別</button>
    <div class="grid">
      <div v-for="t in teams" :key="t.id" class="card">
        <h3 class="team-name">{{ t.name }}</h3>
        <div class="score">{{ t.score }}</div>
        <div class="controls">
          <button @click="t.score--" class="btn-sub">-</button>
          <button @click="t.score++" class="btn-add">+ 加分</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.add-team-btn { padding: 10px 20px; background: #27272a; color: white; border: none; border-radius: 6px; cursor: pointer; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin-top: 20px; }
.card { background: var(--card); padding: 25px; border-radius: 12px; text-align: center; border: 1px solid #27272a; }
.score { font-size: 3.5rem; font-weight: 800; margin: 15px 0; }
.controls { display: flex; gap: 10px; }
.controls button { flex: 1; padding: 10px; border: none; border-radius: 6px; cursor: pointer; }
.btn-sub { background: #3f3f46; color: white; }
.btn-add { background: var(--accent); color: white; }
</style>