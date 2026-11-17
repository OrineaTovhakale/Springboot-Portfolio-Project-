const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

export type Profile = {
  name: string
  title: string
  tagline: string
  biography: string
}

export type Project = {
  name: string
  description: string
  role: string
  technologies: string[]
  contributions: string[]
  liveUrl: string
}

export type PortfolioContent = {
  profile: Profile
  projects: Project[]
}

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

export async function getPortfolioContent(signal?: AbortSignal): Promise<PortfolioContent> {
  const [profile, projects] = await Promise.all([
    getJson<Profile>('/api/profile', signal),
    getJson<Project[]>('/api/projects', signal),
  ])
  return { profile, projects }
}

export async function submitContactMessage(message: {
  name: string
  email: string
  message: string
}): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/contact`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }
}
