<script setup>
import { watchEffect } from "vue";
import { useHistoryStore } from "../store/history";
import { useRoute, useRouter } from "vue-router";

const buyStore = useHistoryStore();
const route = useRoute();
const router = useRouter();

watchEffect(() => {
  buyStore.getAnHistoryBuy(route.params.id);
});

const handleClose = () => {
  buyStore.isCollapsed = false;
  router.replace("/history");
};
</script>

<template>
  <div
    class="bg-teal-200 shadow-sm rounded h-[440px] w-[800px] text-center p-4"
  >
    <div class="relative">
      <h1 class="text-3xl text-red-600">Detail Exchange</h1>
      <span
        @click="handleClose"
        class="text-2xl absolute top-2 right-2 cursor-pointer"
        ><i class="fa-solid fa-close"></i
      ></span>
    </div>
    <ul
      class="shadow-md border-neutral-400 grid grid-cols-4 justify-between text-center py-6"
    >
      <span>Stt</span>
      <span>Image</span>
      <span>Name</span>
      <span>Price Tag</span>
    </ul>
    <div class="">
      <ul
        v-for="(bill, index) in buyStore.historyDetail?.products"
        :key="bill._id"
        class="relative shadow-md border-neutral-400 grid grid-cols-4 justify-between text-center items-center py-3 my-[30px]"
      >
        <li class="flex items-center justify-center">
          {{ index + 1 }}
        </li>
        <li>
          <img
            :src="bill.image"
            class="object-contain w-[80px] mx-auto"
            alt=""
          />
        </li>
        <li>{{ bill.name }}</li>
        <li>
          <div
            class="flex justify-center items-center rounded py-2 px-3 w-[80px] border-[1px] mx-auto border-neutral-300"
          >
            <p class="mr-2">{{ bill.price || 0 }}</p>
          </div>
        </li>
      </ul>
      <p class="text-right mr-3 text-xl text-sky-500 shadow-sm">
        Total price:
        <span class="italic"
          >${{ buyStore.historyDetail?.totalPrice || "NaN" }}</span
        >
      </p>
    </div>
  </div>
</template>
