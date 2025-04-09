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
- **Extracts schemas from the OpenAPI spec** for parameter validation

#### Schema Extraction

The tools generator extracts schemas from the OpenAPI specification to:

1. Generate accurate parameter definitions for MPC tools
2. Create JSON schemas for runtime validation
3. Support full type information including enums and complex objects

The extraction process:

- Maps OpenAPI types to JSON Schema types
- Preserves enum values, descriptions, and required fields
- Generates validation schemas that match the API contract

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
- Bundles parameter schemas and validation utilities

### 5. Bundle Without Regenerating Tools

If you've already generated the tools and want to avoid regenerating them (to save API calls or time), you can directly use the prepare-bundle script:

```bash
node scripts/prepare-bundle.js
```

This script:

- Takes existing TypeScript tool definitions from `dist/generated-tools/`
- Extracts parameter schemas and validation rules
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

#### Schema Validation Workflow

When adding or updating schema validation:

```bash
# 1. Modify schema-extractor.ts if needed
# 2. Generate tools with updated schemas
pnpm tools:generate

# 3. Create the bundle
node scripts/prepare-bundle.js

# 4. Test validation
pnpm bundle:test
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

2. **Schema Extraction**: The generator extracts schemas from the OpenAPI spec via `schema-extractor.ts`.

   - Automatically converts OpenAPI parameters to tool parameters
   - Preserves type information, enums, and validation constraints
   - Generates JSON schemas for runtime validation

3. **AI-Powered Generation**: When you run `pnpm tools:generate`, the system:

   - Analyzes all methods in the BaasClient SDK
   - Calls the Anthropic API with method signatures and example templates
   - Generates properly formatted MPC tool definitions for each SDK method
   - Writes these generated tools to the output directory (`dist/generated-tools`)

4. **Generated Tool Structure**: Each generated tool includes:

   - Properly defined parameters (with types, descriptions, and required flags)
   - Parameter conversion between snake_case (tool) and camelCase (SDK)
   - User-friendly formatting for complex responses
   - Comprehensive error handling
   - Schema definitions for validation

5. **Schema Validation**: The package includes validation utilities:

   - JSON Schema definitions for all tool parameters
   - Zod-based validation for type checking
   - Functions to validate parameters before API calls
   - Error reporting for invalid parameters

6. **Distribution**: All generated tools are:
   - Built automatically during the bundling process
   - Included in the published package
   - Available via the `/tools` export path: `import { join_meeting_tool } from "@meeting-baas/sdk/tools"`
   - Schema information available via `allSchemas` and `getSchemaByName`

### Testing MPC Tools

You can test the generated and bundled tools using:

```bash
# Test the bundled tools
pnpm bundle:test

# Or create a simple test script
echo 'const { allTools, allSchemas } = require("./dist/tools"); console.log(`Loaded ${allTools.length} tools with ${Object.keys(allSchemas).length} schemas`);' > test.js
node test.js
```

### Using Schema Validation

The SDK provides schema validation utilities that can be used to validate parameters before calling API methods:

```javascript
const { allSchemas, validateParameters } = require("@meeting-baas/sdk/tools");

// Get the schema for a specific tool
const joinMeetingSchema = allSchemas["join-meeting"];

// Validate parameters
const params = {
  api_key: "your-api-key",
  bot_name: "My Bot",
  meeting_url: "https://meet.google.com/abc-def-ghi",
  // Missing required parameter: reserved
};

const validation = validateParameters(params, joinMeetingSchema);
if (!validation.success) {
  console.error("Parameter validation failed:", validation.errors);
} else {
  console.log("Parameters are valid");
}
```

## Implementing Schema Extraction

To implement or update the schema extraction:

1. **Understand the OpenAPI Structure**:

   - The SDK is generated from an OpenAPI spec
   - The spec contains complete schema information for all endpoints

2. **Create/Modify Schema Extractor**:

   - Create `src/tools-generator/schema-extractor.ts` if it doesn't exist
   - Implement functions to extract parameter types from the OpenAPI-generated SDK

3. **Update Tools Generator**:

   - Modify `src/tools-generator/index.ts` to use the schema extractor
   - Update the tool generation templates to include schema information

4. **Update Bundle Preparation**:

   - Ensure `scripts/prepare-bundle.js` extracts schemas from generated tools
   - Generate proper JSON schemas for validation

5. **Add Validation Utilities**:
   - Create `src/mpc/validation.ts` with Zod-based validation utilities
   - Implement functions to validate parameters against schemas

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
├── generated/      # Generated OpenAPI client
│   └── baas/      # BaaS specific generated code
│       ├── api/   # Generated API classes
│       │   ├── calendars-api.ts
│       │   ├── default-api.ts
│       │   └── client.ts    # Auto-generated unified client
│       ├── models/ # Generated model types
│       ├── base.ts
│       ├── common.ts
│       └── configuration.ts
├── mpc/           # MPC tools and types
│   └── validation.ts # Schema validation utilities
├── tools-generator/ # MPC tools generation
│   └── schema-extractor.ts # OpenAPI schema extraction
└── index.ts       # Main entry point

dist/
├── index.js       # CommonJS bundle
├── index.mjs      # ES Module bundle
├── tools.js       # CommonJS tools bundle
├── tools.mjs      # ES Module tools bundle
└── generated-tools/ # Generated TypeScript tool definitions

scripts/
├── fetch-openapi.js     # Fetches latest OpenAPI spec
├── post-generate.js     # Post-generation processing
└── prepare-bundle.js    # Bundle preparation

Import paths:
├── "@meeting-baas/sdk"          # Main SDK (BaasClient)
├── "@meeting-baas/sdk/tools"    # MPC tools
└── "@meeting-baas/sdk/bundle"   # Complete bundle
```

## License

[MIT](LICENSE)
