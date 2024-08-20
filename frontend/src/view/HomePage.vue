<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useProductStore } from "../store";
import { useAuthStore } from "../store/auth";
import { updateUserAPI } from "../services/http";
import { toast } from "vue3-toastify";
import { RouterLink } from "vue-router";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";

const route = useRoute();
const router = useRouter();

const {
  userState: { user },
} = useAuthStore();
const store = useProductStore();
const productStore = useProductStore();

// Pagination
const limit = 8;
const currentPage = computed(() => {
  const page = parseInt(route.query.page) || 1;
  return page;
});

const theme = computed(() => store.darkTheme);

onMounted(() => store.getFilteredProducts(currentPage.value, limit));
watch(currentPage, (newPage) => {
  store.getFilteredProducts(newPage, limit);
  router.push({ query: { page: newPage } });
});

const productFilters = computed(() => ({
  products: store.allProducts.products,
  totalPages: store.allProducts.totalPages,
  currentPage: store.allProducts.currentPage,
  allProducts: store.allProducts.allProducts,
}));

// add to wishlist
const handleClick = async (product) => {
  const index =
    user && user?.careItems.findIndex((item) => item._id === product._id);
  if (index === -1) {
    user.careItems.unshift(product);
  }

  if (!user) {
    const result = await Swal.fire({
      title: "Yêu cầu đăng nhập",
      text: "Bạn cần đăng nhập để thêm sản phẩm",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đăng nhập",
      cancelButtonText: "Hủy bỏ",
    });
    if (result.isConfirmed) {
      router.push({ path: "Signin" });
    }
  } else {
    await updateUserAPI(user);
    toast.success("Added item to Wishlist !!", {
      autoClose: 1500,
      position: "bottom-right",
      theme: "colored",
    });
  }
};

// remove from wishlist
const removeClick = async (product) => {
  const index = user.careItems.findIndex((item) => item._id === product._id);
  if (index !== -1) {
    user.careItems.splice(index, 1);
  }

  await updateUserAPI(user);
  toast.error("Removed item from Wishlist", {
    autoClose: 1500,
    position: "bottom-right",
    theme: "colored",
  });
};

// check item in wishlist
const checkItem = (product) => {
  return (
    user && user.careItems.findIndex((item) => item._id === product._id) !== -1
  );
};

// Add to cart
const addToCart = async (product) => {
  if (!user) {
    const result = await Swal.fire({
      title: "Yêu cầu đăng nhập",
      text: "Bạn cần đăng nhập để thêm sản phẩm",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đăng nhập",
      cancelButtonText: "Hủy bỏ",
    });
    if (result.isConfirmed) {
      router.push({ path: "Signin" });
    }
  } else {
    const index = user?.cart.findIndex((item) => item._id === product._id);
    if (index !== -1) {
      user.cart[index].quantity++;
    } else {
      user.cart.push({ ...product, quantity: 1 });
    }

    await updateUserAPI(user);
    toast.success("Added to cart !!", {
      autoClose: 1500,
      position: "bottom-right",
      theme: "colored",
    });
  }
};

// Sorted with options
let order = "asc";
const sortAndSetProducts = (key) => {
  const newProducts = ref(productFilters.value.allProducts);
  productFilters.value.products = newProducts.value.sort((a, b) => {
    const order1 = order === "asc" ? 1 : -1;
    const comp =
      key === "name" ? a[key].localeCompare(b[key]) : a[key] - b[key];
    return order1 * comp;
  });
};

const createSortFunction = (field) => {
  return () => {
    order = order === "asc" ? "desc" : "asc";
    sortAndSetProducts(field);
  };
};

const sortByName = createSortFunction("name");
const sortByPrice = createSortFunction("price");
const sortyByRate = createSortFunction("star");

// Sorted with icons
const show = reactive({
  name: true,
  price: false,
  star: false,
  all: false,
});
</script>

