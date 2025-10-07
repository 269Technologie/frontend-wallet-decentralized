import * as bip39 from 'bip39';
import { BIP32Factory } from 'bip32';
import ecc from 'tiny-secp256k1';
import * as bitcoin from 'bitcoinjs-lib';

const bip32 = BIP32Factory(ecc as any);

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
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const root = bip32.fromSeed(seed, bitcoin.networks.bitcoin);

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
