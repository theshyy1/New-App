import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useHistoryStore = defineStore("historyBuy", () => {
  const listHistoryBuy = ref([]);
  const historyDetail = ref();
  const isCollapsed = ref(false);

  const getHistoryBuy = async (id) => {
    const res = await axios.get(`http://localhost:8000/v1/bills/history/${id}`);
    const data = await res.data;
    listHistoryBuy.value = data;
  };

  const getAnHistoryBuy = async (id) => {
    const res = await axios.get(`http://localhost:8000/v1/bills/${id}`);
    const data = await res.data;
    historyDetail.value = data;
  };

  return {
    listHistoryBuy,
    isCollapsed,
    historyDetail,
    getHistoryBuy,
    getAnHistoryBuy,
  };
});
