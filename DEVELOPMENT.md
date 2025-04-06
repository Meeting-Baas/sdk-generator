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
- Generates TypeScript tool files in `dist/generated-tools/`
- Creates tool definitions for each SDK method

### 4. Bundle Build

```bash
pnpm bundle:build
```

⚠️ **Important**: This command regenerates all tools using the Anthropic API before building the bundle.

This step:

- Builds the base SDK
- Regenerates all MPC tools (calling the Anthropic API)
- Compiles all tools to JavaScript
- Creates the necessary exports in the `dist/` directory

### 5. Bundle Without Regenerating Tools

If you've already generated the tools and want to avoid regenerating them (to save API calls or time), you can directly use the prepare-bundle script:

```bash
node scripts/prepare-bundle.js
```

This script:

- Takes existing TypeScript tool definitions from `dist/generated-tools/`
- Compiles them to JavaScript
- Creates the bundled exports without regenerating the tools

### 6. MPC Tools Registration (Optional)

```bash
pnpm tools:register
```

This step:

- Registers generated tools with an MPC server
- Requires `MPC_SERVER_URL` in `.env` (defaults to http://localhost:3000)
- Note: This requires the tools to be already bundled (run `node scripts/prepare-bundle.js` first)

### Common Workflows

#### Complete Development Workflow

For a complete development cycle from OpenAPI spec to bundled tools:

```bash
# 1. Update OpenAPI client
pnpm openapi:rebuild

# 2. Build the SDK
pnpm build

# 3. Generate MPC tools
pnpm tools:generate

# 4. Create the bundle (without regenerating tools)
node scripts/prepare-bundle.js

# 5. Test the bundle
pnpm bundle:test
```

#### Tools-Only Workflow

If you're only making changes to MPC tools:

```bash
# 1. Generate tools
pnpm tools:generate

# 2. Create the bundle (without regenerating)
node scripts/prepare-bundle.js
```

#### Quick Build for Publishing

There are now two main publishing-related scripts:

```bash
# 1. Prepare a full release (when making significant changes or version bumps)
pnpm prepare-release

# 2. Publish the package (after preparing it)
pnpm publish
```

The scripts do the following:

- **prepare-release**: Comprehensive preparation for a new release

  - Runs TypeScript linting
  - Builds the complete bundle (including regenerating tools)
  - Generates documentation
  - Use this when creating a new version or significant update

- **prepublishOnly**: Lightweight check before publishing
  - Only runs `bundle:test` to verify the package is correctly built
  - Does NOT rebuild anything or make API calls
  - This makes publishing faster and prevents unnecessary regeneration

This separation allows for:

1. Thorough preparation of releases when needed
2. Quick publishing without rebuilding everything
3. Prevention of unnecessary API calls to Anthropic during publishing

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
   - Built automatically during the bundling process
   - Included in the published package
   - Available via the `/tools` export path: `import { join_meeting_tool } from "@meeting-baas/sdk/tools"`

### Testing MPC Tools

You can test the generated and bundled tools using:

```bash
# Test the bundled tools
pnpm bundle:test

# Or create a simple test script
echo 'const { allTools } = require("./dist/tools"); console.log(`Loaded ${allTools.length} tools`);' > test.js
node test.js
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
├── mpc/            # MPC tools and types
├── tools-generator/ # MPC tools generation
└── index.ts        # Main entry point

dist/
├── index.js        # CommonJS bundle
├── index.mjs       # ES Module bundle
├── tools.js        # CommonJS tools bundle
├── tools.mjs       # ES Module tools bundle
└── generated-tools/ # Generated TypeScript tool definitions
```

## License

[MIT](LICENSE)
