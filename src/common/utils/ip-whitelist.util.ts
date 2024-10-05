export function isIpWhitelisted(ip: string, whitelist: string[]): boolean {
  return whitelist.some((pattern) => {
    const regexPattern = pattern.replace(/\./g, '\\.').replace(/\*/g, '\\d+');
    const regex = new RegExp(`^${regexPattern}$`);

    return regex.test(ip);
  });
}
