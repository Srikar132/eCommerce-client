// ESLint configuration snippet for ProductForm components
// Add this to your .eslintrc or eslint.config.mjs to suppress form-related type assertion warnings

module.exports = {
    rules: {
        // Allow 'any' type in form components for react-hook-form compatibility
        "@typescript-eslint/no-explicit-any": "off",
    },
    overrides: [
        {
            files: ["**/product-form*.tsx", "**/use-product-form*.ts"],
            rules: {
                "@typescript-eslint/no-explicit-any": "off",
            },
        },
    ],
};