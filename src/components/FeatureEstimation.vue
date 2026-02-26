<template>
  <div class="fe" aria-hidden="true">
    <!-- Link/zero-friction variant -->
    <template v-if="variant === 'link'">
      <div class="fe-link-scene">
        <div class="fe-link-card">
          <i class="bi bi-link-45deg fe-link-icon"></i>
          <span class="fe-link-url"
            >planning-poker.app/<strong>abc123</strong></span
          >
        </div>
        <div class="fe-link-arrow">
          <i class="bi bi-arrow-down"></i>
        </div>
        <div class="fe-link-avatars">
          <div
            v-for="av in joiners"
            :key="av.name"
            class="fe-av"
            :style="{ background: av.color }"
          >
            {{ av.initial }}
          </div>
        </div>
        <span class="fe-link-hint">4 players joined instantly</span>
      </div>
    </template>

    <!-- Default: estimation results bars -->
    <template v-else>
      <div class="fe-bars">
        <div class="fe-metric">
          <span class="fe-metric-label">Average</span>
          <span class="fe-metric-value">9.33</span>
        </div>
        <div class="fe-dist">
          <div class="fe-dist-row" v-for="row in bars" :key="row.val">
            <span class="fe-dist-val">{{ row.val }}</span>
            <div class="fe-dist-track">
              <div
                class="fe-dist-fill"
                :style="{ width: row.pct + '%', animationDuration: row.dur }"
              ></div>
            </div>
            <span class="fe-dist-cnt">{{ row.cnt }}</span>
          </div>
        </div>
        <div class="fe-nearest">
          <i class="bi bi-bullseye"></i>
          Nearest in deck: <strong>8</strong>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps({ variant: { type: String, default: "" } });

const bars = [
  { val: "5", pct: 22, cnt: 1, dur: "0.5s" },
  { val: "8", pct: 55, cnt: 2, dur: "0.65s" },
  { val: "13", pct: 33, cnt: 1, dur: "0.55s" },
];

const joiners = [
  { name: "A", initial: "A", color: "#4f46e5" },
  { name: "B", initial: "B", color: "#0891b2" },
  { name: "C", initial: "C", color: "#059669" },
  { name: "D", initial: "D", color: "#dc2626" },
];
</script>

<style scoped lang="scss">
.fe {
  width: 100%;
  padding: 0.25rem 0;
}

/* Estimation bars */
.fe-bars {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.fe-metric {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.fe-metric-label {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #9ca3af;
}

.fe-metric-value {
  font-size: 1.625rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: #1a1a1a;
}

.fe-dist {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.fe-dist-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.fe-dist-val {
  min-width: 1.5rem;
  color: #0f5132;
}
.fe-dist-cnt {
  min-width: 1rem;
  color: #9ca3af;
  text-align: right;
}

.fe-dist-track {
  flex: 1;
  height: 1rem;
  background: rgba(15, 81, 50, 0.08);
  border-radius: 6px;
  overflow: hidden;
}

.fe-dist-fill {
  height: 100%;
  background: linear-gradient(90deg, #198754, #20c997);
  border-radius: 6px;
  width: 0;
  animation: fe-bar-in 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards;
}

@keyframes fe-bar-in {
  to {
    width: var(--w, 100%);
  }
}

.fe-nearest {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8125rem;
  color: #4a5568;
  background: rgba(15, 81, 50, 0.07);
  padding: 0.4rem 0.75rem;
  border-radius: 8px;

  .bi {
    color: #0f5132;
  }
  strong {
    color: #0f5132;
  }
}

/* Link variant */
.fe-link-scene {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.fe-link-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  background: #f8faf9;
  border: 1.5px dashed rgba(15, 81, 50, 0.3);
  border-radius: 10px;
  font-size: 0.8125rem;
  color: #4a5568;
  width: 100%;
  justify-content: center;
}

.fe-link-icon {
  color: #0f5132;
  font-size: 1.1rem;
}

.fe-link-arrow {
  font-size: 1.1rem;
  color: #198754;
  animation: fe-bounce 1.4s ease-in-out infinite;
}

@keyframes fe-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(4px);
  }
}

.fe-link-avatars {
  display: flex;
  gap: 0.25rem;
}

.fe-av {
  width: 1.875rem;
  height: 1.875rem;
  border-radius: 50%;
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: 800;
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.fe-link-hint {
  font-size: 0.75rem;
  color: #9ca3af;
}
</style>
