<template>
  <div class="lgp" role="img" aria-label="Animated planning poker game preview">
    <!-- Felt table -->
    <div
      class="lgp-table"
      :class="{
        'lgp-table--revealed': phase === 'reveal' || phase === 'consensus',
      }"
    >
      <span class="lgp-table-brand">
        <i class="bi bi-suit-spade-fill" aria-hidden="true"></i>
        Planning Poker
      </span>

      <div v-if="phase === 'voting'" class="lgp-tally">
        <span class="lgp-tally-voted">{{ votedCount }}</span
        >/{{ players.length }} voted
      </div>

      <button
        class="lgp-reveal-btn"
        :class="{
          'lgp-reveal-btn--active': phase !== 'idle' && phase !== 'voting',
        }"
        tabindex="-1"
      >
        <i
          :class="[
            'bi',
            phase === 'consensus' ? 'bi-arrow-counterclockwise' : 'bi-eye-fill',
          ]"
          aria-hidden="true"
        ></i>
        {{ phase === "consensus" ? "New Round" : "Reveal Cards" }}
      </button>
    </div>

    <!-- Players ring -->
    <div class="lgp-players">
      <div
        v-for="(player, i) in players"
        :key="player.name"
        class="lgp-player"
        :style="{ transitionDelay: i * 0.06 + 's' }"
        :class="{ 'lgp-player--in': phase !== 'idle' }"
      >
        <!-- Card above player -->
        <div class="lgp-card-wrap">
          <div
            class="lgp-card"
            :class="{
              'lgp-card--in': phase !== 'idle',
              'lgp-card--voted': phase === 'voting' && i < votedCount,
              'lgp-card--flip': phase === 'reveal' || phase === 'consensus',
            }"
            :style="{
              transitionDelay:
                phase === 'reveal' || phase === 'consensus'
                  ? i * 0.12 + 's'
                  : i * 0.14 + 's',
            }"
          >
            <!-- Back face (green) -->
            <div class="lgp-card-back">
              <span class="lgp-card-back-pattern" aria-hidden="true">♦</span>
            </div>
            <!-- Front face (value) -->
            <div class="lgp-card-front">
              <span class="lgp-card-front-pip lgp-card-front-pip--tl">{{
                player.vote
              }}</span>
              <span class="lgp-card-front-val">{{ player.vote }}</span>
              <span class="lgp-card-front-pip lgp-card-front-pip--br">{{
                player.vote
              }}</span>
            </div>
          </div>
        </div>

        <!-- Avatar -->
        <div
          class="lgp-avatar"
          :style="{ background: player.color }"
          :title="player.name"
        >
          {{ player.name[0] }}
        </div>

        <!-- Name + admin badge -->
        <span class="lgp-name">
          {{ player.name }}
          <i
            v-if="player.admin"
            class="bi bi-star-fill lgp-host-star"
            title="Host"
            aria-label="Host"
          ></i>
        </span>
      </div>
    </div>

    <!-- Consensus / results pop -->
    <Transition name="lgp-pop">
      <div v-if="phase === 'consensus'" class="lgp-results">
        <div class="lgp-result-item lgp-result-item--primary">
          <span class="lgp-result-label">Average</span>
          <span class="lgp-result-value">8.3</span>
        </div>
        <div class="lgp-result-item lgp-result-item--accent">
          <span class="lgp-result-label">Nearest</span>
          <span class="lgp-result-value lgp-result-value--green">8</span>
        </div>
        <div class="lgp-dist">
          <div class="lgp-dist-row">
            <span>5</span>
            <div class="lgp-dist-bar" style="width: 25%"></div>
            <span>1</span>
          </div>
          <div class="lgp-dist-row">
            <span>8</span>
            <div
              class="lgp-dist-bar lgp-dist-bar--wide"
              style="width: 75%"
            ></div>
            <span>3</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

type Phase = "idle" | "voting" | "reveal" | "consensus";

const players = [
  { name: "Alice", vote: "5", color: "#4f46e5", admin: true },
  { name: "Bob", vote: "8", color: "#0891b2", admin: false },
  { name: "Carol", vote: "8", color: "#059669", admin: false },
  { name: "Dave", vote: "8", color: "#dc2626", admin: false },
];

const phase = ref<Phase>("idle");
const votedCount = ref(0);

let timers: ReturnType<typeof setTimeout>[] = [];

function clear() {
  timers.forEach((t) => clearTimeout(t));
  timers = [];
}

function schedule(fn: () => void, ms: number) {
  timers.push(setTimeout(fn, ms));
}

function runCycle() {
  clear();
  phase.value = "idle";
  votedCount.value = 0;

  // Players join → start voting
  schedule(() => {
    phase.value = "voting";
  }, 600);

  // Players vote one by one
  players.forEach((_, i) => {
    schedule(() => {
      votedCount.value = i + 1;
    }, 900 + i * 700);
  });

  const allVotedAt = 900 + players.length * 700;

  // Pause, then reveal
  schedule(() => {
    phase.value = "reveal";
  }, allVotedAt + 500);

  // Show consensus a moment after cards flip
  schedule(() => {
    phase.value = "consensus";
  }, allVotedAt + 2200);

  // Loop
  schedule(runCycle, allVotedAt + 5800);
}

onMounted(runCycle);
onUnmounted(clear);
</script>

<style lang="scss" scoped>
.lgp {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 0.5rem 0.5rem 0;
  user-select: none;
  width: 100%;
  max-width: 420px;
  min-height: 471px;
  margin: 0 auto;
}

