<template>
  <div class="fr" aria-hidden="true">
    <!-- Shield / secure variant -->
    <template v-if="variant === 'shield'">
      <div class="fr-shield-scene">
        <div class="fr-shield-icon">
          <i class="bi bi-shield-fill-check"></i>
        </div>
        <div class="fr-shield-items">
          <div v-for="item in shieldItems" :key="item" class="fr-shield-item">
            <i class="bi bi-check2-circle"></i>
            {{ item }}
          </div>
        </div>
        <div class="fr-uptime">
          <span class="fr-uptime-dot"></span>
          99.9% uptime · Firebase-backed
        </div>
      </div>
    </template>

    <!-- Default: realtime activity feed -->
    <template v-else>
      <div class="fr-feed">
        <TransitionGroup name="fr-item" tag="div" class="fr-feed-inner">
          <div
            v-for="ev in visible"
            :key="ev.id"
            class="fr-event"
            :class="`fr-event--${ev.type}`"
          >
            <div class="fr-av" :style="{ background: ev.color }">
              {{ ev.initial }}
            </div>
            <span class="fr-event-text">{{ ev.text }}</span>
            <span class="fr-event-time">now</span>
          </div>
        </TransitionGroup>
        <div class="fr-live-badge">
          <span class="fr-live-dot"></span>
          Live
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

defineProps({ variant: { type: String, default: "" } });

const shieldItems = [
  "End-to-end Firestore rules",
  "No passwords stored",
  "HTTPS everywhere",
];

const allEvents = [
  { id: 1, initial: "A", color: "#4f46e5", type: "vote", text: "Alice voted" },
  { id: 2, initial: "B", color: "#0891b2", type: "vote", text: "Bob voted" },
  {
    id: 3,
    initial: "C",
    color: "#059669",
    type: "reveal",
    text: "Cards revealed",
  },
  { id: 4, initial: "D", color: "#dc2626", type: "join", text: "Dave joined" },
  { id: 5, initial: "A", color: "#4f46e5", type: "vote", text: "New round" },
  { id: 6, initial: "E", color: "#7c3aed", type: "join", text: "Eve joined" },
];

const visible = ref(allEvents.slice(0, 3));
let idx = ref(3);
let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  timer = setInterval(() => {
    const next = allEvents[idx.value % allEvents.length];
    visible.value = [next, ...visible.value].slice(0, 4);
    idx.value++;
  }, 1800);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped lang="scss">
.fr {
  width: 100%;
  padding: 0.25rem 0;
}

/* Feed */
.fr-feed {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.fr-feed-inner {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.fr-event {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.625rem;
  border-radius: 10px;
  background: #f8faf9;
  border: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 0.8125rem;

  &--vote {
    border-left: 3px solid #198754;
  }
  &--reveal {
    border-left: 3px solid #f59e0b;
  }
  &--join {
    border-left: 3px solid #4f46e5;
  }
}

.fr-av {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.55rem;
  font-weight: 800;
  color: #fff;
}

.fr-event-text {
  flex: 1;
  color: #374151;
  font-weight: 500;
}

.fr-event-time {
  font-size: 0.6875rem;
  color: #9ca3af;
}

.fr-live-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #dc2626;
  background: rgba(220, 38, 38, 0.08);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  align-self: flex-start;
  margin-top: 0.125rem;
}

.fr-live-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #dc2626;
  animation: fr-live-pulse 1s ease-in-out infinite;
}

@keyframes fr-live-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

/* TransitionGroup */
.fr-item-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.4, 0.64, 1);
}
.fr-item-leave-active {
  transition: all 0.25s ease;
  position: absolute;
  width: 100%;
}
.fr-item-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.97);
}
.fr-item-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
.fr-item-move {
  transition: transform 0.3s ease;
}

/* Shield */
.fr-shield-scene {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.fr-shield-icon {
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(145deg, #0f5132, #198754);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #fff;
  box-shadow: 0 4px 16px rgba(15, 81, 50, 0.35);
  animation: fr-shield-glow 2.5s ease-in-out infinite;
}

@keyframes fr-shield-glow {
  0%,
  100% {
    box-shadow: 0 4px 16px rgba(15, 81, 50, 0.35);
  }
  50% {
    box-shadow: 0 6px 24px rgba(15, 81, 50, 0.55);
  }
}

.fr-shield-items {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  width: 100%;
}

.fr-shield-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8125rem;
  color: #374151;
  font-weight: 500;

  .bi {
    color: #059669;
    font-size: 0.875rem;
  }
}

.fr-uptime {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 500;
}

.fr-uptime-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #059669;
  animation: fr-live-pulse 2s ease-in-out infinite;
}
</style>
