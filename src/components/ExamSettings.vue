<template>
  <div class="card">
    <div class="input-row">
      <label>考試科目</label>
      <input placeholder="例如：期中考">
    </div>
    <div class="input-row">
      <label>考試時間</label>
      <input placeholder="例如：08:00 - 09:00">
    </div>
    <div class="input-row">
      <label>監考老師</label>
      <input placeholder="請輸入姓名">
    </div>
  </div>
</template>

<style scoped>
.card { background: var(--card); padding: 30px; border-radius: 12px; border: 1px solid #27272a; }
.input-row { margin-bottom: 20px; }
.input-row label { display: block; margin-bottom: 8px; color: #a1a1aa; }
input { width: 100%; box-sizing: border-box; background: #09090b; border: 1px solid #3f3f46; padding: 12px; border-radius: 6px; color: white; }
</style>