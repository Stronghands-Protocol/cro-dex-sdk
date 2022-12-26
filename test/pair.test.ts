import { ChainId, Token, Pair, TokenAmount, WETH, Price } from '../src'

describe('Pair', () => {
  const USDC = new Token(ChainId.MAINNET, '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59', 6, 'USDC', 'USD Coin')
  const DAI = new Token(ChainId.MAINNET, '0xF2001B145b43032AAF5Ee2884e456CCd805F677D', 18, 'DAI', 'DAI Stablecoin')

  describe('#getAddress', () => {
    it('returns the correct address', () => {
      expect(Pair.getAddress(DAI, USDC)).toEqual('0x40B358F1D052DeDC6c90a78E7Fb0194E04c89131')
    })
  })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '100')).token0).toEqual(USDC)
      expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100')).token0).toEqual(USDC)
    })
  })
  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '100')).token1).toEqual(DAI)
      expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100')).token1).toEqual(DAI)
    })
  })
  describe('#reserve0', () => {
    it('always comes from the token that sorts before', () => {
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '101')).reserve0).toEqual(
        new TokenAmount(USDC, '101')
      )
      expect(new Pair(new TokenAmount(USDC, '101'), new TokenAmount(DAI, '100')).reserve0).toEqual(
        new TokenAmount(USDC, '101')
      )
    })
  })
  describe('#reserve1', () => {
    it('always comes from the token that sorts after', () => {
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '101')).reserve1).toEqual(
        new TokenAmount(DAI, '100')
      )
      expect(new Pair(new TokenAmount(USDC, '101'), new TokenAmount(DAI, '100')).reserve1).toEqual(
        new TokenAmount(DAI, '100')
      )
    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(new Pair(new TokenAmount(DAI, '101'), new TokenAmount(USDC, '100')).token0Price).toEqual(
        new Price(USDC, DAI, '100', '101')
      )
      expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '101')).token0Price).toEqual(
        new Price(USDC, DAI, '100', '101')
      )
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(new Pair(new TokenAmount(DAI, '101'), new TokenAmount(USDC, '100')).token1Price).toEqual(
        new Price(DAI, USDC, '101', '100')
      )
      expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '101')).token1Price).toEqual(
        new Price(DAI, USDC, '101', '100')
      )
    })
  })

  describe('#priceOf', () => {
    const pair = new Pair(new TokenAmount(DAI, '101'), new TokenAmount(USDC, '100'))
    it('returns price of token in terms of other token', () => {
      expect(pair.priceOf(USDC)).toEqual(pair.token0Price)
      expect(pair.priceOf(DAI)).toEqual(pair.token1Price)
    })

    it('throws if invalid token', () => {
      expect(() => pair.priceOf(WETH[ChainId.MAINNET])).toThrow('TOKEN')
    })
  })

  describe('#reserveOf', () => {
    it('returns reserves of the given token', () => {
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '101')).reserveOf(DAI)).toEqual(
        new TokenAmount(DAI, '100')
      )
      expect(new Pair(new TokenAmount(USDC, '101'), new TokenAmount(DAI, '100')).reserveOf(DAI)).toEqual(
        new TokenAmount(DAI, '100')
      )
    })

    it('throws if not in the pair', () => {
      expect(() =>
        new Pair(new TokenAmount(USDC, '101'), new TokenAmount(DAI, '100')).reserveOf(WETH[ChainId.MAINNET])
      ).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '100')).chainId).toEqual(ChainId.MAINNET)
      expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100')).chainId).toEqual(ChainId.MAINNET)
    })
  })
  describe('#involvesToken', () => {
    expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '100')).involvesToken(DAI)).toEqual(true)
    expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '100')).involvesToken(USDC)).toEqual(true)
    expect(
      new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '100')).involvesToken(WETH[ChainId.MAINNET])
    ).toEqual(false)
  })
})
