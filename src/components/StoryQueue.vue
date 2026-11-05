<template>
  <section
    v-if="stories.length || isHost"
    class="sq"
    aria-labelledby="sq-heading"
  >
    <header class="sq-head">
      <div>
        <h2 id="sq-heading" class="sq-title">
          <i class="bi bi-list-check" aria-hidden="true"></i>
          Stories
        </h2>
        <p v-if="stories.length" class="sq-progress">
          {{ estimatedCount }} of {{ stories.length }} estimated
          <template v-if="totalPoints !== null">
            · <strong>{{ formatPoints(totalPoints) }}</strong> points
          </template>
        </p>
      </div>
      <div v-if="estimatedCount" class="sq-export">
        <button type="button" class="sq-btn" @click="copySummary">
          <i class="bi bi-clipboard" aria-hidden="true"></i> Copy summary
        </button>
        <button type="button" class="sq-btn" @click="downloadCsv">
          <i class="bi bi-download" aria-hidden="true"></i> CSV
        </button>
      </div>
    </header>

    <!-- Host: agree on the estimate after the reveal -->
    <div v-if="isHost && revealed && currentStory" class="sq-decide">
      <p class="sq-decide-title">
        Agreed estimate for <strong>{{ currentStory.title }}</strong>
      </p>
      <div class="sq-chips" role="radiogroup" aria-label="Agreed estimate">
        <button
          v-for="v in estimateOptions"
          :key="v"
          type="button"
          role="radio"
          class="sq-chip"
          :aria-checked="chosen === v"
          @click="chosen = v"
        >
          {{ v }}
          <span v-if="v === suggestion" class="sq-chip-hint">suggested</span>
        </button>
      </div>
      <div class="sq-decide-actions">
        <button
          type="button"
          class="sq-btn"
          :disabled="!chosen || busy"
          @click="emit('save', { estimate: chosen, advance: false })"
        >
          Save
        </button>
        <button
          type="button"
          class="sq-btn sq-btn--primary"
          :disabled="!chosen || busy"
          @click="emit('save', { estimate: chosen, advance: true })"
        >
          Save &amp; next story
          <i class="bi bi-arrow-right" aria-hidden="true"></i>
        </button>
      </div>
    </div>

    <ol v-if="stories.length" class="sq-list">
      <li
        v-for="(s, i) in stories"
        :key="s.id"
        class="sq-item"
        :class="{
          'sq-item--current': s.id === currentStoryId,
          'sq-item--done': !!s.estimate,
        }"
      >
        <span class="sq-num" aria-hidden="true">{{ i + 1 }}</span>
        <span class="sq-text">
          <span class="sq-story">{{ s.title }}</span>
          <span v-if="s.id === currentStoryId" class="sq-now"
            >Now estimating</span
          >
        </span>
        <span
          v-if="s.estimate"
          class="sq-estimate"
          :title="`Estimate: ${s.estimate}`"
          >{{ s.estimate }}</span
        >
        <template v-if="isHost">
          <button
            v-if="s.id !== currentStoryId"
            type="button"
            class="sq-btn sq-btn--small"
            :disabled="busy"
            @click="emit('select', s.id)"
          >
            {{ s.estimate ? "Re-estimate" : "Estimate" }}
          </button>
          <button
            type="button"
            class="sq-remove"
            :aria-label="`Remove ${s.title}`"
            title="Remove story"
            :disabled="busy"
            @click="emit('remove', s.id)"
          >
            <i class="bi bi-x-lg" aria-hidden="true"></i>
          </button>
        </template>
      </li>
    </ol>

    <!-- Host: add stories -->
    <div v-if="isHost" class="sq-add">
      <button
        v-if="!adding && stories.length"
        type="button"
        class="sq-btn sq-btn--ghost"
        @click="adding = true"
      >
        <i class="bi bi-plus-lg" aria-hidden="true"></i> Add stories
      </button>
      <form v-else class="sq-add-form" @submit.prevent="submitStories">
        <label for="sq-new" class="sq-add-label">
          {{
            stories.length
              ? "Add more stories"
              : "Plan the session: paste your stories, one per line"
          }}
        </label>
        <textarea
          id="sq-new"
          v-model="draft"
          class="form-control"
          rows="3"
          placeholder="PROJ-101 Login with email&#10;PROJ-102 Password reset&#10;PROJ-103 Profile page"
        ></textarea>
        <div class="sq-add-actions">
          <span class="sq-add-count"
            >{{ draftCount }} {{ draftCount === 1 ? "story" : "stories" }}</span
          >
          <button
            v-if="stories.length"
            type="button"
            class="sq-btn sq-btn--ghost"
            @click="cancelAdd"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="sq-btn sq-btn--primary"
            :disabled="!draftCount || busy"
          >
            Add to queue
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, ref, watch, PropType } from "vue";
import { Story, isSpecialCard } from "@/interfaces/types";
import { copyText } from "@/composables/copyText";
import { useToast } from "@/composables/useToast";
import { track } from "@/analytics";

