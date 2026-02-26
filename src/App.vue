<template>
  <div id="app-root">
    <header class="app-nav" role="banner">
      <div class="app-nav-container container">
        <button
          v-if="routeName !== 'home'"
          type="button"
          class="app-nav-back"
          aria-label="Go back"
          @click="goBack"
        >
          <i class="bi bi-arrow-left" aria-hidden="true"></i>
          <span class="app-nav-back-text">Back</span>
        </button>
        <router-link
          class="app-nav-brand"
          to="/"
          aria-label="Planning Poker – Home"
        >
          <i
            class="bi bi-suit-spade-fill app-nav-brand-icon"
            aria-hidden="true"
          ></i>
          <span class="app-nav-brand-text">Planning Poker</span>
        </router-link>

        <nav class="app-nav-links" aria-label="Main navigation">
          <router-link v-if="routeName !== 'home'" class="app-nav-link" to="/">
            <i class="bi bi-house" aria-hidden="true"></i>
            Home
          </router-link>
          <router-link
            class="app-nav-link"
            to="/about"
            :aria-current="routeName === 'about' ? 'page' : undefined"
          >
            <i class="bi bi-info-circle" aria-hidden="true"></i>
            About
          </router-link>
        </nav>

        <div class="app-nav-actions">
          <template v-if="routeName === 'game'">
            <button
              type="button"
              class="app-nav-btn app-nav-btn--outline"
              @click="toggleInviteTeamModal"
              aria-label="Invite players – copy game link"
            >
              <i class="bi bi-person-plus-fill" aria-hidden="true"></i>
              <span class="app-nav-btn-text">Invite</span>
            </button>
            <router-link class="app-nav-btn app-nav-btn--ghost" to="/new-game">
              <i class="bi bi-plus-circle" aria-hidden="true"></i>
              <span class="app-nav-btn-text">New game</span>
            </router-link>
          </template>
          <template v-else>
            <router-link
              v-if="!['game', 'newgame'].includes(routeName)"
              class="app-nav-btn app-nav-btn--primary"
              to="/new-game"
            >
              <i class="bi bi-play-fill" aria-hidden="true"></i>
              <span class="app-nav-btn-text">Start new game</span>
            </router-link>
          </template>
        </div>

        <button
          type="button"
          class="app-nav-toggle"
          :aria-expanded="navOpen"
          aria-controls="app-nav-menu"
          aria-label="Toggle menu"
          @click="navOpen = !navOpen"
        >
          <i
            class="bi"
            :class="navOpen ? 'bi-x-lg' : 'bi-list'"
            aria-hidden="true"
          ></i>
        </button>
      </div>

      <div
        id="app-nav-menu"
        class="app-nav-mobile"
        :class="{ 'app-nav-mobile--open': navOpen }"
        role="navigation"
        aria-label="Mobile menu"
      >
        <button
          v-if="routeName !== 'home'"
          type="button"
          class="app-nav-mobile-link app-nav-mobile-btn app-nav-mobile-back"
          @click="
            goBack();
            navOpen = false;
          "
          aria-label="Go back"
        >
          <i class="bi bi-arrow-left" aria-hidden="true"></i>
          Back
        </button>
        <router-link
          v-if="routeName !== 'home'"
          class="app-nav-mobile-link"
          to="/"
          @click="navOpen = false"
        >
          <i class="bi bi-house" aria-hidden="true"></i>
          Home
        </router-link>
        <router-link
          class="app-nav-mobile-link"
          to="/about"
          @click="navOpen = false"
        >
          <i class="bi bi-info-circle" aria-hidden="true"></i>
          About
        </router-link>
        <template v-if="routeName === 'game'">
          <button
            type="button"
            class="app-nav-mobile-link app-nav-mobile-btn"
            @click="
              toggleInviteTeamModal();
              navOpen = false;
            "
          >
            <i class="bi bi-person-plus-fill" aria-hidden="true"></i>
            Invite players
          </button>
          <router-link
            class="app-nav-mobile-link"
            to="/new-game"
            @click="navOpen = false"
          >
            <i class="bi bi-plus-circle" aria-hidden="true"></i>
            New game
          </router-link>
        </template>
        <router-link
          v-else-if="!['game', 'newgame'].includes(routeName)"
          class="app-nav-mobile-link app-nav-mobile-link--primary"
          to="/new-game"
          @click="navOpen = false"
        >
          <i class="bi bi-play-fill" aria-hidden="true"></i>
          Start new game
        </router-link>
      </div>
    </header>
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
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const route: any = useRoute();
const router = useRouter();
const store = useStore();

