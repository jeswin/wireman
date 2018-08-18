import os = require("os");

export default function getOS() {
  const platform = os.platform();
  return platform === "linux"
    ? "linux"
    : platform === "darwin"
      ? "osx"
      : "unsupported";
}
