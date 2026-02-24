<template>
  <div class="app">
    <div class="container">
      <div class="row justify-content-md-center">
        <div class="col-md-6">
          <div class="row text-center">
            <div class="col-12 mt-5">
              <h1>Planning Poker Minimal</h1>
            </div>
            <div class="col-12">
              <div class="w-100">
                <PockerTable
                  class="my-5"
                  :team-members="teamMembers"
                  :revealed="revealed"
                  @reveal="reveal"
                  @reset="reset"
                />
                <div v-if="!currentTeamMember?.joinAsSpectator && !revealed">
                  <p>Choose your card 👇</p>
                  <CardList
                    :cards="cards"
                    @card-selected="recordVote"
                    :disabled="disabled"
                    :voted-card="currentTeamMember?.vote"
                  />
                </div>
                <div v-if="revealed" :class="hasDecimal ? '' : 'text-success'">
                  <p class="h4 mt-5">
                    {{ isNumericVoting ? "Average Agreement" : "Consensus" }}
                  </p>
                  <p :class="hasDecimal ? 'h5' : 'h1'">
                    <template v-if="isNumericVoting">{{
                      averageAgreement
                    }}</template>
                    <template v-else-if="consensus">
                      {{ consensus.value }}
                      <span class="h5 text-muted">
                        ({{ consensus.count }} of {{ consensus.total }}
                        {{ consensus.count === 1 ? "vote" : "votes" }})
                      </span>
                    </template>
                    <template v-else>—</template>
                  </p>

                  <div v-if="hasDecimal" class="text-success">
                    <p class="h4 mt-5">Rounded Agreement</p>
                    <p class="h1">
                      {{ roundedAgreement }}
                    </p>
                  </div>
                  <p
                    v-if="!isNumericVoting && consensus"
                    class="text-muted small mt-2"
                  >
                    Most common value (t-shirt / custom deck)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
        <div class="col-12 mb-4">
          <label for="displayName" class="form-label">URL of the game</label>
          <input
            id="displayName"
            class="form-control"
            type="text"
            autofocus
            readonly
            placeholder="Display name"
            :value="currentUrl"
          />
        </div>
      </div>
    </ModalContainer>
  </Teleport>
</template>

<script lang="ts" setup>
import { ref, computed, watch, getCurrentInstance } from "vue";
import { Card, Game, Member } from "@/interfaces/types";
import CardList from "@/components/CardList.vue";
import PockerTable from "./../components/PockerTable.vue";
import { useRoute } from "vue-router";
import { db, Base, GAME_COLLECTION } from "@/firebase/fb.api";
import { doc, onSnapshot } from "firebase/firestore";
import ModalContainer from "@/components/ModalContainer.vue";
import { nanoid } from "nanoid";
import { useStore } from "vuex";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const route: any = useRoute();
const store = useStore();

const gamesHttp = new Base(GAME_COLLECTION);

const user = ref<Member>({
  id: nanoid(),
  displayName: "",
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

const cards = computed((): Card[] => {
  return (
    gameData.value?.votingSystem?.pattern?.map((digit: string) => {
      return {
        value: digit,
      };
    }) || []
  );
});

const revealed = computed(() => gameData.value?.reveal);

const disabled = ref(false);

const recordVote = (vote: Card) => {
  if (currentTeamMember.value) {
    currentTeamMember.value.vote = vote.value;
    gamesHttp.setDoc(route.params.id, { users: teamMembers.value });
  }
};

const reveal = () => {
  gamesHttp.setDoc(route.params.id, { reveal: true });
};

const reset = () => {
  store.dispatch("resetVotes", route.params.id);
  gamesHttp.setDoc(route.params.id, {
    reveal: false,
    users: teamMembers.value,
  });
};

let justStarted = false;
const continueToGame = () => {
  if (teamMembers.value.length > 0) user.value.admin = false;
  const users: Member[] = [...teamMembers.value, ...[user.value]];
  gamesHttp.setDoc(route.params.id, { users: users });
  store.dispatch("setUserId", user.value.id);
  justStarted = true;
  if (modal.value) modal.value.toggle();
};

const copyGameUrl = async () => {
  navigator.clipboard.writeText(currentUrl.value);
  store.dispatch("setInviteModalState", false);
  const { toast, default: Toast } = await import("vue3-toastify");
  await import("vue3-toastify/dist/index.css");
  const app = getCurrentInstance()?.appContext.app;
  if (app && !(app as { _toastInstalled?: boolean })._toastInstalled) {
    app.use(Toast);
    (app as { _toastInstalled?: boolean })._toastInstalled = true;
  }
  toast.success("Copied to clipboard", {
    autoClose: 1000,
  });
};

const setNewUserModalState = () => {
  currentTeamMember.value = teamMembers.value.find(
    (teamMember: Member) => teamMember.id === userId.value
  );
  if (currentTeamMember.value || justStarted) {
    modal.value.show = false;
  } else {
    modal.value.show = true;
  }
};

onSnapshot(doc(db, GAME_COLLECTION, route.params.id), (doc) => {
  store.dispatch("setGameData", doc.data() as Game);
});

watch(
  () => gameData.value,
  () => {
    setNewUserModalState();
  },
  {
    deep: true,
  }
);

watch(
  () => showInviteModal.value,
  (value: boolean) => {
    inviteTeamModal.value.show = value;
  },
  {
    deep: true,
  }
);
</script>
