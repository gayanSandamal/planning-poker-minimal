<template>
  <div class="container">
    <div class="row justify-content-md-center">
      <div class="col-4">
        <div class="row">
          <div class="col-12">
            <p class="fw-semibold mb-10">
              Choose a name and a voting system for your game.
            </p>
          </div>
          <div class="col-12 mb-4">
            <label for="name" class="form-label">Game's name</label>
            <input
              id="name"
              class="form-control"
              type="text"
              autofocus
              v-model="form.name"
            />
          </div>
          <div class="col-12 mb-4">
            <label for="name" class="form-label">Voting system</label>
            <select
              class="form-select"
              v-model="form.votingSystem"
              :disabled="form.name.trim() === ''"
            >
              <option
                v-for="votingSystem in votingSystems"
                :key="votingSystem.id"
                :value="votingSystem"
              >
                {{ votingSystem.label }}
              </option>
            </select>
          </div>
          <div class="col-12">
            <div class="d-grid gap-2">
              <button
                class="btn btn-primary"
                @click="onSubmit"
                :disabled="
                  form.name.trim() === '' || form.votingSystem.id === 999
                "
              >
                Create Game
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ModalContainer
    ref="modal"
    title="Create Custom Deck"
    okLabel="Create Game"
    @cancel="cancelCustomDeckCreate"
    @submit="submitCustomDeckCreate"
  >
    <div class="row">
      <div class="col-12 mb-4">
        <label for="deckName" class="form-label">Deck name</label>
        <input
          id="deckName"
          class="form-control"
          type="text"
          autofocus
          v-model="deck.name"
        />
      </div>
      <div class="col-12 mb-4">
        <label for="deckValues" class="form-label">Deck values</label>
        <input
          id="deckValues"
          class="form-control"
          type="text"
          v-model="deck.values"
        />
      </div>
      <div class="col-12 mb-4">
        <label for="deckValues" class="form-label w-100">Preview</label>
        <span
          v-for="(item, index) in customPattern"
          :key="index"
          class="badge text-bg-secondary me-2"
          >{{ item }}</span
        >
      </div>
    </div>
  </ModalContainer>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import ModalContainer from "@/components/ModalContainer.vue";
import { Base, GAME_COLLECTION } from "@/firebase/fb.api";
import { useRouter } from "vue-router";
import { CustomDeck, Game, VotingSystem } from "@/interfaces/types";

const gamesHttp = new Base(GAME_COLLECTION);
const router = useRouter();

const votingSystems: VotingSystem[] = [
  {
    id: 1,
    label: "Fibonacci ( 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ?, ☕ )",
    pattern: ["0", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89"],
  },
  {
    id: 2,
    label: "Modified Fibonacci ( 0, ½, 1, 2, 3, 5, 8, 13, 20, 40, 100, ?, ☕ )",
    pattern: ["0", "0.5", "1", "2", "3", "5", "8", "13", "20", "40", "100"],
  },
  {
    id: 3,
    label: "T-shirts (xxs, xs, s, m, l, xl, xxl, ?, ☕ )",
    pattern: ["xxs", "xs", "s", "m", "l", "xl", "xxl"],
  },
  {
    id: 4,
    label: "Powers of 2 ( 0, 1, 2, 4, 8, 16, 32, 64, ?, ☕ )",
    pattern: ["0", "1", "2", "4", "8", "16", "32", "64"],
  },
  {
    id: 999,
    label: "Create Custom Deck",
  },
];
const form = ref<Game>({
  name: "",
  votingSystem: votingSystems[0],
  users: [],
  reveal: false,
});
const deck = ref<CustomDeck>({
  name: "My custom deck",
  values: "1,2,3,5,8,13",
});
const customPattern = computed((): string[] => {
  const patternString = deck.value.values.replaceAll(/ /g, "");
  const pattern: string[] = patternString?.split(",");
  return pattern.map((digit: string | number): string =>
    typeof digit === "number" ? String(digit) : digit
  );
});
const cancelCustomDeckCreate = () =>
  (form.value.votingSystem = votingSystems[0]);

const onSubmit = async () => {
  const gameDoc = await gamesHttp.addDoc(form.value);
  router.push({
    path: `/${gameDoc.id}`,
  });
};

const submitCustomDeckCreate = () => {
  const customVotingDeck = votingSystems.find(
    (votingSystem) => votingSystem.id === 999
  );
  if (customVotingDeck) {
    customVotingDeck.pattern = customPattern.value;
    onSubmit();
  }
};

const modal = ref();
const toggleCustomDeckModal = () => {
  modal.value.toggle();
};

watch(
  () => form.value.votingSystem,
  (votingSystem: VotingSystem) => {
    if (votingSystem.id === 999) toggleCustomDeckModal();
  }
);
</script>

<style></style>
