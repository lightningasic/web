# HardID Hardware Wallet

Fully open-source, air-gapped hardware wallet. Keys never leave the device —
what you see is what you sign.

## Technical Highlights

- **Dual EAL6+ Secure Elements** — Private keys live only inside certified EAL6+ secure elements. The MCU stores no key material whatsoever.
- **Air-Gapped** — No radio. Transactions and signatures move via QR code — the device is physically isolated from the network.
- **Clear Sign** — What you see is what you sign. Human-readable recipient, amount and contract intent on screen — no blind signing.
- **FIDO2 / U2F Passkeys** — Works as a security key on GitHub, Google and any WebAuthn site — in Chrome and Firefox, over USB.
- **Reproducible Builds** — Firmware, schematics and host tools are fully open source. Compile and compare hashes yourself — zero trust required.
- **Security Audited** — 25 rounds of security audit against the secure-core. No key self-destruction, ever — a stolen device is useless, a lost seed can always recover.

## Key Features

- Offline BIP39 seed generation — 12/18/24 words, displayed on screen only once, never exported.
- BIP32/BIP44 deterministic derivation with per-coin path isolation; independent digital-identity key paths.
- Clear Sign for BTC/UTXO (PSBT) and EVM (legacy, EIP-1559, EIP-712) — field-by-field confirmation, unknown calls flagged in red.
- M-of-N multisig coordination; each signer independently confirms the same intent on their own device.
- FIDO2/CTAP2 + U2F passkeys — one device, both a hardware wallet and a universal security key.
- RFC6979 deterministic signing with anti-exfiltration — no covert channels, host-verifiable.
- PIN with exponential backoff (capped at 24h) — no attempt limit, no self-destruction, never wipes your assets.
- Optional 25th-word passphrase hidden wallets and duress PIN decoy wallet.
- Secure boot with ECDSA firmware signature verification and anti-rollback version counter.
- Apache 2.0 licensed — open hardware, open firmware, open tools.

Source: https://github.com/lightningasic
Page: https://lightningasic.com/hardid.html