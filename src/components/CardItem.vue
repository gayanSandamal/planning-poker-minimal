<template>
  <button
    class="card border border-2 border-primary rounded-3 mx-1 mb-3 align-items-center justify-content-center"
    :class="[
      disabled || hasVoted ? 'disabled-card' : 'shadow',
      revealed
        ? 'bg-primary bg-gradient'
        : 'bg-light-subtle flip-vertical-right',
      { hover: hover },
    ]"
    :disabled="disabled || hasVoted"
    @click="selectCard"
    @mouseover="hover = true"
    @mouseout="hover = false"
  >
    <div class="card-value" :class="revealed ? 'text-white' : ''">
      {{ value?.value ?? "‎ ‎ ‎ ‎ ‎ " }}
    </div>
  </button>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, PropType, computed, ref } from "vue";
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

const hover = ref<boolean>(false);
const selectCard = () => {
  if (!props.disabled) {
    emit("card-selected", props.value);
  }
};
const hasVoted = computed(() => props.value?.value === props.votedCard);
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.card {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
  background-color: #f7f7f7;
  text-align: center;
  transition: background-color 0.3s;
  min-width: 4rem;
  min-height: 6rem;
  &:not(.voted) {
    background-color: #eaeaea;
  }
  &.hover {
    transform: scale(1.05);
  }
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.selected-card {
  background-color: #007bff;
  color: #fff;
}

.disabled-card {
  opacity: 0.6;
  transform: scale(0.95);
  cursor: not-allowed;
}

.flip-vertical-right {
  -webkit-animation: flip-vertical-right 0.5s
    cubic-bezier(0.455, 0.03, 0.515, 0.955) both;
  animation: flip-vertical-right 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955)
    both;
}
@-webkit-keyframes flip-vertical-right {
  0% {
    -webkit-transform: rotateY(0);
    transform: rotateY(0);
  }
  100% {
    -webkit-transform: rotateY(360deg);
    transform: rotateY(360deg);
  }
}
@keyframes flip-vertical-right {
  0% {
    -webkit-transform: rotateY(0);
    transform: rotateY(0);
  }
  100% {
    -webkit-transform: rotateY(360deg);
    transform: rotateY(360deg);
  }
}
</style>
