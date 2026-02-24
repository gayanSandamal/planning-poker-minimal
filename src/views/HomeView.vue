<template>
  <div class="home-view">
    <Transition name="skeleton-fade">
      <HomeViewSkeleton v-if="!contentReady" />
    </Transition>
    <div
      class="home-view-content"
      :class="{ 'home-view-content--visible': contentReady }"
    >
      <HeroBanner />

      <!-- About -->
      <section id="about" class="landing-section landing-section--light">
        <div class="container">
          <div class="about-grid">
            <div class="about-visual">
              <IconWidget icon="APPS" size="xl" />
            </div>
            <div class="about-content">
              <span class="section-label">About</span>
              <h2 class="section-heading">Built for teams that ship</h2>
              <p class="section-lead">
                Planning Poker Minimal brings the classic estimation game
                online—so your team can align on complexity without the fuss.
                Pick a deck, share one link, vote in real time, and reveal when
                you’re ready.
              </p>
              <ul class="about-list">
                <li>No accounts required—just a link</li>
                <li>Multiple decks: Fibonacci, T-shirt, custom</li>
                <li>Real-time updates so everyone stays in sync</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- How it works -->
      <section id="how-it-works" class="landing-section landing-section--alt">
        <div class="container">
          <div class="section-top">
            <span class="section-label">How it works</span>
            <h2 class="section-heading section-heading--center">
              Four steps to better estimates
            </h2>
          </div>
          <div class="steps-grid">
            <div class="step-card">
              <span class="step-num" aria-hidden="true">1</span>
              <h3 class="step-title">Create a game</h3>
              <p class="step-desc">
                Choose a name and a voting deck (e.g. Fibonacci or custom
                values).
              </p>
            </div>
            <div class="step-card">
              <span class="step-num" aria-hidden="true">2</span>
              <h3 class="step-title">Share the link</h3>
              <p class="step-desc">
                Send the game URL to your team. Anyone with the link can join—
                no sign-up.
              </p>
            </div>
            <div class="step-card">
              <span class="step-num" aria-hidden="true">3</span>
              <h3 class="step-title">Vote in real time</h3>
              <p class="step-desc">
                Everyone picks a card. You see when votes are in and can discuss
                before revealing.
              </p>
            </div>
            <div class="step-card">
              <span class="step-num" aria-hidden="true">4</span>
              <h3 class="step-title">Reveal & agree</h3>
              <p class="step-desc">
                Flip the cards, see the spread, and converge on an estimate
                together.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section id="features" class="landing-section landing-section--light">
        <div class="container">
          <div class="section-top">
            <span class="section-label">Features</span>
            <h2 class="section-heading section-heading--center">
              Everything you need for estimation
            </h2>
          </div>
          <div class="features-grid">
            <div class="feature-card-modern">
              <div class="feature-icon-wrap">
                <i class="bi bi-calendar-check" aria-hidden="true"></i>
              </div>
              <h3 class="feature-title">Efficient task estimation</h3>
              <IconWidget icon="EFFICIENT" class="feature-visual my-3" />
              <p class="feature-desc">
                Use Planning Poker to estimate complexity accurately and
                consistently.
              </p>
            </div>
            <div class="feature-card-modern">
              <div class="feature-icon-wrap">
                <i
                  class="bi bi-layout-text-window-reverse"
                  aria-hidden="true"
                ></i>
              </div>
              <h3 class="feature-title">User-friendly interface</h3>
              <IconWidget icon="DOG" class="feature-visual my-3" />
              <p class="feature-desc">
                A clean, intuitive UI so your team can focus on the discussion,
                not the tool.
              </p>
            </div>
            <div class="feature-card-modern">
              <div class="feature-icon-wrap">
                <i class="bi bi-chat-dots" aria-hidden="true"></i>
              </div>
              <h3 class="feature-title">Real-time collaboration</h3>
              <IconWidget icon="REALTIME" class="feature-visual my-3" />
              <p class="feature-desc">
                Collaborate in real time—votes and reveals sync instantly for
                everyone.
              </p>
            </div>
            <div class="feature-card-modern">
              <div class="feature-icon-wrap">
                <i class="bi bi-card-checklist" aria-hidden="true"></i>
              </div>
              <h3 class="feature-title">Flexible card deck</h3>
              <IconWidget icon="CARDS" class="feature-visual my-3" />
              <p class="feature-desc">
                Choose Fibonacci, T-shirt sizes, or define your own custom deck.
              </p>
            </div>
            <div class="feature-card-modern feature-card-modern--wide">
              <div class="feature-icon-wrap">
                <i class="bi bi-shield-check" aria-hidden="true"></i>
              </div>
              <h3 class="feature-title">Secure and reliable</h3>
              <IconWidget icon="RELEABLE" class="feature-visual my-3" />
              <p class="feature-desc">
                Your data is safe and the app is built to stay up when you need
                it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats strip -->
      <section
        class="landing-section landing-section--stats"
        aria-label="Usage stats"
      >
        <div class="container">
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-value">Lightweight</span>
              <span class="stat-label">No heavy setup or installs</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">Free</span>
              <span class="stat-label">No paywall, no trial limits</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">Instant</span>
              <span class="stat-label">Start a game in seconds</span>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="landing-section landing-section--cta">
        <div class="container">
          <div class="cta-block">
            <h2 class="cta-heading">Ready to estimate?</h2>
            <p class="cta-text">
              Create a game, share the link, and get your team aligned.
            </p>
            <router-link class="btn-cta" to="/new-game">
              Start a game
            </router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, onUnmounted } from "vue";