const props = defineProps({
  stories: { type: Array as PropType<Story[]>, required: true },
  currentStoryId: { type: String, default: "" },
  isHost: { type: Boolean, default: false },
  revealed: { type: Boolean, default: false },
  /** Pre-selected estimate (nearest in deck / consensus). */
  suggestion: { type: String as PropType<string | null>, default: null },
  deckValues: { type: Array as PropType<string[]>, default: () => [] },
  gameName: { type: String, default: "" },
  busy: { type: Boolean, default: false },
});

const emit = defineEmits<{
  (e: "add", titles: string[]): void;
  (e: "remove", id: string): void;
  (e: "select", id: string): void;
  (e: "save", payload: { estimate: string; advance: boolean }): void;
}>();

const toast = useToast();

const currentStory = computed(() =>
  props.stories.find((s) => s.id === props.currentStoryId)
);

const estimateOptions = computed(() =>
  props.deckValues.filter((v) => !isSpecialCard(v))
);

/* Agreed estimate: start from the suggestion, reset per story/round. */
const chosen = ref("");
watch(
  () => [props.suggestion, props.currentStoryId, props.revealed],
  () => {
    chosen.value =
      props.suggestion && estimateOptions.value.includes(props.suggestion)
        ? props.suggestion
        : currentStory.value?.estimate ?? "";
  },
  { immediate: true }
);

/* Progress + totals */
const estimatedCount = computed(
  () => props.stories.filter((s) => s.estimate).length
);
const totalPoints = computed((): number | null => {
  const nums = props.stories
    .filter((s) => s.estimate)
    .map((s) => Number(s.estimate));
  if (!nums.length || nums.some((n) => Number.isNaN(n))) return null;
  return nums.reduce((a, b) => a + b, 0);
});
const formatPoints = (n: number) =>
  Number.isInteger(n) ? String(n) : n.toFixed(1);

/* Adding stories */
const adding = ref(false);
const draft = ref("");
const draftTitles = computed(() =>
  draft.value
    .split(/\r?\n/)
    .map((t) => t.trim())
    .filter(Boolean)
);
const draftCount = computed(() => draftTitles.value.length);

function submitStories() {
  if (!draftCount.value) return;
  emit("add", draftTitles.value);
  draft.value = "";
  adding.value = false;
}

function cancelAdd() {
  draft.value = "";
  adding.value = false;
}

/* Export */
function summaryText(): string {
  const lines = [`${props.gameName || "Planning Poker"} — estimates`, ""];
  props.stories.forEach((s, i) =>
    lines.push(`${i + 1}. ${s.title} — ${s.estimate || "not estimated"}`)
  );
  lines.push("");
  let footer = `${estimatedCount.value} of ${props.stories.length} estimated`;
  if (totalPoints.value !== null) {
    footer += ` · ${formatPoints(totalPoints.value)} points`;
  }
  lines.push(footer);
  return lines.join("\n");
}

async function copySummary() {
  try {
    await copyText(summaryText());
    void track("session_exported", { format: "text" });
    await toast.success("Summary copied — paste it in Jira, Slack or email", {
      autoClose: 2000,
    });
  } catch {
    await toast.error("Couldn't copy the summary. Try again.");
  }
}

