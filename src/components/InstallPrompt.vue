<template>
  <Transition name="install-slide">
    <section
      v-if="visible && consent !== 'unset'"
      class="install-prompt"
      role="region"
      aria-label="Install the app"
    >
      <img
        src="/img/icons/android-chrome-192x192.png"
        alt=""
        class="install-icon"
        width="40"
        height="40"
      />
      <div class="install-body">
        <p class="install-title">Keep Planning Poker one click away</p>
        <p class="install-text">
          Install it for your next sprint — opens like an app, no app store.
        </p>
      </div>
      <div class="install-actions">
        <button type="button" class="install-btn" @click="dismiss">
          Not now
        </button>
        <button
          type="button"
          class="install-btn install-btn--primary"
          @click="install"
        >
          Install
        </button>
      </div>
    </section>
  </Transition>
</template>

<script lang="ts" setup>
import { usePwaInstall } from "@/composables/usePwaInstall";
import { consent } from "@/analytics";

// Waits until the cookie banner is answered so the two never stack.

const { visible, install, dismiss } = usePwaInstall();
</script>

<style lang="scss" scoped>
.install-prompt {
  position: fixed;
  left: 1rem;
  right: 1rem;
  bottom: 1rem;
  z-index: 1040;
  max-width: 460px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 0.875rem;
  padding: 0.875rem 1rem;
  background: #0f5132;
  color: #fff;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(15, 81, 50, 0.35);

  @media (min-width: 768px) {
    left: auto;
    right: 1.5rem;
    bottom: 1.5rem;
    margin: 0;
  }
}

.install-icon {
  border-radius: 10px;
  background: #fff;
}

.install-body {
  flex: 1 1 200px;
}

.install-title {
  margin: 0;
  font-weight: 700;
  font-size: 0.9375rem;
}

.install-text {
  margin: 0.125rem 0 0;
  font-size: 0.8125rem;
  opacity: 0.85;
}

.install-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}

.install-btn {
  padding: 0.45rem 0.9rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: transparent;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;

  &--primary {
    background: #fff;
    border-color: #fff;
    color: #0f5132;
  }

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
}

.install-slide-enter-active,
.install-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.install-slide-enter-from,
.install-slide-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
