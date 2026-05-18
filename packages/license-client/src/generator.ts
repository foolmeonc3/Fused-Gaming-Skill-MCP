import { createPrivateKey, sign } from 'crypto';
import { LicensePayload, TrialLicenseOptions, CommercialLicenseOptions } from './types.js';
import { LicenseStorage } from './storage.js';

export class LicenseGenerator {
  private static readonly DEFAULT_TRIAL_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC83ValQN0h3vBe
fdf9qce6WTY5h8rafRbIG+KWmaG9bB5D50ymLBFXRyx2Eruxnp08f1VIBD86dZ0c
evAS6VL3UHnpCtNFbfIHJUTg+/UHXB68CFFSBu23zBLgmx1Ur0QcEikHwm2NR16F
32ObNBMOgleWQFq+f6X0UmgWNT1wISkCbPba7iUehKyhh0uFhHiINaEgENz/w05f
eIOIjGOooKh0Jj0h34oSuQaR/cA/BdjV6dmNOVb1S6Zc0UnOltlasuNPUy9eqTAM
ZfkvXzw4T+x9WsYrgYMm+6yv8zdf4FZVd9eRSpVQmhvuNRC5+kO6G3jaNYBGgZks
HmxHou8TAgMBAAECggEAOPKAesmpI9pmHgfSBdGYwK6/s+8nEmRfZy1JUGG4rDYa
lhz7NqvY+rkiReP2JmOOQ7ydSV7Gdeka24iSNRGXi6z/ZW53L9sr/E2XjENMqdB0
D/xuEM64BRCKrKD44h0K62/qYUWV5OCdNr6Z+SVljZ1trYdwFTrGHnpumiupf9Jq
TPfVCptWZ7Oj+tjtIJ4eK1Lccmvgag7HJAHTIwHM2u3o0kxbBwJTNAmIraEFCZoQ
uY6Ukpd2K4dvzHQznS9l6XYKkWLEj0AG4JAjnk1NaLJMVfFnWQEwo7CGibUkw+W3
0YdiXHInpP8lCMw4plIOtoQV8x8gck+optXf3KAeSQKBgQD37CYQJG++AX0dGC3b
RPxnQSYkJgWfOBtHsnO6j5GyaR9PKsiN0DrJBeVwsJEKg8DKpToPapbpB+o4q7Wv
vNWqDOBycLxW1j50XjGxXayx04x+6NQTc5WEQzszF2qZamA4SyNAdxTarTrVfnPi
vdS1oUcAb7TECVspNJ9Mn5oc/QKBgQDDBJrZKAz7t673hLnIor0exVFT12/65SOW
I+R5UMz9Vc21KM7n2Vc0MBEmgYYroAzkYH+5vsdDVPw79bDJ3hqIaLQw5/ODJcIp
2n8a7MzHIDKHME+mPNgdWRTYwkPmCf0b6Z3tyQPxSuS/hqEmSGO5ij0tlhuW+aQq
DmTUTgMBTwKBgQDsf3uryGZD1X25JFiSI5O3F8G/l/mi8c2sLkIRhGUS0Q7J4WEh
TrLVEmfVgMlLQ3XEmaryC9bbgu5ekwYlFzinF9N/t6UiHQvEzBoRPO/BTrFmWsn7
qDXHzq6JRVwt7vjMmniNRUtCcx99izwW3skrXiax9t10aAxrGUSgvlswLQKBgGU1
kpd4raRFY8yZWUHDE5tQlDCK8lanbJyS7BP51yjyyttl3lt89EDlYUE2n0csvQQZ
ALCJTiinhnAnxiQ93E9G550qA7rgca/+8VAr7Oq6zv5SGEQR96bjgGouB8bvECjY
SVoKpL0pPSYY3LFdiEPWdoGeEZt827Hn3nRAOFcJAoGAfKdWurM7RuN4pF/XtX9I
rRC8+ifBQHv6J1RaZUDp1cO8uGDLaI41OTZINh1VLqLMbvOkxjq5AdrBTCrRtPo0
HRCGZ/goclpVCyeH6ZdSrG2JPDuQxYXe3Oe1e3Mm+ev0Zwp0nLsAtHoTmjK7lYHh
DsXz9GMRESdSNrsBPDzQA0E=
-----END PRIVATE KEY-----`;

  static generateTrialLicense(options: TrialLicenseOptions = {}): string {
    const days = options.days ?? 14;
    const product = options.product ?? 'syncpulse-cli';
    const version = options.version ?? '1.2.0';

    const now = new Date();
    const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const machineId = LicenseStorage.getMachineId();

    const payload: LicensePayload = {
      type: 'trial',
      issued_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      product,
      version,
      features: {
        concurrent_agents: 1,
        storage_gb: 10,
        team_members: 1,
        priority_support: false,
        custom_branding: false,
      },
      activation: {
        activated_at: now.toISOString(),
        machine_id: machineId,
        license_key: `trial_${Date.now()}`,
      },
    };

    return this.signLicense(payload, this.DEFAULT_TRIAL_KEY);
  }

  static generateCommercialLicense(options: CommercialLicenseOptions, privateKey: string): string {
    const now = new Date();

    const payload: LicensePayload = {
      type: options.type,
      issued_at: now.toISOString(),
      expires_at: options.expiresAt.toISOString(),
      product: 'syncpulse-cli',
      version: options.version ?? '1.2.0',
      features: options.features,
      activation: {
        activated_at: now.toISOString(),
        machine_id: options.machineId ?? LicenseStorage.getMachineId(),
        license_key: options.licenseKey,
      },
    };

    return this.signLicense(payload, privateKey);
  }

  static generateTeamLicense(options: CommercialLicenseOptions, privateKey: string): string {
    return this.generateCommercialLicense({ ...options, type: 'team' }, privateKey);
  }

  static generateEnterpriseLicense(options: CommercialLicenseOptions, privateKey: string): string {
    return this.generateCommercialLicense({ ...options, type: 'enterprise' }, privateKey);
  }

  private static signLicense(payload: LicensePayload, privateKey?: string): string {
    if (!privateKey) {
      throw new Error(
        'Commercial license signing requires a private key. ' +
        'Set via environment variable SYNCPULSE_PRIVATE_KEY or pass as parameter. ' +
        'For development, generate a key with: openssl genrsa -out key.pem 2048'
      );
    }

    const header = {
      alg: 'RS256',
      typ: 'JWT',
      kid: 'syncpulse-2026',
    };

    const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');

    const key = createPrivateKey({
      key: privateKey,
      format: 'pem',
    });

    const signature = sign('sha256', Buffer.from(`${headerB64}.${payloadB64}`), {
      key,
      format: 'pem',
      type: 'pkcs8',
    });

    const signatureB64 = signature.toString('base64url');
    return `${headerB64}.${payloadB64}.${signatureB64}`;
  }
}
