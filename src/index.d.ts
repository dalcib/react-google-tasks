declare namespace google_tasks {
  /* declare function parallelNock(host: string, options?: any): any;
export = parallelNock; */

  interface Tasks {
    tasks: [Task]
    isLoading: boolean
    error?: string
  }

  interface GTask {
    kind: string
    id: string
    etag: string
    title: string
    updated: string //datetime
    selfLink: string
    parent: string
    position: string
    notes: string
    status: string
    due: string //datetime
    completed: string ///datetime
    deleted: boolean
    hidden: boolean
    links: [
      {
        type: string
        description: string
        link: string
      }
    ]
  }

  interface Task {
    id: string
    text: string
    notes?: string
    due?: string
    isCompleted: boolean
    position: string //data.position
  }

  export interface Session {
    isLoggedIn: boolean
    teste: string
    num: number
    xxx: string
  }
}

//declare const gapi: any
