export function slugify(s:string){return s.toLowerCase().trim().replace(/[^a-z0-9\u0600-\u06FF]+/g,'-').replace(/^-|-$/g,'')}
export function json<T>(value:T){return JSON.stringify(value)}
