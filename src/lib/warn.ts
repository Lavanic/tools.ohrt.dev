// ::warning:: makes the line show up on the GitHub Actions run summary, not just in the log
export const warn = (scope: string, msg: string) =>
  console.warn(process.env.GITHUB_ACTIONS ? `::warning title=${scope}::${msg}` : `[${scope}] ${msg}`);
