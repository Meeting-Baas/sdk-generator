# Utools
Tools – Model Context Protocol Specification 

  [![Model Context Protocol Specification](https://spec.modelcontextprotocol.io/specification/2024-11-05/server/tools//images/light.svg) ![Model Context Protocol Specification](https://spec.modelcontextprotocol.io/specification/2024-11-05/server/tools//images/dark.svg)](/latest)[Specification (Draft)](/draft "Specification (Draft)") [Specification (Latest)](/latest "Specification (Latest)") [Resources](/resources "Resources")

 CTRL K

[GitHub](https://github.com/modelcontextprotocol/specification "GitHub")

 CTRL K

-   [Specification](/specification/)
    
    -   [Specification (Draft)](/specification/draft/)
        
        -   [Architecture](/specification/draft/architecture/)
        -   [Base Protocol](/specification/draft/basic/)
            
            -   [Transports](/specification/draft/basic/transports/)
            -   [Authorization](/specification/draft/basic/authorization/)
            -   [Messages](/specification/draft/basic/messages/)
            -   [Lifecycle](/specification/draft/basic/lifecycle/)
            -   [Versioning](/specification/draft/basic/versioning/)
            -   [Utilities](/specification/draft/basic/utilities/)
                
                -   [Ping](/specification/draft/basic/utilities/ping/)
                -   [Cancellation](/specification/draft/basic/utilities/cancellation/)
                -   [Progress](/specification/draft/basic/utilities/progress/)
                
            
        -   [Server Features](/specification/draft/server/)
            
            -   [Prompts](/specification/draft/server/prompts/)
            -   [Resources](/specification/draft/server/resources/)
            -   [Tools](/specification/draft/server/tools/)
            -   [Utilities](/specification/draft/server/utilities/)
                
                -   [Completion](/specification/draft/server/utilities/completion/)
                -   [Logging](/specification/draft/server/utilities/logging/)
                -   [Pagination](/specification/draft/server/utilities/pagination/)
                
            
        -   [Client Features](/specification/draft/client/)
            
            -   [Roots](/specification/draft/client/roots/)
            -   [Sampling](/specification/draft/client/sampling/)
            
        -   [Contributions](/specification/draft/contributing/)
        -   [Revisions](/specification/draft/revisions/)
            
            -   [2024-11-05 (Current)](/specification/draft/revisions/2024-11-05/)
            
        
    -   [Specification (Latest)](/specification/2024-11-05/)
        
        -   [Architecture](/specification/2024-11-05/architecture/)
        -   [Base Protocol](/specification/2024-11-05/basic/)
            
            -   [Messages](/specification/2024-11-05/basic/messages/)
            -   [Lifecycle](/specification/2024-11-05/basic/lifecycle/)
            -   [Transports](/specification/2024-11-05/basic/transports/)
            -   [Versioning](/specification/2024-11-05/basic/versioning/)
            -   [Utilities](/specification/2024-11-05/basic/utilities/)
                
                -   [Ping](/specification/2024-11-05/basic/utilities/ping/)
                -   [Cancellation](/specification/2024-11-05/basic/utilities/cancellation/)
                -   [Progress](/specification/2024-11-05/basic/utilities/progress/)
                
            
        -   [Server Features](/specification/2024-11-05/server/)
            
            -   [Prompts](/specification/2024-11-05/server/prompts/)
            -   [Resources](/specification/2024-11-05/server/resources/)
            -   [Tools](/specification/2024-11-05/server/tools/)
                -   [User Interaction Model](#user-interaction-model)
                -   [Capabilities](#capabilities)
                -   [Protocol Messages](#protocol-messages)
                -   [Message Flow](#message-flow)
                -   [Data Types](#data-types)
                -   [Error Handling](#error-handling)
                -   [Security Considerations](#security-considerations)
            -   [Utilities](/specification/2024-11-05/server/utilities/)
                
                -   [Completion](/specification/2024-11-05/server/utilities/completion/)
                -   [Logging](/specification/2024-11-05/server/utilities/logging/)
                -   [Pagination](/specification/2024-11-05/server/utilities/pagination/)
                
            
        -   [Client Features](/specification/2024-11-05/client/)
            
            -   [Roots](/specification/2024-11-05/client/roots/)
            -   [Sampling](/specification/2024-11-05/client/sampling/)
            
        -   [Contributions](/specification/2024-11-05/contributing/)
        -   [Revisions](/specification/2024-11-05/revisions/)
            
            -   [2024-11-05 (Current)](/specification/2024-11-05/revisions/2024-11-05/)
            
        
    
-   [Schema ↗](https://github.com/modelcontextprotocol/specification/tree/main/schema)
-   More
-   [User Guide ↗](https://modelcontextprotocol.io)
-   [Python SDK ↗](https://github.com/modelcontextprotocol/python-sdk)
-   [TypeScript SDK ↗](https://github.com/modelcontextprotocol/typescript-sdk)

-   [Specification (Draft)](/specification/draft/)
    
    -   [Architecture](/specification/draft/architecture/)
    -   [Base Protocol](/specification/draft/basic/)
        
        -   [Transports](/specification/draft/basic/transports/)
        -   [Authorization](/specification/draft/basic/authorization/)
        -   [Messages](/specification/draft/basic/messages/)
        -   [Lifecycle](/specification/draft/basic/lifecycle/)
        -   [Versioning](/specification/draft/basic/versioning/)
        -   [Utilities](/specification/draft/basic/utilities/)
            
            -   [Ping](/specification/draft/basic/utilities/ping/)
            -   [Cancellation](/specification/draft/basic/utilities/cancellation/)
            -   [Progress](/specification/draft/basic/utilities/progress/)
            
        
    -   [Server Features](/specification/draft/server/)
        
        -   [Prompts](/specification/draft/server/prompts/)
        -   [Resources](/specification/draft/server/resources/)
        -   [Tools](/specification/draft/server/tools/)
        -   [Utilities](/specification/draft/server/utilities/)
            
            -   [Completion](/specification/draft/server/utilities/completion/)
            -   [Logging](/specification/draft/server/utilities/logging/)
            -   [Pagination](/specification/draft/server/utilities/pagination/)
            
        
    -   [Client Features](/specification/draft/client/)
        
        -   [Roots](/specification/draft/client/roots/)
        -   [Sampling](/specification/draft/client/sampling/)
        
    -   [Contributions](/specification/draft/contributing/)
    -   [Revisions](/specification/draft/revisions/)
        
        -   [2024-11-05 (Current)](/specification/draft/revisions/2024-11-05/)
        
    
-   [Specification (Latest)](/specification/2024-11-05/)
    
    -   [Architecture](/specification/2024-11-05/architecture/)
    -   [Base Protocol](/specification/2024-11-05/basic/)
        
        -   [Messages](/specification/2024-11-05/basic/messages/)
        -   [Lifecycle](/specification/2024-11-05/basic/lifecycle/)
        -   [Transports](/specification/2024-11-05/basic/transports/)
        -   [Versioning](/specification/2024-11-05/basic/versioning/)
        -   [Utilities](/specification/2024-11-05/basic/utilities/)
            
            -   [Ping](/specification/2024-11-05/basic/utilities/ping/)
            -   [Cancellation](/specification/2024-11-05/basic/utilities/cancellation/)
            -   [Progress](/specification/2024-11-05/basic/utilities/progress/)
            
        
    -   [Server Features](/specification/2024-11-05/server/)
        
        -   [Prompts](/specification/2024-11-05/server/prompts/)
        -   [Resources](/specification/2024-11-05/server/resources/)
        -   [Tools](/specification/2024-11-05/server/tools/)
        -   [Utilities](/specification/2024-11-05/server/utilities/)
            
            -   [Completion](/specification/2024-11-05/server/utilities/completion/)
            -   [Logging](/specification/2024-11-05/server/utilities/logging/)
            -   [Pagination](/specification/2024-11-05/server/utilities/pagination/)
            
        
    -   [Client Features](/specification/2024-11-05/client/)
        
        -   [Roots](/specification/2024-11-05/client/roots/)
        -   [Sampling](/specification/2024-11-05/client/sampling/)
        
    -   [Contributions](/specification/2024-11-05/contributing/)
    -   [Revisions](/specification/2024-11-05/revisions/)
        
        -   [2024-11-05 (Current)](/specification/2024-11-05/revisions/2024-11-05/)
        
    
-   [Schema ↗](https://github.com/modelcontextprotocol/specification/tree/main/schema)
-   More
-   [User Guide ↗](https://modelcontextprotocol.io)
-   [Python SDK ↗](https://github.com/modelcontextprotocol/python-sdk)
-   [TypeScript SDK ↗](https://github.com/modelcontextprotocol/typescript-sdk)

LightDark

On this page

-   [User Interaction Model](#user-interaction-model)
-   [Capabilities](#capabilities)
-   [Protocol Messages](#protocol-messages)
-   [Listing Tools](#listing-tools)
-   [Calling Tools](#calling-tools)
-   [List Changed Notification](#list-changed-notification)
-   [Message Flow](#message-flow)
-   [Data Types](#data-types)
-   [Tool](#tool)
-   [Tool Result](#tool-result)
-   [Text Content](#text-content)
-   [Image Content](#image-content)
-   [Embedded Resources](#embedded-resources)
-   [Error Handling](#error-handling)
-   [Security Considerations](#security-considerations)

Scroll to top

[Specification](/specification/)

[Specification (Latest)](/specification/2024-11-05/)

[Server Features](/specification/2024-11-05/server/)

Tools

# Tools

ℹ️

**Protocol Revision**: 2024-11-05

The Model Context Protocol (MCP) allows servers to expose tools that can be invoked by language models. Tools enable models to interact with external systems, such as querying databases, calling APIs, or performing computations. Each tool is uniquely identified by a name and includes metadata describing its schema.

## User Interaction Model[](#user-interaction-model)

Tools in MCP are designed to be **model-controlled**, meaning that the language model can discover and invoke tools automatically based on its contextual understanding and the user’s prompts.

However, implementations are free to expose tools through any interface pattern that suits their needs—the protocol itself does not mandate any specific user interaction model.

⚠️

For trust & safety and security, there **SHOULD** always be a human in the loop with the ability to deny tool invocations.

Applications **SHOULD**:

-   Provide UI that makes clear which tools are being exposed to the AI model
-   Insert clear visual indicators when tools are invoked
-   Present confirmation prompts to the user for operations, to ensure a human is in the loop

## Capabilities[](#capabilities)

Servers that support tools **MUST** declare the `tools` capability:

```json
{
  "capabilities": {
    "tools": {
      "listChanged": true
    }
  }
}
```

`listChanged` indicates whether the server will emit notifications when the list of available tools changes.

## Protocol Messages[](#protocol-messages)

### Listing Tools[](#listing-tools)

To discover available tools, clients send a `tools/list` request. This operation supports [pagination](https://spec.modelcontextprotocol.io/specification/2024-11-05/server/utilities/pagination/).

**Request:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {
    "cursor": "optional-cursor-value"
  }
}
```

**Response:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "get_weather",
        "description": "Get current weather information for a location",
        "inputSchema": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "City name or zip code"
            }
          },
          "required": ["location"]
        }
      }
    ],
    "nextCursor": "next-page-cursor"
  }
}
```

### Calling Tools[](#calling-tools)

To invoke a tool, clients send a `tools/call` request:

**Request:**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": {
      "location": "New York"
    }
  }
}
```

**Response:**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Current weather in New York:
Temperature: 72°F
Conditions: Partly cloudy"
      }
    ],
    "isError": false
  }
}
```

### List Changed Notification[](#list-changed-notification)

When the list of available tools changes, servers that declared the `listChanged` capability **SHOULD** send a notification:

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/tools/list_changed"
}
```

## Message Flow[](#message-flow)

ServerClientLLMServerClientLLMDiscoveryTool SelectionInvocationUpdatestools/listList of toolsSelect tool to usetools/callTool resultProcess resulttools/list\_changedtools/listUpdated tools

## Data Types[](#data-types)

### Tool[](#tool)

A tool definition includes:

-   `name`: Unique identifier for the tool
-   `description`: Human-readable description of functionality
-   `inputSchema`: JSON Schema defining expected parameters

### Tool Result[](#tool-result)

Tool results can contain multiple content items of different types:

#### Text Content[](#text-content)

```json
{
  "type": "text",
  "text": "Tool result text"
}
```

#### Image Content[](#image-content)

```json
{
  "type": "image",
  "data": "base64-encoded-data",
  "mimeType": "image/png"
}
```

#### Embedded Resources[](#embedded-resources)

[Resources](https://spec.modelcontextprotocol.io/specification/2024-11-05/server/resources/) **MAY** be embedded, to provide additional context or data, behind a URI that can be subscribed to or fetched again by the client later:

```json
{
  "type": "resource",
  "resource": {
    "uri": "resource://example",
    "mimeType": "text/plain",
    "text": "Resource content"
  }
}
```

## Error Handling[](#error-handling)

Tools use two error reporting mechanisms:

1.  **Protocol Errors**: Standard JSON-RPC errors for issues like:
    
    -   Unknown tools
    -   Invalid arguments
    -   Server errors
2.  **Tool Execution Errors**: Reported in tool results with `isError: true`:
    
    -   API failures
    -   Invalid input data
    -   Business logic errors

Example protocol error:

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "error": {
    "code": -32602,
    "message": "Unknown tool: invalid_tool_name"
  }
}
```

Example tool execution error:

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Failed to fetch weather data: API rate limit exceeded"
      }
    ],
    "isError": true
  }
}
```

## Security Considerations[](#security-considerations)

1.  Servers **MUST**:
    
    -   Validate all tool inputs
    -   Implement proper access controls
    -   Rate limit tool invocations
    -   Sanitize tool outputs
2.  Clients **SHOULD**:
    
    -   Prompt for user confirmation on sensitive operations
    -   Show tool inputs to the user before calling the server, to avoid malicious or accidental data exfiltration
    -   Validate tool results before passing to LLM
    -   Implement timeouts for tool calls
    -   Log tool usage for audit purposes

[Resources](/specification/2024-11-05/server/resources/ "Resources")

[Powered by Hextra](https://github.com/imfing/hextra "Hextra GitHub Homepage")