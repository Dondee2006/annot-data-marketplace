/**
 * Calculate tokens earned for a file upload
 * Base: 5 tokens
 * Bonus: +2 tokens if file size > 100KB
 */
export function calculateTokens({ size_mb, file_type }: { size_mb: number; file_type: string }): number {
    let tokens = 5; // Base tokens

    // Bonus for files larger than 100KB (0.1 MB)
    if (size_mb > 0.1) {
        tokens += 2;
    }

    // Future: Add more bonuses based on file_type or quality
    // Example: Premium file types could earn more tokens

    return tokens;
}

/**
 * Calculate tokens from file size in bytes
 */
export function calculateTokensFromBytes(sizeBytes: number, fileType: string): number {
    const sizeMb = sizeBytes / 1048576;
    return calculateTokens({ size_mb: sizeMb, file_type: fileType });
}
