const Multiaddr = require('multiaddr')
const shuffle = require('array-shuffle')
const log = require('debug')('ipfs-swarm-bind-shim')

// Say connected to one or more of the passed addrs
module.exports = async (ipfs, addrs, options) => {
  options = options || {}

  const minConnections = options.minConnections
    ? Math.min(options.minConnections, addrs.length)
    : addrs.length

  const checkInterval = options.checkInterval || 1000 * 60

  addrs = addrs.map(a => Multiaddr(a))

  let timeoutId
  let canceled = false

  const checkAndConnect = async () => {
    const peers = await ipfs.swarm.peers()
    if (canceled) return

    const unconnectedAddrs = shuffle(addrs)
      .filter(addr => {
        const peerId = addr.getPeerId()
        const isConnected = peers.some(({ peer }) => (
          peer.toB58String() === peerId
        ))
        return !isConnected
      })

    const connectedCount = addrs.length - unconnectedAddrs.length

    if (minConnections - connectedCount > 0) {
      log(`${connectedCount} of ${addrs.length} addresses connected (target ${minConnections})`)

      await Promise.all(
        unconnectedAddrs
          .slice(0, minConnections - connectedCount)
          .map(addr => (async () => {
            try {
              log(`connecting to ${addr}`)
              await ipfs.swarm.connect(addr)
            } catch (err) {
              log(`failed to connect to ${addr}`, err)
            }
          })())
      )
    }

    if (!canceled) {
      timeoutId = setTimeout(checkAndConnect, checkInterval)
    }
  }

  await checkAndConnect()

  return () => {
    clearTimeout(timeoutId)
    canceled = true
  }
}
