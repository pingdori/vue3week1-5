import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js";
import productModal from "./productModal.js";
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule("required", required);
defineRule("email", email);
defineRule("min", min);
defineRule("max", max);

loadLocaleFromURL(
  "https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json"
);

configure({
  generateMessage: localize("zh_TW"),
});

const apiUrl = "https://vue3-course-api.hexschool.io";
const apiPath = "pokebox";

const app = Vue.createApp({
  data() {
    return {
      products: [],
      productId: "",
      form: {
        user: {
          name: "",
          email: "",
          tel: "",
          address: "",
        },
        message: "",
      },
      cart: {},
      loadingItem: "",
      isLoading: false,
    };
  },
  components: {
    productModal,
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  methods: {
    getProducts() {
      axios
        .get(`${apiUrl}/v2/api/${apiPath}/products/all`)
        .then((res) => {
          //   console.log("產品列表", res.data.products);
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    openModal(id) {
      this.productId = id;
      //   console.log("外層傳入 Id", id);
    },
    addToCart(product_id, qty = 1) {
      //參數預設值，當沒有傳入該參數時會使用預設值
      //和api文件結構同名稱
      const data = {
        product_id, //product_id:product_id縮寫，同名不寫第二次
        qty,
      };
      axios
        .post(`${apiUrl}/v2/api/${apiPath}/cart`, { data })
        .then((res) => {
          console.log("加入購物車", res.data);
          this.$refs.productModal.hide();
          this.getCarts();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    deleteAllCarts() {
      const url = `${apiUrl}/api/${apiPath}/carts`;
      axios
        .delete(url)
        .then((response) => {
          alert(response.data.message);
          this.getCarts();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    getCarts() {
      //區塊或全畫面的讀取
      axios
        .get(`${apiUrl}/v2/api/${apiPath}/cart`)
        .then((res) => {
          //   console.log("購物車列表", res.data);
          this.cart = res.data.data;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    updateCartItem(item) {
      const data = {
        product_id: item.product.id, //產品id
        qty: item.qty,
      };
      this.loadingItem = item.id;
      axios
        .put(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`, { data }) //購物車id
        .then((res) => {
          //   this.cart = res.data.data;
          this.getCarts();
          this.loadingItem = "";
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    deleteItem(item) {
      this.loadingItem = item.id;
      axios
        .delete(`${apiUrl}//v2/api/${apiPath}/cart/${item.id}`) //購物車id
        .then((res) => {
          //   console.log("刪除購物車", res.data);
          //   this.cart = res.data.data;
          this.loadingItem = "";
          this.getCarts();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    createOrder() {
      const url = `${apiUrl}/api/${apiPath}/order`;
      const order = this.form;
      axios
        .post(url, { data: order })
        .then((response) => {
          alert(response.data.message);
          this.$refs.form.resetForm();
          this.getCarts();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });

      //   console.log(this.form.user);
    },
  },

  mounted() {
    this.getProducts();
    this.getCarts();
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
    // console.log(VueLoading);
  },
});
app.component("productModal", productModal);
app.component("loading", VueLoading.Component);
app.mount("#app");
