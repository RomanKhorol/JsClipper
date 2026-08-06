/** A mutable object containing red, green, and blue color channels. */
export interface RgbColorLike {
  /** Red channel in the inclusive range from 0 to 255. */
  r: number;

  /** Green channel in the inclusive range from 0 to 255. */
  g: number;

  /** Blue channel in the inclusive range from 0 to 255. */
  b: number;
}

/**
 * Internal byte-clamped storage for RGB channels.
 *
 * Channel order is red, green, then blue.
 *
 * @internal
 */
export type ColorChannels = Uint8ClampedArray;
