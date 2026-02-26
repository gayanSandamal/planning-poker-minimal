<template>
  <div class="game-view">
    <!-- ── Game Not Found ─────────────────────────────── -->
    <div v-if="gameNotFound" class="gv-not-found">
      <div class="gv-not-found-card">
        <div class="gv-not-found-icon">
          <i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>
        </div>
        <h1 class="gv-not-found-title">Game not found</h1>
        <p class="gv-not-found-desc">
          This game doesn't exist or the link is invalid. Create a new game or
          go back home.
        </p>
        <div class="gv-not-found-actions">
          <router-link class="gv-btn gv-btn--primary" to="/new-game">
            <i class="bi bi-play-fill" aria-hidden="true"></i>
            Start new game
          </router-link>
          <router-link class="gv-btn gv-btn--outline" to="/">
            <i class="bi bi-house-fill" aria-hidden="true"></i>
            Home
          </router-link>
        </div>
      </div>
    </div>

    <!-- ── Active Game ────────────────────────────────── -->
    <div v-else class="gv-active">
      <!-- Info bar -->
      <div class="gv-info-bar">
        <div class="container">
          <div class="gv-info-inner">
            <div class="gv-info-left">
              <h1 class="gv-game-name">
                {{ gameData?.name || "Planning Session" }}
              </h1>
              <div v-if="currentStoryEditing" class="gv-current-story-wrap">
                <input
                  ref="currentStoryInputRef"
                  v-model="currentStoryEditValue"
                  class="gv-current-story-input"
                  placeholder="What are we voting on?"
                  @blur="saveCurrentStory"
                  @keydown.enter="saveCurrentStory"
                />
              </div>
              <p
                v-else
                class="gv-current-story"
                :class="{
                  'gv-current-story--empty': !currentStoryDisplay,
                  'gv-current-story--editable': isCurrentUserAdmin,
                }"
                @click="startEditCurrentStory"
              >
                <i class="bi bi-card-text" aria-hidden="true"></i>
                {{ currentStoryDisplay || "Add what you’re voting on…" }}
              </p>
              <span v-if="deckLabel" class="gv-deck-badge">
                <i class="bi bi-stack" aria-hidden="true"></i>
                {{ deckLabel }}
              </span>
            </div>
            <div class="gv-info-right">
              <div v-if="teamMembers.length" class="gv-player-count">
                <i class="bi bi-people-fill" aria-hidden="true"></i>
                {{ teamMembers.length }}
                {{ teamMembers.length === 1 ? "player" : "players" }}
              </div>
              <div
                class="gv-status-badge"
                :class="
                  revealed
                    ? 'gv-status-badge--revealed'
                    : 'gv-status-badge--voting'
                "
              >
                <span class="gv-status-dot" aria-hidden="true"></span>
                {{ revealed ? "Revealed" : "Voting" }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main content -->
      <div class="container gv-content">
        <!-- Poker table -->
        <div class="gv-table-wrap">
          <PockerTable
            :team-members="teamMembers"
            :revealed="revealed"
            @reveal="reveal"
            @reset="reset"
          />
        </div>

        <!-- Card hand (voters only, while voting) -->
        <div
          v-if="!currentTeamMember?.joinAsSpectator && !revealed"
          class="gv-hand"
        >
          <p class="gv-hand-prompt">
            <i class="bi bi-hand-index-fill" aria-hidden="true"></i>
            Pick your card
          </p>
          <CardList
            :cards="cards"
            @card-selected="recordVote"
            :disabled="disabled"
            :voted-card="currentTeamMember?.vote"
          />
        </div>

        <!-- Spectator hint -->
        <div
          v-else-if="currentTeamMember?.joinAsSpectator && !revealed"
          class="gv-spectator"
        >
          <i class="bi bi-eye-fill" aria-hidden="true"></i>
          You are watching as a spectator
        </div>

        <!-- Results panel -->
        <Transition name="results-fade">
          <div v-if="revealed" class="gv-results">
            <div class="gv-results-grid">
              <!-- Primary metric -->
              <div class="gv-result-card gv-result-card--primary">
                <div class="gv-result-label">
                  {{ isNumericVoting ? "Average" : "Consensus" }}
                </div>
                <div
                  class="gv-result-value"
                  :class="
                    hasDecimal
                      ? 'gv-result-value--neutral'
                      : 'gv-result-value--green'
                  "
                >
                  <template v-if="isNumericVoting">
                    {{ averageAgreement }}
                  </template>
                  <template v-else-if="consensus">
                    {{ consensus.value }}
                  </template>
                  <template v-else>—</template>
                </div>
                <div v-if="!isNumericVoting && consensus" class="gv-result-sub">
                  {{ consensus.count }} of {{ consensus.total }}
                  {{ consensus.count === 1 ? "vote" : "votes" }}
                </div>
                <div v-if="!isNumericVoting" class="gv-result-hint">
                  Most common value
                </div>
              </div>

              <!-- Rounded (only when there's a decimal) -->
              <div
                v-if="hasDecimal"
                class="gv-result-card gv-result-card--rounded"
              >
                <div class="gv-result-label">Rounded</div>
                <div class="gv-result-value gv-result-value--green">
                  {{ roundedAgreement }}
                </div>
                <div class="gv-result-sub">Nearest whole number</div>
              </div>

              <!-- Nearest in deck (Fibonacci / numeric decks) -->
              <div
                v-if="showNearestInDeck"
                class="gv-result-card gv-result-card--nearest"
              >
                <div class="gv-result-label">Nearest in deck</div>
                <div class="gv-result-value gv-result-value--green">
                  {{ nearestInDeck }}
                </div>
                <div class="gv-result-sub">
                  Closest value in your deck (e.g. Fibonacci)
                </div>
              </div>
            </div>
            <!-- Vote distribution -->
            <div
              v-if="revealed && voteDistribution.length > 0"
              class="gv-distribution"
            >
              <div class="gv-result-label">Vote distribution</div>
              <div class="gv-distribution-bars">
                <div
                  v-for="item in voteDistribution"
                  :key="item.value"
                  class="gv-distribution-row"
                >
                  <span class="gv-distribution-value">{{ item.value }}</span>
                  <div class="gv-distribution-bar-wrap">
                    <div
                      class="gv-distribution-bar"
                      :style="{ width: item.percent + '%' }"
                    ></div>
                  </div>
                  <span class="gv-distribution-count">{{ item.count }}</span>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>

  <!-- ── Display name modal ───────────────────────── -->
  <Teleport to="body">
    <ModalContainer
      ref="modal"
      title="Choose your display name"
      okLabel="Continue to Game"
      :allowClose="false"
      :onlySubmit="true"
      :disableSubmit="user.displayName.trim() === ''"
      @submit="continueToGame"
    >
      <div class="row">
        <div class="col-12 mb-4">
          <label for="displayName" class="form-label">Your display name</label>
          <input
            id="displayName"
            class="form-control"
            type="text"
            autofocus
            placeholder="Display name"
            v-model="user.displayName"
          />
        </div>
        <div class="col-12 mb-4">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              v-model="user.joinAsSpectator"
              id="joinAsSpectator"
            />
            <label class="form-check-label" for="joinAsSpectator">
              Join as spectator
            </label>
          </div>
        </div>
      </div>
    </ModalContainer>
  </Teleport>

  <!-- ── Invite modal ─────────────────────────────── -->
  <Teleport to="body">
    <ModalContainer
      ref="inviteTeamModal"
      title="Invite players"
      okLabel="Copy invitation link"
      :allowClose="false"
      :onlySubmit="true"
      @submit="copyGameUrl"
    >
      <div class="row">
        <div class="col-12 mb-3 text-center">
          <div v-if="qrCodeDataUrl" class="gv-qr-wrap">
            <img
              :src="qrCodeDataUrl"
              alt="QR code to join game"
              class="gv-qr-img"
              width="160"
              height="160"
            />
          </div>
          <p class="gv-qr-hint">Scan to join on another device</p>
        </div>
        <div class="col-12 mb-4">
          <label for="gameUrl" class="form-label">URL of the game</label>
          <input
            id="gameUrl"
            class="form-control"
            type="text"
            readonly
            aria-describedby="gameUrlHelp"
            :value="currentUrl"
          />
          <small id="gameUrlHelp" class="form-text text-muted">
            Share this link so others can join the game.
          </small>
        </div>
      </div>
    </ModalContainer>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { Card, Game, Member } from "@/interfaces/types";
import CardList from "@/components/CardList.vue";
import PockerTable from "./../components/PockerTable.vue";
import { useRoute } from "vue-router";
import { db, Base, GAME_COLLECTION } from "@/firebase/fb.api";
import { doc, onSnapshot } from "firebase/firestore";
import ModalContainer from "@/components/ModalContainer.vue";
import { nanoid } from "nanoid";
import { useStore } from "vuex";
import { useToast } from "@/composables/useToast";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const route: any = useRoute();
const store = useStore();
const toast = useToast();

const DISPLAY_NAME_KEY = "planningPokerDisplayName";

const gamesHttp = new Base(GAME_COLLECTION);
const gameNotFound = ref(false);

const savedDisplayName =
  typeof localStorage !== "undefined"
    ? (localStorage.getItem(DISPLAY_NAME_KEY) ?? "").trim()
    : "";

const user = ref<Member>({
  id: nanoid(),
  displayName: savedDisplayName,
  joinAsSpectator: false,
  admin: true,
  vote: "",
});

const userId = computed(() => store.getters["getUserId"]);
const gameData = computed(() => store.getters["getGameData"]);
const teamMembers = computed(() => store.getters["getTeamMembers"]);
const averageAgreement = computed(() => {
  const value = store.getters["getAverageAgreement"];
  if (value == null) return null;
  return Number(value.toFixed(2));
});
const hasDecimal = computed(
  () => averageAgreement.value != null && averageAgreement.value % 1 !== 0
);
const roundedAgreement = computed(() => {
  const value = averageAgreement.value;
  if (value == null) return null;
  return hasDecimal.value ? Math.round(value) : value;
});

/** Nearest value in the deck to the average (e.g. nearest Fibonacci). Null if deck is non-numeric. */
const nearestInDeck = computed((): string | null => {
  const avg = averageAgreement.value;
  const pattern = gameData.value?.votingSystem?.pattern;
  if (avg == null || !pattern?.length) return null;
  const numericEntries = pattern.map((s: string) => ({
    str: s,
    num: Number(s),
  }));
  if (numericEntries.every((e: { num: number }) => !Number.isNaN(e.num))) {
    let nearest = numericEntries[0];
    for (let i = 1; i < numericEntries.length; i++) {
      const cur = numericEntries[i];
      if (cur && Math.abs(cur.num - avg) < Math.abs(nearest.num - avg)) {
        nearest = cur;
      }
    }
    return nearest.str;
  }
  return null;
});

const showNearestInDeck = computed(
  () => isNumericVoting.value && nearestInDeck.value != null
);

const isNumericVoting = computed(() => averageAgreement.value != null);
const consensus = computed(
  () =>
    store.getters["getConsensus"] as {
      value: string;
      count: number;
      total: number;
    } | null
);

const showInviteModal = computed(() => store.getters["getInviteModalState"]);
const currentUrl = computed(() => window.location.href);
const currentTeamMember = ref<Member | undefined>();
const modal = ref();
const inviteTeamModal = ref();
const qrCodeDataUrl = ref("");

watch(
  currentUrl,
  async (url) => {
    if (!url) {
      qrCodeDataUrl.value = "";
      return;
    }
    try {
      const QRCode = await import("qrcode");
      const dataUrl = await QRCode.toDataURL(url, { width: 160, margin: 1 });
      qrCodeDataUrl.value = dataUrl;
    } catch {
      qrCodeDataUrl.value = "";
    }
  },
  { immediate: true }
);

const deckLabel = computed((): string => {
  const label: string = gameData.value?.votingSystem?.label ?? "";
  if (!label) return "";
  const match = label.match(/^([^(]+)/);
  return match ? match[1].trim() : label;
});

const currentStoryDisplay = computed(() =>
  (gameData.value?.currentStory ?? "").trim()
);
const currentStoryEditing = ref(false);
const currentStoryEditValue = ref("");
const currentStoryInputRef = ref<HTMLInputElement | null>(null);
const isCurrentUserAdmin = computed(
  () => currentTeamMember.value?.admin === true
);

function startEditCurrentStory() {
  if (!isCurrentUserAdmin.value) return;
  currentStoryEditValue.value = currentStoryDisplay.value;
  currentStoryEditing.value = true;
  nextTick(() => currentStoryInputRef.value?.focus());
}

async function saveCurrentStory() {
  currentStoryEditing.value = false;
  const val = currentStoryEditValue.value.trim();
  if (val === currentStoryDisplay.value) return;
  try {
    await gamesHttp.setDoc(route.params.id, { currentStory: val || "" });
  } catch {
    await toast.error("Failed to update story.");
  }
}

/** Vote distribution after reveal: { value, count, percent }[] */
const voteDistribution = computed(() => {
  if (!revealed.value) return [];
  const voters = teamMembers.value.filter((m: Member) => !m.joinAsSpectator);
  if (voters.length === 0) return [];
  const counts: Record<string, number> = {};
  for (const m of voters) {
    const v = m.vote ?? "—";
    counts[v] = (counts[v] ?? 0) + 1;
  }
  const total = voters.length;
  const pattern = gameData.value?.votingSystem?.pattern ?? [];
  const numericPattern = pattern
    .map((s: string) => Number(s))
    .every((n: number) => !Number.isNaN(n));
  const entries = Object.entries(counts).map(([value, count]) => ({
    value,
    count,
    percent: total > 0 ? (count / total) * 100 : 0,
  }));
  entries.sort((a, b) => {
    if (numericPattern) return Number(a.value) - Number(b.value);
    return String(a.value).localeCompare(String(b.value));
  });
  return entries;
});

const perfectConsensus = computed(() => {
  if (!revealed.value || voteDistribution.value.length !== 1) return false;
  return (
    voteDistribution.value[0].count ===
    teamMembers.value.filter((m: Member) => !m.joinAsSpectator).length
  );
});

const cards = computed((): Card[] => {
  return (
    gameData.value?.votingSystem?.pattern?.map((digit: string) => ({
      value: digit,
    })) || []
  );
});

const revealed = computed(() => gameData.value?.reveal);
const disabled = ref(false);

const recordVote = async (vote: Card) => {
  if (!currentTeamMember.value) return;
  try {
    currentTeamMember.value.vote = vote.value;
    await gamesHttp.setDoc(route.params.id, { users: teamMembers.value });
  } catch {
    await toast.error(
      "Failed to save your vote. Check your connection and try again."
    );
  }
};

const reveal = async () => {
  try {
    await gamesHttp.setDoc(route.params.id, { reveal: true });
  } catch {
    await toast.error(
      "Failed to reveal cards. Check your connection and try again."
    );
  }
};

const reset = async () => {
  try {
    store.dispatch("resetVotes", route.params.id);
    await gamesHttp.setDoc(route.params.id, {
      reveal: false,
      users: teamMembers.value,
    });
  } catch {
    await toast.error(
      "Failed to reset round. Check your connection and try again."
    );
  }
};

let justStarted = false;
const continueToGame = async () => {
  const name = user.value.displayName.trim();
  if (name && typeof localStorage !== "undefined") {
    localStorage.setItem(DISPLAY_NAME_KEY, name);
  }
  if (teamMembers.value.length > 0) user.value.admin = false;
  const newUsers: Member[] = [...teamMembers.value, user.value];
  try {
    await gamesHttp.setDoc(route.params.id, { users: newUsers });
    store.dispatch("setUserId", user.value.id);
    store.dispatch("setGameData", {
      ...gameData.value,
      users: newUsers,
    } as Game);
    justStarted = true;
    currentTeamMember.value = user.value;
    if (modal.value) modal.value.toggle();
  } catch {
    await toast.error(
      "Failed to join the game. Check your connection and try again."
    );
  }
};

const copyGameUrl = async () => {
  try {
    await navigator.clipboard.writeText(currentUrl.value);
    store.dispatch("setInviteModalState", false);
    await toast.success("Copied to clipboard", { autoClose: 1000 });
  } catch {
    await toast.error("Could not copy to clipboard. Copy the URL manually.");
  }
};

const setNewUserModalState = () => {
  if (gameNotFound.value || !modal.value) return;
  currentTeamMember.value = teamMembers.value.find(
    (teamMember: Member) => teamMember.id === userId.value
  );
  if (currentTeamMember.value || justStarted) {
    modal.value.show = false;
  } else {
    modal.value.show = true;
  }
};

onSnapshot(
  doc(db, GAME_COLLECTION, route.params.id),
  (snapshot) => {
    if (!snapshot.exists()) {
      gameNotFound.value = true;
      store.dispatch("setGameData", null);
    } else {
      gameNotFound.value = false;
      store.dispatch("setGameData", snapshot.data() as Game);
    }
  },
  (err) => {
    gameNotFound.value = true;
    store.dispatch("setGameData", null);
    toast.error("Could not load game. Check your connection.");
    // eslint-disable-next-line no-console -- log Firestore errors for debugging
    console.error("Firestore snapshot error:", err);
  }
);

watch(
  () => gameData.value,
  () => {
    setNewUserModalState();
  },
  { deep: true }
);

watch(
  () => showInviteModal.value,
  (value: boolean) => {
    inviteTeamModal.value.show = value;
  },
  { deep: true }
);

watch(
  () => revealed.value,
  async (isRevealed) => {
    if (!isRevealed) return;
    await nextTick();
    if (perfectConsensus.value) {
      try {
        const confetti = (await import("canvas-confetti")).default;
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // canvas-confetti not installed
      }
    }
  }
);

onMounted(() => {
  window.addEventListener("sw-update", () => {
    toast.success("New version available! Refresh to update.", {
      autoClose: 0,
    });
  });
});
</script>

<style lang="scss" scoped>
.game-view {
  min-height: calc(100vh - 115px);
  display: flex;
  flex-direction: column;
}

/* ── Not Found ─────────────────────────────────── */
.gv-not-found {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
}

.gv-not-found-card {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
  padding: 3rem 2.5rem;
  text-align: center;
  max-width: 440px;
  width: 100%;
}

.gv-not-found-icon {
  width: 4rem;
  height: 4rem;
  background: rgba(220, 53, 69, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 1.5rem;
  color: #dc3545;
}

.gv-not-found-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.75rem;
}

.gv-not-found-desc {
  color: #6c757d;
  line-height: 1.6;
  margin: 0 0 1.75rem;
  font-size: 0.9375rem;
}

.gv-not-found-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.gv-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 600;
  border-radius: 12px;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-1px);
  }

  &--primary {
    background: #0f5132;
    color: #fff;
    box-shadow: 0 2px 8px rgba(15, 81, 50, 0.3);

    &:hover {
      background: #0d4629;
      color: #fff;
      box-shadow: 0 4px 16px rgba(15, 81, 50, 0.4);
    }
  }

  &--outline {
    background: #fff;
    color: #0f5132;
    border: 1.5px solid rgba(15, 81, 50, 0.25);

    &:hover {
      background: rgba(15, 81, 50, 0.05);
      color: #0f5132;
    }
  }
}

