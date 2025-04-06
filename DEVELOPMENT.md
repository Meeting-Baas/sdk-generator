# Meeting BaaS SDK Development

This document contains development and contribution guidelines for the Meeting BaaS SDK.

## Prerequisites

- Node.js 18+
- pnpm
- Anthropic API key (for MPC tools generation)

## Setup

1. Clone the repository

```bash
git clone https://github.com/meeting-baas/sdk-generator.git
cd sdk-generator
```

2. Install dependencies

```bash
pnpm install
```

3. Create a `.env` file with required API keys:

```bash
# Required for MPC tools generation
ANTHROPIC_API_KEY=your_anthropic_api_key
DEBUG=true
```

## Build Process

The SDK build process consists of several steps, each with a specific purpose:

### 1. OpenAPI Client Generation

```bash
# Clean existing generated files
pnpm openapi:clean

# Generate TypeScript client from OpenAPI spec
pnpm openapi:generate

# Or run both in sequence
pnpm openapi:rebuild
```

This step:

- Cleans the `src/generated/baas` directory
- Fetches the latest OpenAPI spec
- Generates TypeScript client code using OpenAPI Generator

### 2. SDK Build

```bash
pnpm build
```

This step:

- Compiles the SDK using tsup
- Generates CommonJS, ESM, and TypeScript declaration files
- Outputs to `dist/` directory

### 3. MPC Tools Generation

```bash
pnpm tools:generate
```

This step:

- Uses Anthropic API to generate MPC tool definitions
- Requires `ANTHROPIC_API_KEY` in `.env`
- Generates tools in `dist/generated-tools/`
- Creates TypeScript definitions for each tool

### 4. MPC Tools Registration

```bash
pnpm tools:register
```

This step:

- Registers generated tools with an MPC server
- Requires `MPC_SERVER_URL` in `.env` (defaults to http://localhost:3000)
- Generates JSON-RPC registration payload

### 5. Bundle Build

```bash
pnpm bundle:build
```

This step:

- Compiles generated tools to JavaScript
- Creates a bundled package in `dist/`
- Generates index files for tools
- No LLM keys required

### Complete Build

```bash
# Run all steps in sequence
pnpm tools:rebuild
```

This runs:

1. `pnpm build`
2. `pnpm tools:generate`
3. `pnpm tools:register`

### Publishing

```bash
# Run linting and bundle build before publishing
pnpm prepublishOnly

# Publish to npm
pnpm publish
```

The `prepublishOnly` script:

- Runs TypeScript linting
- Builds the bundle
- No LLM keys required

## Environment Variables

Required environment variables for different steps:

```bash
# Required for MPC tools generation
ANTHROPIC_API_KEY=your_anthropic_api_key

# Optional for MPC tools registration
MPC_SERVER_URL=http://localhost:3000  # Default value
PROTOCOL_VERSION=1.0.0               # Optional
DEBUG=true                          # For verbose output
```

## MPC Tools Generation

The SDK includes an automatic MPC tool generation system that creates Claude Plugin (MPC) tools from SDK methods. These tools are now included by default in the package and can be accessed via the `/tools` export path.

### How MPC Tools Are Generated and Distributed

1. **Template-Based Generation**: The SDK uses example templates in `src/tools-generator/example-tool-templates.ts` to inform the tool generation process.

2. **AI-Powered Generation**: When you run `pnpm tools:generate`, the system:

   - Analyzes all methods in the BaasClient SDK
   - Calls the Anthropic API with method signatures and example templates
   - Generates properly formatted MPC tool definitions for each SDK method
   - Writes these generated tools to the output directory (`dist/generated-tools`)

3. **Generated Tool Structure**: Each generated tool includes:

   - Properly defined parameters (with types, descriptions, and required flags)
   - Parameter conversion between snake_case (tool) and camelCase (SDK)
   - User-friendly formatting for complex responses
   - Comprehensive error handling

4. **Distribution**: All generated tools are:
   - Built automatically as part of `pnpm bundle:build`
   - Included in the published package
   - Available via the `/tools` export path: `import { join_meeting_tool } from "@meeting-baas/sdk/tools"`

### Building With Tools

The build process now automatically includes MPC tools generation:

```bash
# Build the SDK with tools
pnpm bundle:build
```

This process:

1. Builds the base SDK
2. Generates MPC tools for all SDK methods
3. Bundles everything for distribution

### Using MPC Tools in Development

During development, you can test the tools by:

```bash
# Build the SDK and generate tools
pnpm bundle:build

# Test the tools with a local MPC server
pnpm bundle:test
```

## Contributing

We welcome contributions to the Meeting BaaS SDK! Please feel free to submit issues or pull requests.

### Development Guidelines

1. **Code Style**: Follow the existing TypeScript code style
2. **Testing**: Add tests for new features
3. **Documentation**: Update both README.md and DEVELOPMENT.md as needed
4. **Commits**: Use conventional commits format

### Pull Request Process

1. Create a feature branch
2. Make your changes
3. Run tests and build
4. Submit a pull request

## Project Structure

```
src/
├── baas/           # BaaS client implementation
├── generated/      # Generated OpenAPI client
├── mpc/           # MPC tools and types
├── tools-generator/ # MPC tools generation
└── index.ts       # Main entry point
```

## License

[MIT](LICENSE)
