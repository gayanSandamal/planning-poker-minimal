<template>
  <div class="new-game-view">
    <div class="ng-bg" aria-hidden="true">
      <div class="ng-gradient"></div>
      <div class="ng-grid"></div>
    </div>

    <div class="container ng-container">
      <div class="ng-header">
        <span class="ng-badge">
          <i class="bi bi-controller" aria-hidden="true"></i>
          New Game
        </span>
        <h1 class="ng-title">Set up your planning session</h1>
        <p class="ng-subtitle">
          Choose a name and a deck — share one link, vote together in real time.
        </p>
      </div>

      <div class="ng-form-card">
        <!-- Game name -->
        <div class="ng-field">
          <label for="name" class="ng-label">Game Name</label>
          <div class="ng-input-wrap">
            <i class="bi bi-tag-fill ng-input-icon" aria-hidden="true"></i>
            <input
              id="name"
              class="ng-input"
              type="text"
              autofocus
              placeholder="e.g. Sprint 24 Planning"
              v-model="form.name"
            />
          </div>
        </div>

        <!-- Deck picker -->
        <div class="ng-field">
          <label class="ng-label">Voting System</label>
          <div
            class="ng-deck-grid"
            role="radiogroup"
            aria-label="Voting system"
          >
            <button
              v-for="vs in votingSystems"
              :key="vs.id"
              class="ng-deck-btn"
              :class="{
                'ng-deck-btn--active': form.votingSystem?.id === vs.id,
                'ng-deck-btn--custom': vs.id === 999,
              }"
              type="button"
              @click="selectVotingSystem(vs)"
              :aria-pressed="form.votingSystem?.id === vs.id"
            >
              <div class="ng-deck-top">
                <span class="ng-deck-name">{{ deckShortName(vs) }}</span>
                <i
                  v-if="form.votingSystem?.id === vs.id"
                  class="bi bi-check-circle-fill ng-deck-check"
                  aria-hidden="true"
                ></i>
                <i
                  v-else-if="vs.id === 999"
                  class="bi bi-pencil-square ng-deck-icon"
                  aria-hidden="true"
                ></i>
              </div>
              <div class="ng-deck-chips">
                <template v-if="vs.id !== 999">
                  <span
                    v-for="(chip, i) in (vs.pattern ?? []).slice(0, 5)"
                    :key="i"
                    class="ng-chip"
                    >{{ chip }}</span
                  >
                  <span
                    v-if="(vs.pattern ?? []).length > 5"
                    class="ng-chip ng-chip--more"
                  >
                    +{{ (vs.pattern ?? []).length - 5 }}
                  </span>
                </template>
                <template v-else>
                  <span class="ng-chip ng-chip--custom"
                    >Enter your own values…</span
                  >
                </template>
              </div>
            </button>
          </div>
        </div>

        <button
          class="ng-submit-btn"
          type="button"
          @click="onSubmit"
          :disabled="
            form.name.trim() === '' || form.votingSystem?.disabled === true
          "
        >
          <i class="bi bi-play-fill" aria-hidden="true"></i>
          Create Game
        </button>
      </div>
    </div>
  </div>

  <Teleport to="body">
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
          <small class="form-text text-muted"
            >Comma-separated, e.g. 1,2,3,5,8,13</small
          >
        </div>
        <div class="col-12 mb-2">
          <label class="form-label w-100">Preview</label>
          <span
            v-for="(item, index) in customPattern"
            :key="index"
            class="badge text-bg-secondary me-2 mb-1"
            >{{ item }}</span
          >
        </div>
      </div>
    </ModalContainer>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import ModalContainer from "@/components/ModalContainer.vue";
import { Base, GAME_COLLECTION } from "@/firebase/fb.api";
import { useRouter } from "vue-router";
import { CustomDeck, Game, VotingSystem } from "@/interfaces/types";
import { useToast } from "@/composables/useToast";

const gamesHttp = new Base(GAME_COLLECTION);
const router = useRouter();
const toast = useToast();

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
    label: "T-shirts (xxs, xs, s, m, l, xl, xxl, ?, ☕ ) (Available soon!)",
    pattern: ["xxs", "xs", "s", "m", "l", "xl", "xxl"],
    // disabled: true,
  },
  {
    id: 4,
    label: "Powers of 2 ( 0, 1, 2, 4, 8, 16, 32, 64, ?, ☕ )",
    pattern: ["0", "1", "2", "4", "8", "16", "32", "64"],
  },
  {
    id: 999,
    label: "Create Custom Deck",
    pattern: [],
    // disabled: true,
  },
];

