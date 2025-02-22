<script setup>
import { computed, ref } from "vue";
import { useAuthStore } from "../store/auth";
import { toast } from "vue3-toastify";
import { updateUserAPI, updateProductAPI, addBillAPI } from "../services/http";
import { useRouter } from "vue-router";
import { getNewestPrice } from "../ultil";
import { useProductStore } from "../store";
import Swal from "sweetalert2";

const router = useRouter();
const { userState } = useAuthStore();
const store = useProductStore();
// Discount price
const codeDiscount = ref("");
const selectedItems = ref([]);
const shipPrice = ref(userState.user.cart.length * 20);
const payFee = ref(shipPrice.value);

const getDiscount = computed(() => {
  let discount = 0;
  switch (codeDiscount.value) {
    case "hoangtrung":
      discount = 1;
      break;
    case "trung":
      discount = 0.5;
      break;
    case "manh":
      discount = 0.4;
      break;
    case "quynh":
      discount = 0.3;
      break;
    default:
      discount = 0;
  }
  return shipPrice.value * discount;
});

function getPriceDiscount() {
  const x = computed(() => shipPrice.value - getDiscount.value);
  payFee.value = x.value;
}

const totalPriceItems = computed(() => {
  const total = selectedItems.value.reduce(
    (total, num) =>
      total + (num.quantity ? num.quantity : 1) * getNewestPrice(num.price),
    0
  );
  return total;
});

const handleCheckout = async () => {
  if (!userState.user.cart.length > 0) return;
  const result = await Swal.fire({
    title: "Bạn có chắc muốn thanh toán chứ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Thanh toán",
    cancelButtonText: "Hủy bỏ",
  });
  if (result.isConfirmed) {
    for (let product of userState.user.cart) {
      const updatedSoldQuantity = product.quantity + product.soldQuantity;
      const updatedQuantityInStock = product.quantityInStock - product.quantity;

      // check quantity before update
      if (updatedQuantityInStock >= 0) {
        // update product
        await updateProductAPI(product, {
          soldQuantity: updatedSoldQuantity,
          quantityInStock: updatedQuantityInStock,
        });
      } else {
        console.error(`Quantity of ${product.name} is not enough`);
      }
    }
    const timeCreated = new Date(Date.now());
    const newBill = {
      user_id: userState.user._id,
      products: userState.user.cart.map((item) => item._id),
      totalPrice: userState.user.cart.reduce(
        (total, num) => total + num.quantity * num.price,
        0
      ),
      createAt: timeCreated.toUTCString(),
    };
    await addBillAPI(newBill);
    await updateUserAPI(userState.user);
    payFee.value = 0;
    userState.user.cart = [];
    await router.push({ path: "/" });
    toast.success("Checkout Done", {
      autoClose: 1500,
      position: "bottom-right",
      theme: "colored",
    });
  }
};
</script>

