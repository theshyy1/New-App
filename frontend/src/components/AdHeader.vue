<script setup>
import { useProductStore } from "../store";

const productStore = useProductStore();
</script>

<template>
  <header :class="{ 'bg-[#1c1b1e] text-white': productStore.darkTheme }">
    <div class="container py-[14px] flex justify-between items-center">
      <span></span>
      <p class="text-sm">
        Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
        <a
          href="#"
          class="border-b-1 border-white ml-4 cursor-pointer hover:underline"
          >ShopNow</a
        >
      </p>
      <p class="text-sm">
        English
        <span class="ml-2 text-xl"
          ><i class="fa-solid fa-chevron-down"></i
        ></span>
      </p>
    </div>
  </header>
</template>
