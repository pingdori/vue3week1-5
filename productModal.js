export default {
  //   當id"變動"時，取得遠端資料，並呈現modal
  props: ["id", "addToCart", "openModal"],
  data() {
    return {
      loadingStatus: {
        loadingItem: "",
      },
      modal: {},
      tempProduct: {},
      qty: 1,
    };
  },
  template: "#userProductModal",
  watch: {
    id() {
      if (this.id) {
        console.log(this.id);
        axios
          .get(`${apiUrl}/v2/api/${apiPath}/product/${this.id}`)
          .then((res) => {
            console.log("產品列表", res.data.product);
            this.tempProduct = res.data.product;
            this.modal.show();
          })
          .catch((err) => {
            alert(err.response.data.message);
          });
      }
    },
  },
  methods: {
    hide() {
      this.modal.hide();
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
    //監聽DOM，當modal關閉實作其他事情
    this.$refs.modal.addEventListener("hidden.bs.modal", (event) => {
      //   console.log("modal被關閉了");
      this.openModal("");
    });
  },
};
