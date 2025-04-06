<template>
  <div class="pocker-table d-flex flex-wrap justify-content-center">
    <div
      class="card rounded-5 border border-2 border-primary-subtle py-5 w-100"
      style="max-width: 25rem"
    >
      <div class="card-body">
        <button
          class="btn btn-primary"
          @click="!revealed ? reveal() : reset()"
          :disabled="disabled"
        >
          {{ revealed ? "Start new voting" : "Reveal Cards" }}
        </button>
      </div>
    </div>
    <div class="w-100 mt-5">
      <ul class="list-group list-group-horizontal">
        <li
          class="bg-body-tertiary list-group-item d-flex flex-wrap justify-content-center border border-0 p-0"
          v-for="(player, i) in players"
          :key="player.id"
        >
          <CardItem
            :value="getValues[i]"
            :voted-card="getValues && getValues[i] ? getValues[i].value : 'ㅤ'"
            :revealed="!revealed"
            :disabled="true"
          />
          <p class="w-100 mb-0">
            <strong>{{ player.displayName }}</strong>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, PropType, computed } from "vue";
import CardItem from "./CardItem.vue";
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
    type: Object as PropType<string>,
  },
  revealed: {
    type: Boolean as PropType<boolean>,
  },
});
const emit = defineEmits(["reveal", "reset"]);

const getValues = computed(() => {
  return props.revealed
    ? props.teamMembers
        .filter((teamMember: Member) => !teamMember.joinAsSpectator)
        .map((teamMember: Member) => {
          return { name: teamMember.vote, value: teamMember.vote };
        })
    : [{ name: "", value: "‎ ‎ ‎ ‎ ‎ " }];
});

const players = computed(() =>
  props.teamMembers.filter((teamMember: Member) => !teamMember.joinAsSpectator)
);

const reveal = () => {
  emit("reveal");
};

const reset = () => {
  emit("reset");
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
