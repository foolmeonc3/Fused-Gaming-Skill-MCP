/**
 * License Generator
 * Creates and signs license tokens
 */

import jwt from 'jsonwebtoken';
import { LicensePayload, LicenseFeatures, TrialLicenseOptions, CommercialLicenseOptions } from './types.js';
import { LicenseStorage } from './storage.js';

export class LicenseGenerator {
  private static privateKey: string | null = null;
  private static issuer: string = 'syncpulse.io';
  private static productName: string = 'syncpulse-cli';
  private static productVersion: string = '1.0.0';

  // Internal default key for trial license initialization only
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

  /**
   * Set the private key for signing licenses
   */
  static setPrivateKey(privateKey: string): void {
    this.privateKey = privateKey;
  }

  /**
   * Set the issuer claim
   */
  static setIssuer(issuer: string): void {
    this.issuer = issuer;
  }

  /**
   * Set product metadata
   */
  static setProductMetadata(name: string, version: string): void {
    this.productName = name;
    this.productVersion = version;
  }

  /**
   * Generate a trial license
   */
  static generateTrialLicense(options: TrialLicenseOptions = {}): string {
    const days = options.days || 14;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const payload: LicensePayload = {
      type: 'trial',
      issued_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      product: this.productName,
      version: this.productVersion,
      trial_days: days,
      features: this.getDefaultTrialFeatures(),
      iss: this.issuer
    };

    // Use default key for trial generation if no key is configured
    const keyToUse = this.privateKey || this.DEFAULT_TRIAL_KEY;
    return this.signLicense(payload, keyToUse);
  }

  /**
   * Generate a commercial license
   */
  static generateCommercialLicense(options: CommercialLicenseOptions): string {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year default
    const machineId = options.machineId || LicenseStorage.getMachineId();

    const payload: LicensePayload = {
      type: 'commercial',
      issued_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      product: this.productName,
      version: this.productVersion,
      sub: options.email,
      features: {
        ...this.getDefaultCommercialFeatures(),
        ...options.features
      },
      iss: this.issuer,
      activation: {
        activated_at: now.toISOString(),
        machine_id: machineId,
        license_key: options.licenseKey
      }
    };

    return this.signLicense(payload, this.privateKey);
  }

  /**
   * Generate a team license
   */
  static generateTeamLicense(customerId: string, email: string): string {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year default
    const machineId = LicenseStorage.getMachineId();

    const payload: LicensePayload = {
      type: 'team',
      issued_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      product: this.productName,
      version: this.productVersion,
      sub: email,
      features: this.getDefaultTeamFeatures(),
      iss: this.issuer,
      activation: {
        activated_at: now.toISOString(),
        machine_id: machineId,
        license_key: `team_${customerId}`
      }
    };

    return this.signLicense(payload, this.privateKey);
  }

  /**
   * Generate an enterprise license
   */
  static generateEnterpriseLicense(customerId: string, email: string): string {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year default
    const machineId = LicenseStorage.getMachineId();

    const payload: LicensePayload = {
      type: 'enterprise',
      issued_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      product: this.productName,
      version: this.productVersion,
      sub: email,
      features: this.getDefaultEnterpriseFeatures(),
      iss: this.issuer,
      activation: {
        activated_at: now.toISOString(),
        machine_id: machineId,
        license_key: `enterprise_${customerId}`
      }
    };

    return this.signLicense(payload, this.privateKey);
  }

  /**
   * Sign a license payload with RS256
   */
  static signLicense(payload: LicensePayload, privateKey?: string | null): string {
    const key = privateKey || this.privateKey;

    if (!key) {
      throw new Error('Private key not configured. Call setPrivateKey() first.');
    }

    try {
      const token = jwt.sign(payload, key, {
        algorithm: 'RS256',
        header: {
          alg: 'RS256',
          kid: 'syncpulse-2026'
        }
      });

      return token;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to sign license: ${errorMessage}`);
    }
  }

  /**
   * Get default features for trial licenses
   */
  private static getDefaultTrialFeatures(): LicenseFeatures {
    return {
      concurrent_agents: 1,
      storage_gb: 10,
      team_members: 1,
      priority_support: false,
      custom_branding: false
    };
  }

  /**
   * Get default features for commercial licenses
   */
  private static getDefaultCommercialFeatures(): LicenseFeatures {
    return {
      concurrent_agents: 5,
      storage_gb: 100,
      team_members: 1,
      priority_support: true,
      custom_branding: false
    };
  }

  /**
   * Get default features for team licenses
   */
  private static getDefaultTeamFeatures(): LicenseFeatures {
    return {
      concurrent_agents: 10,
      storage_gb: 500,
      team_members: 5,
      priority_support: true,
      custom_branding: false
    };
  }

  /**
   * Get default features for enterprise licenses
   */
  private static getDefaultEnterpriseFeatures(): LicenseFeatures {
    return {
      concurrent_agents: 100,
      storage_gb: 5000,
      team_members: 1000,
      priority_support: true,
      custom_branding: true
    };
  }
}
