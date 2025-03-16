# Uarchitecture
Architecture – Model Context Protocol Specification 

  [![Model Context Protocol Specification](https://spec.modelcontextprotocol.io/specification/2024-11-05/architecture//images/light.svg) ![Model Context Protocol Specification](https://spec.modelcontextprotocol.io/specification/2024-11-05/architecture//images/dark.svg)](/latest)[Specification (Draft)](/draft "Specification (Draft)") [Specification (Latest)](/latest "Specification (Latest)") [Resources](/resources "Resources")

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
            -   [Core Components](#core-components)
            -   [Design Principles](#design-principles)
            -   [Message Types](#message-types)
            -   [Capability Negotiation](#capability-negotiation)
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

-   [Core Components](#core-components)
-   [Host](#host)
-   [Clients](#clients)
-   [Servers](#servers)
-   [Design Principles](#design-principles)
-   [Message Types](#message-types)
-   [Capability Negotiation](#capability-negotiation)

Scroll to top

[Specification](/specification/)

[Specification (Latest)](/specification/2024-11-05/)

Architecture

# Architecture

The Model Context Protocol (MCP) follows a client-host-server architecture where each host can run multiple client instances. This architecture enables users to integrate AI capabilities across applications while maintaining clear security boundaries and isolating concerns. Built on JSON-RPC, MCP provides a stateful session protocol focused on context exchange and sampling coordination between clients and servers.

## Core Components[](#core-components)

Internet

Local machine

Application Host Process

Server 3  
External APIs

Remote  
Resource C

Server 1  
Files & Git

Server 2  
Database

Local  
Resource A

Local  
Resource B

Host

Client 1

Client 2

Client 3

### Host[](#host)

The host process acts as the container and coordinator:

-   Creates and manages multiple client instances
-   Controls client connection permissions and lifecycle
-   Enforces security policies and consent requirements
-   Handles user authorization decisions
-   Coordinates AI/LLM integration and sampling
-   Manages context aggregation across clients

### Clients[](#clients)

Each client is created by the host and maintains an isolated server connection:

-   Establishes one stateful session per server
-   Handles protocol negotiation and capability exchange
-   Routes protocol messages bidirectionally
-   Manages subscriptions and notifications
-   Maintains security boundaries between servers

A host application creates and manages multiple clients, with each client having a 1:1 relationship with a particular server.

### Servers[](#servers)

Servers provide specialized context and capabilities:

-   Expose resources, tools and prompts via MCP primitives
-   Operate independently with focused responsibilities
-   Request sampling through client interfaces
-   Must respect security constraints
-   Can be local processes or remote services

## Design Principles[](#design-principles)

MCP is built on several key design principles that inform its architecture and implementation:

1.  **Servers should be extremely easy to build**
    
    -   Host applications handle complex orchestration responsibilities
    -   Servers focus on specific, well-defined capabilities
    -   Simple interfaces minimize implementation overhead
    -   Clear separation enables maintainable code
2.  **Servers should be highly composable**
    
    -   Each server provides focused functionality in isolation
    -   Multiple servers can be combined seamlessly
    -   Shared protocol enables interoperability
    -   Modular design supports extensibility
3.  **Servers should not be able to read the whole conversation, nor “see into” other servers**
    
    -   Servers receive only necessary contextual information
    -   Full conversation history stays with the host
    -   Each server connection maintains isolation
    -   Cross-server interactions are controlled by the host
    -   Host process enforces security boundaries
4.  **Features can be added to servers and clients progressively**
    
    -   Core protocol provides minimal required functionality
    -   Additional capabilities can be negotiated as needed
    -   Servers and clients evolve independently
    -   Protocol designed for future extensibility
    -   Backwards compatibility is maintained

## Message Types[](#message-types)

MCP defines three core message types based on [JSON-RPC 2.0](https://www.jsonrpc.org/specification):

-   **Requests**: Bidirectional messages with method and parameters expecting a response
-   **Responses**: Successful results or errors matching specific request IDs
-   **Notifications**: One-way messages requiring no response

Each message type follows the JSON-RPC 2.0 specification for structure and delivery semantics.

## Capability Negotiation[](#capability-negotiation)

The Model Context Protocol uses a capability-based negotiation system where clients and servers explicitly declare their supported features during initialization. Capabilities determine which protocol features and primitives are available during a session.

-   Servers declare capabilities like resource subscriptions, tool support, and prompt templates
-   Clients declare capabilities like sampling support and notification handling
-   Both parties must respect declared capabilities throughout the session
-   Additional capabilities can be negotiated through extensions to the protocol

ServerClientHostServerClientHostActive Session with Negotiated Featuresloop\[Client Requests\]loop\[Server Requests\]loop\[Notifications\]Initialize clientInitialize session with capabilitiesRespond with supported capabilitiesUser- or model-initiated actionRequest (tools/resources)ResponseUpdate UI or respond to modelRequest (sampling)Forward to AIAI responseResponseResource updatesStatus changesTerminateEnd session

Each capability unlocks specific protocol features for use during the session. For example:

-   Implemented [server features](https://spec.modelcontextprotocol.io/specification/2024-11-05/server/) must be advertised in the server’s capabilities
-   Emitting resource subscription notifications requires the server to declare subscription support
-   Tool invocation requires the server to declare tool capabilities
-   [Sampling](https://spec.modelcontextprotocol.io/specification/2024-11-05/client/) requires the client to declare support in its capabilities

This capability negotiation ensures clients and servers have a clear understanding of supported functionality while maintaining protocol extensibility.

[Powered by Hextra](https://github.com/imfing/hextra "Hextra GitHub Homepage")