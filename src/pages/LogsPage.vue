<template>
  <div class="page" style="padding:24px;">
    <h1>Logs de Auditoria</h1>
    <table class="logs-table">
      <thead><tr><th>Timestamp</th><th>Usuário</th><th>Ação</th><th>Detalhes</th></tr></thead>
      <tbody>
        <tr v-for="l in logs" :key="l.id">
          <td>{{ l.ts }}</td>
          <td>{{ l.user }}</td>
          <td>{{ l.action }}</td>
          <td>{{ l.details }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
import { logs } from '../service/mockData'
</script>
<style scoped>
.logs-table { width:100%; border-collapse: collapse }
.logs-table th, .logs-table td { border:1px solid #eee; padding:8px }
</style>
