path = require("path")
console.log(path.join(__dirname, "src/"))
module.exports = {
  contracts_build_directory: path.join(__dirname, "src/contracts"),
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: 5777 // Match any network id
    }
  },
  compilers: {
    solc: {
      version: "0.8.0",    // Fetch exact version from solc-bin (default: truffle's version)
    },
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}