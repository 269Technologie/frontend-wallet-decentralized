import * as bip39 from 'bip39';

// bip32 and tiny-secp256k1 are dynamically imported inside the function to avoid
// Rollup/Vite resolving them at build-time in environments where node polyfills
// are unavailable (CI/browser builds). This keeps the bundle smaller and ensures
// the utility only loads when used (client-side, offline detection).

export type DerivationResult = {
  derivation: 'bip44' | 'bip49' | 'bip84';
  index: number;
  path: string;
  address: string;
};

export async function findDerivationLocal(mnemonic: string, targetAddress: string, maxIndex = 5): Promise<DerivationResult | null> {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Mnemonic invalide');
  }
  // dynamic import of bip32, tiny-secp256k1 and bitcoinjs-lib
  const [{ BIP32Factory }, tinySecp, bitcoin] = await Promise.all([
    import('bip32'),
    import('tiny-secp256k1'),
    import('bitcoinjs-lib'),
  ] as any);
  const ecc = (tinySecp && (tinySecp.default || tinySecp)) as any;
  const bip32 = BIP32Factory(ecc as any);

  const seed = await bip39.mnemonicToSeed(mnemonic);
  const root = bip32.fromSeed(seed, (bitcoin && bitcoin.networks && bitcoin.networks.bitcoin) || ({} as any));

  const paths: Record<string, string> = {
    bip44: "m/44'/0'/0'/0/",
    bip49: "m/49'/0'/0'/0/",
    bip84: "m/84'/0'/0'/0/",
  };

  for (const [name, base] of Object.entries(paths)) {
    for (let i = 0; i <= maxIndex; i++) {
      const child = root.derivePath(base + i);
      let addr: string | undefined;
      try {
        if (name === 'bip84') {
          addr = bitcoin.payments.p2wpkh({ pubkey: Buffer.from(child.publicKey), network: bitcoin.networks.bitcoin }).address;
        } else if (name === 'bip49') {
          const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: Buffer.from(child.publicKey), network: bitcoin.networks.bitcoin });
          addr = bitcoin.payments.p2sh({ redeem: p2wpkh, network: bitcoin.networks.bitcoin }).address;
        } else {
          addr = bitcoin.payments.p2pkh({ pubkey: Buffer.from(child.publicKey), network: bitcoin.networks.bitcoin }).address;
        }
      } catch (e) {
        // ignore derivation errors and continue
        addr = undefined;
      }
      if (addr === targetAddress) {
        return {
          derivation: name as any,
          index: i,
          path: base + i,
          address: addr,
        };
      }
    }
  }
  return null;
}
