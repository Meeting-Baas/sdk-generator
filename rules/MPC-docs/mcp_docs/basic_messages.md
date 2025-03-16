# Umessages
Messages – Model Context Protocol Specification 

  [![Model Context Protocol Specification](https://spec.modelcontextprotocol.io/specification/2024-11-05/basic/messages//images/light.svg) ![Model Context Protocol Specification](https://spec.modelcontextprotocol.io/specification/2024-11-05/basic/messages//images/dark.svg)](/latest)[Specification (Draft)](/draft "Specification (Draft)") [Specification (Latest)](/latest "Specification (Latest)") [Resources](/resources "Resources")

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
                -   [Requests](#requests)
                -   [Responses](#responses)
                -   [Notifications](#notifications)
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

-   [Requests](#requests)
-   [Responses](#responses)
-   [Notifications](#notifications)

Scroll to top

[Specification](/specification/)

[Specification (Latest)](/specification/2024-11-05/)

[Base Protocol](/specification/2024-11-05/basic/)

Messages

# Messages

ℹ️

**Protocol Revision**: 2024-11-05

All messages in MCP **MUST** follow the [JSON-RPC 2.0](https://www.jsonrpc.org/specification) specification. The protocol defines three types of messages:

## Requests[](#requests)

Requests are sent from the client to the server or vice versa.

```typescript
{
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: {
    [key: string]: unknown;
  };
}
```

-   Requests **MUST** include a string or integer ID.
-   Unlike base JSON-RPC, the ID **MUST NOT** be `null`.
-   The request ID **MUST NOT** have been previously used by the requestor within the same session.

## Responses[](#responses)

Responses are sent in reply to requests.

```typescript
{
  jsonrpc: "2.0";
  id: string | number;
  result?: {
    [key: string]: unknown;
  }
  error?: {
    code: number;
    message: string;
    data?: unknown;
  }
}
```

-   Responses **MUST** include the same ID as the request they correspond to.
-   Either a `result` or an `error` **MUST** be set. A response **MUST NOT** set both.
-   Error codes **MUST** be integers.

## Notifications[](#notifications)

Notifications are sent from the client to the server or vice versa. They do not expect a response.

```typescript
{
  jsonrpc: "2.0";
  method: string;
  params?: {
    [key: string]: unknown;
  };
}
```

-   Notifications **MUST NOT** include an ID.

[Lifecycle](/specification/2024-11-05/basic/lifecycle/ "Lifecycle")

[Powered by Hextra](https://github.com/imfing/hextra "Hextra GitHub Homepage")