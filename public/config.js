window.config = {
  env: "prod",

  api: {
    dev: "http://localhost:8000",
    prod: "https://my-app.vercel.app",
  },

  get url() {
    return this.api[this.env];
  }
};