import HeroBanner from "@/components/HeroBanner.vue";
import HomeViewSkeleton from "@/components/HomeViewSkeleton.vue";
import IconWidget from "@/components/IconWidget.vue";

const contentReady = ref(false);
let readyTimer: ReturnType<typeof setTimeout> | null = null;

onMounted(async () => {
  await nextTick();
  const minSkeletonTime = 400;
  readyTimer = setTimeout(() => {
    contentReady.value = true;
    readyTimer = null;
  }, minSkeletonTime);
});

onUnmounted(() => {
  if (readyTimer) clearTimeout(readyTimer);
});
</script>

<style lang="scss" scoped>
.home-view {
  position: relative;
  min-height: 100%;
}

.home-view-content {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.3s ease 0.05s, visibility 0.3s ease 0.05s;

  &--visible {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }
}

// Shared section styles
.landing-section {
  padding: 4rem 1rem;

  @media (min-width: 768px) {
    padding: 5rem 1rem;
  }

  &--light {
    background: #fff;
  }

  &--alt {
    background: linear-gradient(180deg, #f0f7f4 0%, #f8faf9 100%);
  }

  &--stats {
    padding: 3rem 1rem;
    background: #0f5132;
    color: #fff;
  }

  &--cta {
    padding: 4rem 1rem;
    background: linear-gradient(180deg, #e8f5ee 0%, #f0f7f4 100%);
  }
}

.section-top {
  text-align: center;
  max-width: 560px;
  margin: 0 auto 3rem;
}

.section-label {
  display: inline-block;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f5132;
  margin-bottom: 0.5rem;
}

.section-heading {
  font-size: clamp(1.5rem, 3.5vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.25;

  &--center {
    text-align: center;
  }
}

.section-lead {
  font-size: 1.0625rem;
  line-height: 1.65;
  color: #4a5568;
  margin: 0 0 1.25rem;
}

// About
.about-grid {
  display: grid;
  gap: 2.5rem;
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 3.5rem;
  }
}

.about-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.about-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.9375rem;
  color: #4a5568;
  line-height: 1.6;

  li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.5rem;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0.5em;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #0f5132;
    }
  }
}

// How it works
.steps-grid {
  display: grid;
  gap: 1.5rem;
  max-width: 960px;
  margin: 0 auto;

  @media (min-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 992px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
  }
}

.step-card {
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(15, 81, 50, 0.08);
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
}

.step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: #0f5132;
  background: rgba(15, 81, 50, 0.1);
  border-radius: 10px;
  margin-bottom: 0.75rem;
}

.step-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.35rem;
}

.step-desc {
  font-size: 0.875rem;
  line-height: 1.55;
  color: #4a5568;
  margin: 0;
}

// Features
.features-grid {
  display: grid;
  gap: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;

  @media (min-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto auto;
    gap: 1.25rem;

    .feature-card-modern--wide {
      grid-column: span 2;
    }
  }
}

.feature-card-modern {
  background: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(15, 81, 50, 0.08);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
}

.feature-icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.25rem;
  color: #0f5132;
  background: rgba(15, 81, 50, 0.08);
  border-radius: 12px;
  margin-bottom: 0.25rem;
}

.feature-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.feature-desc {
  font-size: 0.875rem;
  line-height: 1.55;
  color: #4a5568;
  margin: 0;
}

// Stats
.stats-grid {
  display: grid;
  gap: 2rem;
  text-align: center;

  @media (min-width: 576px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem;
  }
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.9;
}

// CTA
.cta-block {
  text-align: center;
  max-width: 480px;
  margin: 0 auto;
}

.cta-heading {
  font-size: clamp(1.5rem, 3vw, 1.75rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #1a1a1a;
  margin: 0 0 0.5rem;
}

.cta-text {
  font-size: 1rem;
  color: #4a5568;
  margin: 0 0 1.5rem;
  line-height: 1.5;
}

.btn-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.875rem 1.75rem;
  background: #0f5132;
  color: #fff;
  border-radius: 12px;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(15, 81, 50, 0.35);
  transition: transform 0.15s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(15, 81, 50, 0.4);
    color: #fff;
  }
}

.skeleton-fade-enter-active,
.skeleton-fade-leave-active {
  transition: opacity 0.25s ease;
}
.skeleton-fade-enter-from,
.skeleton-fade-leave-to {
  opacity: 0;
}
</style>
