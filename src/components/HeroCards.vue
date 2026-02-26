<template>
  <div class="hc" aria-hidden="true">
    <!-- Ambient glow -->
    <div class="hc-glow" />

    <!-- Card fan -->
    <div class="hc-fan">
      <div
        v-for="(card, i) in cards"
        :key="i"
        class="hc-slot"
        :style="{ transform: card.slotTransform }"
      >
        <div
          class="hc-card"
          :class="{ 'hc-card--selected': card.selected }"
          :style="{ animationDelay: card.floatDelay }"
        >
          <span class="hc-pip hc-pip--tl">{{ card.value }}</span>
          <span class="hc-suit hc-suit--tl" aria-hidden="true">♠</span>
          <span class="hc-center-value">{{ card.value }}</span>
          <span class="hc-suit hc-suit--br" aria-hidden="true">♠</span>
          <span class="hc-pip hc-pip--br">{{ card.value }}</span>
          <div v-if="card.selected" class="hc-selected-glow" />
        </div>
      </div>
    </div>

    <!-- Team + vote status -->
    <div class="hc-footer">
      <div class="hc-avatars">
        <div
          v-for="av in avatars"
          :key="av.name"
          class="hc-av"
          :style="{ background: av.color }"
          :title="av.name"
        >
          {{ av.initial }}
        </div>
        <div class="hc-av hc-av--pending" title="Waiting…">
          <i class="bi bi-hourglass-split"></i>
        </div>
      </div>
      <span class="hc-status">
        <span class="hc-status-dot" />
        <span class="hc-status-voted" ref="votedEl">{{ votedCount }}</span
        >/4 voted
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const cards = [
  {
    value: "1",
    selected: false,
    floatDelay: "0s",
    slotTransform: "rotate(-18deg) translate(-116px, 32px)",
  },
  {
    value: "2",
    selected: false,
    floatDelay: "0.25s",
    slotTransform: "rotate(-9deg) translate(-58px, 10px)",
  },
  {
    value: "5",
    selected: true,
    floatDelay: "0.1s",
    slotTransform: "rotate(0deg) translate(0, -18px)",
  },
  {
    value: "8",
    selected: false,
    floatDelay: "0.35s",
    slotTransform: "rotate(9deg) translate(58px, 10px)",
  },
  {
    value: "13",
    selected: false,
    floatDelay: "0.2s",
    slotTransform: "rotate(18deg) translate(116px, 32px)",
  },
];

const avatars = [
  { name: "Alice", initial: "A", color: "#4f46e5" },
  { name: "Bob", initial: "B", color: "#0891b2" },
  { name: "Charlie", initial: "C", color: "#059669" },
];

const votedCount = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  timer = setInterval(() => {
    votedCount.value = votedCount.value >= 3 ? 0 : votedCount.value + 1;
  }, 1200);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style lang="scss" scoped>
.hc {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem 1rem 1rem;
  user-select: none;
  min-height: 260px;
}

.hc-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -55%);
  width: 360px;
  height: 240px;
  background: radial-gradient(
    ellipse at center,
    rgba(25, 135, 84, 0.18) 0%,
    rgba(32, 201, 151, 0.08) 45%,
    transparent 70%
  );
  pointer-events: none;
  border-radius: 50%;
}

/* ── Fan ─────────────────────────────────────── */
.hc-fan {
  position: relative;
  width: 300px;
  height: 180px;
}

.hc-slot {
  position: absolute;
  bottom: 0;
  left: 50%;
  margin-left: -2rem; /* half card width */
  transform-origin: bottom center;
}

/* ── Card ────────────────────────────────────── */
.hc-card {
  position: relative;
  width: 4rem;
  height: 5.5rem;
  background: #fff;
  border-radius: 10px;
  border: 1.5px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: hc-float 3.5s ease-in-out infinite;
  overflow: hidden;

  &--selected {
    background: linear-gradient(145deg, #0f5132 0%, #198754 60%, #20c997 100%);
    border-color: transparent;
    box-shadow: 0 8px 32px rgba(15, 81, 50, 0.45),
      0 2px 8px rgba(15, 81, 50, 0.25);
    transform: scale(1.06);

    .hc-pip,
    .hc-suit,
    .hc-center-value {
      color: rgba(255, 255, 255, 0.95);
    }

    .hc-suit {
      color: rgba(255, 255, 255, 0.45);
    }
  }
}

@keyframes hc-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.hc-pip {
  position: absolute;
  font-size: 0.6rem;
  font-weight: 800;
  line-height: 1;
  color: #1a1a1a;

  &--tl {
    top: 0.3rem;
    left: 0.35rem;
  }
  &--br {
    bottom: 0.3rem;
    right: 0.35rem;
    transform: rotate(180deg);
  }
}

.hc-suit {
  position: absolute;
  font-size: 0.5rem;
  color: #adb5bd;
  line-height: 1;

  &--tl {
    top: 0.85rem;
    left: 0.38rem;
  }
  &--br {
    bottom: 0.85rem;
    right: 0.38rem;
    transform: rotate(180deg);
  }
}

.hc-center-value {
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: #1a1a1a;
  line-height: 1;
  z-index: 1;
}

.hc-selected-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.15),
    transparent 70%
  );
  pointer-events: none;
}

/* ── Footer ──────────────────────────────────── */
.hc-footer {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
  justify-content: center;
}

.hc-avatars {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.hc-av {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 700;
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;

  &:not(.hc-av--pending):hover {
    transform: translateY(-2px) scale(1.1);
  }

  &--pending {
    background: #e5e7eb;
    color: #9ca3af;
    font-size: 0.55rem;
    border-color: #f3f4f6;
  }
}

.hc-status {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #4a5568;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.08);
  padding: 0.3rem 0.75rem;
  border-radius: 100px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.hc-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fbbf24;
  animation: hc-pulse 1.4s ease-in-out infinite;
}

.hc-status-voted {
  color: #0f5132;
  font-size: 1rem;
  font-weight: 800;
  display: inline-block;
  min-width: 0.7rem;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes hc-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(0.85);
  }
}

@media (max-width: 575.98px) {
  .hc-fan {
    width: 240px;
    height: 150px;
  }

  .hc {
    min-height: 200px;
  }
}
</style>