const form = ref<Game>({
  name: "",
  votingSystem: votingSystems[0],
  users: [],
  reveal: false,
  currentStory: "",
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

const deckShortName = (vs: VotingSystem): string => {
  const names: Record<number, string> = {
    1: "Fibonacci",
    2: "Modified Fibonacci",
    3: "T-Shirt Sizes",
    4: "Powers of 2",
    999: "Custom Deck",
  };
  return names[vs.id] ?? vs.label;
};

const selectVotingSystem = (vs: VotingSystem) => {
  form.value.votingSystem = vs;
};

const cancelCustomDeckCreate = () =>
  (form.value.votingSystem = votingSystems[0]);

const onSubmit = async () => {
  try {
    const gameDoc = await gamesHttp.addDoc(form.value);
    router.push({ path: `/${gameDoc.id}` });
  } catch {
    await toast.error(
      "Failed to create game. Check your connection and try again."
    );
  }
};

const submitCustomDeckCreate = () => {
  const customVotingDeck = votingSystems.find((vs) => vs.id === 999);
  if (customVotingDeck) {
    customVotingDeck.pattern = customPattern.value;
    onSubmit();
  }
};

const modal = ref();
const toggleCustomDeckModal = () => modal.value.toggle();

watch(
  () => form.value.votingSystem,
  (votingSystem: VotingSystem) => {
    if (votingSystem.id === 999) toggleCustomDeckModal();
  }
);
</script>

<style lang="scss" scoped>
.new-game-view {
  position: relative;
  min-height: calc(100vh - 115px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ng-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.ng-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(
      ellipse 100% 80% at 50% -20%,
      rgba(25, 135, 84, 0.2),
      transparent 55%
    ),
    radial-gradient(
      ellipse 60% 40% at 90% 80%,
      rgba(32, 201, 151, 0.1),
      transparent 50%
    ),
    linear-gradient(180deg, #f0f7f4 0%, #e8f5ee 40%, #f8faf9 100%);
}

.ng-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
      rgba(25, 135, 84, 0.04) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(25, 135, 84, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
}

.ng-container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 3rem;
  padding-bottom: 4rem;
}

.ng-header {
  text-align: center;
  max-width: 520px;
  margin-bottom: 2.5rem;
}

.ng-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #0f5132;
  background: rgba(25, 135, 84, 0.12);
  padding: 0.4rem 0.9rem;
  border-radius: 100px;
  margin-bottom: 1.25rem;
}

.ng-title {
  font-size: clamp(1.625rem, 4vw, 2.25rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #1a1a1a;
  margin: 0 0 0.75rem;
}

.ng-subtitle {
  font-size: 1rem;
  color: #4a5568;
  line-height: 1.6;
  margin: 0;
}

.ng-form-card {
  width: 100%;
  max-width: 620px;
  background: #fff;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.07);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04);
  padding: 2rem;
}

.ng-field {
  margin-bottom: 1.75rem;
}

.ng-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.625rem;
  letter-spacing: 0.01em;
}

.ng-input-wrap {
  position: relative;
}

.ng-input-icon {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: #198754;
  font-size: 0.875rem;
  pointer-events: none;
}

.ng-input {
  width: 100%;
  padding: 0.75rem 0.875rem 0.75rem 2.5rem;
  font-size: 1rem;
  font-family: inherit;
  color: #1a1a1a;
  background: #f8faf9;
  border: 1.5px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease,
    background 0.15s ease;

  &::placeholder {
    color: #adb5bd;
  }

  &:focus {
    border-color: #198754;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(25, 135, 84, 0.15);
  }
}

.ng-deck-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
  gap: 0.75rem;
}

.ng-deck-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 1rem;
  background: #f8faf9;
  border: 1.5px solid rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s ease, background 0.15s ease,
    box-shadow 0.15s ease, transform 0.15s ease;

  &:hover {
    border-color: #198754;
    background: rgba(25, 135, 84, 0.04);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(25, 135, 84, 0.12);
  }

  &--active {
    border-color: #0f5132;
    background: rgba(15, 81, 50, 0.06);
    box-shadow: 0 0 0 3px rgba(25, 135, 84, 0.18);

    &:hover {
      transform: none;
    }

    .ng-deck-name {
      color: #0f5132;
    }
  }

  &--custom {
    border-style: dashed;
  }
}

.ng-deck-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 0.5rem;
}

.ng-deck-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.3;
}

.ng-deck-check {
  color: #0f5132;
  font-size: 1rem;
  flex-shrink: 0;
}

.ng-deck-icon {
  color: #adb5bd;
  font-size: 0.9375rem;
  flex-shrink: 0;
}

.ng-deck-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.ng-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.625rem;
  height: 1.5rem;
  padding: 0 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #0f5132;
  background: rgba(25, 135, 84, 0.1);
  border-radius: 6px;
  white-space: nowrap;

  &--more {
    color: #6c757d;
    background: rgba(108, 117, 125, 0.1);
  }

  &--custom {
    color: #6c757d;
    background: transparent;
    font-weight: 400;
    font-style: italic;
    font-size: 0.8125rem;
    min-width: 0;
    padding: 0;
  }
}

.ng-submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  font-family: inherit;
  color: #fff;
  background: #0f5132;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(15, 81, 50, 0.3);
  transition: background 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;

  &:hover:not(:disabled) {
    background: #0d4629;
    box-shadow: 0 4px 20px rgba(15, 81, 50, 0.4);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
  }

  .bi {
    font-size: 0.9rem;
  }
}

@media (max-width: 575.98px) {
  .ng-form-card {
    padding: 1.5rem 1.25rem;
  }

  .ng-deck-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
