<template>
  <nav class="navbar bg-body-tertiary">
    <div class="container">
      <div class="d-flex">
        <router-link class="navbar-brand" to="/">Planning Poker</router-link>
      </div>
      <div class="row">
        <div class="col-md-3 d-flex align-items-center">
          <div
            v-if="routeName === 'home'"
            class="nav text-uppercase fs-6 fw-semibold"
          >
            <router-link class="nav-link d-flex align-items-center" to="/about"
              >About</router-link
            >
          </div>
        </div>
        <div class="col-md-9 col-md-9 d-flex justify-content-end">
          <button
            v-if="routeName === 'game'"
            class="btn btn-outline-primary text-nowrap"
            @click="toggleInviteTeamModal"
          >
            Invite players
          </button>
          <router-link
            v-if="!['game', 'newgame'].includes(routeName)"
            class="btn btn-lg btn-success text-nowrap"
            to="/new-game"
            >Start New Game</router-link
          >
        </div>
      </div>
    </div>
  </nav>
  <router-view />
  <footer class="footer">
    <div class="container">
      <p class="text-center">
        &copy; {{ year }} Planning Poker Minimal. All rights reserved. v1.01
      </p>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const route: any = useRoute();
const store = useStore();

const routeName = computed(() => route.name);
const showInviteModal = computed(() => store.getters["getInviteModalState"]);
const year = new Date().getFullYear();

const toggleInviteTeamModal = () => {
  store.dispatch("setInviteModalState", !showInviteModal.value);
};
</script>

<style lang="scss">
@import "./assets/style/bootstrap@5.3.0.scss";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: rgba(248, 249, 250, 1) !important;
  min-height: 100vh;
}
.app {
  min-height: calc(100vh - 115px);
}
nav {
  padding: 30px;

  a {
    font-weight: bold;
    &:not(.btn) {
      color: #2c3e50 !important;
    }
    &.nav-link {
      line-height: initial !important;
    }

    &.router-link-exact-active:not(.btn) {
      color: #42b983 !important;
    }
  }
}
.feature-card {
  margin-bottom: 3rem;
}
.section-header {
  display: inline-block;
  margin-bottom: 20px;
  .section-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin: 0;
    padding: 0;
  }
  .section-divider {
    height: 2px;
    width: 80px;
    background-color: #333;
    margin: 10px auto;
  }
}
.sub-section-title {
  font-size: 18px;
  font-weight: bold;
  color: #555;
  margin: 20px 0 10px 0;
  padding: 0;
}
.section-description {
  font-size: 14px;
  color: #777;
  margin: 0;
  padding: 0;
}
.footer {
  background-color: #f8f9fa;
  padding: 1.2rem 0;
  p {
    font-size: 14px;
    color: #888;
    margin: 0;
  }
}
</style>
