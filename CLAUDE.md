# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

JOLT Transform Web is a Spring Boot 4 application that lets users transform JSON using [bazaarvoice JOLT](https://github.com/bazaarvoice/jolt) specifications, with an AI assistant (Google Gemini via Spring AI) that can generate a JOLT spec from example input/output JSON. The same Spring Boot app also exposes an MCP (Model Context Protocol) server so the transform capability can be used as a tool by MCP clients.

It's a Maven multi-module reactor with an embedded React frontend:

- `jolt-transform-parent` — parent POM: Java version, `spring-ai-bom` and internal dependency management. Both other modules inherit from this (not from the root POM).
- `jolt-transform-app` — the Spring Boot application (REST controllers, transform service, MCP tool, AWS Secrets Manager config).
- `jolt-transform-ui` — a Vite + React 19 + Tailwind v4 SPA. Its Maven build (`exec-maven-plugin`) runs `npm install` and `npm run build` during `mvn compile`, and Vite outputs directly into `jolt-transform-ui/target/classes/static`, so the built JS/CSS gets packaged onto the classpath of `jolt-transform-app` as Spring Boot static resources (`jolt-transform-app` depends on `jolt-transform-ui`, which forces module build order).

The root `pom.xml` is a `packaging=pom` aggregator listing all three modules; it is not the module the app/parent inherit from.

## Common commands

Build everything (Java + UI, in the correct module order):
```
mvn clean install
```

Run the app locally (serves API + built UI on port 8081):
```
mvn -pl jolt-transform-app spring-boot:run
```

Run only the Java tests:
```
mvn -pl jolt-transform-app test
```
Run a single Java test class/method:
```
mvn -pl jolt-transform-app test -Dtest=JoltTransformControllerTest
mvn -pl jolt-transform-app test -Dtest=JoltTransformControllerTest#testMethodName
```

UI development (from `jolt-transform-ui/`), with hot reload against a locally running backend on 8081:
```
npm install
npm run dev
```
UI tests (Vitest):
```
npm test          # run once
npm run test:watch
```
Run a single UI test file:
```
npx vitest run src/test/TransformPage.test.jsx
```
UI production build (also invoked automatically by Maven):
```
npm run build     # runs vitest run, then vite build into target/classes/static
```

Build the Docker image (expects `jolt-transform-app/target/jolt-transform-app-0.0.1-SNAPSHOT.jar` to already exist from `mvn install`):
```
./build.sh
```

## Architecture notes

- **Transform flow**: `JoltTransformController` (`POST /api/v1/jolt/transform`) delegates to `TransformService.transform`, which builds a bazaarvoice `Chainr` from the spec in `TransformDto` and applies it to the input. `TransformService.transform` is also annotated `@McpTool` (Spring AI MCP annotations), so the exact same method is exposed as an MCP tool over the streamable-HTTP MCP endpoint configured in `application.properties` (`spring.ai.mcp.server.*`, endpoint `/api/mcp`).
- **AI spec generation flow**: `ChatController` (`POST /api/v1/ai/generate`) builds a `GoogleGenAiChatModel` by hand in `@PostConstruct` (not a Spring-managed `ChatModel` bean) using an API key injected as a plain `String` constructor argument. That `String googleApiKey` bean is produced by `SecretsManagerConfiguration`, which is active on all profiles except `test` (`@Profile("!test")`) and pulls the key from AWS Secrets Manager (`prod/googleai`) — this means `ChatController` has no usable API key when running under the default/dev profile without AWS credentials configured; tests must run under the `test` profile to avoid hitting Secrets Manager and exiting the JVM.
- **`TransformDto`** is the shared request/response shape for both `/jolt/transform` and `/ai/generate`, carrying `input`, `spec`, and `output` as raw `Map`/`List` (untyped JSON), plus JSON-string convenience getters/setters used when building AI prompts.
- **UI structure**: `TransformPage.jsx` and `BuildPage.jsx` are the two main app views (transform vs. spec-building/AI-assist); `DocumentationPage.jsx` + `DocumentationMenu.jsx` + the various `*Doc.jsx` components render JOLT operation reference docs (Shift, Sort, Cardinality, Defaultr, Removr, Custom). `JsonEditorWithLineNumbers.jsx` is the shared JSON input widget used across pages.
- **Dev vs. prod API wiring**: in dev, Vite proxies `/api/v1/jolt/transform` and `/api/v1/ai/generate` to `localhost:8081` (see `vite.config.js`); in prod the same paths are served directly by Spring Boot since the built UI is bundled on its classpath — there is no separate UI server in production.
- **Deployment**: `.github/workflows/build.yml` builds the Maven reactor, then builds/pushes a Docker image (ARM64) to ECR and forces an ECS service redeployment on every push to `main`. `docker-compose.yml` shows the intended runtime topology: this app alongside a separate `jolt-agent` container.