/* ── Active Game ───────────────────────────────── */
.gv-active {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Info bar */
.gv-info-bar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  padding: 0.875rem 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.gv-info-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.gv-info-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.gv-game-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: -0.01em;
}

.gv-current-story-wrap {
  width: 100%;
  max-width: 20rem;
}

.gv-current-story-input {
  width: 100%;
  padding: 0.35rem 0.5rem;
  font-size: 0.875rem;
  font-family: inherit;
  border: 1px solid rgba(15, 81, 50, 0.3);
  border-radius: 8px;
  outline: none;
  background: #fff;

  &:focus {
    border-color: #0f5132;
    box-shadow: 0 0 0 2px rgba(25, 135, 84, 0.2);
  }
}

.gv-current-story {
  font-size: 0.875rem;
  color: #4a5568;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  cursor: default;

  .bi {
    color: #198754;
    flex-shrink: 0;
  }

  &.gv-current-story--empty {
    color: #9ca3af;
    cursor: pointer;

    &:hover {
      color: #0f5132;
    }
  }

  &.gv-current-story--editable {
    cursor: pointer;

    &:hover {
      color: #0f5132;
    }
  }
}

/* Vote distribution */
.gv-distribution {
  width: 100%;
  max-width: 640px;
  margin-top: 1rem;
  padding: 1.25rem 1.5rem;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 18px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.gv-distribution .gv-result-label {
  margin-bottom: 1rem;
}

.gv-distribution-bars {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.gv-distribution-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
}

.gv-distribution-value {
  min-width: 2.5rem;
  font-weight: 700;
  color: #0f5132;
}

.gv-distribution-bar-wrap {
  flex: 1;
  height: 1.5rem;
  background: rgba(15, 81, 50, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.gv-distribution-bar {
  height: 100%;
  background: linear-gradient(90deg, #198754, #20c997);
  border-radius: 8px;
  min-width: 4px;
  transition: width 0.4s ease;
}

.gv-distribution-count {
  min-width: 2rem;
  font-weight: 600;
  color: #6c757d;
  text-align: right;
}

/* Invite modal QR */
.gv-qr-wrap {
  display: inline-block;
  padding: 0.75rem;
  background: #fff;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  margin-bottom: 0.5rem;
}

.gv-qr-img {
  display: block;
  border-radius: 6px;
}

.gv-qr-hint {
  font-size: 0.8125rem;
  color: #6c757d;
  margin: 0;
}

.gv-deck-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #0f5132;
  background: rgba(25, 135, 84, 0.1);
  padding: 0.25rem 0.625rem;
  border-radius: 100px;
}

.gv-info-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.gv-player-count {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6c757d;
}

.gv-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.3rem 0.75rem;
  border-radius: 100px;

  &--voting {
    background: rgba(255, 193, 7, 0.15);
    color: #856404;

    .gv-status-dot {
      background: #ffc107;
      animation: status-pulse 1.5s ease-in-out infinite;
    }
  }

  &--revealed {
    background: rgba(25, 135, 84, 0.12);
    color: #0f5132;

    .gv-status-dot {
      background: #198754;
    }
  }
}

.gv-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

@keyframes status-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}

/* Main content */
.gv-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  padding-top: 2.5rem;
  padding-bottom: 3rem;
}

