<template>
  <div id="app-root">
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
              <router-link
                class="nav-link d-flex align-items-center"
                to="/about"
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
    <main class="app-main">
      <router-view />
    </main>
    <footer class="footer">
      <div class="container">
        <p class="text-center">
          &copy; {{ year }} Planning Poker Minimal. All rights reserved. v{{
            version
          }}
        </p>
      </div>
    </footer>
  </div>
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
const version = (process.env.VUE_APP_VERSION as string | undefined) ?? "0.1.2";

const toggleInviteTeamModal = () => {
  store.dispatch("setInviteModalState", !showInviteModal.value);
};
</script>

<style lang="scss">
@import "./assets/style/bootstrap@5.3.0.scss";
#app {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #1a1a1a;
  background-color: #f8faf9;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
html {
  scroll-behavior: smooth;
}
#app-root {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}
.app-main {
  flex: 1 0 auto;
  min-height: 0;
}
.app {
  min-height: calc(100vh - 115px);
}
nav {
  padding: 1rem 0;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: saturate(180%) blur(12px);

  a {
    font-weight: 600;
    &:not(.btn) {
      color: #1a1a1a !important;
    }
    &.nav-link {
      line-height: initial !important;
      font-size: 0.9375rem;
      letter-spacing: 0.02em;
    }

    &.router-link-exact-active:not(.btn) {
      color: #0f5132 !important;
    }
  }
  .navbar-brand {
    font-size: 1.125rem;
    letter-spacing: -0.02em;
    color: #1a1a1a !important;
  }
  .btn-success {
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 10px;
    font-size: 0.9375rem;
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
.section-min-height {
  min-height: 200px;
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
  flex-shrink: 0;
  min-height: 72px;
  background: #1a1a1a;
  padding: 1.5rem 0;
  p {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.65);
    margin: 0;
  }
}
</style>
