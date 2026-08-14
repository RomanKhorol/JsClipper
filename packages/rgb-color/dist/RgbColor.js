import { HEX_PATTERN, RGB_PATTERN, SHORT_HEX_PATTERN } from "./constants";
import { isNamedColorName, NamedColor } from "./namedColors";
/**
 * Parses and represents an RGB color using byte-clamped channels.
 *
 * Supported inputs include CSS color names, `rgb()` values, and three- or
 * six-digit hexadecimal values.
 */
export class RgbColor {
    /** Indicates whether the constructor input was parsed successfully. */
    ok = false;
    #channels;
    /**
     * Creates an RGB color.
     *
     * Invalid or omitted input produces black channels and sets {@link ok}
     * to `false`.
     *
     * @param input - Color name, `rgb()` value, or hexadecimal value.
     */
    constructor(input = "") {
        this.#channels = new Uint8ClampedArray([0, 0, 0]);
        const value = RgbColor.#normalizeInput(input);
        const channels = RgbColor.#parseRgb(value) ??
            RgbColor.#parseHex(value) ??
            RgbColor.#parseShortHex(value);
        if (!channels) {
            return;
        }
        this.#channels.set(channels);
        this.ok = true;
    }
    /** Returns the color formatted as `rgb(r, g, b)`. */
    toRGB() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }
    /** Returns the color formatted as a six-digit hexadecimal value. */
    toHex() {
        return `#${RgbColor.#toHexChannel(this.r)}${RgbColor.#toHexChannel(this.g)}${RgbColor.#toHexChannel(this.b)}`;
    }
    /**
     * Blends this color over a background color and mutates its channels.
     *
     * @param alpha - Foreground opacity.
     * @param background - Background RGB color.
     * @returns The blended color as a hexadecimal value.
     */
    flattenRGBA(alpha, background) {
        const foregroundAlpha = Number.parseFloat(String(alpha));
        const backgroundAlpha = 1 - foregroundAlpha;
        this.r = Math.round(foregroundAlpha * this.r + backgroundAlpha * background.r);
        this.g = Math.round(foregroundAlpha * this.g + backgroundAlpha * background.g);
        this.b = Math.round(foregroundAlpha * this.b + backgroundAlpha * background.b);
        return this.toHex();
    }
    /** Red channel in the inclusive range from 0 to 255. */
    get r() {
        return this.#channels[0];
    }
    set r(value) {
        this.#channels[0] = value;
    }
    /** Green channel in the inclusive range from 0 to 255. */
    get g() {
        return this.#channels[1];
    }
    set g(value) {
        this.#channels[1] = value;
    }
    /** Blue channel in the inclusive range from 0 to 255. */
    get b() {
        return this.#channels[2];
    }
    set b(value) {
        this.#channels[2] = value;
    }
    static #parseChannels(value, pattern, radix, expand = false) {
        const channels = pattern.exec(value)?.slice(1, 4);
        const isValid = channels &&
            channels.length === 3 &&
            !channels.some((channel) => channel === undefined);
        return isValid
            ? new Uint8ClampedArray(channels.map((channel) => Number.parseInt(expand ? channel.repeat(2) : channel, radix)))
            : null;
    }
    static #parseRgb(value) {
        return RgbColor.#parseChannels(value, RGB_PATTERN, 10);
    }
    static #parseHex(value) {
        return RgbColor.#parseChannels(value, HEX_PATTERN, 16);
    }
    static #parseShortHex(value) {
        return RgbColor.#parseChannels(value, SHORT_HEX_PATTERN, 16, true);
    }
    static #normalizeInput(input) {
        const value = input.replace(/\s/g, "").toLowerCase();
        return isNamedColorName(value)
            ? NamedColor[value].slice(1)
            : value.startsWith("#")
                ? value.slice(1, 7)
                : value;
    }
    static #toHexChannel(value) {
        return value.toString(16).padStart(2, "0");
    }
}
//# sourceMappingURL=RgbColor.js.map