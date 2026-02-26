<template>
  <div class="pt-wrap">
    <!-- Felt table -->
    <div class="pt-table">
      <div class="pt-table-inner">
        <p class="pt-table-label" aria-hidden="true">
          <i class="bi bi-suit-spade-fill"></i>
          Planning Poker
        </p>
        <button
          class="pt-reveal-btn"
          @click="!revealed ? reveal() : reset()"
          :disabled="disabled || players.length === 0"
        >
          <i
            :class="[
              'bi',
              revealed ? 'bi-arrow-counterclockwise' : 'bi-eye-fill',
            ]"
            aria-hidden="true"
          ></i>
          {{ revealed ? "New Round" : "Reveal Cards" }}
        </button>
        <p v-if="!revealed && players.length > 0" class="pt-vote-tally">
          <span class="pt-tally-voted">{{ votedCount }}</span>
          <span class="pt-tally-sep">/</span>
          <span class="pt-tally-total">{{ players.length }}</span>
          <span class="pt-tally-label">voted</span>
        </p>
      </div>
    </div>

    <!-- Players ring -->
    <div v-if="players.length > 0" class="pt-players" role="list">
      <div
        v-for="(player, i) in players"
        :key="player.id"
        class="pt-player"
        role="listitem"
      >
        <div
          class="pt-player-avatar"
          :style="{ backgroundColor: avatarColor(player.displayName) }"
          :title="player.displayName"
          aria-hidden="true"
        >
          {{ getInitials(player.displayName) }}
        </div>
        <div
          class="pt-player-card"
          :class="{
            'pt-player-card--voted': !revealed && playerHasVoted(player),
            'pt-player-card--empty': !revealed && !playerHasVoted(player),
            'pt-player-card--revealed': revealed,
          }"
          :aria-label="`${player.displayName}: ${
            revealed
              ? getPlayerVote(i)
              : playerHasVoted(player)
              ? 'voted'
              : 'waiting'
          }`"
        >
          <span v-if="revealed" class="pt-player-card-value">
            {{ getPlayerVote(i) }}
          </span>
          <span v-else-if="playerHasVoted(player)" class="pt-player-card-back">
            <i class="bi bi-check2" aria-hidden="true"></i>
          </span>
          <span v-else class="pt-player-card-waiting" aria-hidden="true">
            <i class="bi bi-hourglass-split"></i>
          </span>
        </div>
        <span class="pt-player-name" :title="player.displayName">
          {{ player.displayName }}
          <span v-if="player.admin" class="pt-player-host" title="Host">
            <i class="bi bi-star-fill" aria-hidden="true"></i>
          </span>
        </span>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="pt-empty">
      <i class="bi bi-people" aria-hidden="true"></i>
      Waiting for players to join…
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, computed } from "vue";
import { Member } from "@/interfaces/types";

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  teamMembers: {
    type: Array as PropType<Member[]>,
    required: true,
  },
  votedCard: {
    type: String,
    default: undefined,
  },
  revealed: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["reveal", "reset"]);

const players = computed(() =>
  props.teamMembers.filter((m: Member) => !m.joinAsSpectator)
);

const votedCount = computed(
  () => players.value.filter((m: Member) => m.vote && m.vote !== "").length
);

const playerHasVoted = (player: Member): boolean =>
  !!(player.vote && player.vote !== "");

const getPlayerVote = (i: number): string => {
  const p = players.value[i];
  return p?.vote ?? "—";
};

const reveal = () => emit("reveal");
const reset = () => emit("reset");

function getInitials(name: string): string {
  const s = (name || "").trim();
  if (!s) return "?";
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2);
  }
  return s.slice(0, 2).toUpperCase();
}

function avatarColor(name: string): string {
  let h = 0;
  for (let i = 0; i < (name || "").length; i++) {
    h = (h << 5) - h + (name || "").charCodeAt(i);
    h |= 0;
  }
  const hue = Math.abs(h % 360);
  return `hsl(${hue}, 45%, 40%)`;
}
</script>

<style scoped lang="scss">
.pt-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
}

/* ── Table ──────────────────────────────────────── */
.pt-table {
  width: 100%;
  max-width: 480px;
  background: linear-gradient(145deg, #1a6640 0%, #145235 50%, #0f3d28 100%);
  border-radius: 120px;
  padding: 2.5rem 3rem;
  box-shadow: 0 0 0 8px rgba(15, 81, 50, 0.15), 0 0 0 9px rgba(0, 0, 0, 0.08),
    0 12px 40px rgba(0, 0, 0, 0.25), inset 0 2px 8px rgba(255, 255, 255, 0.06);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 10px;
    border-radius: 110px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    pointer-events: none;
  }
}

.pt-table-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.875rem;
  position: relative;
  z-index: 1;
}

.pt-table-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.375rem;

  .bi {
    font-size: 0.875rem;
  }
}

.pt-reveal-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.75rem;
  font-size: 0.9375rem;
  font-weight: 600;
  font-family: inherit;
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  border-radius: 100px;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease,
    transform 0.15s ease;
  backdrop-filter: blur(4px);

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.22);
    border-color: rgba(255, 255, 255, 0.45);
    transform: scale(1.03);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.pt-vote-tally {
  display: flex;
  align-items: baseline;
  gap: 0.2rem;
  margin: 0;
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.7);
}

.pt-tally-voted {
  font-weight: 700;
  color: #4ade80;
  font-size: 1.125rem;
}

.pt-tally-sep {
  color: rgba(255, 255, 255, 0.3);
}

.pt-tally-total {
  font-weight: 600;
}

.pt-tally-label {
  font-size: 0.8125rem;
  margin-left: 0.25rem;
  color: rgba(255, 255, 255, 0.5);
}

/* ── Players ────────────────────────────────────── */
.pt-players {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem 0.75rem;
  width: 100%;
}

.pt-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 56px;
}

.pt-player-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
  line-height: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.pt-player-card {
  width: 3.25rem;
  height: 4.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &--empty {
    background: #f1f5f9;
    border: 2px dashed #cbd5e1;
    color: #94a3b8;
    font-size: 0.875rem;
  }

  &--voted {
    background: linear-gradient(145deg, #0f5132, #198754);
    border: 2px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 12px rgba(15, 81, 50, 0.3);
    color: #fff;
    animation: card-voted-in 0.3s ease both;
  }

  &--revealed {
    background: #fff;
    border: 2px solid #0f5132;
    box-shadow: 0 4px 16px rgba(15, 81, 50, 0.2);
    animation: card-flip-in 0.4s ease both;
  }
}

@keyframes card-voted-in {
  from {
    transform: scale(0.85);
    opacity: 0.6;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes card-flip-in {
  from {
    transform: rotateY(90deg) scale(0.9);
    opacity: 0;
  }
  to {
    transform: rotateY(0deg) scale(1);
    opacity: 1;
  }
}

.pt-player-card-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f5132;
  letter-spacing: -0.03em;
  line-height: 1;
}

.pt-player-card-back {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
}

.pt-player-card-waiting {
  font-size: 0.875rem;
  color: #cbd5e1;
  animation: spin-slow 3s linear infinite;
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.pt-player-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: #4a5568;
  text-align: center;
  max-width: 5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  justify-content: center;
}

.pt-player-host {
  color: #f59e0b;
  font-size: 0.5rem;
  flex-shrink: 0;
  display: inline-flex;
}

/* ── Empty ──────────────────────────────────────── */
.pt-empty {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  color: #94a3b8;
  padding: 1rem 0;

  .bi {
    font-size: 1.125rem;
  }
}

@media (max-width: 575.98px) {
  .pt-table {
    padding: 2rem 2rem;
    border-radius: 80px;
  }
}
</style>