/* ── Table ───────────────────────────────────────── */
.lgp-table {
  width: 100%;
  max-width: 320px;
  background: linear-gradient(145deg, #1a6640 0%, #145235 55%, #0f3d28 100%);
  border-radius: 120px;
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
  box-shadow: 0 0 0 6px rgba(15, 81, 50, 0.18), 0 0 0 7px rgba(0, 0, 0, 0.08),
    0 8px 32px rgba(0, 0, 0, 0.22), inset 0 2px 6px rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
  transition: box-shadow 0.4s ease;

  &::before {
    content: "";
    position: absolute;
    inset: 8px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 110px;
    pointer-events: none;
  }

  &--revealed {
    box-shadow: 0 0 0 6px rgba(15, 81, 50, 0.3), 0 0 0 7px rgba(0, 0, 0, 0.08),
      0 10px 40px rgba(15, 81, 50, 0.25),
      inset 0 2px 6px rgba(255, 255, 255, 0.05);
  }
}

.lgp-table-brand {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.38);
  display: flex;
  align-items: center;
  gap: 0.3rem;

  .bi {
    font-size: 0.75rem;
  }
}

.lgp-tally {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.65);

  .lgp-tally-voted {
    color: #4ade80;
    font-size: 1rem;
    font-weight: 800;
  }
}

.lgp-reveal-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: inherit;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.1);
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  border-radius: 100px;
  cursor: default;
  transition: background 0.3s ease, border-color 0.3s ease, color 0.3s ease;
  pointer-events: none;

  &--active {
    background: rgba(255, 255, 255, 0.18);
    border-color: rgba(255, 255, 255, 0.38);
    color: #fff;
  }
}

/* ── Players ─────────────────────────────────────── */
.lgp-players {
  display: flex;
  gap: 0.875rem;
  justify-content: center;
  flex-wrap: wrap;
}

.lgp-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.35s ease, transform 0.35s ease;

  &--in {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── Player cards ────────────────────────────────── */
.lgp-card-wrap {
  perspective: 600px;
}

.lgp-card {
  position: relative;
  width: 2.75rem;
  height: 3.75rem;
  transform-style: preserve-3d;
  transform: rotateY(-90deg) scale(0.8);
  opacity: 0;
  transition: transform 0.45s cubic-bezier(0.34, 1.2, 0.64, 1),
    opacity 0.3s ease;

  &--in {
    opacity: 1;
    transform: rotateY(0deg) scale(1);
  }

  &--voted {
    animation: lgp-voted-pulse 0.35s ease;
  }

  &--flip {
    transform: rotateY(180deg) scale(1);
  }
}

@keyframes lgp-voted-pulse {
  0% {
    transform: rotateY(0) scale(1);
  }
  50% {
    transform: rotateY(0) scale(1.12);
  }
  100% {
    transform: rotateY(0) scale(1);
  }
}

.lgp-card-back,
.lgp-card-front {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 7px;
}

.lgp-card-back {
  background: linear-gradient(145deg, #0f5132 0%, #198754 100%);
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

.lgp-card-back-pattern {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.12);
}

.lgp-card-front {
  background: #fff;
  border: 1.5px solid rgba(0, 0, 0, 0.1);
  transform: rotateY(180deg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.12);
}

.lgp-card-front-pip {
  position: absolute;
  font-size: 0.5rem;
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1;

  &--tl {
    top: 0.25rem;
    left: 0.3rem;
  }
  &--br {
    bottom: 0.25rem;
    right: 0.3rem;
    transform: rotate(180deg);
  }
}

.lgp-card-front-val {
  font-size: 1.125rem;
  font-weight: 900;
  color: #0f5132;
  letter-spacing: -0.04em;
}

/* ── Avatar / name ───────────────────────────────── */
.lgp-avatar {
  width: 1.875rem;
  height: 1.875rem;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: 800;
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.lgp-name {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #4a5568;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  white-space: nowrap;
}

.lgp-host-star {
  font-size: 0.45rem;
  color: #f59e0b;
}

/* ── Results ─────────────────────────────────────── */
.lgp-results {
  width: 100%;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 16px;
  padding: 1rem 1.25rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.lgp-result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.lgp-result-label {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #9ca3af;
}

.lgp-result-value {
  font-size: 1.75rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: #1a1a1a;

  &--green {
    color: #0f5132;
  }
}

.lgp-dist {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.lgp-dist-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #4a5568;

  span:first-child {
    min-width: 1rem;
    color: #0f5132;
  }

  span:last-child {
    min-width: 0.75rem;
    color: #6c757d;
    text-align: right;
  }
}

.lgp-dist-bar {
  flex: 1;
  height: 1rem;
  max-width: 100%;
  background: rgba(25, 135, 84, 0.15);
  border-radius: 6px;
  overflow: hidden;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 0;
    background: linear-gradient(90deg, #198754, #20c997);
    border-radius: 6px;
    animation: lgp-bar-in 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
  }

  &--wide::after {
    animation: lgp-bar-wide 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards;
  }
}

@keyframes lgp-bar-in {
  from {
    width: 0;
  }
  to {
    width: 25%;
  }
}

@keyframes lgp-bar-wide {
  from {
    width: 0;
  }
  to {
    width: 75%;
  }
}

/* ── Transitions ─────────────────────────────────── */
.lgp-pop-enter-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.4, 0.64, 1);
}
.lgp-pop-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.lgp-pop-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.96);
}
.lgp-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>
