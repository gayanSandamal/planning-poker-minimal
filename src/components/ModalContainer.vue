<template>
  <Transition
    @after-enter="focusTrapActivate"
    @after-leave="focusTrapDeactivate"
  >
    <div
      ref="modalRef"
      v-if="show"
      class="modal align-items-center justify-content-center fade show"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      @click="allowClose ? cancel() : triggerModalError()"
      @keydown="handleKeydown"
    >
      <div
        ref="dialogRef"
        class="modal-dialog w-100"
        :class="{ heartbeat: modalError }"
        @click.stop="() => {}"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 :id="titleId" class="modal-title">{{ title }}</h5>
            <button
              v-if="allowClose"
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              @click="cancel"
            ></button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <button
              v-if="!onlySubmit"
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="cancel"
            >
              {{ cancelLabel }}
            </button>
            <button
              type="button"
              class="btn btn-primary"
              :disabled="disableSubmit"
              @click="submit()"
            >
              {{ okLabel }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  defineExpose,
  PropType,
  ref,
  nextTick,
} from "vue";

const modalRef = ref<HTMLElement | null>(null);
const dialogRef = ref<HTMLElement | null>(null);
const show = ref<boolean>(false);
const titleId = ref(`modal-title-${Math.random().toString(36).slice(2, 9)}`);
let previousActiveElement: HTMLElement | null = null;
let focusTrapKeydown: ((e: KeyboardEvent) => void) | null = null;

const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function getFocusables(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
  );
}

function focusTrapActivate() {
  previousActiveElement = (document.activeElement as HTMLElement) || null;
  nextTick(() => {
    const dialog = dialogRef.value;
    if (!dialog) return;
    const focusables = getFocusables(dialog);
    const first = focusables[0];
    if (first) first.focus();
    focusTrapKeydown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusables = getFocusables(dialog);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", focusTrapKeydown);
  });
}

function focusTrapDeactivate() {
  if (focusTrapKeydown) {
    document.removeEventListener("keydown", focusTrapKeydown);
    focusTrapKeydown = null;
  }
  if (
    previousActiveElement &&
    typeof previousActiveElement.focus === "function"
  ) {
    previousActiveElement.focus();
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && props.allowClose) {
    cancel();
  }
}

const toggle = () => (show.value = !show.value);
const props = defineProps({
  title: {
    type: String as PropType<string>,
  },
  cancelLabel: {
    type: String as PropType<string>,
    default: "Cancel",
  },
  okLabel: {
    type: String as PropType<string>,
    default: "Submit",
  },
  disableSubmit: {
    type: Boolean,
    default: false,
  },
  onlySubmit: {
    type: Boolean,
    default: false,
  },
  allowClose: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["submit", "cancel"]);
const cancel = () => {
  toggle();
  emit("cancel");
};
const submit = () => {
  if (props.disableSubmit) return true;
  emit("submit");
};
const modalError = ref<boolean>(false);
const triggerModalError = () => {
  modalError.value = true;
  setTimeout(() => {
    modalError.value = false;
  }, 1000);
};

defineExpose({
  show,
  toggle,
  modalRef: modalRef as unknown as typeof modalRef,
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
/* we will explain what these classes do next! */
.modal {
  display: flex;
  background-color: rgba(0, 0, 0, 0.5);
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.heartbeat {
  -webkit-animation: heartbeat 1s ease-in-out infinite both;
  animation: heartbeat 1s ease-in-out infinite both;
}
@-webkit-keyframes heartbeat {
  from {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-transform-origin: center center;
    transform-origin: center center;
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  10% {
    -webkit-transform: scale(0.95);
    transform: scale(0.95);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  17% {
    -webkit-transform: scale(0.98);
    transform: scale(0.98);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  33% {
    -webkit-transform: scale(0.95);
    transform: scale(0.95);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  45% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
}
@keyframes heartbeat {
  from {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-transform-origin: center center;
    transform-origin: center center;
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  10% {
    -webkit-transform: scale(0.95);
    transform: scale(0.95);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  17% {
    -webkit-transform: scale(0.98);
    transform: scale(0.98);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  33% {
    -webkit-transform: scale(0.95);
    transform: scale(0.95);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  45% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
}
</style>
