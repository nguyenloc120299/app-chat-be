import app from "./app";

app
  .listen(7000, () => {
    console.log(`Server running on port : ${5000}`);
  })
  .on("error", (e) => console.log(e));
