import {M3Concept, Metamodel} from "./types.ts"
import {SerializedNode} from "../serialization.ts"
import {lioncore} from "./self-definition.ts"
import {classBasedConceptDeducerFor, serializeModel} from "../serializer.ts"


/**
 * Serializes a metamodel (i.e., an instance of the LIonCore/M3 metametamodel,
 * using {@link M3Concept these type definitions})
 * into the LIonWeb serialization JSON format.
 */

export const serializeMetamodel = (metamodel: Metamodel): SerializedNode[] =>
    serializeModel([metamodel], classBasedConceptDeducerFor(lioncore))