<template>
  <section class="container relative flex justify-between">
    <span
      class="absolute top-0 left-[338px] border-neutral-400 border-[0.5px] h-full"
    ></span>
    <aside class="mt-[40px]">
      <ul class="space-y-4">
        <li
          class="relative hover:underline hover:text-shadow-md hover:translate-x-[-15px] transition-transform transition-duration-300 ease-in-out"
        >
          <a class="" href="#"
            >Woman’s Fashion
            <span
              class="after:content-['>'] absolute top-0 right-[-70px]"
            ></span
          ></a>
        </li>
        <li
          class="relative hover:underline hover:text-shadow-md hover:translate-x-[-15px] transition-transform transition-duration-300 ease-in-out"
        >
          <a href="#" class=""
            >Men’s Fashion
            <span
              class="after:content-['>'] absolute top-0 right-[-70px] hover:underline hover:text-shadow-md hover:translate-x-[-15px] transition-transform transition-duration-300 ease-in-out"
            ></span
          ></a>
        </li>
        <li
          class="hover:underline hover:text-shadow-md hover:translate-x-[-15px] transition-transform transition-duration-500 ease-in-out"
        >
          <a href="#" class="">Electronics</a>
        </li>
        <li
          class="hover:underline hover:text-shadow-md hover:translate-x-[-15px] transition-transform transition-duration-500 ease-in-out"
        >
          <a href="#" class="hover:">Home & Lifestyle</a>
        </li>
        <li
          class="hover:underline hover:text-shadow-md hover:translate-x-[-15px] transition-transform transition-duration-500 ease-in-out"
        >
          <a href="#" class="hover:">Medicine</a>
        </li>
        <li
          class="hover:underline hover:text-shadow-md hover:translate-x-[-15px] transition-transform transition-duration-500 ease-in-out"
        >
          <a href="#" class="hover:">Sports & Outdoor</a>
        </li>
        <li
          class="hover:underline hover:text-shadow-md hover:translate-x-[-15px] transition-transform transition-duration-500 ease-in-out"
        >
          <a href="#" class="">Baby’s & Toys</a>
        </li>
        <li
          class="hover:underline hover:text-shadow-md hover:translate-x-[-15px] transition-transform transition-duration-500 ease-in-out"
        >
          <a href="#" class="hover:">Groceries & Pets</a>
        </li>
        <li
          class="hover:underline hover:text-shadow-md hover:translate-x-[-15px] transition-transform transition-duration-500 ease-in-out"
        >
          <a href="#" class="hover:">Health & Beauty</a>
        </li>
      </ul>
    </aside>
    <main class="mt-[40px] ml-[45px] block border-l-2 border-neutral-700">
      <img src="../assets/coverimage.png" alt="" />
    </main>
  </section>
  <section class="container my-[60px]">
    <div class="mb-[40px]">
      <section class="flex items-center mb-6">
        <span class="block w-5 h-[40px] rounded-md bg-primary mr-2"></span>
        <p class="text-orange-700">Today’s</p>
      </section>
      <section class="flex justify-between items-center">
        <h4 class="text-4xl font-semibold">Flash Sales</h4>
        <div class="flex items-center space-x-2">
          <span
            class="flex justify-center items-center w-[46px] h-[46px] bg-neutral-300 rounded-full"
            :class="{ 'text-black': theme }"
            ><i class="fa-solid fa-arrow-left"></i
          ></span>
          <span
            class="flex justify-center items-center w-[46px] h-[46px] bg-neutral-300 rounded-full"
            :class="{ 'text-black': theme }"
            ><i class="fa-solid fa-arrow-right"></i
          ></span>
        </div>
      </section>
    </div>
    <ul
      class="flex space-x-5 items-center py-2 px-3 my-6"
      :class="[theme ? 'bg-[#5b5959]' : 'bg-neutral-200']"
    >
      <span class="ml-5">Sort by</span>
      <li @click="show.name = !show.name">
        <button
          class="px-5 py-3 bg-white text-black hover:bg-primary hover:text-white"
          @click="sortByName"
          transition="fade"
        >
          Tên sản phẩm
          <i v-if="show.name" class="fa-solid fa-chevron-up"></i>
          <i v-else class="fa-solid fa-chevron-down"></i>
        </button>
      </li>
      <li @click="show.price = !show.price">
        <button
          @click="sortByPrice"
          class="px-5 py-3 bg-white text-black hover:bg-primary hover:text-white"
        >
          Giá cả
          <i v-if="show.price" class="fa-solid fa-chevron-up"></i>
          <i v-else class="fa-solid fa-chevron-down"></i>
        </button>
      </li>
      <li @click="show.star = !show.star">
        <button
          @click="sortyByRate"
          class="px-5 py-3 bg-white text-black hover:bg-primary hover:text-white"
        >
          Lượt đánh giá
          <i v-if="show.star" class="fa-solid fa-chevron-up"></i>
          <i v-else class="fa-solid fa-chevron-down"></i>
        </button>
      </li>
    </ul>
    <div class="#page grid grid-cols-4 gap-4">
      <span v-if="store.isLoading">Loading...</span>
      <template v-if="productFilters">
        <article
          v-for="product in productFilters.products"
          :key="product.id"
          class="shadow-md border-2 border-orange-400 bg-orange-200 py-4 px-2 hover:translate-y-1"
          :class="[productStore.darkTheme ? 'bg-[#171010]' : 'bg-white']"
        >
          <div class="">
            <div class="relative flex flex-col items-center mb-4">
              <RouterLink :to="`/products/${product._id}`">
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="object-cover w-[270px] h-[250px]"
                />
              </RouterLink>
              <p
                v-if="product.star >= 5 || product.soldQuantity >= 50"
                class="flex justify-center items-center absolute top-[-10px] left-[-17px] text-sm shadow-md w-[100px] h-[20px] bg-red-500 hover:opacity-0 cursor-pointer"
              >
                <!-- <span
                  v-if="checkItem(product)"
                  @click="removeClick(product)"
                  class="text-white"
                  >Đã yêu thích
                  <i class="fa-solid fa-check"></i>
                </span>
                <span
                  v-else
                  @click="handleClick(product)"
                  class="text-white"
                  :class="{ 'text-black': theme }"
                  >Yêu thích</span
                > -->

                <span class="text-white" :class="{ 'text-black': theme }"
                  >Yêu thích</span
                >
              </p>
            </div>
            <div class="ml-3 space-y-4">
              <RouterLink :to="`/products/${product._id}`">
                <h5 class="text-base hover:underline">{{ product.name }}</h5>
              </RouterLink>
              <p class="text-red-600 my-2">
                ${{ product.price * 0.85 }}
                <span class="text-neutral-400 line-through ml-2"
                  >${{ product.price }}</span
                >
              </p>
              <ul>
                <template v-for="index in 5">
                  <i
                    v-if="index <= product.star"
                    key="index"
                    class="fa-solid fa-star text-red-600"
                  ></i>
                  <i v-else class="fa-regular fa-star"></i>
                </template>
                <span class="text-sm"> Đã bán {{ product.soldQuantity }}</span>
              </ul>
              <p class="text-white"><span> Hà Nội</span></p>
            </div>
            <!-- <button
              class="bg-primary text-white py-2 px-7 mt-2 rounded hover:opacity-60"
              @click="addToCart(product)"
            >
              Add to cart
            </button> -->
          </div>
        </article>
      </template>
    </div>
    <!-- Hiển thị phân trang -->
    <div class="mt-4">
      <nav class="flex justify-end">
        <ul class="flex items-center cursor-pointer">
          <RouterLink
            v-if="productFilters.currentPage > 1"
            :to="`/products?page=${productFilters.currentPage - 1}`"
            class="px-3 py-1 rounded border border-gray-300 mr-2"
          >
            Previous
          </RouterLink>
          <li v-for="page in productFilters.totalPages" :key="page">
            <RouterLink
              :to="`/products?page=${page}`"
              class="px-3 py-1 rounded border border-gray-300 mr-2"
              :class="productFilters.currentPage === page ? 'bg-gray-300' : ''"
            >
              {{ page }}
            </RouterLink>
          </li>
          <RouterLink
            v-if="productFilters.currentPage < productFilters.totalPages"
            :to="`/products?page=${productFilters.currentPage + 1}`"
            class="px-3 py-1 rounded border border-gray-300 mr-2"
          >
            Next
          </RouterLink>
        </ul>
      </nav>
    </div>
    <div class="" @click="show.name = !show.name">
      <button
        class="block mx-auto mt-[60px] w-[234px] bg-primary text-white rounded py-4 hover:opacity-40"
        @click="sortByName"
      >
        View All Products
      </button>
    </div>
  </section>
</template>
