<script setup>
import { reactive } from "vue";
import { toast } from "vue3-toastify";
import { useRouter } from "vue-router";
import { addProductAPI } from "../../services/http";
import avatar from "../../assets/avatar.jpg";
import { productSchema } from "../../ultil/schema";

const router = useRouter();

const newProduct = reactive({
  name: "",
  price: "",
  quantityInStock: "",
  image: "",
});

const handleSubmit = async () => {
  try {
    const { error, value } = productSchema.validate(newProduct);
    if (error) {
      toast.error("Error: " + error.message, {
        autoClose: 3000,
        position: "bottom-right",
        theme: "colored",
      });
      return;
    }

    const product = {
      ...value,
    };
    await addProductAPI(product);
    await router.push({ path: "/admin/products", replace: true });
    toast.success("Added successfully", {
      autoClose: 1500,
      position: "bottom-right",
      theme: "colored",
    });
  } catch (error) {
    console.error("Error adding product:", error);
  }
};
</script>

<template>
  <div class="container">
    <div class="bg-white py-5 px-7 flex justify-between items-center">
      <form @submit.prevent="handleSubmit">
        <div class="my-3">
          <p>Name*</p>
          <input
            type="text"
            placeholder="Enter product's name..."
            v-model="newProduct.name"
            class="py-3 px-4 bg-gray-200 w-[600px] mt-2 shadow-md placeholder:text-orange-500 opacity-60"
          />
        </div>
        <div class="my-3">
          <p>Price*</p>
          <input
            type="text"
            placeholder="Enter product's price..."
            v-model="newProduct.price"
            class="py-3 px-4 bg-gray-200 w-[600px] mt-2 shadow-md placeholder:text-orange-500 opacity-60"
          />
        </div>
        <div class="my-3">
          <p>Quantity In Stock*</p>
          <input
            type="text"
            placeholder="Enter product's quantity..."
            v-model="newProduct.quantityInStock"
            class="py-3 px-4 bg-gray-200 w-[600px] mt-2 shadow-md placeholder:text-orange-500 opacity-60"
          />
        </div>
        <div class="my-3">
          <p>Image*</p>
          <input
            type="text"
            placeholder="Enter product's image..."
            v-model="newProduct.image"
            class="py-3 px-4 bg-gray-200 w-[600px] mt-2 shadow-md placeholder:text-orange-500 opacity-60"
          />
        </div>

        <button
          class="py-3 px-5 my-3 w-[120px] bg-orange-500 hover:opacity-60 text-white rounded"
        >
          ADD
        </button>
      </form>
      <div class="">
        <a href="https://www.facebook.com/trung.isme182" target="_blank">
          <h4 class="text-xl shadow-sm text-center italic underline">
            Nice to meet you !!
          </h4>
        </a>
        <img
          :src="`${avatar}`"
          class="object-cover w-[400px] p-1 shadow-md"
          alt=""
        />
      </div>
    </div>
  </div>
</template>
