export function toUrlSlug(name) {
    return name.toLowerCase().replace(/\s+/g, '-');
}

export function fromUrlSlug(slug) {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}