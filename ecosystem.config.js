module.exports = {
  apps: [
    {
      name: "api.daker.xin",
      script: "./app.js",
      max_memory_restart: "512M",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      error_file: "/tmp/error.log",
      out_file: "/tmp/out.log"
    }
  ]
}
