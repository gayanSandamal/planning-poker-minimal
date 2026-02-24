<template>
  <div class="icon-wrapper">
    <div class="icon" :class="[size, `text-${align}`]" v-html="iconSvg"></div>
  </div>
</template>

<script lang="ts" setup>
import {
  ALIGNMENTS,
  ALIGN_CENTER,
  AlignmentTypes,
  ICON_MEDIUM,
  ICON_SIZES,
  IconSizes,
} from "@/interfaces/types";
import { PropType, defineProps, ref, watch, onMounted } from "vue";

const props = defineProps({
  icon: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: String as PropType<any>,
    default: "",
  },
  size: {
    type: String as PropType<string>,
    default: ICON_MEDIUM,
    validator: (value: IconSizes) => {
      return ICON_SIZES.indexOf(value) !== -1;
    },
  },
  align: {
    type: String as PropType<string>,
    default: ALIGN_CENTER,
    validator: (value: AlignmentTypes) => {
      return ALIGNMENTS.indexOf(value) !== -1;
    },
  },
});

const iconSvg = ref("");

function loadIcon() {
  if (!props.icon) return;
  import("@/assets/graphics/SVGs").then((m) => {
    iconSvg.value = (m as Record<string, string>)[props.icon] ?? "";
  });
}

onMounted(loadIcon);
watch(() => props.icon, loadIcon);
</script>

<style lang="scss" scoped>
.icon-wrapper {
  .icon {
    :deep(svg) {
      width: auto;
      max-width: -webkit-fill-available;
    }
    &.xs {
      :deep(svg) {
        height: 100px;
      }
    }
    &.s {
      :deep(svg) {
        height: 150px;
      }
    }
    &.m {
      :deep(svg) {
        height: 200px;
      }
    }
    &.l {
      :deep(svg) {
        height: 400px;
      }
    }
    &.xl {
      :deep(svg) {
        height: 600px;
      }
    }
  }
}
</style>
