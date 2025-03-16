# Uprompts
Prompts – Model Context Protocol Specification 

  [![Model Context Protocol Specification](https://spec.modelcontextprotocol.io/specification/2024-11-05/server/prompts//images/light.svg) ![Model Context Protocol Specification](https://spec.modelcontextprotocol.io/specification/2024-11-05/server/prompts//images/dark.svg)](/latest)[Specification (Draft)](/draft "Specification (Draft)") [Specification (Latest)](/latest "Specification (Latest)") [Resources](/resources "Resources")

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
                -   [User Interaction Model](#user-interaction-model)
                -   [Capabilities](#capabilities)
                -   [Protocol Messages](#protocol-messages)
                -   [Message Flow](#message-flow)
                -   [Data Types](#data-types)
                -   [Error Handling](#error-handling)
                -   [Implementation Considerations](#implementation-considerations)
                -   [Security](#security)
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
-   [Listing Prompts](#listing-prompts)
-   [Getting a Prompt](#getting-a-prompt)
-   [List Changed Notification](#list-changed-notification)
-   [Message Flow](#message-flow)
-   [Data Types](#data-types)
-   [Prompt](#prompt)
-   [PromptMessage](#promptmessage)
-   [Text Content](#text-content)
-   [Image Content](#image-content)
-   [Embedded Resources](#embedded-resources)
-   [Error Handling](#error-handling)
-   [Implementation Considerations](#implementation-considerations)
-   [Security](#security)

Scroll to top

[Specification](/specification/)

[Specification (Latest)](/specification/2024-11-05/)

[Server Features](/specification/2024-11-05/server/)

Prompts

# Prompts

ℹ️

**Protocol Revision**: 2024-11-05

The Model Context Protocol (MCP) provides a standardized way for servers to expose prompt templates to clients. Prompts allow servers to provide structured messages and instructions for interacting with language models. Clients can discover available prompts, retrieve their contents, and provide arguments to customize them.

## User Interaction Model[](#user-interaction-model)

Prompts are designed to be **user-controlled**, meaning they are exposed from servers to clients with the intention of the user being able to explicitly select them for use.

Typically, prompts would be triggered through user-initiated commands in the user interface, which allows users to naturally discover and invoke available prompts.

For example, as slash commands:

![Example of prompt exposed as slash command](../slash-command.png)

However, implementors are free to expose prompts through any interface pattern that suits their needs—the protocol itself does not mandate any specific user interaction model.

## Capabilities[](#capabilities)

Servers that support prompts **MUST** declare the `prompts` capability during [initialization](https://spec.modelcontextprotocol.io/specification/2024-11-05/basic/lifecycle/#initialization):

```json
{
  "capabilities": {
    "prompts": {
      "listChanged": true
    }
  }
}
```

`listChanged` indicates whether the server will emit notifications when the list of available prompts changes.

## Protocol Messages[](#protocol-messages)

### Listing Prompts[](#listing-prompts)

To retrieve available prompts, clients send a `prompts/list` request. This operation supports [pagination](https://spec.modelcontextprotocol.io/specification/2024-11-05/server/utilities/pagination/).

**Request:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "prompts/list",
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
    "prompts": [
      {
        "name": "code_review",
        "description": "Asks the LLM to analyze code quality and suggest improvements",
        "arguments": [
          {
            "name": "code",
            "description": "The code to review",
            "required": true
          }
        ]
      }
    ],
    "nextCursor": "next-page-cursor"
  }
}
```

### Getting a Prompt[](#getting-a-prompt)

To retrieve a specific prompt, clients send a `prompts/get` request. Arguments may be auto-completed through [the completion API](https://spec.modelcontextprotocol.io/specification/2024-11-05/server/utilities/completion/).

**Request:**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "prompts/get",
  "params": {
    "name": "code_review",
    "arguments": {
      "code": "def hello():
    print('world')"
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
    "description": "Code review prompt",
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "Please review this Python code:
def hello():
    print('world')"
        }
      }
    ]
  }
}
```

### List Changed Notification[](#list-changed-notification)

When the list of available prompts changes, servers that declared the `listChanged` capability **SHOULD** send a notification:

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/prompts/list_changed"
}
```

## Message Flow[](#message-flow)

ServerClientServerClientDiscoveryUsageChangesopt\[listChanged\]prompts/listList of promptsprompts/getPrompt contentprompts/list\_changedprompts/listUpdated prompts

## Data Types[](#data-types)

### Prompt[](#prompt)

A prompt definition includes:

-   `name`: Unique identifier for the prompt
-   `description`: Optional human-readable description
-   `arguments`: Optional list of arguments for customization

### PromptMessage[](#promptmessage)

Messages in a prompt can contain:

-   `role`: Either “user” or “assistant” to indicate the speaker
-   `content`: One of the following content types:

#### Text Content[](#text-content)

Text content represents plain text messages:

```json
{
  "type": "text",
  "text": "The text content of the message"
}
```

This is the most common content type used for natural language interactions.

#### Image Content[](#image-content)

Image content allows including visual information in messages:

```json
{
  "type": "image",
  "data": "base64-encoded-image-data",
  "mimeType": "image/png"
}
```

The image data **MUST** be base64-encoded and include a valid MIME type. This enables multi-modal interactions where visual context is important.

#### Embedded Resources[](#embedded-resources)

Embedded resources allow referencing server-side resources directly in messages:

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

Resources can contain either text or binary (blob) data and **MUST** include:

-   A valid resource URI
-   The appropriate MIME type
-   Either text content or base64-encoded blob data

Embedded resources enable prompts to seamlessly incorporate server-managed content like documentation, code samples, or other reference materials directly into the conversation flow.

## Error Handling[](#error-handling)

Servers **SHOULD** return standard JSON-RPC errors for common failure cases:

-   Invalid prompt name: `-32602` (Invalid params)
-   Missing required arguments: `-32602` (Invalid params)
-   Internal errors: `-32603` (Internal error)

## Implementation Considerations[](#implementation-considerations)

1.  Servers **SHOULD** validate prompt arguments before processing
2.  Clients **SHOULD** handle pagination for large prompt lists
3.  Both parties **SHOULD** respect capability negotiation

## Security[](#security)

Implementations **MUST** carefully validate all prompt inputs and outputs to prevent injection attacks or unauthorized access to resources.

[Resources](/specification/2024-11-05/server/resources/ "Resources")

[Powered by Hextra](https://github.com/imfing/hextra "Hextra GitHub Homepage")