<template>
  <div class="container flex justify-between items-center my-[80px]">
    <section>
      <h1 class="text-4xl my-[40px]">Billing Details</h1>
      <div class="my-3">
        <p>FirstName*</p>
        <input
          :class="{ 'text-black': store.darkTheme }"
          type="text"
          placeholder=""
          class="py-2 px-3 bg-neutral-300 w-[400px] mt-2"
        />
      </div>
      <div class="my-3">
        <p>Company Name*</p>
        <input
          :class="{ 'text-black': store.darkTheme }"
          type="text"
          placeholder=""
          class="py-2 px-3 bg-neutral-300 w-[400px] mt-2"
        />
      </div>
      <div class="my-3">
        <p>Street Address*</p>
        <input
          :class="{ 'text-black': store.darkTheme }"
          type="text"
          placeholder=""
          class="py-2 px-3 bg-neutral-300 w-[400px] mt-2"
        />
      </div>
      <div class="my-3">
        <p>Town/City*</p>
        <input
          :class="{ 'text-black': store.darkTheme }"
          type="text"
          placeholder=""
          class="py-2 px-3 bg-neutral-300 w-[400px] mt-2"
        />
      </div>
      <div class="my-3">
        <p>Phone Number*</p>
        <input
          :class="{ 'text-black': store.darkTheme }"
          type="text"
          placeholder=""
          class="py-2 px-3 bg-neutral-300 w-[400px] mt-2"
        />
      </div>
      <div class="my-3">
        <p>Email Address*</p>
        <input
          :class="{ 'text-black': store.darkTheme }"
          type="text"
          placeholder=""
          class="py-2 px-3 bg-neutral-300 w-[400px] mt-2"
        />
      </div>
      <div class="my-3 flex">
        <input
          :class="{ 'text-black': store.darkTheme }"
          type="checkbox"
          placeholder=""
          class="mr-2 bg-red-600"
          checked
        />
        <p>Save this information for faster check-out next time</p>
      </div>
    </section>
    <section>
      <div>
        <div
          class="w-full h-[230px] bg-white text-black text-base shadow-md overflow-y-auto"
        >
          <ul v-if="userState.user?.cart.length > 0" class="space-y-2 w-full">
            <li v-for="item in userState.user.cart" :key="item._id">
              <div class="flex justify-around items-center w-full">
                <input
                  type="checkbox"
                  class="px-4"
                  v-model="selectedItems"
                  :value="item"
                />
                <RouterLink
                  :to="`/products/${item._id}`"
                  class="flex items-center py-2"
                >
                  <img
                    :src="item.image"
                    class="object-cover w-[40px] h-[40px] mr-3 rounded"
                    alt=""
                  />
                  <p class="text-sm w-[180px]">{{ item.name }}</p>
                </RouterLink>
                <span>x{{ item.quantity || 1 }}</span>
                <span class="text-red-500 text-sm"
                  >${{ getNewestPrice(item.price) }}</span
                >
              </div>
            </li>
            <span
              v-if="selectedItems.length >= 1"
              class="block ml-5 text-orange-500 italic shadow-sm"
              >Đã chọn {{ selectedItems.length }} sản phẩm</span
            >
          </ul>
          <span v-else>Chưa có sản phẩm</span>
        </div>
        <div class="my-8 mx-6">
          <div class="">
            <p
              class="flex justify-between border-b-[1px] border-neutral-300 py-1 px-2 mb-4"
            >
              Subtotal:
              <span class="totalPrice">$ {{ totalPriceItems }}</span>
            </p>
            <p
              class="flex justify-between border-b-[1px] border-neutral-300 py-1 px-2 mb-4"
            >
              Shipping: <span>{{ payFee === 0 ? "Free" : `$ ${payFee}` }}</span>
            </p>
            <p
              class="flex justify-between border-b-[1px] border-neutral-300 py-1 px-2 mb-4"
            >
              Total:
              <span class="totalPrice">$ {{ totalPriceItems + payFee }}</span>
            </p>
          </div>
          <div class="">
            <div class="flex justify-between my-8">
              <p>
                <input type="radio" value="Card" name="bank" checked /><span
                  class="ml-2"
                  >Bank</span
                >
              </p>
              <ul class="flex space-x-2">
                <li><img src="../assets/Bkash.png" alt="" /></li>
                <li><img src="../assets/Visa.png" alt="" /></li>
                <li><img src="../assets/Mastercard.png" alt="" /></li>
                <li><img src="../assets/Nagad.png" alt="" /></li>
              </ul>
            </div>
            <input
              type="radio"
              value="Cash"
              name="bank"
              class="text-3xl"
            /><span class="ml-2">Cash on delivery</span>
          </div>
          <div class="flex justify-center mt-8">
            <input
              type="text"
              placeholder="Coupon Code"
              class="w-[300px] text-sm text-black py-4 px-5 border-[1px] border-neutral-300 rounded"
              v-model="codeDiscount"
              @keyup.enter="getPriceDiscount"
            />
            <button
              class="w-[210px] py-4 ml-4 bg-primary border-none text-white rounded hover:opacity-60"
            >
              Apply Coupon
            </button>
          </div>
        </div>
        <button
          class="w-[210px] py-4 ml-6 bg-primary border-none text-white rounded hover:opacity-60"
          @click="handleCheckout"
        >
          Place Order
        </button>
      </div>
    </section>
  </div>
</template>
