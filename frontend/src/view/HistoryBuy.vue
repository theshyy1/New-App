<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from "../store/auth";
import { useHistoryStore } from "../store/history";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";

const { userState } = useAuthStore();
const buyStore = useHistoryStore();

const route = useRoute();
const router = useRouter();

onMounted(() => buyStore.getHistoryBuy(userState?.user?._id));

const showDetail = (id) => {
  if (route.params.id === id) {
    buyStore.isCollapsed = false;
    router.replace("/history");
  } else {
    buyStore.isCollapsed = true;
  }
};
</script>

<template>
  <div class="container my-[60px]">
    <h1 class="my-5 text-3xl border-l-4 border-orange-500 px-3 ml-6">
      History Buy
    </h1>
    <div
      class="border-[1px] shadow-md border-neutral-400 grid grid-cols-5 justify-between text-center py-6"
    >
      <span>Stand</span>
      <span>Info products</span>
      <span>Subtotal ($)</span>
      <span>Period times</span>
      <span></span>
    </div>
    <!-- Bill Cart -->
    <div class="">
      <ul
        v-for="(bill, index) in buyStore.listHistoryBuy"
        :key="bill._id"
        class="relative border-[1px] shadow-md border-neutral-400 grid grid-cols-5 justify-between text-center items-center py-3 my-[30px]"
      >
        <li class="flex items-center justify-center">
          {{ index + 1 }}
        </li>
        <li>{{ bill.products[0].name }}</li>
        <li>
          <div
            class="flex justify-center items-center rounded py-2 px-3 w-[80px] border-[1px] mx-auto border-neutral-300"
          >
            <p class="mr-2">{{ bill.totalPrice || 0 }}</p>
          </div>
        </li>
        <li>{{ bill.createAt || 0 }}</li>
        <RouterLink
          :to="`/history/${bill._id}`"
          class="text-base text-red-500 hover:text-red-300 cursor-pointer"
          @click="showDetail(bill._id)"
        >
          <span>
            {{
              bill._id === route.params.id && buyStore.isCollapsed
                ? "Hide"
                : "Show"
            }}
            <i class="fa-solid fa-eye"></i>
          </span>
        </RouterLink>
      </ul>
    </div>
    <div v-if="buyStore.isCollapsed" class="fixed top-[25%] left-[20%]">
      <RouterView />
    </div>
  </div>
</template>
