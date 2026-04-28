<script setup>
import { ref } from 'vue'
const subTab = ref('settings')
const exam = ref({ subject: '', time: '', proctor: '' })
const questions = ref([])
</script>

<template>
  <div class="exam-wrapper">
    <div class="sub-tabs">
      <button @click="subTab = 'settings'" :class="{ active: subTab === 'settings' }">考試設定</button>
      <button @click="subTab = 'questions'" :class="{ active: subTab === 'questions' }">題目編輯</button>
    </div>

    <div v-if="subTab === 'settings'" class="card">
      <div class="input-row">
        <label>考試科目</label>
        <input v-model="exam.subject" placeholder="例如：期中考">
      </div>
      <div class="input-row">
        <label>考試時間</label>
        <input v-model="exam.time" placeholder="例如：08:00 - 09:00">
      </div>
      <div class="input-row">
        <label>監考老師</label>
        <input v-model="exam.proctor" placeholder="請輸入姓名">
      </div>
    </div>

    <div v-else class="card">
      <button @click="questions.push({id: Date.now()})" class="add-btn">+ 新增題目</button>
      <div v-for="(q, i) in questions" :key="q.id" class="q-item">
        <input v-model="q.text" placeholder="輸入題目內容...">
      </div>
    </div>
  </div>
</template>

<style scoped>
.sub-tabs { display: flex; gap: 15px; margin-bottom: 20px; }
.sub-tabs button { background: transparent; border: none; color: #a1a1aa; cursor: pointer; }
.sub-tabs button.active { color: var(--accent); font-weight: bold; border-bottom: 2px solid var(--accent); }
.card { background: var(--card); padding: 30px; border-radius: 12px; border: 1px solid #27272a; }
.input-row { margin-bottom: 20px; }
.input-row label { display: block; margin-bottom: 8px; color: #a1a1aa; }
input { width: 100%; box-sizing: border-box; background: #09090b; border: 1px solid #3f3f46; padding: 12px; border-radius: 6px; color: white; }
.add-btn { width: 100%; padding: 12px; background: var(--accent); color: white; border: none; border-radius: 6px; cursor: pointer; }
.q-item { margin-top: 15px; }
</style>