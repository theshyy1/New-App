<script setup>
import { getProductAPI, updateUserAPI } from "../services/http";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProductStore } from "../store";
import { useAuthStore } from "../store/auth";
import Swal from "sweetalert2";
import { toast } from "vue3-toastify";
const route = useRoute();
const router = useRouter();

const currentProduct = ref(null);

const {
  userState: { user },
} = useAuthStore();
const store = useProductStore();

onMounted(() => {
  getProductAPI(route.params.id).then(
    ({ data }) => (currentProduct.value = data)
  );
});

const quantity = ref(1);

// Add to wishlist
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
      user.cart.push({ ...product, quantity });
    }

    await updateUserAPI(user);
    toast.success("Added to cart !!", {
      autoClose: 1500,
      position: "bottom-right",
      theme: "colored",
    });
  }
};

function increaseQuantity() {
  quantity.value++;
}

function decreaseQuantity() {
  if (quantity.value > 0) {
    quantity.value--;
  }
}
</script>

<template>
  <div
    v-if="currentProduct"
    class="container flex justify-between items-center my-[60px]"
  >
    <section class="flex">
      <div class="space-y-4 mr-7">
        <img src="https://picsum.photos/170/138" alt="" />
        <img src="https://picsum.photos/170/138" alt="" />
        <img src="https://picsum.photos/170/138" alt="" />
        <img src="https://picsum.photos/170/138" alt="" />
      </div>
      <img
        :src="currentProduct.image"
        class="object-cover w-[500px] h-[600px]"
        alt=""
      />
    </section>
    <section>
      <div class="">
        <h3 class="text-2xl font-semibold">{{ currentProduct.name }}</h3>
        <ul class="my-4">
          <template v-for="index in 5">
            <i
              v-if="index <= currentProduct.star"
              key="index"
              class="fa-solid fa-star text-red-600"
            ></i>
            <i v-else class="fa-regular fa-star"></i>
          </template>
          <span>({{ currentProduct.soldQuantity }} Reviews) | </span>
          <span class="text-green-700">In Stock</span>
        </ul>
        <span class="block text-2xl font-semibold mb-6"
          >${{ currentProduct?.price }}</span
        >
        <p class="text-sm max-w-[440px] pb-6 border-b-[1px] border-black">
          PlayStation 5 Controller Skin High quality vinyl with air channel
          adhesive for easy bubble free install & mess free removal Pressure
          sensitive.
        </p>
      </div>
      <div class="">
        <div class="space-x-2 my-6">
          <span>Colours: </span>
          <input type="radio" class="text-red-600" name="1" checked />
          <input type="radio" class="text-green-600" name="1" />
        </div>
        <div v-if="product?.sll" class="">
          <div class="space-x-3">
            <span class="text-xl">Size: </span>
            <button class="border-[1px] border-black rounded text-sm p-2">
              XS
            </button>
            <button class="border-[1px] border-black rounded text-sm p-2 px-3">
              S
            </button>
            <button
              class="border-[1px] rounded text-sm p-2 px-3 bg-primary text-white"
            >
              M
            </button>
            <button class="border-[1px] border-black rounded text-sm p-2 px-3">
              L
            </button>
            <button class="border-[1px] border-black rounded text-sm p-2">
              XL
            </button>
          </div>
        </div>
        <div class="flex justify-between items-center w-[370px] mt-6 mb-[40px]">
          <div
            class="border-[1px] border-black rounded w-[100px] flex justify-around p-1"
          >
            <span class="block px-3" @click="decreaseQuantity"> - </span>
            <span> {{ quantity || 1 }} </span>
            <span class="block px-3" @click="increaseQuantity"> + </span>
          </div>
          <button
            class="bg-primary text-white py-2 px-7 rounded hover:opacity-60"
            @click="addToCart(currentProduct)"
          >
            Buy now
          </button>
          <p class="border-[1px] border-black rounded py-1 px-2">
            <i
              class="fa-solid fa-heart text-2xl text-orange-500"
              @click="removeClick(currentProduct)"
              v-if="checkItem(currentProduct)"
            ></i>
            <i
              v-else
              @click="handleClick(currentProduct)"
              class="fa-regular fa-heart text-2xl"
            ></i>
          </p>
        </div>
        <div class="border-[1px] border-black rounded w-[370px] p-4">
          <div class="flex items-center mb-2 border-b-[1px] border-black pb-3">
            <i class="fa-solid fa-truck text-2xl"></i>
            <div class="ml-3">
              <p class="text-base">Free Delivery</p>
              <span class="underline text-[12px]"
                >Enter your postal code for Delivery Availability</span
              >
            </div>
          </div>
          <div class="flex items-center">
            <i class="fa-solid fa-rotate-left text-2xl"></i>
            <div class="ml-3">
              <p class="text-base">Free Delivery</p>
              <span class="underline text-[12px]"
                >Enter your postal code for Delivery Availability</span
              >
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
