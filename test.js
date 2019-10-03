import test from 'ava'
import IPFSFactory from 'ipfsd-ctl'
import IPFS from 'ipfs'

test.beforeEach(async t => {
  const factory = IPFSFactory.create({ type: 'proc', exec: IPFS })
  const nodes = await Promise.all([1, 2, 3].map(() => factory.spawn()))

  const swarmAddrs = await Promise.all(nodes.map(async ({ api }) => {
    const addrs = await api.swarm.localAddrs()
    return addrs[0]
  }))

  console.log({ swarmAddrs: swarmAddrs.map(a => a + '') })

  Object.assign(t.context, { nodes, swarmAddrs })
})

test.afterEach.always(t => Promise.all(t.context.nodes.map(n => n.stop())))

test('TODO', async t => {
  t.is(true, true)
})
