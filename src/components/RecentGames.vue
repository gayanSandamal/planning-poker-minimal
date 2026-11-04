<template>
  <section
    v-if="recentGames.length"
    class="recent-games"
    aria-labelledby="recent-games-heading"
  >
    <div class="container">
      <div class="recent-head">
        <div>
          <h2 id="recent-games-heading" class="recent-title">
            <span v-if="profile.avatar" aria-hidden="true">{{
              profile.avatar
            }}</span>
            <i v-else class="bi bi-clock-history" aria-hidden="true"></i>
            {{
              profile.displayName
                ? `Welcome back, ${profile.displayName}!`
                : "Pick up where you left off"
            }}
          </h2>
          <p v-if="profile.displayName" class="recent-sub">
            Pick up where you left off — your team is one click away.
          </p>
        </div>
        <router-link to="/new-game" class="recent-new">
          <i class="bi bi-plus-lg" aria-hidden="true"></i>
          New game
        </router-link>
      </div>
      <ul class="recent-list">
        <li
          v-for="(game, i) in recentGames"
          :key="game.id"
          class="recent-item"
          :class="{ 'recent-item--latest': i === 0 }"
        >
          <router-link
            :to="`/${game.id}`"
            class="recent-link"
            @click="opened(game.id)"
          >
            <span v-if="i === 0" class="recent-badge">Last played</span>
            <span class="recent-name">{{ game.name }}</span>
            <span class="recent-meta">
              <span v-if="game.deck">{{ game.deck }} · </span>
              {{ timeAgo(game.lastVisited) }}
            </span>
          </router-link>
          <button
            type="button"
            class="recent-remove"
            :aria-label="`Remove ${game.name} from recent games`"
            title="Remove from this list"
            @click="forget(game.id)"
          >
            <i class="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </li>
      </ul>
      <p class="recent-note">Only stored in this browser.</p>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useRecentGames, timeAgo } from "@/composables/useRecentGames";
import { track } from "@/analytics";
import { loadProfile } from "@/composables/useProfile";

const { recentGames, forget } = useRecentGames();
const profile = loadProfile();

const opened = (id: string) => {
  const position = recentGames.value.findIndex((g) => g.id === id) + 1;
  void track("recent_game_opened", {
    position,
    returning: profile.displayName !== "",
  });
};
</script>

<style lang="scss" scoped>
.recent-games {
  padding: 2rem 0 0.5rem;
  background: #f8faf9;
}

.recent-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.recent-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1a1a1a;

  i {
    color: #0f5132;
  }
}

.recent-sub {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.recent-item--latest {
  border-color: rgba(15, 81, 50, 0.35);
  box-shadow: 0 6px 20px rgba(15, 81, 50, 0.1);
}

.recent-badge {
  align-self: flex-start;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #0f5132;
  background: rgba(25, 135, 84, 0.1);
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
}

.recent-new {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f5132;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.recent-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}

.recent-item {
  position: relative;
  display: flex;
  background: #fff;
  border: 1px solid rgba(15, 81, 50, 0.1);
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: rgba(15, 81, 50, 0.3);
    box-shadow: 0 6px 20px rgba(15, 81, 50, 0.08);
  }
}

.recent-link {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.875rem 2.5rem 0.875rem 1rem;
  text-decoration: none;
  border-radius: 14px;

  &:focus-visible {
    outline: 2px solid #198754;
    outline-offset: 2px;
  }
}

.recent-name {
  font-weight: 700;
  color: #1a1a1a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recent-meta {
  font-size: 0.8125rem;
  color: #6b7280;
}

.recent-remove {
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;

  &:hover {
    background: rgba(15, 81, 50, 0.06);
    color: #0f5132;
  }

  &:focus-visible {
    outline: 2px solid #198754;
  }
}

.recent-note {
  margin: 0.75rem 0 0;
  font-size: 0.75rem;
  color: #9ca3af;
}
</style>
