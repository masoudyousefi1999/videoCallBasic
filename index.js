const express = require("express");
const app = express();
const {v4 : uudiv4} = require("uuid")
app.set("view engine", "ejs")
app.use(express.static("public"))

app.get("/",(req,res) => {
    res.redirect(`/${uudiv4()}`)
})


app.get("/:id", (req,res) => {
    res.render("index", {roomId : req.params.id})
})

const expressServer = app.listen(5000, () => {
    console.log("app listening on port 5000");
})

const io = require("socket.io")(expressServer);

io.on("connection", (socket) => {
    console.log("a user connected to server")
    socket.on("join-room",(ROOM_ID,userId) => {
        socket.join(ROOM_ID)
        socket.broadcast.emit("user connected",userId)


        socket.on("disconnect",() => {
            socket.broadcast.emit("user disconnected",userId)
        })
    })
})
