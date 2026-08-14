import type { RgbColorLike } from "./types";
/**
 * Parses and represents an RGB color using byte-clamped channels.
 *
 * Supported inputs include CSS color names, `rgb()` values, and three- or
 * six-digit hexadecimal values.
 */
export declare class RgbColor implements RgbColorLike {
    #private;
    /** Indicates whether the constructor input was parsed successfully. */
    ok: boolean;
    /**
     * Creates an RGB color.
     *
     * Invalid or omitted input produces black channels and sets {@link ok}
     * to `false`.
     *
     * @param input - Color name, `rgb()` value, or hexadecimal value.
     */
    constructor(input?: string);
    /** Returns the color formatted as `rgb(r, g, b)`. */
    toRGB(): string;
    /** Returns the color formatted as a six-digit hexadecimal value. */
    toHex(): string;
    /**
     * Blends this color over a background color and mutates its channels.
     *
     * @param alpha - Foreground opacity.
     * @param background - Background RGB color.
     * @returns The blended color as a hexadecimal value.
     */
    flattenRGBA(alpha: number | string, background: RgbColorLike): string;
    /** Red channel in the inclusive range from 0 to 255. */
    get r(): number;
    set r(value: number);
    /** Green channel in the inclusive range from 0 to 255. */
    get g(): number;
    set g(value: number);
    /** Blue channel in the inclusive range from 0 to 255. */
    get b(): number;
    set b(value: number);
}
//# sourceMappingURL=RgbColor.d.ts.map