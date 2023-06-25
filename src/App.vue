<template>
  <nav class="navbar bg-body-tertiary">
    <div class="container-fluid">
      <div class="d-flex">
        <router-link class="navbar-brand" to="/">Planning Poker</router-link>
        <div class="nav mt-1">
          <router-link class="nav-link" to="/about">About</router-link>
        </div>
      </div>
      <router-link
        v-if="routeName !== 'game'"
        class="btn btn-lg btn-success"
        to="/new-game"
        >Start New Game</router-link
      >
    </div>
  </nav>
  <nav></nav>
  <router-view />
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const route: any = useRoute();
const routeName = computed(() => route.name);
debugger;
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
</style>
