// lib/github.ts — Push generated code to GitHub via REST API
// No extra deps needed (fetch is native)

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!
const GITHUB_OWNER = process.env.GITHUB_OWNER!   // e.g. "yourorg"
const GITHUB_REPO = process.env.GITHUB_REPO!     // e.g. "alhena-app"
const GITHUB_BRANCH = process.env.GITHUB_BRANCH ?? 'main'

const BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`

const headers = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  'Content-Type': 'application/json',
  'X-GitHub-Api-Version': '2022-11-28',
}

// ─── Get current file SHA (needed for update) ────────────────────────────────

async function getFileSHA(path: string): Promise<string | null> {
  const res = await fetch(`${BASE}/contents/${path}?ref=${GITHUB_BRANCH}`, { headers })
  if (res.status === 404) return null
  const data = await res.json()
  return data.sha ?? null
}

// ─── Create or update a file ─────────────────────────────────────────────────

export async function pushFileToGitHub(
  filePath: string,
  content: string,
  commitMessage: string
): Promise<{ url: string; sha: string }> {
  const sha = await getFileSHA(filePath)
  const encoded = Buffer.from(content).toString('base64')

  const body: Record<string, unknown> = {
    message: commitMessage,
    content: encoded,
    branch: GITHUB_BRANCH,
  }
  if (sha) body.sha = sha  // required for update

  const res = await fetch(`${BASE}/contents/${filePath}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`GitHub push failed: ${err.message}`)
  }

  const data = await res.json()
  return {
    url: data.content.html_url,
    sha: data.commit.sha,
  }
}

// ─── Trigger Vercel deploy via deploy hook ────────────────────────────────────
// Set VERCEL_DEPLOY_HOOK in env — get from Vercel dashboard → Settings → Git → Deploy Hooks

export async function triggerVercelDeploy(): Promise<void> {
  const hook = process.env.VERCEL_DEPLOY_HOOK
  if (!hook) {
    console.warn('[deploy] VERCEL_DEPLOY_HOOK not set — skipping')
    return
  }
  const res = await fetch(hook, { method: 'POST' })
  if (!res.ok) throw new Error(`Vercel deploy hook failed: ${res.status}`)
}

// ─── Combined: generate → push → deploy ──────────────────────────────────────

export async function publishGeneratedCode(opts: {
  filePath: string
  code: string
  commitMessage: string
  triggerDeploy?: boolean
}): Promise<{ githubUrl: string; commitSha: string }> {
  const { url, sha } = await pushFileToGitHub(
    opts.filePath,
    opts.code,
    opts.commitMessage
  )

  if (opts.triggerDeploy) {
    await triggerVercelDeploy()
  }

  return { githubUrl: url, commitSha: sha }
}
