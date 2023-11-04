# Cloudflare OIDC proxy

This Node.js project serves as an OpenID Connect (OIDC) provider and is designed to validate users against Cloudflare Access cookies. The OIDC provider allows you to use Cloudflare Access for authentication and authorization in your application, making it easy to secure your resources and services.

## Getting Started

To get started with this OIDC provider, follow the steps below.

### Prerequisites

Before you begin, make sure you have the following prerequisites installed:

- Node.js (version 14 or higher)
- npm (Node Package Manager)
- A Cloudflare Access account and a valid Cloudflare Access configuration.

### Installation

1. Clone the repository to your local machine:
   
   ```shell
   git clone https://github.com/esoadamo/cloudflare-oidc-proxy.git
   cd cloudflare-oidc-proxy
   ```

2. Install the project's dependencies:
   
   ```shell
   npm install
   ```

## Configuration

Before running the OIDC provider, you need to configure it properly. Configuration examples are available under `config` directory. Crate copy of all example files while removing `.example` from their names. 

Next, setup a Cloudlare Access configuration where only `/protected/` path requires authentication, otherwise other services won't be able to access your OIDC proxy.

## Usage

To start the OIDC provider, use the following command:

```shell
npm start
```

This will start the OIDC provider on `http://localhost:3000` by default.

## Contributing

If you'd like to contribute to this project, feel free to open issues, submit pull requests, or provide feedback. We welcome contributions from the community.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.txt) file for details.