const csvCell = (v: string) => `"${v.replace(/"/g, '""')}"`;

function downloadCsv() {
  const rows = [
    ["#", "Story", "Estimate"],
    ...props.stories.map((s, i) => [String(i + 1), s.title, s.estimate ?? ""]),
  ];
  const csv = rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
  // BOM so Excel opens UTF-8 (emoji, accents) correctly.
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const slug =
    (props.gameName || "planning-poker")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "planning-poker";
  a.href = url;
  a.download = `${slug}-estimates.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  void track("session_exported", { format: "csv" });
}
</script>

<style lang="scss" scoped>
.sq {
  margin-top: 1.5rem;
  padding: 1.25rem;
  background: #fff;
  border: 1px solid rgba(15, 81, 50, 0.1);
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
}

.sq-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.sq-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 700;
  color: #1a1a1a;

  i {
    color: #0f5132;
  }
}

.sq-progress {
  margin: 0.2rem 0 0;
  font-size: 0.875rem;
  color: #6b7280;

  strong {
    color: #0f5132;
  }
}

.sq-export {
  display: flex;
  gap: 0.5rem;
}

.sq-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.85rem;
  border-radius: 10px;
  border: 1.5px solid rgba(15, 81, 50, 0.25);
  background: #fff;
  color: #0f5132;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: rgba(15, 81, 50, 0.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }

  &--primary {
    background: #0f5132;
    border-color: #0f5132;
    color: #fff;

    &:hover:not(:disabled) {
      background: #146c43;
    }
  }

  &--ghost {
    border-color: transparent;
  }

  &--small {
    padding: 0.25rem 0.6rem;
    font-size: 0.8125rem;
  }

  &:focus-visible {
    outline: 2px solid #198754;
    outline-offset: 2px;
  }
}

.sq-decide {
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 14px;
  background: rgba(25, 135, 84, 0.06);
  border: 1px solid rgba(25, 135, 84, 0.2);
}

.sq-decide-title {
  margin: 0 0 0.75rem;
  color: #1a1a1a;
}

.sq-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
}

.sq-chip {
  position: relative;
  min-width: 2.75rem;
  padding: 0.4rem 0.7rem;
  border-radius: 10px;
  border: 1.5px solid rgba(15, 81, 50, 0.2);
  background: #fff;
  font-weight: 700;
  color: #0f5132;
  cursor: pointer;

  &[aria-checked="true"] {
    background: #0f5132;
    border-color: #0f5132;
    color: #fff;

    .sq-chip-hint {
      color: rgba(255, 255, 255, 0.8);
    }
  }

  &:focus-visible {
    outline: 2px solid #198754;
    outline-offset: 2px;
  }
}

.sq-chip-hint {
  display: block;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #198754;
}

.sq-decide-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.5rem;
}

.sq-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sq-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.5rem;
  border-top: 1px solid rgba(15, 81, 50, 0.06);
  border-radius: 10px;

  &:first-child {
    border-top: none;
  }

  &--current {
    background: rgba(25, 135, 84, 0.07);
    border-top-color: transparent;
  }

  &--done .sq-story {
    color: #4a5568;
  }
}

.sq-num {
  width: 1.5rem;
  flex-shrink: 0;
  text-align: right;
  font-size: 0.8125rem;
  color: #9ca3af;
}

.sq-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.sq-story {
  font-weight: 600;
  color: #1a1a1a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sq-now {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #198754;
}

.sq-estimate {
  min-width: 2rem;
  padding: 0.15rem 0.5rem;
  text-align: center;
  font-weight: 700;
  color: #fff;
  background: #198754;
  border-radius: 8px;
}

.sq-remove {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: rgba(15, 81, 50, 0.06);
    color: #b02a37;
  }

  &:focus-visible {
    outline: 2px solid #198754;
  }
}

.sq-add {
  margin-top: 0.75rem;
}

.sq-add-label {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
}

.sq-add-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.sq-add-count {
  margin-right: auto;
  font-size: 0.8125rem;
  color: #9ca3af;
}
</style>
