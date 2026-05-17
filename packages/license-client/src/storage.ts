/**
 * License Storage Handler
 * Manages license file persistence in ~/.syncpulse directory
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import { LicensePayload } from './types.js';
import crypto from 'crypto';

const DEFAULT_STORAGE_DIR = path.join(os.homedir(), '.syncpulse');

export class LicenseStorage {
  private static customStorageDir: string | null = null;

  /**
   * Set a custom storage directory (for testing)
   */
  static setStoragePath(dir: string | null): void {
    this.customStorageDir = dir;
  }

  /**
   * Get the storage directory path
   */
  static getStoragePath(): string {
    return this.customStorageDir || DEFAULT_STORAGE_DIR;
  }

  private static getLicenseFile(): string {
    return path.join(this.getStoragePath(), 'license.jwt');
  }

  private static getLicenseCacheFile(): string {
    return path.join(this.getStoragePath(), 'license.json');
  }

  private static getMachineIdFile(): string {
    return path.join(this.getStoragePath(), 'machine-id');
  }

  /**
   * Ensure storage directory exists with proper permissions
   */
  static ensureStorageDirectory(): void {
    try {
      const storageDir = this.getStoragePath();
      if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir, { recursive: true, mode: 0o700 });
      }

      // Ensure directory has restrictive permissions (0700 = rwx------)
      fs.chmodSync(storageDir, 0o700);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to create license storage directory: ${errorMessage}`);
    }
  }

  /**
   * Save license JWT token to storage
   */
  static saveLicense(token: string): void {
    try {
      this.ensureStorageDirectory();

      // Write with restrictive permissions (0600 = rw-------)
      fs.writeFileSync(this.getLicenseFile(), token, {
        mode: 0o600,
        encoding: 'utf-8'
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to save license: ${errorMessage}`);
    }
  }

  /**
   * Load license JWT token from storage
   */
  static loadLicense(): string | null {
    try {
      const licenseFile = this.getLicenseFile();
      if (!fs.existsSync(licenseFile)) {
        return null;
      }

      const token = fs.readFileSync(licenseFile, 'utf-8').trim();
      return token || null;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to load license: ${errorMessage}`);
    }
  }

  /**
   * Save parsed license cache for offline validation
   */
  static saveLicenseCache(payload: LicensePayload): void {
    try {
      this.ensureStorageDirectory();

      const cacheData = {
        payload,
        cached_at: new Date().toISOString(),
        cache_version: 1
      };

      fs.writeFileSync(this.getLicenseCacheFile(), JSON.stringify(cacheData, null, 2), {
        mode: 0o600,
        encoding: 'utf-8'
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to save license cache: ${errorMessage}`);
    }
  }

  /**
   * Load parsed license cache
   */
  static loadLicenseCache(): LicensePayload | null {
    try {
      const licenseCacheFile = this.getLicenseCacheFile();
      if (!fs.existsSync(licenseCacheFile)) {
        return null;
      }

      const data = fs.readFileSync(licenseCacheFile, 'utf-8');
      const parsed = JSON.parse(data);

      if (parsed.payload) {
        return parsed.payload;
      }

      return null;
    } catch (_err) {
      return null;
    }
  }

  /**
   * Clear all license files and cache
   */
  static clearLicense(): void {
    try {
      const licenseFile = this.getLicenseFile();
      const licenseCacheFile = this.getLicenseCacheFile();

      if (fs.existsSync(licenseFile)) {
        fs.unlinkSync(licenseFile);
      }

      if (fs.existsSync(licenseCacheFile)) {
        fs.unlinkSync(licenseCacheFile);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to clear license: ${errorMessage}`);
    }
  }

  /**
   * Get or generate a consistent machine ID for this device
   */
  static getMachineId(): string {
    try {
      const machineIdFile = this.getMachineIdFile();
      // Try to load existing machine ID
      if (fs.existsSync(machineIdFile)) {
        const machineId = fs.readFileSync(machineIdFile, 'utf-8').trim();
        if (machineId) {
          return machineId;
        }
      }

      // Generate new machine ID based on system info
      const machineId = this.generateMachineId();

      // Save it for future use
      this.ensureStorageDirectory();
      fs.writeFileSync(machineIdFile, machineId, {
        mode: 0o600,
        encoding: 'utf-8'
      });

      return machineId;
    } catch (_err) {
      // If we can't persist, generate and return a temporary one
      return this.generateMachineId();
    }
  }

  /**
   * Generate a unique machine ID based on system information
   */
  private static generateMachineId(): string {
    try {
      const hostname = os.hostname();
      const platform = os.platform();
      const arch = os.arch();
      const userInfo = os.userInfo();

      // Combine system identifiers
      const identifier = `${hostname}-${platform}-${arch}-${userInfo.uid}`;

      // Hash it to create a consistent but anonymized ID
      const hash = crypto
        .createHash('sha256')
        .update(identifier)
        .digest('hex')
        .substring(0, 32);

      return `machine_${hash}`;
    } catch {
      // Fallback: generate random ID
      return `machine_${crypto.randomBytes(16).toString('hex')}`;
    }
  }

  /**
   * Check if license file exists
   */
  static hasLicense(): boolean {
    return fs.existsSync(this.getLicenseFile());
  }

  /**
   * Get license file modification time
   */
  static getLicenseModificationTime(): Date | null {
    try {
      const licenseFile = this.getLicenseFile();
      if (fs.existsSync(licenseFile)) {
        const stats = fs.statSync(licenseFile);
        return stats.mtime;
      }
      return null;
    } catch {
      return null;
    }
  }
}
