<script setup>
import { ref } from 'vue'

const questions = ref([
  { id: 1, q: "Vue 的 v-model 指令主要用途是？", options: ["渲染清單", "雙向資料綁定", "條件判斷", "事件監聽"], ans: 1 },
  { id: 2, q: "宣告響應式狀態常用哪個函數？", options: ["ref", "createState", "bind", "set"], ans: 0 },
  { id: 3, q: "掛載完成後的生命週期鉤子是？", options: ["onCreated", "onMounted", "onUpdated", "onUnmounted"], ans: 1 },
  { id: 4, q: "v-if 與 v-show 的最大區別？", options: ["效能不同", "v-if 會銷毀節點", "v-show 會銷毀節點", "沒區別"], ans: 1 },
  { id: 5, q: "v-for 為什麼建議加 :key？", options: ["為了美觀", "這是強制要求", "優化渲染效能", "為了錯誤除錯"], ans: 2 }
])

const userAnswers = ref(Array(questions.value.length).fill(null))
const isSubmitted = ref(false)

const submitQuiz = () => {
  isSubmitted.value = true
}
</script>

<template>
  <div class="quiz-container">
    <div v-for="(q, i) in questions" :key="q.id" class="q-card">
      <p><strong>{{ i + 1 }}. {{ q.q }}</strong></p>
      
      <div class="options">
        <button v-for="(opt, oIndex) in q.options" :key="oIndex"
          @click="userAnswers[i] = oIndex"
          :class="{ 'selected': userAnswers[i] === oIndex }"
          :disabled="isSubmitted">
          {{ opt }}
        </button>
      </div>

      <div v-if="isSubmitted" class="result" :class="{ 'correct': userAnswers[i] === q.ans, 'wrong': userAnswers[i] !== q.ans }">
        {{ userAnswers[i] === q.ans ? '答對了！' : '答錯了，正確答案是：' + q.options[q.ans] }}
      </div>
    </div>

    <button @click="submitQuiz" class="submit-btn" v-if="!isSubmitted">送出測驗</button>
    <button @click="isSubmitted = false; userAnswers.fill(null)" class="submit-btn" v-else>重做測驗</button>
  </div>
</template>

<style scoped>
.q-card { background: var(--card); padding: 20px; border-radius: 12px; border: 1px solid #27272a; margin-bottom: 20px; }
.options { display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap; }
.options button { padding: 10px 20px; background: #27272a; border: 1px solid #3f3f46; color: white; border-radius: 6px; cursor: pointer; }
.options button.selected { background: var(--accent); }
.submit-btn { width: 100%; padding: 15px; background: var(--accent); color: white; border: none; border-radius: 8px; font-size: 1.1rem; cursor: pointer; }
.result { margin-top: 15px; font-weight: bold; padding: 10px; border-radius: 6px; }
.correct { color: #4ade80; background: #064e3b; }
.wrong { color: #f87171; background: #7f1d1d; }
</style>