.gv-table-wrap {
  width: 100%;
  max-width: 640px;
}

/* Hand */
.gv-hand {
  width: 100%;
  max-width: 720px;
  text-align: center;
}

.gv-hand-prompt {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  .bi {
    color: #198754;
  }
}

/* Spectator */
.gv-spectator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  color: #6c757d;
  background: rgba(108, 117, 125, 0.08);
  padding: 0.75rem 1.25rem;
  border-radius: 12px;

  .bi {
    color: #adb5bd;
  }
}

/* Results */
.results-fade-enter-active,
.results-fade-leave-active {
  transition: opacity 0.45s ease, transform 0.45s ease;
}

.results-fade-enter-from,
.results-fade-leave-to {
  opacity: 0;
  transform: translateY(14px);
}

.gv-results {
  width: 100%;
  max-width: 640px;
}

.gv-results-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.gv-result-card {
  flex: 1;
  min-width: 160px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 18px;
  padding: 1.75rem 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.07);

  &--rounded {
    border-color: rgba(25, 135, 84, 0.2);
    background: rgba(25, 135, 84, 0.03);
  }

  &--nearest {
    border-color: rgba(25, 135, 84, 0.25);
    background: rgba(25, 135, 84, 0.06);
  }
}

.gv-result-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9ca3af;
  margin-bottom: 0.5rem;
}

.gv-result-value {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  margin-bottom: 0.5rem;

  &--green {
    color: #0f5132;
  }

  &--neutral {
    color: #1a1a1a;
    font-size: 3rem;
  }
}

.gv-result-sub {
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 500;
  margin-top: 0.25rem;
}

.gv-result-hint {
  font-size: 0.8rem;
  color: #adb5bd;
  margin-top: 0.2rem;
}

@media (max-width: 575.98px) {
  .gv-game-name {
    font-size: 1rem;
  }

  .gv-result-value {
    font-size: 3rem;

    &--neutral {
      font-size: 2.25rem;
    }
  }
}
</style>
