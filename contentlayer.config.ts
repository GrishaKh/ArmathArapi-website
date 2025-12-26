import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Event = defineDocumentType(() => ({
    name: 'Event',
    filePathPattern: `events/**/*.mdx`,
    contentType: 'mdx',
    fields: {
        title: { type: 'string', required: true },
        titleHy: { type: 'string', required: false }, // Optional because it might be in a separate file
        description: { type: 'string', required: false },
        descriptionHy: { type: 'string', required: false },
        year: { type: 'number', required: true },
        date: { type: 'string', required: true },
        location: { type: 'string', required: true },
        locationHy: { type: 'string', required: false },
        image: { type: 'string', required: true },
        category: {
            type: 'enum',
            options: ['competition', 'workshop', 'camp', 'exhibition'],
            required: true
        },
        technologies: { type: 'list', of: { type: 'string' }, required: true },
        technologiesHy: { type: 'list', of: { type: 'string' }, required: false },
        participants: { type: 'json', required: false }, // Complex object, using json for flexibility or could define nested
        results: { type: 'string', required: false },
        resultsHy: { type: 'string', required: false },
        highlights: { type: 'list', of: { type: 'string' }, required: false },
        highlightsHy: { type: 'list', of: { type: 'string' }, required: false },
        relatedProjects: { type: 'list', of: { type: 'string' }, required: false },
        language: { type: 'enum', options: ['en', 'hy'], default: 'en' },
        id: { type: 'string', required: true },
    },
    computedFields: {
        slug: {
            type: 'string',
            resolve: (doc) => doc._raw.flattenedPath.replace(/^events\//, ''),
        },
    },
}))

export default makeSource({
    contentDirPath: 'content',
    documentTypes: [Event],
})
