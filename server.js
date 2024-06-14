const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let rooms = {};

io.on("connection", (socket) => {
  socket.on("createRoom", (room) => {
    rooms[room] = { users: {}, votes: {}, showVotes: false };
    socket.join(room);
    socket.emit("roomCreated", room);
  });

  socket.on("joinRoom", (room) => {
    if (rooms[room]) {
      socket.join(room);
      socket.emit("roomJoined", room);
    } else {
      socket.emit("error", "Room does not exist");
    }
  });

  socket.on("setName", ({ room, name }) => {
    if (rooms[room]) {
      rooms[room].users[socket.id] = name;
      io.to(room).emit("updateUsers", rooms[room].users);
    }
  });

  socket.on("vote", ({ room, vote }) => {
    if (rooms[room]) {
      rooms[room].votes[socket.id] = vote;
      io.to(room).emit("updateVotes", Object.keys(rooms[room].votes).length);
    }
  });

  socket.on("revealVotes", (room) => {
    if (rooms[room]) {
      rooms[room].showVotes = true;
      const votes = rooms[room].votes;
      const average =
        Object.values(votes).reduce((a, b) => a + b, 0) /
        Object.values(votes).length;
      io.to(room).emit("revealVotes", { votes, average });
    }
  });

  socket.on("clearVotes", (room) => {
    if (rooms[room]) {
      rooms[room].votes = {};
      rooms[room].showVotes = false;
      io.to(room).emit("updateVotes", 0);
    }
  });

  socket.on("disconnect", () => {
    for (let room in rooms) {
      if (rooms[room].users[socket.id]) {
        delete rooms[room].users[socket.id];
        delete rooms[room].votes[socket.id];
        io.to(room).emit("updateUsers", rooms[room].users);
        io.to(room).emit("updateVotes", Object.keys(rooms[room].votes).length);
      }
    }
  });
});

server.listen(4000, () => {
  console.log("Server listening on port 4000");
});
