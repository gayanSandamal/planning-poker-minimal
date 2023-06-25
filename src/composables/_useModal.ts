import { ref } from "vue";

type useModalArgs = {
  refName?: string;
};

export default function useModal({ refName = "modalRef" }: useModalArgs = {}) {
  const modal = ref();
  return {
    [refName]: modal,
  };
}
