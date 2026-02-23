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
      const players =
        state.gameData?.users?.filter(
          (teamMember: Member) => !teamMember.joinAsSpectator
        ) ?? [];
      if (players.length === 0) return 0;
      const votes = players.map((p) => p.vote);
      const numericVotes = votes.map((v) => Number(v));
      if (numericVotes.some((n) => isNaN(n))) return null;
      const totalVotes = numericVotes.reduce((total, n) => total + n, 0);
      const avg = totalVotes / players.length;
      return isNaN(avg) ? 0 : avg;
    },
    getConsensus(
      state
    ): { value: string; count: number; total: number } | null {
      const players =
        state.gameData?.users?.filter(
          (teamMember: Member) =>
            !teamMember.joinAsSpectator &&
            teamMember.vote != null &&
            teamMember.vote !== ""
        ) ?? [];
      if (players.length === 0) return null;
      const votes = players.map((p) => p.vote);
      const numericVotes = votes.map((v) => Number(v));
      if (!numericVotes.some((n) => isNaN(n))) return null;
      const counts: Record<string, number> = {};
      for (const v of votes) {
        counts[v] = (counts[v] ?? 0) + 1;
      }
      let topValue = "";
      let topCount = 0;
      for (const [val, count] of Object.entries(counts)) {
        if (count > topCount) {
          topValue = val;
          topCount = count;
        }
      }
      return topValue
        ? { value: topValue, count: topCount, total: players.length }
        : null;
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
