import {asString, indentWith, NestedString} from "../../deps.ts"
import {
    Concept,
    ConceptInterface,
    Containment,
    Enumeration,
    Feature,
    Link,
    Metamodel,
    MetamodelElement,
    PrimitiveType
} from "../types.ts"
import {
    elementsSortedByName,
    nonRelationalFeatures,
    relationsOf,
    type
} from "../functions.ts"
import {isRef, unresolved} from "../../references.ts"


// define some layouting basics/building algebra:

const indented = indentWith(`  `)(1)

const block = (header: string, elements: NestedString): NestedString =>
    elements.length === 0
        ? header
        : [
            `${header} {`,
            indented(elements),
            `}`
        ]

const withNewLine = (content: NestedString): NestedString =>
    [
        content,
        ``
    ]


/**
 * Generates a string with a Mermaid class diagram
 * representing the given {@link Metamodel LIonCore/M3 instance}.
 */
export const generateMermaidForMetamodel = ({elements}: Metamodel) =>
    asString([
        "```mermaid",
        `classDiagram

`,
        indented(elementsSortedByName(elements).map(generateForMetamodelElement)),
        ``,
        indented(elementsSortedByName(elements).map(generateForRelationsOf)),
        ``,
        "```"
    ])


const generateForEnumeration = ({name, literals}: Enumeration) =>
    withNewLine(block(
        `class ${name}`,
        [
            `<<enumeration>>`,
            literals.map(({name}) => name)
        ]
    ))


const generateForConcept = ({name, features, abstract: abstract_, extends: extends_/*, implements: implements_*/}: Concept) =>
    [
        block(
            `class ${name}`,
            nonRelationalFeatures(features).map(generateForNonRelationalFeature)
        ),
        abstract_ ? `<<Abstract>> ${name}` : [],
        isRef(extends_) ? `${extends_.name} <|-- ${name}` : [],
        ``
    ]


const generateForConceptInterface = ({name, features, extends: extends_}: ConceptInterface) =>
    [
        block(
            `class ${name}`,
            nonRelationalFeatures(features).map(generateForNonRelationalFeature)
        ),
        `<<Interface>> ${name}`,
        extends_.map(({name: extendsName}) => `${extendsName} <|-- ${name}`),
        ``
    ]


const generateForNonRelationalFeature = (feature: Feature) => {
    const {name, optional, derived} = feature
    const multiple = feature instanceof Link && feature.multiple
    const type_ = type(feature)
    const typeText = `${multiple ? `List~` : ``}${type_ === unresolved ? `???` : type_.name}${multiple ? `~` : ``}${optional ? `?` : ``}`
    return derived
        ? `+${name}() : ${typeText}`
        : `+${typeText} ${name}`
}


const generateForPrimitiveType = ({name}: PrimitiveType) =>
`%% primitive type: "${name}"

`
// Note: No construct for PrimitiveType exists in PlantUML.


const generateForMetamodelElement = (metamodelElement: MetamodelElement) => {
    if (metamodelElement instanceof Concept) {
        return generateForConcept(metamodelElement)
    }
    if (metamodelElement instanceof ConceptInterface) {
        return generateForConceptInterface(metamodelElement)
    }
    if (metamodelElement instanceof Enumeration) {
        return generateForEnumeration(metamodelElement)
    }
    if (metamodelElement instanceof PrimitiveType) {
        return generateForPrimitiveType(metamodelElement)
    }
    return `// unhandled metamodel element: ${metamodelElement.name}`
}


const generateForRelationsOf = (metamodelElement: MetamodelElement) => {
    const relations = relationsOf(metamodelElement)
    return relations.length === 0
        ? ``
        : relations
            .map((relation) => generateForRelation(metamodelElement, relation))
}


const generateForRelation = ({name: leftName}: MetamodelElement, relation: Link) => {
    const {name: relationName, optional, multiple, type} = relation
    const rightName = isRef(type) ? type.name : (type === unresolved ? `<unresolved>` : `<null>`)
    const isContainment = relation instanceof Containment
    const leftMultiplicity = isContainment ? `1` : `*`
    const rightMultiplicity = (() => {
        if (multiple) {
            return "*"
        }
        return optional ? "0..1" : "1"
    })()
    return `${leftName} "${leftMultiplicity}" ${isContainment ? `o` : ``}-- "${rightMultiplicity}" ${rightName}: ${relationName}`
}

