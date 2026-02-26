<template>
  <div class="fd" aria-hidden="true">
    <div class="fd-decks">
      <button
        v-for="(deck, i) in decks"
        :key="deck.name"
        class="fd-deck-btn"
        :class="{ 'fd-deck-btn--active': activeDeck === i }"
        @mouseenter="activeDeck = i"
        tabindex="-1"
      >
        <i :class="['bi', deck.icon]"></i>
        {{ deck.name }}
      </button>
    </div>
    <div class="fd-cards">
      <div
        v-for="(val, j) in decks[activeDeck].values"
        :key="val + j"
        class="fd-card"
        :style="{ animationDelay: j * 0.04 + 's' }"
      >
        {{ val }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const decks = [
  {
    name: "Fibonacci",
    icon: "bi-123",
    values: ["0", "1", "2", "3", "5", "8", "13", "21"],
  },
  {
    name: "T-shirt",
    icon: "bi-rulers",
    values: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    name: "Powers ×2",
    icon: "bi-lightning-charge",
    values: ["0", "1", "2", "4", "8", "16", "32"],
  },
  {
    name: "Custom",
    icon: "bi-pencil-square",
    values: ["XS", "S", "M", "L", "XL", "∞"],
  },
];

const activeDeck = ref(0);
</script>

<style scoped lang="scss">
.fd {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.fd-decks {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.fd-deck-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: inherit;
  color: #4a5568;
  background: #f3f4f6;
  border: 1.5px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;

  .bi {
    font-size: 0.75rem;
  }

  &--active {
    color: #0f5132;
    background: rgba(15, 81, 50, 0.08);
    border-color: rgba(15, 81, 50, 0.3);
  }
}

.fd-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.fd-card {
  width: 2.25rem;
  height: 3rem;
  border-radius: 7px;
  background: #fff;
  border: 1.5px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
  color: #1a1a1a;
  animation: fd-card-in 0.3s cubic-bezier(0.34, 1.4, 0.64, 1) both;

  @for $i from 1 through 12 {
    &:nth-child(#{$i}) {
      animation-delay: $i * 0.04s;
    }
  }
}

@keyframes fd-card-in {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
