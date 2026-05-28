// Use require to avoid TS module resolution issues when types are missing
const { io } = require("socket.io-client");

const socket = io("https://github.com/ViditGupta0603/auctra-backend");

export default socket;