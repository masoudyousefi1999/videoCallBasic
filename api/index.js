const express = require("express");
const app = express();
const { v4: uudiv4 } = require("uuid");
require("dotenv").config()

app.set("view engine", "ejs");
app.set('views', 'views')
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.redirect(`/${uudiv4()}`);
});

app.get("/:id", (req, res) => {
  res.render("index.ejs", { roomId: req.params.id });
});

const expressServer = app.listen(PORT, () => {
  console.log("app listening on port ", PORT);
});

const io = require("socket.io")(expressServer,{
    cors : {
        origin : "*"
    }
});

io.on("connection", (socket) => {
  socket.on("join-room", (ROOM_ID, userId) => {
    socket.join(ROOM_ID);
    socket.broadcast.emit("user connected", userId);

    socket.on("disconnect", () => {
      socket.broadcast.emit("user disconnected", userId);
    });
  });
});

export default app;
