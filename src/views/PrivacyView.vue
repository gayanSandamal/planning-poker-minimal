<template>
  <div class="privacy-view">
    <div class="container privacy-container">
      <h1 class="privacy-title">Privacy &amp; cookies</h1>
      <p class="privacy-lead">
        Planning Poker Minimal has no accounts. Here is exactly what it stores
        and what it measures.
      </p>

      <section class="privacy-card" aria-labelledby="pv-analytics">
        <h2 id="pv-analytics">Analytics (optional)</h2>
        <p>
          If you accept, we use <strong>Google Analytics</strong> (through
          Firebase) to understand how the app is used — for example how many
          games are created, whether people come back, and which features help.
          Google sets the cookies <code>_ga</code> and <code>_ga_*</code>.
        </p>
        <p>
          What is sent: pages visited (game links are replaced with
          <code>/game</code>), actions such as "game created", "cards revealed"
          or "results shared", the deck type, number of players, and the device,
          browser and approximate location Google derives from your connection.
        </p>
        <p>
          What is <strong>not</strong> sent: game names, stories, player names,
          individual votes, or game links.
        </p>
        <div class="privacy-choice">
          <p class="privacy-status">
            Your choice:
            <strong>{{ statusLabel }}</strong>
          </p>
          <div class="privacy-actions">
            <button
              type="button"
              class="privacy-btn"
              :disabled="consent === 'denied'"
              @click="setConsent('denied')"
            >
              Turn off analytics
            </button>
            <button
              type="button"
              class="privacy-btn privacy-btn--primary"
              :disabled="consent === 'granted'"
              @click="setConsent('granted')"
            >
              Allow analytics
            </button>
          </div>
        </div>
      </section>

      <section class="privacy-card" aria-labelledby="pv-games">
        <h2 id="pv-games">Games</h2>
        <p>
          A game's name, current story, the display names of players and their
          votes are stored in Google Cloud Firestore so everyone in the game
          sees them in real time. Anyone with a game's link can open it, so only
          share links with your team. Games can't be listed or searched.
        </p>
      </section>

      <section class="privacy-card" aria-labelledby="pv-device">
        <h2 id="pv-device">On your device</h2>
        <p>
          Your browser keeps your display name, the games you recently opened,
          and your analytics choice, so you don't have to set them again. A
          <code>userId</code> cookie remembers which player you are in a game
          for 7 days. None of this leaves your device except as described above.
        </p>
      </section>

      <p class="privacy-contact">
        Questions? Reach the creator through
        <a
          href="https://gayansandamal.github.io/"
          target="_blank"
          rel="noopener noreferrer"
          >gayansandamal.github.io</a
        >.
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { consent, setConsent } from "@/analytics";

const statusLabel = computed(
  () =>
    ({
      granted: "Analytics allowed",
      denied: "Analytics off",
      unset: "Not chosen yet (analytics off)",
    }[consent.value])
);
</script>

<style lang="scss" scoped>
.privacy-view {
  padding: 2.5rem 0 4rem;
}

.privacy-container {
  max-width: 720px;
}

.privacy-title {
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: -0.02em;
}

.privacy-lead {
  color: #4a5568;
  font-size: 1.0625rem;
  margin-bottom: 1.75rem;
}

.privacy-card {
  background: #fff;
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
  border: 1px solid rgba(15, 81, 50, 0.08);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);

  h2 {
    font-size: 1.125rem;
    font-weight: 700;
    color: #0f5132;
    margin-bottom: 0.75rem;
  }

  p {
    color: #4a5568;
    line-height: 1.7;
    margin-bottom: 0.75rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  code {
    color: #0f5132;
    background: rgba(15, 81, 50, 0.06);
    padding: 0.05rem 0.3rem;
    border-radius: 4px;
  }
}

.privacy-choice {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(15, 81, 50, 0.08);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.privacy-status {
  margin: 0 !important;
}

.privacy-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.privacy-btn {
  padding: 0.5rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(15, 81, 50, 0.25);
  background: #fff;
  color: #0f5132;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;

  &--primary {
    background: #0f5132;
    border-color: #0f5132;
    color: #fff;
  }

  &:disabled {
    opacity: 0.45;
    cursor: default;
  }
}

.privacy-contact {
  color: #4a5568;
  margin-top: 1.5rem;

  a {
    color: #0f5132;
    font-weight: 600;
  }
}
</style>
