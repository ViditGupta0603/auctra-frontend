// Use require to avoid TS module resolution issues when types are missing
const { io } = require("socket.io-client");

const socket = io("https://auctra-backend-gunz.onrender.com");

export default socket;