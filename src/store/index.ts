import { createStore } from "vuex";
import { Game, Member } from "@/interfaces/types";
import Cookies from "js-cookie";

export default createStore({
  state: {
    userId: Cookies.get("userId") || null,
    gameData: undefined as Game | undefined,
    showInviteModal: false,
  },
  getters: {
    getUserId(state) {
      return state.userId;
    },
    getGameData(state) {
      return state.gameData;
    },
    getTeamMembers(state) {
      const users =
        state.gameData?.users && Array.isArray(state.gameData?.users)
          ? state.gameData?.users
          : [];
      return users?.map((user: Member) => {
        return {
          id: user.id,
          displayName: user.displayName,
          joinAsSpectator: user.joinAsSpectator,
          admin: user.admin,
          vote: user.vote ?? "",
        };
      });
    },
    getAverageAgreement(state) {
      const totalVotes =
        state.gameData?.users?.reduce(
          (total, next) => total + Number(next.vote),
          0
        ) ?? 0;
      const players =
        state.gameData?.users?.filter(
          (teamMember: Member) => !teamMember.joinAsSpectator
        ) ?? [];
      return totalVotes / players.length;
    },
    getInviteModalState(state) {
      return state.showInviteModal;
    },
  },
  mutations: {
    mutateGameData(state, data): void {
      state.gameData = data;
    },
    mutateVotes(state): void {
      if (state.gameData) {
        state.gameData.users = state.gameData.users.map((user: Member) => {
          return {
            ...user,
            vote: "",
          };
        });
      }
    },
    mutateUserId(state, data): void {
      state.userId = data;
    },
    mutateInviteModalState(state, data: boolean): void {
      state.showInviteModal = data;
    },
  },
  actions: {
    setUserId(context, userId) {
      Cookies.set("userId", userId, { expires: 7 });
      context.commit("mutateUserId", userId);
    },
    setGameData(context, docData) {
      context.commit("mutateGameData", docData);
    },
    resetVotes(context) {
      context.commit("mutateVotes");
    },
    setInviteModalState(context, state) {
      context.commit("mutateInviteModalState", state);
    },
  },
  modules: {},
});
