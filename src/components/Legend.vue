<!-- src/components/Legend.vue -->
<template>
  <div class="legend-container">
    <div class="legend-title">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path :d="mdiPalette"/>
      </svg>
      {{ t('legend.title') }}
    </div>
    <div class="legend-items">
      <div class="legend-item">
        <div class="legend-color" style="background: #4CAF50;"></div>
        <div class="legend-text">
          <strong>{{ t('legend.green.title') }}</strong>
          <span>{{ t('legend.green.description') }}</span>
        </div>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #FF9800;"></div>
        <div class="legend-text">
          <strong>{{ t('legend.orange.title') }}</strong>
          <span>{{ t('legend.orange.description') }}</span>
        </div>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #F44336;"></div>
        <div class="legend-text">
          <strong>{{ t('legend.red.title') }}</strong>
          <span>{{ t('legend.red.description') }}</span>
        </div>
      </div>
    </div>
    <div class="legend-footer">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path :d="mdiInformation"/>
      </svg>
      {{ t('legend.footer') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { mdiPalette, mdiInformation } from '@mdi/js'

const { t } = useI18n()
</script>

<style scoped>
.legend-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  font-family: 'Segoe UI', sans-serif;
  min-width: 220px;
  pointer-events: none;
}

.legend-title {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 6px;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legend-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.legend-text strong {
  font-size: 11px;
  color: #fff;
}

.legend-text span {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.3;
}

.legend-footer {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  gap: 4px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 4px;
}
</style>