<template>
  <div class="home-page">
    <h1>Home</h1>
    <div class="modules">
      <router-link to="/mapa" class="module">🗺️<span>Mapa</span></router-link>
      <router-link to="/dashboard" class="module">📊<span>Dashboard</span></router-link>
      <router-link to="/usuarios" class="module">👥<span>Usuários</span></router-link>
      <router-link to="/logs" class="module">📜<span>Logs</span></router-link>
      <router-link to="/reserva" class="module">📅<span>Reserva</span></router-link>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped>
.home-page { padding: 32px; }
.modules { display:flex; gap:16px; flex-wrap:wrap }
.module { width:140px; height:120px; background:#fff; color:#111; display:flex; flex-direction:column; align-items:center; justify-content:center; text-decoration:none; border-radius:8px; box-shadow:0 2px 12px #0002 }
.module span { margin-top:8px }
</style>
