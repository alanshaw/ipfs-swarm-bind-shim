# ipfs-swarm-bind-shim

[![Build Status](https://travis-ci.org/alanshaw/ipfs-swarm-bind-shim.svg?branch=master)](https://travis-ci.org/alanshaw/ipfs-swarm-bind-shim)
[![dependencies Status](https://david-dm.org/alanshaw/ipfs-swarm-bind-shim/status.svg)](https://david-dm.org/alanshaw/ipfs-swarm-bind-shim)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> A poor mans shim for a missing swarm.bind command

Stay connected to a minimum number of peers. Periodically checks for connectivity and if not connected to the minimum it'll (re)connect.

**⚠️ No tests yet! Might not even work!**

## Install

```sh
npm install ipfs-swarm-bind-shim
```

## Usage

```js
const swarmBind = require('ipfs-swarm-bind-shim')
```

### Example

```js
// addresses of peers we want to stay connected to
// n.b. must include peer ID!
const addrs = [
  '/ip4/127.0.0.1/tcp/63372/p2p/QmXGb4JumMVSFc66Fz6q3XiUQbGdyU4WCHjrLykQD9p8SQ',
  '/ip4/127.0.0.1/tcp/63362/p2p/QmeqriW5H3G7KBo41U3pTyNdCq5iE19SH4oVeuxAQ3iHz2',
  '/ip4/127.0.0.1/tcp/63391/p2p/QmbtWfdGpeT9YVWZ4gajg2c4hA1UVrgqiFuLF2CgJmGv23'
]

const cancel = await swarmBind(ipfs, addrs, {
  minConnections: 1, // minimum number of peers from the list this node should be connected to (default addrs.length)
  checkInterval: 1000 * 60 // (ms) time between connectivity checks
})

// ipfs will now be connected to minConnections peers
// and will monitor and re-connect.

// later...

cancel() // unbind (stop checking and connecting)
```

## Contribute

Feel free to dive in! [Open an issue](https://github.com/alanshaw/ipfs-swarm-bind-shim/issues/new) or submit PRs.

## License

[MIT](LICENSE) © Alan Shaw
