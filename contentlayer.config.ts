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
        id: { type: 'string', required: true },
    },
    computedFields: {
        slug: {
            type: 'string',
            resolve: (doc) => doc._raw.flattenedPath.split('/')[1],
        },
        language: {
            type: 'string', // Override the enum field if needed, or keep it as computed to ensure correct value
            resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, '') as 'en' | 'hy',
        }
    },
}))

export const Project = defineDocumentType(() => ({
    name: 'Project',
    filePathPattern: `projects/**/*.mdx`,
    contentType: 'mdx',
    fields: {
        id: { type: 'string', required: true },
        title: { type: 'string', required: true },
        description: { type: 'string', required: false },
        shortDescription: { type: 'string', required: false },
        image: { type: 'string', required: true },
        category: { type: 'string', required: true },
        categoryHy: { type: 'string', required: false },
        year: { type: 'number', required: true },
        featured: { type: 'boolean', required: false },
        tools: { type: 'list', of: { type: 'string' }, required: false },
        toolsHy: { type: 'list', of: { type: 'string' }, required: false },
        challenge: { type: 'string', required: false },
        challengeHy: { type: 'string', required: false },
        solution: { type: 'string', required: false },
        solutionHy: { type: 'string', required: false },
        results: { type: 'list', of: { type: 'string' }, required: false },
        resultsHy: { type: 'list', of: { type: 'string' }, required: false },
        impact: { type: 'string', required: false },
        impactHy: { type: 'string', required: false },
        studentName: { type: 'string', required: false },
        presentedAt: { type: 'string', required: false },
        technologies: { type: 'json', required: false }, // Complex object for technologies array
    },
    computedFields: {
        slug: {
            type: 'string',
            resolve: (doc) => doc._raw.flattenedPath.split('/')[1],
        },
        language: {
            type: 'string',
            resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, '') as 'en' | 'hy',
        }
    },
}))

export const Material = defineDocumentType(() => ({
    name: 'Material',
    filePathPattern: `materials/**/*.mdx`,
    contentType: 'mdx',
    fields: {
        id: { type: 'string', required: true },
        title: { type: 'string', required: true },
        summary: { type: 'string', required: true },
        topic: {
            type: 'enum',
            options: ['programming', 'electronics', 'robotics', 'modeling3d', 'cncLaser'],
            required: true
        },
        difficulty: {
            type: 'enum',
            options: ['beginner', 'next', 'advanced'],
            required: true
        },
        format: {
            type: 'enum',
            options: ['lesson', 'project-guide', 'worksheet', 'video'],
            required: true
        },
        ageGroup: { type: 'string', required: true },
        durationMinutes: { type: 'number', required: true },
        tools: { type: 'list', of: { type: 'string' }, required: false },
        prerequisites: { type: 'list', of: { type: 'string' }, required: false },
        learningObjectives: { type: 'list', of: { type: 'string' }, required: false },
        downloads: { type: 'json', required: false },
        featured: { type: 'boolean', required: false },
        year: { type: 'number', required: true },
        image: { type: 'string', required: true },
    },
    computedFields: {
        slug: {
            type: 'string',
            resolve: (doc) => doc._raw.flattenedPath.split('/')[1],
        },
        language: {
            type: 'string',
            resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, '') as 'en' | 'hy',
        }
    },
}))

export default makeSource({
    contentDirPath: 'content',
    documentTypes: [Event, Project, Material],
})
