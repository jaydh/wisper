export interface article {
    id: string
    link: string

    title?: string
    author?: string
    domain?: string

    dateAdded: string
    dateRead?: string
    lastViewed?: string

    completed: boolean
}

export interface StoreState {
    hash?: string
    visibilityFilter: string
    articles: article[]
}