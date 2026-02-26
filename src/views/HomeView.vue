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
              <LiveGamePreview />
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
      <section
        id="how-it-works"
        class="landing-section how-it-works"
        aria-labelledby="how-it-works-heading"
      >
        <div class="how-it-works-bg" aria-hidden="true"></div>
        <div class="container how-it-works-inner">
          <div class="section-top how-it-works-header">
            <span class="section-label">How it works</span>
            <h2
              id="how-it-works-heading"
              class="section-heading section-heading--center how-it-works-title"
            >
              Four steps to better estimates
            </h2>
            <p class="how-it-works-subtitle">
              From game creation to consensus—simple and fast.
            </p>
          </div>
          <div class="steps-grid">
            <div class="step-card" v-for="(step, i) in steps" :key="step.title">
              <div class="step-card-inner">
                <div class="step-badge" aria-hidden="true">
                  <i
                    :class="['bi', step.icon]"
                    class="step-icon"
                    aria-hidden="true"
                  ></i>
                  <span class="step-num" aria-hidden="true">{{ i + 1 }}</span>
                </div>
                <h3 class="step-title">{{ step.title }}</h3>
                <p class="step-desc">{{ step.desc }}</p>
              </div>
              <div
                v-if="i < steps.length - 1"
                class="step-connector"
                aria-hidden="true"
              >
                <i class="bi bi-chevron-right" aria-hidden="true"></i>
              </div>
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
            <div
              class="feature-card-modern"
              v-for="feat in features"
              :key="feat.title"
            >
              <div class="feature-icon-wrap">
                <i :class="['bi', feat.icon]" aria-hidden="true"></i>
              </div>
              <h3 class="feature-title">{{ feat.title }}</h3>
              <div class="feature-visual-area" aria-hidden="true">
                <component :is="feat.visual" v-bind="feat.visualProps" />
              </div>
              <p class="feature-desc">{{ feat.desc }}</p>
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
import LiveGamePreview from "@/components/LiveGamePreview.vue";
import FeatureEstimation from "@/components/FeatureEstimation.vue";
import FeatureRealtime from "@/components/FeatureRealtime.vue";
import FeatureDeck from "@/components/FeatureDeck.vue";

const features = [
  {
    icon: "bi-calendar-check",
    title: "Efficient task estimation",
    desc: "Use Planning Poker to estimate complexity accurately and consistently. Average, nearest-in-deck, and vote spread — all at a glance.",
    visual: FeatureEstimation,
    visualProps: {},
  },
  {
    icon: "bi-chat-dots",
    title: "Real-time collaboration",
    desc: "Collaborate in real time—votes and reveals sync instantly for everyone. See who voted and who is still thinking.",
    visual: FeatureRealtime,
    visualProps: {},
  },
  {
    icon: "bi-card-checklist",
    title: "Flexible card deck",
    desc: "Choose Fibonacci, Modified Fibonacci, T-shirt sizes, Powers of 2, or define your own custom values to fit any team.",
    visual: FeatureDeck,
    visualProps: {},
  },
  {
    icon: "bi-layout-text-window-reverse",
    title: "Zero friction UX",
    desc: "No accounts, no installs. Share one link and your team is in — from any device, any browser, in seconds.",
    visual: FeatureEstimation,
    visualProps: { variant: "link" },
  },
  {
    icon: "bi-shield-check",
    title: "Secure and reliable",
    desc: "Powered by Firebase Firestore — data syncs in milliseconds with enterprise-grade reliability and automatic backups.",
    visual: FeatureRealtime,
    visualProps: { variant: "shield" },
  },
];

const steps = [
  {
    title: "Create a game",
    icon: "bi-plus-circle",
    desc: "Choose a name and a voting deck (e.g. Fibonacci or custom values).",
  },
  {
    title: "Share the link",
    icon: "bi-link-45deg",
    desc: "Send the game URL to your team. Anyone with the link can join—no sign-up.",
  },
  {
    title: "Vote in real time",
    icon: "bi-people",
    desc: "Everyone picks a card. You see when votes are in and can discuss before revealing.",
  },
  {
    title: "Reveal & agree",
    icon: "bi-check2-circle",
    desc: "Flip the cards, see the spread, and converge on an estimate together.",
  },
];

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
.how-it-works {
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    165deg,
    #e8f5ee 0%,
    #f0f7f4 35%,
    #f8faf9 70%,
    #fff 100%
  );
  padding: 4.5rem 1rem 5rem;

  @media (min-width: 768px) {
    padding: 5.5rem 1rem 6rem;
  }
}

.how-it-works-bg {
  position: absolute;
  inset: 0;
  opacity: 0.4;
  background-image: radial-gradient(
      circle at 20% 30%,
      rgba(15, 81, 50, 0.06) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 70%,
      rgba(32, 201, 151, 0.05) 0%,
      transparent 45%
    );
  pointer-events: none;
}

.how-it-works-inner {
  position: relative;
  z-index: 1;
}

.how-it-works-header {
  margin-bottom: 3.5rem;

  @media (min-width: 768px) {
    margin-bottom: 4rem;
  }
}

.how-it-works-title {
  margin-bottom: 0.5rem;
}

.how-it-works-subtitle {
  font-size: 1.0625rem;
  color: #4a5568;
  margin: 0;
  line-height: 1.5;
}

.steps-grid {
  display: grid;
  gap: 1.25rem;
  max-width: 1000px;
  margin: 0 auto;

  @media (min-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (min-width: 992px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
  }
}

.step-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  @media (min-width: 992px) {
    flex-direction: row;
    align-items: center;
    text-align: center;

    .step-card-inner {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}

.step-card-inner {
  flex: 1;
  background: #fff;
  border-radius: 20px;
  padding: 1.75rem 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(15, 81, 50, 0.06);
  border: 1px solid rgba(15, 81, 50, 0.06);
  transition: box-shadow 0.25s ease, transform 0.25s ease,
    border-color 0.25s ease;

  &:hover {
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08),
      0 4px 12px rgba(15, 81, 50, 0.08);
    transform: translateY(-4px);
    border-color: rgba(15, 81, 50, 0.12);
  }
}

.step-badge {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  margin-bottom: 1.25rem;
  background: linear-gradient(145deg, #0f5132 0%, #198754 100%);
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(15, 81, 50, 0.35);
}

.step-icon {
  font-size: 1.35rem;
  color: rgba(255, 255, 255, 0.95);
}

.step-num {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 800;
  color: #0f5132;
  background: #fff;
  border-radius: 999px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

.step-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.5rem;
  letter-spacing: -0.01em;
}

.step-desc {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: #4a5568;
  margin: 0;
}

.step-connector {
  display: none;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 2rem;
  padding: 0 0.25rem;
  color: rgba(15, 81, 50, 0.4);
  font-size: 1.25rem;

  @media (min-width: 992px) {
    display: flex;
    padding: 0 0.35rem;
  }

  .bi {
    animation: step-connector-pulse 2s ease-in-out infinite;
  }
}

@keyframes step-connector-pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
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
    gap: 1.25rem;
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

.feature-visual-area {
  min-height: 120px;
  margin: 0.875rem 0 0.5rem;
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
