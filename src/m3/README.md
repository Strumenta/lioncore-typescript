# LIonCore M3 meta-metamodel


## Aspects

* [TypeScript type definitions](./types.ts)
* [factory](./factory.ts) for conveniently creating M3 instances
* [primitive types built-in (`builtins`) to LIonCore](./builtins.ts)
* [A model API specific for M3 instances](./api.ts)
* persistence: [serializer](./serializer.ts) and [deserializer](./deserializer.ts)
* [constraints checker](./constraints.ts)
* convenience/helper [functions](./functions.ts) defined on M3 concepts
* [JSON Schema generator](./schema-generator.ts) that generates a JSON Schema for the serialization format specific to the given metamodel
* [Ecore importer](./ecore/importer.ts) that converts an Ecore XML file to a M3 instance
* [PlantUML generator](./diagrams/PlantUML-generator.ts) that generates a PlantUML class diagram from a given metamodel
* ([reference checker](./reference-checker.ts))

An interesting place to start might be the [self-definition of LIonCore/M3](./self-definition.ts) using its own [TypeScript type definitions](./types.ts).

