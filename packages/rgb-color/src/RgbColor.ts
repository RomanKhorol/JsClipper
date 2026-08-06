import { HEX_PATTERN, RGB_PATTERN, SHORT_HEX_PATTERN } from "./constants";
import { isNamedColorName, NamedColor } from "./namedColors";
import type { ColorChannels, RgbColorLike } from "./types";

/**
 * Parses and represents an RGB color using byte-clamped channels.
 *
 * Supported inputs include CSS color names, `rgb()` values, and three- or
 * six-digit hexadecimal values.
 */
export class RgbColor implements RgbColorLike {
  /** Indicates whether the constructor input was parsed successfully. */
  public ok = false;

  readonly #channels: ColorChannels;

  /**
   * Creates an RGB color.
   *
   * Invalid or omitted input produces black channels and sets {@link ok}
   * to `false`.
   *
   * @param input - Color name, `rgb()` value, or hexadecimal value.
   */
  public constructor(input = "") {
    this.#channels = new Uint8ClampedArray([0, 0, 0]);

    const value = RgbColor.#normalizeInput(input);
    const channels =
      RgbColor.#parseRgb(value) ??
      RgbColor.#parseHex(value) ??
      RgbColor.#parseShortHex(value);

    if (!channels) {
      return;
    }

    this.#channels.set(channels);
    this.ok = true;
  }

  /** Returns the color formatted as `rgb(r, g, b)`. */
  public toRGB(): string {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }

  /** Returns the color formatted as a six-digit hexadecimal value. */
  public toHex(): string {
    return `#${RgbColor.#toHexChannel(this.r)}${RgbColor.#toHexChannel(
      this.g
    )}${RgbColor.#toHexChannel(this.b)}`;
  }

  /**
   * Blends this color over a background color and mutates its channels.
   *
   * @param alpha - Foreground opacity.
   * @param background - Background RGB color.
   * @returns The blended color as a hexadecimal value.
   */
  public flattenRGBA(alpha: number | string, background: RgbColorLike): string {
    const foregroundAlpha = Number.parseFloat(String(alpha));
    const backgroundAlpha = 1 - foregroundAlpha;

    this.r = Math.round(
      foregroundAlpha * this.r + backgroundAlpha * background.r
    );
    this.g = Math.round(
      foregroundAlpha * this.g + backgroundAlpha * background.g
    );
    this.b = Math.round(
      foregroundAlpha * this.b + backgroundAlpha * background.b
    );

    return this.toHex();
  }

  /** Red channel in the inclusive range from 0 to 255. */
  public get r(): number {
    return this.#channels[0]!;
  }

  public set r(value: number) {
    this.#channels[0] = value;
  }

  /** Green channel in the inclusive range from 0 to 255. */
  public get g(): number {
    return this.#channels[1]!;
  }

  public set g(value: number) {
    this.#channels[1] = value;
  }

  /** Blue channel in the inclusive range from 0 to 255. */
  public get b(): number {
    return this.#channels[2]!;
  }

  public set b(value: number) {
    this.#channels[2] = value;
  }

  static #parseChannels(
    value: string,
    pattern: RegExp,
    radix: 10 | 16,
    expand = false
  ): ColorChannels | null {
    const channels = pattern.exec(value)?.slice(1, 4);
    const isValid =
      channels &&
      channels.length === 3 &&
      !channels.some((channel) => channel === undefined);
    return isValid
      ? new Uint8ClampedArray(
          channels.map((channel) =>
            Number.parseInt(expand ? channel.repeat(2) : channel, radix)
          )
        )
      : null;
  }

  static #parseRgb(value: string): ColorChannels | null {
    return RgbColor.#parseChannels(value, RGB_PATTERN, 10);
  }

  static #parseHex(value: string): ColorChannels | null {
    return RgbColor.#parseChannels(value, HEX_PATTERN, 16);
  }

  static #parseShortHex(value: string): ColorChannels | null {
    return RgbColor.#parseChannels(value, SHORT_HEX_PATTERN, 16, true);
  }

  static #normalizeInput(input: string): string {
    const value = input.replace(/\s/g, "").toLowerCase();

    return isNamedColorName(value)
      ? NamedColor[value].slice(1)
      : value.startsWith("#")
      ? value.slice(1, 7)
      : value;
  }

  static #toHexChannel(value: number): string {
    return value.toString(16).padStart(2, "0");
  }
}
