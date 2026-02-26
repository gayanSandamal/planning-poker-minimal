<template>
  <button
    class="poker-card"
    :class="{
      'poker-card--selected': hasVoted,
      'poker-card--idle': !hasVoted && !disabled,
      'poker-card--disabled': disabled && !hasVoted,
    }"
    :disabled="disabled || revealed"
    @click="selectCard"
    :aria-pressed="hasVoted"
  >
    <span class="poker-card-corner poker-card-corner--tl" aria-hidden="true">
      {{ value?.value ?? "" }}
    </span>
    <span class="poker-card-value">{{ value?.value ?? "" }}</span>
    <span class="poker-card-corner poker-card-corner--br" aria-hidden="true">
      {{ value?.value ?? "" }}
    </span>
    <span v-if="hasVoted" class="poker-card-voted-badge" aria-hidden="true">
      <i class="bi bi-check2-circle"></i>
    </span>
  </button>
</template>

<script lang="ts" setup>
import { PropType, computed } from "vue";
import { Card } from "@/interfaces/types";

const props = defineProps({
  value: {
    type: Object as PropType<Card>,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  revealed: {
    type: Boolean,
    default: false,
  },
  votedCard: {
    type: Object as PropType<string>,
  },
});

const emit = defineEmits(["card-selected"]);

const selectCard = () => {
  if (!props.disabled && !props.revealed) {
    emit("card-selected", props.value);
  }
};

const hasVoted = computed(() => props.value?.value === props.votedCard);
</script>

<style scoped lang="scss">
.poker-card {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 3.75rem;
  height: 5.25rem;
  margin: 0.25rem;
  background: #fff;
  border: 2px solid rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease,
    border-color 0.15s ease, background 0.15s ease;
  padding: 0;
  overflow: hidden;

  &--idle:hover {
    transform: translateY(-8px) scale(1.04);
    box-shadow: 0 12px 28px rgba(15, 81, 50, 0.2), 0 4px 8px rgba(0, 0, 0, 0.08);
    border-color: #198754;
    z-index: 1;
  }

  &--selected {
    background: linear-gradient(145deg, #0f5132 0%, #198754 100%);
    border-color: #0f5132;
    box-shadow: 0 4px 16px rgba(15, 81, 50, 0.35);
    transform: translateY(-6px) scale(1.04);

    .poker-card-value,
    .poker-card-corner {
      color: #fff;
    }

    .poker-card-corner {
      color: rgba(255, 255, 255, 0.75);
    }
  }

  &--disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: scale(0.94);
    box-shadow: none;
  }

  /* When revealed, selected card stays green but all are non-interactive */
  &--selected.poker-card--disabled .poker-card-voted-badge {
    display: none;
  }
}

.poker-card-corner {
  position: absolute;
  font-size: 0.625rem;
  font-weight: 700;
  line-height: 1;
  color: #9ca3af;

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

.poker-card-value {
  font-size: 1.375rem;
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: -0.03em;
  line-height: 1;
  user-select: none;
}

.poker-card-voted-badge {
  position: absolute;
  top: -0.4rem;
  right: -0.4rem;
  width: 1.25rem;
  height: 1.25rem;
  background: #fff;
  color: #198754;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}
</style>