const routeName = computed(() => route.name);
const showInviteModal = computed(() => store.getters["getInviteModalState"]);
const year = new Date().getFullYear();
const version = (process.env.VUE_APP_VERSION as string | undefined) ?? "0.1.2";
const navOpen = ref(false);

watch(
  () => route.path,
  () => {
    navOpen.value = false;
  }
);

const goBack = () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    router.push("/");
  }
};

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
/* ── App navbar ───────────────────────────────────── */
.app-nav {
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.88);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  backdrop-filter: saturate(180%) blur(14px);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.8);
}

.app-nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  min-height: 3.25rem;
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
}

.app-nav-back {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.5rem 0.5rem 0.25rem;
  margin-right: 0.25rem;
  font-size: 0.9375rem;
  font-weight: 600;
  font-family: inherit;
  color: #4a5568;
  background: transparent;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: color 0.15s ease, background 0.15s ease;
  flex-shrink: 0;

  &:hover {
    color: #0f5132;
    background: rgba(25, 135, 84, 0.06);
  }

  .bi {
    font-size: 1.125rem;
  }
}

.app-nav-back-text {
  white-space: nowrap;
}

@media (max-width: 767.98px) {
  .app-nav-back-text {
    display: none;
  }

  .app-nav-back {
    padding: 0.5rem 0.5rem;
    margin-right: 0;
  }
}

.app-nav-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #1a1a1a !important;
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: #0f5132 !important;
  }
}

.app-nav-brand-icon {
  font-size: 1.25rem;
  color: #0f5132;
  flex-shrink: 0;
}

.app-nav-brand-text {
  white-space: nowrap;
}

.app-nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.app-nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #4a5568 !important;
  text-decoration: none;
  border-radius: 10px;
  transition: color 0.15s ease, background 0.15s ease;

  &:hover {
    color: #0f5132 !important;
    background: rgba(25, 135, 84, 0.06);
  }

  &.router-link-active,
  &[aria-current="page"] {
    color: #0f5132 !important;
    background: rgba(25, 135, 84, 0.1);
  }

  .bi {
    font-size: 1rem;
    opacity: 0.9;
  }
}

.app-nav-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.app-nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  font-size: 0.9375rem;
  font-weight: 600;
  font-family: inherit;
  border-radius: 10px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;

  &--primary {
    background: #0f5132;
    color: #fff !important;
    box-shadow: 0 2px 8px rgba(15, 81, 50, 0.3);

    &:hover {
      background: #0d4629;
      box-shadow: 0 4px 14px rgba(15, 81, 50, 0.35);
      color: #fff !important;
    }
  }

  &--outline {
    background: transparent;
    color: #0f5132 !important;
    border: 1.5px solid rgba(15, 81, 50, 0.35);

    &:hover {
      background: rgba(15, 81, 50, 0.08);
      border-color: #0f5132;
      color: #0f5132 !important;
    }
  }

  &--ghost {
    background: transparent;
    color: #4a5568 !important;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
      color: #1a1a1a !important;
    }
  }
}

.app-nav-btn-text {
  white-space: nowrap;
}

@media (max-width: 767.98px) {
  .app-nav-btn-text {
    display: none;
  }

  .app-nav-btn {
    padding: 0.5rem 0.75rem;

    .bi {
      margin: 0;
    }
  }

  .app-nav-links {
    display: none;
  }

  .app-nav-actions {
    margin-right: 0.25rem;
  }
}

.app-nav-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  color: #1a1a1a;
  font-size: 1.25rem;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.15);
  }
}

@media (max-width: 767.98px) {
  .app-nav-toggle {
    display: flex;
  }
}

.app-nav-mobile {
  display: none;
  flex-direction: column;
  padding: 0.75rem 0;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.98);
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease;

  &--open {
    max-height: 320px;
  }
}

@media (max-width: 767.98px) {
  .app-nav-mobile {
    display: flex;
  }
}

.app-nav-mobile-link,
.app-nav-mobile-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1a1a1a !important;
  text-decoration: none;
  background: none;
  border: none;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s ease;
  border-radius: 0;

  &:hover {
    background: rgba(25, 135, 84, 0.08);
    color: #0f5132 !important;
  }

  .bi {
    font-size: 1.125rem;
    color: #0f5132;
    opacity: 0.9;
  }

  &--primary {
    margin-top: 0.5rem;
    background: rgba(15, 81, 50, 0.1);
    color: #0f5132 !important;
    border-radius: 10px;
    justify-content: center;

    &:hover {
      background: rgba(15, 81, 50, 0.18);
    }
  }
}

.app-nav-mobile-btn {
  color: #1a1a1a;
}

.app-nav-mobile-back {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  margin-bottom: 0.25rem;
  padding-bottom: 0.75rem;

  .bi {
    color: #0f5132;
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
