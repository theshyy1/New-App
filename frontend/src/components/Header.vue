<script setup>
import { RouterLink, useRoute } from "vue-router";
import { ref } from "vue";
import { useProductStore } from "../store";
import { useAuthStore } from "../store/auth";
import { popupOptions, headerOptions } from "../constraints";
import Swal from "sweetalert2";
import AdHeader from "./AdHeader.vue";
import "../styles/transition.css";

const productStore = useProductStore();
const { userState, logout } = useAuthStore();
const searchText = ref("");

const handleSubmit = () => {
  productStore.getFilteredProducts(searchText.value);
  searchText.value = "";
};

const handleLogout = async () => {
  const result = await Swal.fire({
    // title: "Yêu cầu đăng nhập",
    text: "Bạn có chắc chắn muốn đăng xuất không?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Có",
    cancelButtonText: "Không",
  });
  if (result.isConfirmed) {
    logout();
  }
};
</script>

<template>
  <AdHeader />
  <section
    class="border-b-[1px] text-white border-neutral-500"
    :class="[productStore.darkTheme ? 'bg-[#1c1b1e]' : 'bg-primary']"
  >
    <div class="container flex justify-between items-center pt-9 mb-4">
      <RouterLink to="/">
        <h3 class="text-2xl font-bold">Exclusive</h3>
      </RouterLink>
      <nav>
        <ul class="flex justify-center items-center space-x-6">
          <li v-for="(option, index) in headerOptions" :key="index">
            <RouterLink :to="option.url" class="hover:underline hover:italic">
              {{ option.title }}
            </RouterLink>
          </li>
        </ul>
      </nav>
      <div class="flex justify-between items-center">
        <div
          class="border-2 border-neutral-300 bg-white rounded-md mr-4"
          @submit.prevent="handleSubmit"
        >
          <input
            type="text"
            placeholder="What are you looking for?"
            class="px-4 py-2 outline-none text-black"
            v-model="searchText"
            @keyup.enter="handleSubmit"
          />
          <button class="pr-2">
            <i class="fa-solid fa-magnifying-glass text-black"></i>
          </button>
        </div>
        <p class="space-x-4 text-2xl">
          <RouterLink to="/wishlist" class="hover-trigger group relative">
            <i class="fa-regular fa-heart hover:text-sky-500"></i>
            <span
              class="hidden group-hover:block absolute top-[-40px] right-[-20px] text-[12px] z-[2] text-black bg-white rounded px-2"
              >Wishlist</span
            >
            <span
              v-if="userState.user?.careItems?.length > 0"
              class="flex justify-center absolute top-[-7px] right-[-10px] text-sm w-5 h-5 rounded-full bg-white text-red-500"
              >{{ userState.user?.careItems.length }}</span
            >
          </RouterLink>
          <RouterLink to="/cart" class="hover-trigger group relative">
            <i class="fa-solid fa-cart-plus"></i>
            <div
              class="hidden group-hover:flex w-[300px] h-[230px] bg-white text-black absolute top-[30px] right-0 z-[2] justify-center items-center text-base shadow-md border-[1px] border-neutral-300 overflow-y-auto"
            >
              <ul
                v-if="userState.user?.cart?.length > 0"
                class="space-y-2 h-full py-2 my-4"
              >
                <li
                  v-for="item in userState.user.cart"
                  class="flex justify-between items-center"
                >
                  <RouterLink
                    :to="`/products/${item.id}`"
                    class="flex justify-between items-center"
                  >
                    <div class="flex items-center">
                      <img
                        :src="item.image"
                        class="object-cover w-[40px] h-[40px] mr-1 rounded"
                        alt=""
                      />
                      <p class="text-sm w-[180px]">{{ item.name }}</p>
                    </div>
                    <span class="text-red-500 text-sm">${{ item.price }}</span>
                  </RouterLink>
                </li>
                <div class="">
                  <button
                    class="block ml-auto py-2 px-3 bg-primary text-white hover:opacity-60"
                  >
                    View Cart
                  </button>
                </div>
              </ul>
              <span v-else>Chưa có sản phẩm</span>
            </div>
          </RouterLink>
        </p>
      </div>
      <button class="" @click="productStore.toggleTheme">
        <span v-if="productStore.darkTheme">
          <i class="fa-regular fa-lightbulb"></i>
        </span>
        <span v-else>
          <i class="fa-solid fa-lightbulb"></i>
        </span>
      </button>

      <div class="text-xl">
        <span v-if="userState.isLoggin" class="flex items-center space-x-2">
          <i class="fa-regular fa-user"></i>
          <div class="text-base">
            Hi,
            <RouterLink
              to="/"
              class="text-white hover:text-sky-600 shadow-sm cursor-pointer hover-trigger group relative"
            >
              {{ userState.user.name }} !!
              <Transition name="fade">
                <ul
                  class="hidden group-hover:block absolute top-[20px] right-[0px] rounded z-[2] text-sm py-2 px-3 space-y-2 w-[200px] bg-gradient-to-l from-transparent to-neutral-400 z-100"
                >
                  <li v-for="(option, index) in popupOptions" :key="index">
                    <RouterLink
                      :to="option.url"
                      class="block p-2 hover:bg-orange-500 hover:text-white rounded text-black"
                    >
                      <i :class="option.icon"></i> {{ option.title }}
                    </RouterLink>
                  </li>
                  <li
                    class="block p-2 hover:bg-orange-500 hover:text-white rounded text-black"
                    @click="handleLogout"
                  >
                    <i class="fa-solid fa-right-from-bracket mr-2"></i> Logout
                  </li>
                </ul>
              </Transition></RouterLink
            >
          </div>
        </span>
        <span class="space-x-2" v-else>
          <RouterLink
            class="text-base border-[1px] border-white text-white py-2 px-7 mt-2 rounded hover:opacity-60"
            to="/signin"
            >Sign in</RouterLink
          >
          <RouterLink
            class="text-base border-[1px] border-white text-white py-2 px-7 mt-2 rounded hover:opacity-60"
            to="/signup"
            >Sign up</RouterLink
          >
        </span>
      </div>
    </div>
  </section>
</template>
