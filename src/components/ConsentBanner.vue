<template>
  <Transition name="consent-slide">
    <section
      v-if="consent === 'unset'"
      class="consent-banner"
      role="region"
      aria-label="Cookie consent"
    >
      <p class="consent-text">
        <i class="bi bi-bar-chart-line" aria-hidden="true"></i>
        We'd like to use Google Analytics cookies to see how the app is used and
        make it better. No game names, player names or votes are sent.
        <router-link to="/privacy" class="consent-link">Privacy</router-link>
      </p>
      <div class="consent-actions">
        <button type="button" class="consent-btn" @click="choose('denied')">
          Decline
        </button>
        <button
          type="button"
          class="consent-btn consent-btn--primary"
          @click="choose('granted')"
        >
          Accept
        </button>
      </div>
    </section>
  </Transition>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import { consent, setConsent, trackPageView } from "@/analytics";

const route = useRoute();

async function choose(value: "granted" | "denied") {
  await setConsent(value);
  // The current page was viewed before consent; record it now.
  if (value === "granted") {
    await trackPageView(
      route.path,
      document.title,
      route.name as string | undefined
    );
  }
}
</script>

<style lang="scss" scoped>
.consent-banner {
  position: fixed;
  left: 1rem;
  right: 1rem;
  bottom: 1rem;
  z-index: 1050;
  max-width: 560px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1rem;
  padding: 1rem 1.125rem;
  background: #fff;
  border: 1px solid rgba(15, 81, 50, 0.14);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.14);

  @media (min-width: 768px) {
    left: auto;
    right: 1.5rem;
    bottom: 1.5rem;
    margin: 0;
  }
}

.consent-text {
  flex: 1 1 260px;
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.55;
  color: #4a5568;

  i {
    color: #0f5132;
    margin-right: 0.25rem;
  }
}

.consent-link {
  color: #0f5132;
  font-weight: 600;
}

.consent-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
}

.consent-btn {
  padding: 0.5rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(15, 81, 50, 0.25);
  background: #fff;
  color: #0f5132;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: rgba(15, 81, 50, 0.05);
  }

  &--primary {
    background: #0f5132;
    border-color: #0f5132;
    color: #fff;

    &:hover {
      background: #146c43;
    }
  }

  &:focus-visible {
    outline: 2px solid #198754;
    outline-offset: 2px;
  }
}

.consent-slide-enter-active,
.consent-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.consent-slide-enter-from,
.consent-slide-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
