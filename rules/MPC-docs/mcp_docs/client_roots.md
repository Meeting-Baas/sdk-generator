# Uroots
Roots – Model Context Protocol Specification 

  [![Model Context Protocol Specification](https://spec.modelcontextprotocol.io/specification/2024-11-05/client/roots//images/light.svg) ![Model Context Protocol Specification](https://spec.modelcontextprotocol.io/specification/2024-11-05/client/roots//images/dark.svg)](/latest)[Specification (Draft)](/draft "Specification (Draft)") [Specification (Latest)](/latest "Specification (Latest)") [Resources](/resources "Resources")

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
            -   [Utilities](/specification/2024-11-05/server/utilities/)
                
                -   [Completion](/specification/2024-11-05/server/utilities/completion/)
                -   [Logging](/specification/2024-11-05/server/utilities/logging/)
                -   [Pagination](/specification/2024-11-05/server/utilities/pagination/)
                
            
        -   [Client Features](/specification/2024-11-05/client/)
            
            -   [Roots](/specification/2024-11-05/client/roots/)
                -   [User Interaction Model](#user-interaction-model)
                -   [Capabilities](#capabilities)
                -   [Protocol Messages](#protocol-messages)
                -   [Message Flow](#message-flow)
                -   [Data Types](#data-types)
                -   [Error Handling](#error-handling)
                -   [Security Considerations](#security-considerations)
                -   [Implementation Guidelines](#implementation-guidelines)
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
-   [Listing Roots](#listing-roots)
-   [Root List Changes](#root-list-changes)
-   [Message Flow](#message-flow)
-   [Data Types](#data-types)
-   [Root](#root)
-   [Project Directory](#project-directory)
-   [Multiple Repositories](#multiple-repositories)
-   [Error Handling](#error-handling)
-   [Security Considerations](#security-considerations)
-   [Implementation Guidelines](#implementation-guidelines)

Scroll to top

[Specification](/specification/)

[Specification (Latest)](/specification/2024-11-05/)

[Client Features](/specification/2024-11-05/client/)

Roots

# Roots

ℹ️

**Protocol Revision**: 2024-11-05

The Model Context Protocol (MCP) provides a standardized way for clients to expose filesystem “roots” to servers. Roots define the boundaries of where servers can operate within the filesystem, allowing them to understand which directories and files they have access to. Servers can request the list of roots from supporting clients and receive notifications when that list changes.

## User Interaction Model[](#user-interaction-model)

Roots in MCP are typically exposed through workspace or project configuration interfaces.

For example, implementations could offer a workspace/project picker that allows users to select directories and files the server should have access to. This can be combined with automatic workspace detection from version control systems or project files.

However, implementations are free to expose roots through any interface pattern that suits their needs—the protocol itself does not mandate any specific user interaction model.

## Capabilities[](#capabilities)

Clients that support roots **MUST** declare the `roots` capability during [initialization](https://spec.modelcontextprotocol.io/specification/2024-11-05/basic/lifecycle/#initialization):

```json
{
  "capabilities": {
    "roots": {
      "listChanged": true
    }
  }
}
```

`listChanged` indicates whether the client will emit notifications when the list of roots changes.

## Protocol Messages[](#protocol-messages)

### Listing Roots[](#listing-roots)

To retrieve roots, servers send a `roots/list` request:

**Request:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "roots/list"
}
```

**Response:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "roots": [
      {
        "uri": "file:///home/user/projects/myproject",
        "name": "My Project"
      }
    ]
  }
}
```

### Root List Changes[](#root-list-changes)

When roots change, clients that support `listChanged` **MUST** send a notification:

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/roots/list_changed"
}
```

## Message Flow[](#message-flow)

ClientServerClientServerDiscoveryChangesroots/listAvailable rootsnotifications/roots/list\_changedroots/listUpdated roots

## Data Types[](#data-types)

### Root[](#root)

A root definition includes:

-   `uri`: Unique identifier for the root. This **MUST** be a `file://` URI in the current specification.
-   `name`: Optional human-readable name for display purposes.

Example roots for different use cases:

#### Project Directory[](#project-directory)

```json
{
  "uri": "file:///home/user/projects/myproject",
  "name": "My Project"
}
```

#### Multiple Repositories[](#multiple-repositories)

```json
[
  {
    "uri": "file:///home/user/repos/frontend",
    "name": "Frontend Repository"
  },
  {
    "uri": "file:///home/user/repos/backend",
    "name": "Backend Repository"
  }
]
```

## Error Handling[](#error-handling)

Clients **SHOULD** return standard JSON-RPC errors for common failure cases:

-   Client does not support roots: `-32601` (Method not found)
-   Internal errors: `-32603`

Example error:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32601,
    "message": "Roots not supported",
    "data": {
      "reason": "Client does not have roots capability"
    }
  }
}
```

## Security Considerations[](#security-considerations)

1.  Clients **MUST**:
    
    -   Only expose roots with appropriate permissions
    -   Validate all root URIs to prevent path traversal
    -   Implement proper access controls
    -   Monitor root accessibility
2.  Servers **SHOULD**:
    
    -   Handle cases where roots become unavailable
    -   Respect root boundaries during operations
    -   Validate all paths against provided roots

## Implementation Guidelines[](#implementation-guidelines)

1.  Clients **SHOULD**:
    
    -   Prompt users for consent before exposing roots to servers
    -   Provide clear user interfaces for root management
    -   Validate root accessibility before exposing
    -   Monitor for root changes
2.  Servers **SHOULD**:
    
    -   Check for roots capability before usage
    -   Handle root list changes gracefully
    -   Respect root boundaries in operations
    -   Cache root information appropriately

[Sampling](/specification/2024-11-05/client/sampling/ "Sampling")

[Powered by Hextra](https://github.com/imfing/hextra "Hextra GitHub Homepage")