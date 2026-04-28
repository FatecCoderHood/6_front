<template>
  <div class="page" style="padding:24px;">
    <h1>Usuários</h1>
    <table class="users-table">
      <thead><tr><th>ID</th><th>Nome</th><th>Email</th></tr></thead>
      <tbody>
        <tr v-for="u in users" :key="u.id"><td>{{u.id}}</td><td>{{u.name}}</td><td>{{u.email}}</td></tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
import { users } from '../service/mockData'
</script>
<style scoped>
.users-table { width:100%; border-collapse: collapse }
.users-table th, .users-table td { border:1px solid #eee; padding:8px }
</style>
