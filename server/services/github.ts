export async function searchGithubRepositories(query: string) {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=15`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Learning-Launchpad-Academic",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub responded with status: ${response.status}`);
  }

  return response.json();
}

export async function fetchGithubReadme(owner: string, repo: string) {
  // Try fetching main branch, fall back to master branch readme
  const possibleBranches = ["main", "master"];
  for (const branch of possibleBranches) {
    try {
      const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
      const response = await fetch(url);
      if (response.ok) {
        const text = await response.text();
        return { readme: text, branch };
      }
    } catch {
      // Continue to try next branch
    }
  }

  // Fallback to GitHub repository API information
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/readme`;
    const response = await fetch(url, {
      headers: { "User-Agent": "Learning-Launchpad-Academic" },
    });
    if (response.ok) {
      const data = await response.json();
      if (data.content && data.encoding === "base64") {
        const readmeText = Buffer.from(data.content, "base64").toString("utf-8");
        return { readme: readmeText, branch: "api" };
      }
    }
  } catch {
    // Ignore error
  }

  return { readme: "No README.md found or repository is private.", branch: "none" };
}
