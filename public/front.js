const socket = io();
const myPeer = new Peer();
const user_selfi = document.querySelector(".user_selfi");
const myViedo = document.createElement("video");
myViedo.muted = true;
myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

// getting user camera

navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    addUserVideo(myViedo, stream, "me");
    myPeer.on("call", (call) => {
      call.answer(stream);
      const userVideo = document.createElement("video");
      call.on("stream", (stream) => {
        addUserVideo(userVideo, stream);
      });
    });

    // when user connect to our server we call and connect all user toghter
    socket.on("user connected", (userId) => callUser(userId, stream));
  })
  .catch((err) => console.log("error ocuerd", err));

socket.on("user disconnected", (userId) => {
  const removedVideo = document.getElementById(userId);
  removedVideo.remove();
});

// functions
function callUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userStream) => {
    addUserVideo(video, userStream, userId);
  });

  call.on("close", () => {
    video.remove();
  });
}

function addUserVideo(video, userStream, userId) {
  video.srcObject = userStream;
  video.id = userId;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  user_selfi.append(video);
}
