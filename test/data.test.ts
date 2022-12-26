import { ChainId, WETH, Token, Fetcher } from '../src'

// TODO: replace the provider in these tests
describe.skip('data', () => {
  it('Token', async () => {
    const token = await Fetcher.fetchTokenData(ChainId.MAINNET, '0xF2001B145b43032AAF5Ee2884e456CCd805F677D') // DAI
    expect(token.decimals).toEqual(18)
  })

  it('Pair', async () => {
    const token = new Token(ChainId.MAINNET, '0xF2001B145b43032AAF5Ee2884e456CCd805F677D', 18) // DAI
    const pair = await Fetcher.fetchPairData(WETH[ChainId.MAINNET], token)
    expect(pair.liquidityToken.address).toEqual('0xB81ca62EC9B7A9b019Ac2221288704E9FD6a9935')
  })
})
