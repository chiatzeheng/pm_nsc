import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'PracticeMeNextJs',

  projectId: 'k664eac1',
  dataset: 'announcement',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
