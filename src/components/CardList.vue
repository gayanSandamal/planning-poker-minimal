<template>
  <div class="card-list">
    <CardItem
      v-for="card in cards"
      :key="card.value"
      :value="card"
      :disabled="disabled"
      @card-selected="selectCard"
      :voted-card="votedCard"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, PropType } from "vue";
import { Card } from "@/interfaces/types";
import CardItem from "./CardItem.vue";
defineProps({
  cards: {
    type: Array as PropType<Card[]>,
    required: true,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  votedCard: {
    type: Object as PropType<string>,
  },
});
const emit = defineEmits(["card-selected"]);
const selectCard = (card: Card) => {
  emit("card-selected", card);
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.card-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
