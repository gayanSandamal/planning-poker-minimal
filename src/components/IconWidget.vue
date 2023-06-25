<template>
  <div class="icon-wrapper">
    <div
      class="icon"
      :class="[size, `text-${align}`]"
      v-html="icons[props.icon]"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import * as ICONS from "@/assets/graphics/SVGs.ts";
import {
  ALIGNMENTS,
  ALIGN_CENTER,
  AlignmentTypes,
  ICON_MEDIUM,
  ICON_SIZES,
  IconSizes,
} from "@/interfaces/types";
import { PropType, defineProps } from "vue";
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const icons: any = ICONS;
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
