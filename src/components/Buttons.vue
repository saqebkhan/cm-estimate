<script setup lang="ts">
import { CmButton, ButtonType, Placement } from "cm-uicomponents";
import { ref } from "vue";
import Coffee from "../assets/Coffee.vue";

const options = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "5", value: "5" },
  { label: "8", value: "8" },
  { label: "13", value: "13" },
  { label: "∞", value: "∞" },
  { label: "?", value: "?" },
];

const selectedValue = ref<string | null>(null);

const vote = (value: string) => {
  console.log("vote for", value);
  selectedValue.value = value;
};
</script>

<template>
  <div class="ct-flex">
    <div v-for="option in options" :key="option.value" class="ct-p-4">
      <CmButton
        :label="option.label"
        :type="
          selectedValue === option.value
            ? ButtonType.SecondaryRed
            : ButtonType.Primary
        "
        @click="() => vote(option.value)"
      />
    </div>
    <div class="ct-p-4">
      <CmButton :icon="{ component: Coffee, placement: Placement.Right }" />
    </div>
  </div>
</template>
