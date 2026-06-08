import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId:"oehwpok2",
    dataset: "production"
  },
  deployment: {
    autoUpdates: true,
  }
})
