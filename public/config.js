window.config = {
  env: "dev",

  api: {
    dev: "http://localhost:8000",
    prod: "https://rmc-adetech-room-vacancy.vercel.app",
  },

  get url() {
    return this.api[this.env];
  }
};
