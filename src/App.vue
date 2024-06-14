<template>
  <div id="app">
    <div v-if="!currentRoom">
      <button @click="createRoom">Create Room</button>
      <input v-model="roomIdInput" placeholder="Room ID" />
      <button @click="joinRoom">Join Room</button>
    </div>
    <div v-if="currentRoom && !name">
      <input v-model="nameInput" placeholder="Enter your name" />
      <button @click="setName">Submit</button>
    </div>
    <div v-if="currentRoom && name">
      <h3>Room: {{ currentRoom }}</h3>
      <p>Users:</p>
      <ul>
        <li v-for="(user, id) in users" :key="id">{{ user }}</li>
      </ul>
      <p>Select your vote:</p>
      <button
        v-for="num in fibonacci"
        :key="num"
        @click="vote(num)"
        :disabled="hasVoted"
      >
        {{ num }}
      </button>
      <button @click="revealVotes" :disabled="!canRevealVotes">
        Show Results
      </button>
      <button @click="clearVotes">Clear Votes</button>
      <div v-if="showVotes">
        <p>Votes:</p>
        <ul>
          <li v-for="(vote, user) in votes" :key="user">
            {{ users[user] }}: {{ vote }}
          </li>
        </ul>
        <p>Average: {{ average }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { io } from "socket.io-client";

export default {
  data() {
    return {
      socket: null,
      name: "",
      nameInput: "",
      roomIdInput: "",
      currentRoom: null,
      users: {},
      votes: {},
      average: null,
      showVotes: false,
      fibonacci: [1, 2, 3, 5, 8, 13, 21],
    };
  },
  computed: {
    hasVoted() {
      return this.votes[this.socket.id] !== undefined;
    },
    canRevealVotes() {
      return Object.keys(this.votes).length === Object.keys(this.users).length;
    },
  },
  mounted() {
    this.socket = io("http://localhost:4000");
    this.socket.on("roomCreated", (room) => {
      this.currentRoom = room;
    });
    this.socket.on("roomJoined", (room) => {
      this.currentRoom = room;
    });
    this.socket.on("updateUsers", (users) => {
      this.users = users;
    });
    this.socket.on("updateVotes", (votesCount) => {
      if (!this.showVotes) {
        this.votes = Array(votesCount).fill("?");
      }
    });
    this.socket.on("revealVotes", ({ votes, average }) => {
      this.showVotes = true;
      this.votes = votes;
      this.average = average;
    });
  },
  methods: {
    createRoom() {
      const room = Math.random().toString(36).substring(2, 9);
      this.socket.emit("createRoom", room);
    },
    joinRoom() {
      this.socket.emit("joinRoom", this.roomIdInput);
    },
    setName() {
      if (this.nameInput.trim()) {
        this.name = this.nameInput.trim();
        this.socket.emit("setName", {
          room: this.currentRoom,
          name: this.name,
        });
      }
    },
    vote(num) {
      this.socket.emit("vote", { room: this.currentRoom, vote: num });
    },
    revealVotes() {
      this.socket.emit("revealVotes", this.currentRoom);
    },
    clearVotes() {
      this.showVotes = false;
      this.votes = {};
      this.socket.emit("clearVotes", this.currentRoom);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
